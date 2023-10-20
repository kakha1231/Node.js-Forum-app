const {checkSchema} = require("express-validator");

const signupvalidator = checkSchema({
    username :{
      in : 'body',
      isEmpty : false,
      isString : true,
      isLength:{
          oprions :{
              minLength : 2
          }
      }
    },
    password : {
          in : 'body',
          isEmpty : false,
          isString : true,
          isLength: {
              options : {
                  minLength : 6
              }
          }
    },
    email :{
      in : 'body',
      isEmpty : false,
      isString : true,
      isLength:{
          oprions :{
              minLength : 2
          }
      }
    },
  });
  
  const signinvalidator = checkSchema({
    email :{
      in : 'body',
      isEmpty : false,
      isString : true
    },
    password : {
      in : 'body',
      isEmpty : false,
      isString : true,
      }
   })
  
  module.exports = {signupvalidator, signinvalidator}