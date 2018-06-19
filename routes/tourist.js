var express = require('express');
var router = express.Router();
var connection = require('../config/connection');

router.get('/edit',function(req,res){
  connection.query("SELECT * FROM users WHERE id ="+req.user.user_id+" LIMIT 1",function(err,result){
    if(err) throw err;
    var username = result[0]["username"];
    var email = result[0]["email"];
    res.render('edit_tourist',{username:username,email:email});
  });
});

router.post('/customer_reg',function(req,res){
  var userdata = {
    t_username:req.body.username,
    t_first_name:req.body.fname,
    t_last_name:req.body.lname,
    t_email:req.body.email,
    t_mobile:req.body.pno,
    t_profile_photo:req.body.file_photo,
    country:req.body.country,
    state:req.body.state,
    zip:req.body.zip,
    t_user_id:req.user.user_id
  };
  connection.query("INSERT INTO tourist SET ?",userdata,function(err,result){
    if(err) throw err;
    res.redirect('/tourist/edit');
  });
  // console.log(req.body);
});

module.exports = router;
