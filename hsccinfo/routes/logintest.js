var express = require('express');
var router = express.Router();
var jwt=require('jsonwebtoken');
const auth=require("../middleware/verifyToken");


const Encrypter=require("../middleware/PasswordEncrypt");
const MongoClient=require("../middleware/MongoClient");
/* GET register page. */
router.get('/', auth,function(req, res, next) {
  res.render('logintest', { title: 'Test Login Page' ,message:'',username: res.locals.name, role: res.locals.role });
});

// POST register form
router.post('/', auth,function(req, res, next) {
  let name=req.body.username;
  let pwd=req.body.pwd;
  const client=MongoClient.CreateMongoClient();
  async function run() {
    try {
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        const db = client.db('Elections24');
        const collection = db.collection('Users');
        const result= await collection.findOne( { username: name } )
        console.log(result)
        if (result===null){
          res.render('logintest',{title:'Login failed',message:'Login and password not found',username: res.locals.name, role: res.locals.role})
        }
        else {
          salt=result.salt
          key=result.key
          if (process.env.CONSOLE_DEBUG){
            console.log(result)
            //console.log(salt)
            //console.log(key)
          }
          var {keyString,saltString}=await Encrypter.TestPassword(req.body,salt)
          if (process.env.CONSOLE_DEBUG){
             console.log(keyString,saltString)
          }
          if (keyString==key){
            global.user_id=result._id
            global.role=result.role
            var token=jwt.sign(
              {
                id:global.user_id,role:global.role,name:name
              }, process.env.BEARER_TOKEN, {expiresIn: 86400000}
            )
            if (process.env.CONSOLE_DEBUG){
              console.log(token)
              console.log(req.ip)
              const currentTime = new Date();
              console.log(currentTime);
              console.log(`Current time is: ${currentTime.toLocaleString()}`);
            }
            global.userToken=token
            var IParray=result.lastIP
            IParray.unshift(req.ip)
            IParray=IParray.slice(0, 5);
            var loginTimearray=result.lastLoginTime
            loginTimearray.unshift(new Date())
            loginTimearray=loginTimearray.slice(0,5)

            const updateresult=await collection.updateOne({username:name},{$set:{lastIP:IParray,lastLoginTime:loginTimearray}})
            res.redirect('dashboard')
          }
          else{
            res.render('logintest',{title:'Login failed',message:'Login and password not found',username: res.locals.name, role: res.locals.role})
          }
        }
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
  }
  run().catch(console.dir);
  console.log("Test password");
 
 

});

module.exports = router;