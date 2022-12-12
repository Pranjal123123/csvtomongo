const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
//const Resource = require("../src/models/excldata");
const multer  = require('multer');
const csv = require('csvtojson');
var csvmodels = require('../src/models/excldata');
const path = require("path");
const methodOverride = require("method-override");
var async = require('async');

router.use(methodOverride("_method"));
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
); 

router.use(express.static(__dirname+"./public/"));
const storage = multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,"./public/csv/");
  },
  filename: function(req, file, cb) {
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }
});

var upload = multer({
    storage: storage,
  });
 
router.get("/",async(req,res)=>{
    try{
        res.render("home",{
          serverSuccess:req.flash('server-success'),
          serverError:req.flash('server-error')
        });
    }
    catch(err){
      console.log(err);
      res.send("Something went wrong. Try again");
    }
});

router.post('/post', upload.single('csv'), async(req, res) => {  
  try{
    csv()
    .fromFile(req.file.path)
    .then((alldata) => {
      //console.log(alldata);


      async.eachSeries(alldata,function(item, cb){
        setTimeout(function() {
          console.log(item);
          return cb();
        }, Math.random()*2000);
      }, function(err){
        console.log(err);
      });


      csvmodels.insertMany(alldata,(err, data) => {
        if (err) {
          req.flash('server-error',"Something wrong");
          res.redirect('/');
          console.log(err);
        } else {
          req.flash('server-success',"Thank You.Your File has been Successfully uploaded");
          res.redirect('/');
          // res.send("successfully send");
        }
      });
    });
  }
  catch{
    console.log(err);
    res.send("There is a possibility of error");   
  }
 
});
module.exports = router;