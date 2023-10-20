const express = require("express");
const cors = require("cors")
const userroute = require("./routes/user")
const postroute = require("./routes/posts")
const comentroute = require("./routes/comments")

const app = express();

require("dotenv").config();
app.use(cors());
app.use(express.json());

app.get("/",(req,res) =>{

    return res.json({body: "all good"})
})

app.use("/user",userroute);
app.use("/post",postroute);
app.use("/comment",comentroute);



app.listen(8000, (req, res) => {
    console.log('listening on 8000') })