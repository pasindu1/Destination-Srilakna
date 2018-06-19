var express = require('express');
var router = express.Router();
var connection = require('../config/connection');
var https= require('https');
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
        var Id = req.user.user_id;
        var path2 = "user_id_"
        upload_path = "public/uploads/"+ path2 +Id;
        mkdirp(upload_path, function (err) {
            if (err) console.error(err)
            else {
                console.log('Directory created');
                //setting destination.
                callback(null, upload_path);
            }
        });

    },
  filename : function (req, file, cb) {
    //var user = req.user_id;
    cb(null, file.fieldname + '-' + Date.now()+ path.extname(file.originalname))
  }
});

var upload = multer({ storage: storage }).array('vehi_img',5);
// var bcrypt = require('bcrypt');
// var passport = require('passport');
// var LocalStrategy = require('passport-local').Strategy;


router.get('/register_vendor',function(req,res){
  if(req.query.brandid){
    var brand_id = req.query.brandid;
    connection.query("SELECT * FROM model WHERE brand_id = ?",brand_id,function(err,result){
      if(err) throw err;
      res.send(result);
    });

  }else{
    connection.query("SELECT * FROM brand",function(err,result){
      if(err) throw err;
      connection.query("SELECT * FROM type",function(err,result2){
        if(err) throw err;
        connection.query("SELECT * FROM color",function(err,result3){
          if(err) throw err;

            res.render('vendor_reg',{brands:result,types:result2,colors:result3});
        });

      });


    });
  }

    //console.log( req.originalUrl);
});



//var cpUpload = upload.fields([{ name: 'filepond', maxCount: 3 }, { name: 'profile_img', maxCount: 1 }]);
router.post('/vendor_registration', function(req,res){
  //console.log(req.files['filepond'])
   //console.log(req.body);
  // console.log(req.body);

  upload(req, res, function (err) {
   if (err) {
    throw err;
  }else{
    // console.log(req.files);
    // console.log(req.body);
    connection.query("SELECT username FROM users WHERE id=?", req.user.user_id,function(err,result){
      if(err) throw err;
      var username = result[0]["username"];
      var vehi_period_start =req.body.start;
      var vehi_period_end =req.body.end;
      var today_date = dateToday();
      var active = dateCheck(vehi_period_start,vehi_period_end,today_date);
      var userdata = {
        color_id : req.body.colorid,
        description:req.body.desc,
        owner:username,
        brand_id:req.body.brandid,
        model_id:req.body.modelid,
        type_id:req.body.typeid,
        rate:req.body.rate,
        vehi_period_start:req.body.start,
        vehi_period_end:req.body.end,
        vehi_cond:req.body.condition,
        active:active
      };
      connection.query("INSERT INTO vehicle SET ?",userdata,function(err,result1){
        if(err) throw err;
        var insertId = result1.insertId;
        var l = req.files.length;
        var arr = [];
        for(var i=0;i<l;i++){
          arr[i] = req.files[i].path;
        }
        for(var j=0;j<arr.length;j++){
          connection.query("INSERT INTO image(img_url,vehi_id) VALUES ('"+arr[j]+"','"+insertId+"')");
        }
        // if(insertId){
        //   connection.query("CREATE EVENT myevent"+insertId+
        //                     " ON SCHEDULE EVERY 1 DAY"
        //                       +" DO"
        //                       +" BEGIN"
        //                       +" UPDATE vehicle SET active ="+active+";"
        //                       +" END");
        // }
        res.send("12")
       });
    });



  }

   // Everything went fine
 });
});

function dateCheck(from,to,check) {

    var fDate,lDate,cDate;
    fDate = Date.parse(from);
    lDate = Date.parse(to);
    cDate = Date.parse(check);

    if((cDate <= lDate && cDate >= fDate)) {
        return true;
    }
    return false;
};

function dateToday(){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

  if(dd<10) {
      dd = '0'+dd
  }

  if(mm<10) {
      mm = '0'+mm
  }

  today = mm + '-' + dd + '-' + yyyy;
  return today;
};


router.post('/vendor_registoring',function(req,res){
  console.log(req);
  upload(req, res, function (err) {
   if (err) {
    throw err;
  }else{
    // console.log(req.body);
    // console.log(req.files)
    var userdata = {
      vfirstname:req.body.fname,
      vlastname:req.body.lname,
      vaddress:req.body.address,
      vemail:req.body.email,
      vprofile_image_url:"123",
      vgender:req.body.gender,
      vp_number:req.body.pno,
      user_id:req.user.user_id
    }
    connection.query("INSERT INTO vendor SET ?",userdata,function(err,result){
      if(err) throw err;
      connection.query("SELECT username FROM users WHERE id=?", req.user.user_id,function(err,result){
        if(err) throw err;
        var username = result[0]["username"];
        var vehi_period_start =req.body.datepicker;
        var vehi_period_end =req.body.datepicker1;
        var today_date = dateToday();
        var active = dateCheck(vehi_period_start,vehi_period_end,today_date);
        var userdata2 = {
          color_id : req.body.color,
          description:req.body.vehi_desc,
          owner:username,
          brand_id:req.body.brand,
          model_id:req.body.model,
          type_id:req.body.type,
          rate:req.body.rate,
          vehi_period_start:vehi_period_start,
          vehi_period_end:vehi_period_end,
          vehi_cond:req.body.condition,
          active:active
        };
        connection.query("INSERT INTO vehicle SET ?",userdata2,function(err,result1){
          if(err) throw err;
          var insertId = result1.insertId;
          var l = req.files.length;
          var arr = [];
          for(var i=0;i<l;i++){
            arr[i] = req.files[i].path;
          }
          for(var j=0;j<arr.length;j++){
            connection.query("INSERT INTO image(img_url,vehi_id) VALUES ('"+arr[j]+"','"+insertId+"')");
          }
          res.redirect('/vendor/register_vendor');
        });
      });


    });
  }
});
});
module.exports = router;
