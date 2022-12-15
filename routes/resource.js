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
const reorder = require('csv-reorder');


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

      // use of async.eachseries
      async.eachSeries(alldata,function(item, cb){
        setTimeout(function() {
          console.log(item);
          return cb();
        }, Math.random()*2000);
      }, function(err){
        console.log(err);
      });

      //method 1
      // const unique = new Set(alldata);

      //method 2
      //reorder package
      reorder({
        input: req.file.path,
        output: './public/csv/output.csv',
        sort: 'Email',
        type: 'string',
        remove: true,
        "remove-duplicates": true,
        metadata: false
      })
      .then((metadata) => {

        console.log(metadata);

        //csv of output
        csv().fromFile('./public/csv/output.csv')
        .then((productdata)=>{
        csvmodels.insertMany(productdata,(err, data) => {
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
        })
        .catch(error => {
          console.log(error)
        });  
        // output of csv ends
      })
      .catch(error => {
        console.log(error)
      });
     // reorder package ends

    });
  }
  catch{
    console.log(err);
    res.send("There is a possibility of error");   
  }
});

// method 3 (but not able to implement)
  // router.post("/post",upload.single('csv'), async (req, res) => {
  //   const products = await csv().fromFile(req.file.path);
    
  //   try {
  //     products.map(async (pdata) => {
  //       let uniqueCode= await csvmodels.findOne({
  //         Email: pdata.Email,
  //       });
  //       if (!uniqueCode) {
  //         //create new object
  //         let product = new csvmodels({
  //           Name:pdata.Name,
  //           Email:pdata.Email,
  //           MobileNumber:pdata.MobileNumber,
  //           DateOfBirth:pdata.DateOfBirth,
  //           WorkExperience:pdata.WorkExperience,
  //           ResumeTitle:pdata.ResumeTitle,
  //           CurrentLocation:pdata.CurrentLocation,
  //           PostalAddress:pdata.PostalAddress,
  //           CurrentEmployer:pdata.CurrentEmployer,
  //           CurrentDesignation:pdata.CurrentDesignation,
  //         });
  //          await product.save();
  //       }
  //     });
  //     req.flash('server-success',"Thank You.Your File has been Successfully uploaded");
  //     res.redirect('/');
  //   } catch (err) {
  //     console.error(err);
  //   }
  // })
 

module.exports = router;