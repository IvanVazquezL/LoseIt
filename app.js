const express = require("express");
const ejs = require("ejs");
const pool = require("./db");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req,res){
  res.render("login",{failure:false});
});

app.post("/",async(req,res)=>{
  const usernameSent = req.body.username;
  const passwordSent = req.body.password;

  try {
    let queryString = "SELECT username, password FROM Users WHERE username =\'"+usernameSent+"\' AND password =\'"+passwordSent+"\'";
    const userVerification = await pool.query(queryString);

    if(userVerification.rows.length === 1){

      const usernameRetrieved = userVerification.rows[0].username;
      const passwordRetrieved = userVerification.rows[0].password;

      if(usernameSent === usernameRetrieved && passwordSent === passwordRetrieved){
        res.redirect("/home");
      }
      else{
        res.render("login",{failure:true});
      }
    }
    else
    {
      res.render("login",{failure:true});
    }




  } catch (error) {
    console.log(error);
  }
});



app.get("/home",async(req,res)=>{


  try {
  const allWeights = await pool.query("SELECT * FROM Users INNER JOIN Weeks ON Users.user_id = Weeks.user_id");
  // console.log(allWeights.rows);
  console.log(allWeights.rows[0]);
  var post = allWeights.rows[0];

  res.render("index",{post});

} catch (e) {
  console.log(e);
}
});

app.listen(8080, function() {
  console.log("Server started on port 8080");
});
