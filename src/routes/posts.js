const express = require("express");
const {authmiddleware} = require("../middlewares/jwt");
const prisma = require("../prisma_client/client")

const PRouter = express.Router();


PRouter.post("/addpost",authmiddleware, async (req,res) =>{  //adds post 
    try{
        const post = await prisma.blogPost.create({data :
             {
                title : req.body.title ,
                 content : req.body.content,
                  authorId : req.user.id    // as authorId uses author id form JWT
                }
            });
            return res.status(200).json({data : post});
    }
    catch(e){
        return res.status(200).json({error : e});
    }

});


PRouter.delete("/:id",authmiddleware, async (req,res) =>{  //delets post 
    try{
        const posttodelete = await prisma.blogPost.findUnique({where : { id : Number(req.params.id)} }) //check if post exists
        if(!posttodelete){
            return res.status(404).json({message : "post not found"});
        }
        if(posttodelete.authorId != req.user.id){   //checks if authorized user owns it
            return res.status(403).json({message : "you are not authorized to delete this post"}); //if it is other users post
        }
        const deletepost = await prisma.blogPost.delete({where : { id : Number(req.params.id)}}); 
        return res.status(200).json({data : deletepost});
    }
    catch (e){
        return res.status(401).json({error : e});
    }
})


PRouter.post("/edit/:id",authmiddleware,async (req,res) =>{   //edits post
    try{
        const posttoedit = await prisma.blogPost.findUnique({where : {id : Number(req.params.id)} });
        if(!posttoedit){
            return res.status(404).json({error : "post not found"});
        }
        if(posttoedit.authorId != req.user.id){
            return res.status(403).json({error : "you are not authorized to edit this post"});
        }
        const editedpost = await prisma.blogPost.update({where : { id : Number(req.params.id)}, data : { title : req.body.title, content : req.body.content} });       
        return res.status(200).json({message : "success",editedpost});
    }
    catch(e){
        console.log(e)
        return res.status(401).json({error : e});
    }
});


PRouter.get("/myposts", authmiddleware, async (req,res) => { //gets post from authorized user 
    try{
        const myposts = await prisma.blogPost.findMany({      
            where :{ authorId : req.user.id},    
            include: {
              author: { select: { id: true, username: true} },
              comments: { include: { author : {select : {username : true, postId : false, authorId : false} } } },
            },
          });
        if (myposts.length === 0){
            return res.status(200).json({message : "you have not posted yet"});
        }
        return res.status(200).json({data : myposts});
    }
    catch(e) {
        return res.status(401).json({error : e});
    }
});

PRouter.get("/:id", async (req,res) => {  //gets post with id
    const Post = await prisma.blogPost.findUnique({ 
        where: { id: Number(req.params.id) },
        include: {
          author: { select: { id: true, username: true} },
          comments: { include: { author : {select : {username : true, postId : false, authorId : false} } } },  //returns post with comment
        },
      });
      if(!Post){
        return res.status(404).json({error : "there is no post with that id"})
      }
      return res.status(200).json({data : Post})
})

PRouter.get("/", async (req,res) => {  //gets all posts
    const posts = await prisma.blogPost.findMany({          //returns all posts with comment
        include: {
          author: { select: { id: true, username: true} },
          comments: { include: { author : {select : {username : true, postId : false, authorId : false} } } },  //shows with author but only username 
        },
      }); 
      if(posts.length === 0){ 
        return res.status(404).json({error : "no posts yet"});
      }
       return res.status(200).json({data : posts});
})

module.exports = PRouter;