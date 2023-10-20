const express = require("express");
const prisma = require("../prisma_client/client");
const { authmiddleware } = require("../middlewares/jwt");

const CRouter = express.Router();

CRouter.post("/add/:postId", authmiddleware, async (req,rest)=>{ //adds coment to the post
    try{  
    const post = await prisma.blogPost.findUnique({where:{id : Number(req.params.postId)}});
    if(!post){
        return rest.status(404).json({message : "post not found"});
    }
        const comment = await prisma.comment.create({data : {text : req.body.text, authorId : req.user.id, postId: Number(req.params.postId) }})

          return rest.status(200).json({data : comment});
    }
    catch(e){
        console.log(e)
        return rest.status(401).json({error : e});
    }
});


CRouter.post("/edit/:id",authmiddleware,async (req,res) =>{   //edits comment
    try{
        const commenttoedit = await prisma.comment.findUnique({where : {id : Number(req.params.id)} });
        if(!commenttoedit){
            return res.status(404).json({error : "comment not found"});
        }
        if(commenttoedit.authorId != req.user.id){
            return res.status(403).json({error : "you are not authorized to edit this comment"});
        }
        const editedcomment = await prisma.comment.update({where : { id : Number(req.params.id)}, data : { text : req.body.text} });       
        return res.status(200).json({message : "success",editedcomment});
    }
    catch(e){
        console.log(e)
        return rest.status(401).json({error : e});
    }

});

CRouter.delete("/:id",authmiddleware,async (req,res) =>{
    
    try{
    const comment = await prisma.comment.findUnique({where : { id : Number(req.params.id), authorId : req.user.id} });

    if(!comment){
        return res.status(404).json({error : "comment not found"});
    }
    if(comment.authorId != req.user.id){
        return res.status(403).json({message : "you are not authorized to delete this comment"});
    }
        const deletecoment = await prisma.comment.delete({where : { id : Number(req.params.id)} });
        return res.status(200).json({data : deletecoment});
    }

    catch(e){
        return res.status(400).json({error : e});
    }
});

module.exports = CRouter;