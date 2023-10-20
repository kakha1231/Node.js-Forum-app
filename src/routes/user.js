const express = require("express");
const prisma = require("../prisma_client/client")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {signinvalidator,signupvalidator} = require("../validators/user");
const {validationResult} = require('express-validator')
const { authmiddleware } = require("../middlewares/jwt");

const router = express.Router();

router.get("/", async (req,res)=> {

    const users = await prisma.user.findMany();  //for testing
    return res.json({data: users})
}); 

router.post("/register",signupvalidator,async (req,res) => {  //user registration
    const {username, password, email, role} = req.body;

    const error = validationResult(req)
   if (!error.isEmpty()){
     return res.status(400).json({message: error.array()})
   }
    try{
        const hashpassword = await bcrypt.hashSync(password,10);  //stores hashed password  
        const newuser = await prisma.user.create({data : {username, password : hashpassword , email, role}});    

        return res.status(200).json({success : true})
    }
    catch(e){
        console.log(e)
        return res.status(401).json({error : 'we got some error here ${e}'})
    }
});


router.post("/login",signinvalidator,async (req,res) =>{  //user login

    const user = await prisma.user.findUnique({where : { email : req.body.email }})

    const error = validationResult(req)
   if (!error.isEmpty()){
     return res.status(400).json({message: error.array()})
   }

    if(!user){
        return res.status(401).json({message : "invalid email or password"});
    }

    else{   
        const password = await bcrypt.compare(req.body.password,user.password); //compares hashed password to pasword from request
         
        if(!password){
            return res.status(401).json({message : "invalid email or password"});     
          }           
           else{
                const token = jwt.sign({  //generates JWT token
                   username : user.username,
                   id : user.id,
                   role : user.role},
                   process.env.JWT_SECRET,
                   {expiresIn: '12h'}) 

           return res.status(200).json({token : token})  
           }     
    }
});

module.exports = router;