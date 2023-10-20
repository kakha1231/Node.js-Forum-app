const jwt = require("jsonwebtoken")

function authmiddleware(req, res, next){
const header = req.headers.authorization;
if(!header){
  return res.status(401).json({message: "unauthorized"})
}
const split = header.split(" ")
if(split.length != 2){ 
     return res.status(401).json({message: "unauthorized"}) }
 
     try{
   const payload = jwt.verify(split[1],process.env.JWT_SECRET)
   req.user=payload;
  }
  catch(err){
   return res.status(401).json({message: "unauthorized"})
  }

  next();
}

module.exports = {authmiddleware};