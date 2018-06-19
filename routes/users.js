var express = require('express');
var router = express.Router();
var connection = require('../config/connection');
var multer = require('multer');
var upload =  multer({dest : "images/uploads/"});
var bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;



router.get('/myblogs', function(req,res){
  console.log(req.query['result']);
  res.render('myblogs');
})

/* GET users listing. */
router.post('/myblogs',upload.single('myfile'), function(req ,res) {

    var desc = req.body.form10;
    var path1 = req.file.path;

    //req.check('desc', 'description is required').notEmpty();


   //console.log(req.body);



//     if(req.files.mainimage){
//       var mainImageOriginalName = req.files.originalname;
//       var mainImageName  = req.files.mainimage.name;
//       var mainImageMime  = req.files.mainimage.mimetype;
//       var mainImagePath  = req.files.mainimage.path
//       var mainImageExt   = req.files.mainimage.extension
//       var mainImageSize  = req.files.mainimage.size
//     }else{
//       var mainImageName = "noImage.png";
//     }

  // var errors= req.validationErrors();
  //  if(errors){
  //    req.session.errors = errors;
  //    console.log(errors);
  //    res.redirect('myblogs');
  //  }else{
    var userdata=[{
      description : desc,
      image_url : path1,
      user_id : req.user.user_id

    }]
    connection.query("INSERT INTO blog SET ?",userdata,function(err,result){
      if(err) throw err;

      connection.query("SELECT * FROM blog ORDER BY date",function(err,result){
        if(err) throw err;

        // var reultt = JSON.stringify(result);
        // res.redirect('myblogs?result='+ reultt);
        res.render('myblogs',{blogs:result});
      });
    });
 //}



});
//
// router.get('/verify',function(req,res){
//   res.render('email_verify');
// });
// router.post('/verify',function(req,res){
//   var secrettoken1 = req.body.secrettoken;
//   connection.query("SELECT * FROM users WHERE secrettoken = ?",secrettoken1,function(err,result){
//     if(err) throw err;
//     // console
//     if(!result[0]){
//       res.redirect('/users/verify');
//     };
//     connection.query("UPDATE users SET secrettoken ='', active= "+true+" WHERE id ="+result[0]["id"],function(err,result){
//       if(err) throw err;
//       res.redirect('/home');
//     })
//   });
//   // secrettoken ='';
// });
passport.serializeUser(function(user_id, done) {
  done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {
  done(null, user_id);
});
module.exports = router;
