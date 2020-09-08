const express = require("express");
const ejs = require("ejs");
const pool = require("./db");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    username: '',
    user_id: ''
}))

app.get("/", function(req,res){
  res.render("login",{failure:false});
});

app.post("/",async(req,res)=>{
  const usernameSent = req.body.username;
  const passwordSent = req.body.password;

  try {
    let queryString = "SELECT username, password,user_id FROM Users WHERE username =\'"+usernameSent+"\' AND password =\'"+passwordSent+"\'";
    const userVerification = await pool.query(queryString);

    if(userVerification.rows.length === 1){
console.log(userVerification.rows);
      const usernameRetrieved = userVerification.rows[0].username;
      const passwordRetrieved = userVerification.rows[0].password;
      const idRetrieved = userVerification.rows[0].user_id;

      if(usernameSent === usernameRetrieved && passwordSent === passwordRetrieved){
        req.session.username = usernameSent;
        req.session.user_id = idRetrieved;
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
console.log(req.session.username);

  try {
    let queryUserWeight = "SELECT * FROM Users INNER JOIN Weeks ON Users.user_id = Weeks.user_id WHERE Users.username =\'"+req.session.username+"\' ORDER BY week DESC";
console.log(queryUserWeight);
  const allWeights = await pool.query(queryUserWeight);

  var post = allWeights.rows;

  // console.log(post);

  res.render("index",{post});

} catch (e) {
  console.log(e);
}
});

app.post("/home", async(req,res)=>{
  console.log("Hello");
  console.log(req.body.new_weight);
  console.log(req.session.user_id);
  console.log(req.session.username);

  try {
    let updateData = "SELECT weight,delta_acc FROM Weeks WHERE user_id = "+req.session.user_id+" ORDER BY week DESC LIMIT 1"
    console.log(updateData);
    const weightDelta = await pool.query(updateData);
    const weightTable = weightDelta.rows[0].weight;
    const deltaAccTable = weightDelta.rows[0].delta_acc;
    console.log(deltaAccTable);
    console.log(weightTable-req.body.new_weight);
    console.log((parseFloat(deltaAccTable)+parseFloat(weightTable)-req.body.new_weight).toFixed(2));
    let updateTable = "INSERT INTO Weeks (week,weight,delta,user_id,previous_weight,delta_acc) VALUES (\'"+new Date().toString().substr(0,15)+"\',"+req.body.new_weight+","+(weightTable-req.body.new_weight)+","+req.session.user_id+","+weightTable+","+(parseFloat(deltaAccTable)+parseFloat(weightTable)-req.body.new_weight).toFixed(2)+")"
    console.log(updateTable);
    const updateWeek = await pool.query(updateTable);
// INSERT INTO Weeks (week,weight,delta,user_id) VALUES ('2020-08-17',83.4,null,2);
  } catch (e) {
    console.log(e);
  }

  res.redirect("home");
});

app.get("/compare", async(req,res)=>{
  try {
    
  } catch (e) {
    console.log(e);
  }
  res.render("compare");
});

app.get("/tdee", async(req,res)=>{
  res.render("tdee");
});

app.listen(8080, function() {
  console.log("Server started on port 8080");
});
