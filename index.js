const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
//const cors = require("cors");
const mongoose = require("mongoose"); // assign mongoose variable

const session = require('express-session');
const passport = require('passport');
//require('./passport-config')(passport);

const cookieParser = require('cookie-parser');
const flash = require("connect-flash");
//const session = require("express-session");

// import diff Routes
//const gateRoute = require("./routes/GateRoutes");
require('dotenv').config();


// connect to database
mongoose.connect("mongodb://localhost/dascanner",
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
var sessionChecker =  (req,res,next)=>{

    let cookie = req.cookies['remember_me'];
    console.log("cookie " + cookie)
    if(req.body && req.body.rememberme){
    if(cookie === undefined)
    {
        res.cookie("remember_me",req.user,{maxAge: 7*24*60*60*1000}).send('cookie set');
        next();
    }
    }
    next();
    // if(cookie)
    // {
    //     res.redirect('/users/loadHomePage');
    // }
    
    
    
}
app.get("/",(request, response) =>
{

    let cookie = request.cookies['remember_me'];
    console.log(cookie);
    if(cookie || request.isAuthenticated())
    {
        //console.log("hey");
        response.redirect('/users/loadHomePage');

    }else{
    //response.redirect("/admin/loadAddUser");
	response.render("loginPage",
	{
        title: "Helloo, Welcome to DAScanner.",
        error: request.flash('message')
    });
}
});

app.get("/index",(request, response) =>
{

    let cookie = request.cookies['remember_me'];
    console.log(cookie);
    if(cookie || request.isAuthenticated())
    {
        //console.log("hey");
        response.redirect('/users/loadHomePage');

    }else{
    //response.redirect("/admin/loadAddUser");
	response.render("loginPage",
	{
        title: "Helloo, Welcome to DAScanner.",
        error: request.flash('message')
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

// set /gate routes gateRoutes
//app.use("/gate", gateRoute);
app.use("/users", userRoute); // set /users routes
app.use("/userTypes", userTypeRoute);
app.use("/home",homeRoute);
app.use("/gate",gateRoute);
app.use("/admin",adminRoute);


app.use('/equipment',equipment);

app.use('/scanqr',scanqr);
app.use('/student_homepage1',student_home);
app.use("/student_header", student_header);
//app.user("/emp",userRoute);
// init port so server can start listening


app.use(function(err,req,res,text){
    console.error(err.stack);
    res.status(500);
    res.render("Errors/error500");

})


app.listen(3000, ()=>
{
	console.log("DAScanner's Server started at port 3000");
});