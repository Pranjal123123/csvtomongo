const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const session = require("express-session");
const app = express();


const port = process.env.PORT || 8000;
mongoose.set('strictQuery', true);
const static_path = path.join(__dirname, "../public");
app.use(express.static(static_path));

require("dotenv").config();


app.set("view engine", "ejs");


require("./db/conn");
const { Console } = require("console");

//body parser

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//setting up methods
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//flash part==================={use to display success or error in coloured manner}
app.use(cookieParser(''));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false,maxAge:60000 }
}));

app.use(flash());

//Routes===========================================
var resourceRoutes = require("../routes/resource");
app.use(resourceRoutes);

// app.get('/', function (req, res) {
//     res.send('Welcome to EXCelSheet');
// });
  
app.listen(port, () => {
console.log(`server is running at port ${port}`);
});
  