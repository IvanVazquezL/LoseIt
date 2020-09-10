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

    let retrieveHeight = "SELECT height FROM Users WHERE USER_ID ="+req.session.user_id;
    const heightQuery = await pool.query(retrieveHeight);
    let newBmi = (req.body.new_weight /(parseFloat(heightQuery.rows[0].height)*parseFloat(heightQuery.rows[0].height))).toFixed(1);
    console.log(newBmi);
    let updateWeightBmi = "UPDATE Users SET current_weight="+req.body.new_weight+",bmi="+newBmi+" WHERE user_id ="+req.session.user_id;
    const updateUser = await pool.query(updateWeightBmi);
  } catch (e) {
    console.log(e);
  }

  res.redirect("home");
});

app.get("/compare", async(req,res)=>{
  try {
    const allUsers = await pool.query("SELECT username,delta,delta_acc,weight,week FROM WEEKS JOIN Users on Users.user_id=Weeks.user_id ORDER BY week DESC");
    const allWeeks = await pool.query("SELECT week FROM Weeks GROUP BY week HAVING COUNT(*) > 1 ORDER BY week DESC");
    const numberUsers = await pool.query("SELECT COUNT(*) FROM Users");

    var users = parseInt(numberUsers.rows[0].count);
    var weeks = allWeeks.rows

    var usersInfo = allUsers.rows;

    res.render("compare",{usersInfo,weeks,users});

    weeks.forEach(function(element){
      console.log(element.week);
      let count = 0;
      // console.log(usersInfo);
      usersInfo.every(function(element,index,object){
        console.log("Name: "+element.username+", Peso:"+element.weight+", Week:"+element.week);
        count +=1;



        if(count===users){
          object.splice(0,users);
          return false;
        }
        else{
          return true;
        }
      });

      // console.log(usersInfo);
      console.log(" ");
    });
console.log(numberUsers);
console.log(users);
  } catch (e) {
    console.log(e);
  }

});

app.get("/tdee", async(req,res)=>{
  try {
    const resultBmi = await pool.query("SELECT bmi,height,current_weight,age,sex FROM Users WHERE user_id="+req.session.user_id);

var bmi =resultBmi.rows[0].bmi;
var heightBmi = resultBmi.rows[0].height;
var weightTdee = resultBmi.rows[0].current_weight;
var ageTdee = resultBmi.rows[0].age;
var sexTdee = resultBmi.rows[0].sex;
var category;
var firstLimit;
var lastLimit;
var tdee;

if(bmi<18.5){
  category="Bajo Peso";
}
else if(bmi>=18.5 && bmi<=24.9){
  category="Peso Normal";
}
else if(bmi>=25.0 && bmi<=29.9){
  category="Sobrepeso";
}
else{
  category="Obeso";
}

firstLimit = (18.5 * (heightBmi*heightBmi)).toFixed(1);
lastLimit = (24.9 * (heightBmi*heightBmi)).toFixed(1);

if(sexTdee==="male"){
  tdee = (((10*weightTdee + 6.25*(heightBmi*100) - 5.0*ageTdee) + 5) * 1.2).toFixed(0);
  console.log(weightTdee);
  console.log(heightBmi);
  console.log(ageTdee);
  console.log(tdee);
}
else{
  tdee = (((10*weightTdee + 6.25*(heightBmi*100) - 5.0*ageTdee) - 161) * 1.2).toFixed(0);
}

res.render("tdee",{bmi,category,firstLimit,lastLimit,tdee});
  } catch (e) {

  }

});

app.get("/prediction", async(req,res)=>{
  res.render("prediction");
});



app.listen(8080, function() {
  console.log("Server started on port 8080");
});
