require('dotenv').config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
//const cors = require("cors");
const mongoose = require("mongoose"); // assign mongoose variable
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const flash = require("connect-flash");
const crypto = require('crypto');
const time1 = require('./timer');
const uri = "mongodb+srv://Vruttant_1403:Mankad@dascanner-ou1qn.mongodb.net/dascanner?retryWrites=true&w=majority"



// connect to database
mongoose.connect(uri ,
{ 
	useNewUrlParser: true,
	useUnifiedTopology: true 
});

const db = mongoose.connection;

//check db connection
db.once("open", ()=>
{
	console.log("connected to databse.");
});

//check for db connection error if any
db.on("error", (error)=>
{
	console.log(error);
});

// initialize app with express
const app = express();

// set views
app.set("views", path.join(__dirname, "views"));
// set view engine - EJS
app.set("view engine", "ejs");



app.use(cookieParser());



// set static file to /static/views route
// so all files in views will be static now
app.use('/static/', express.static(path.join(__dirname, "views")));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

var sessionStore = new session.MemoryStore;


app.use(session({
    cookie: { maxAge: 1000 * 60000000 },
    store: sessionStore,
    saveUninitialized: false,
    resave: 'false', //resaves session if time limit ended
    secret: 'asdajn'
}));


app.use(passport.initialize());
app.use(passport.session());
require('./passport-config')(passport);


const userRoute = require("./routes/userRoutes");
const userTypeRoute = require("./routes/userTypeRoutes");
const homeRoute = require("./routes/HomeRoute")(passport);
const gateRoute = require("./routes/GateRoutes");
const adminRoute = require("./routes/adminRoutes");
var equipment=require('./routes/equipment_router');
var scanqr=require('./routes/scanqr_router');
// var qrcode=require('./routes/qrcode_router');
var lib_tmp=require('./routes/lib_tmp_router');
var student_home=require('./routes/student_homepage_router');
var student_header=require('./routes/header_router');
let qrcode = require("./routes/qrcode_router");






app.use(flash());
/*
// Custom flash middleware -- from Ethan Brown's book, 'Web Development with Node & Express'
app.use(function(req, res, next){
    // if there's a flash message in the session request, make it available in the response, then delete it
    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;
    next();
});*/

// set home route
// simple get request by user

app.get("/",(request, response) =>
{
    time1.f2();
    let cookie = request.cookies['remember_me'];
    console.log(cookie);
    let msg= request.flash('message')
    //console.log(msg + "heyyyyy");
    if((cookie || request.isAuthenticated()) && msg=="")
    {
        console.log("here");
        //console.log("hey");
        response.redirect('/users/loadHomePage');

    }else{
    //response.redirect("/admin/addEmpUser");
    //console.log(msg + "heyyyyy1");
	response.render("loginPage",
	{
        title: "Helloo, Welcome to DA-Scanner.",
        error: msg,
        info: ""
    });
}
});

app.get("/index",(request, response) =>
{

    let cookie = request.cookies['remember_me'];
    //console.log(cookie);
    let msg= request.flash('message')
   // console.log(msg + "heyyyyy");
    if((cookie || request.isAuthenticated()) && msg=="")
    {
        //console.log("hey");
        response.redirect('/users/loadHomePage');

    }else{
    //response.redirect("/admin/loadAddUser");
    //console.log(msg + "heyyyyy");
	response.render("AddUserType",
	{
        title: "Helloo, Welcome to DAScanner.",
        error: msg
    });
}
});






    /*let doc;
    if(request.session.userData)
        doc = request.session.userData;

    console.log(doc);
    response.render("studentRegistration",
	{
        data: doc,
        title: "Helloo, Welcome to DAScanner.",
        error: request.flash('message')
    });*/
    


app.post("/decryptID",(req,res) => {

    let id = req.body.id;
    console.log(id);
    var mykey = crypto.createDecipher('aes-128-cbc', 'dascanner');
    var mystr = mykey.update(id, 'hex', 'utf8')
    mystr += mykey.final('utf8');

    res.send(mystr);
})
app.get("/decryptID/:id",(req,res) => {

    let id = req.params.id;
    console.log(id);
    var mykey = crypto.createDecipher('aes-128-cbc', 'dascanner');
    var mystr = mykey.update(id, 'hex', 'utf8')
    mystr += mykey.final('utf8');

    res.send(mystr);
})


// set /gate routes gateRoutes
//app.use("/gate", gateRoute);
app.use("/users", userRoute); // set /users routes
app.use("/userTypes", userTypeRoute);
app.use("/home",homeRoute);
app.use("/gate",gateRoute);
app.use("/admin",adminRoute);
app.use('/lib_tmp',lib_tmp);


app.use('/equipment',equipment);

app.use('/scanqr',scanqr);
app.use('/student_homepage1',student_home);
app.use("/student_header", student_header);
app.use("/qrcode",qrcode);
//app.user("/emp",userRoute);
// init port so server can start listening
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/*app.use(function(err,req,res,text){

    res.status(err.status || 500);
    if(err.status){
        res.render("Errors/error404");
    }else
    res.render("Errors/error500");

})*/

const port = process.env.PORT || 3000;
app.listen(port, ()=>
{
	console.log("DAScanner's Server started at port 3000");
});


