var express = require('express');
var router = express.Router();
var connection = require('../config/connection');
var dateFormat = require('dateformat');

router.get('/get_vehicles',function(req,res){
  //console.log(req.query);
  connection.query("SELECT DISTINCT brand.b_name FROM brand INNER JOIN vehicle ON brand.b_id = vehicle.brand_id WHERE b_name LIKE '%"+ req.query.name +"%'",function(err,result){
    if(err) throw err;
    //console.log(result);
    res.send(result);
  });
});

router.get('/display_relativevcls',function(req,res){
  connection.query("SELECT * FROM vehicle INNER JOIN brand ON brand.b_id = vehicle.brand_id WHERE brand_id ="+req.query.b_id+" AND model_id ="+req.query.m_id ,function(err,result){
    if(err) throw err;
    connection.query("SELECT * FROM model WHERE brand_id = ?",req.query.b_id,function(err,result2){
      if(err) throw err;
      res.render('display_relvcl',{vehicles:result,models:result2});
    });

  });
});

router.get('/book',function(req,res){
  connection.query("SELECT * FROM events WHERE vehi_id = ?",req.query.vehi_id,function(err,result){
    //console.log(result);
    res.send(JSON.stringify(result));
  });
});

function getDaysBetweenDates(d0, d1) {

  var msPerDay = 8.64e7;

  // Copy dates so don't mess them up
  var x0 = new Date(d0);
  var x1 = new Date(d1);

  // Set to noon - avoid DST errors
  x0.setHours(12,0,0);
  x1.setHours(12,0,0);

  // Round to remove daylight saving errors
  return Math.round( (x1 - x0) / msPerDay );
}

router.post('/insert_booking',function(req,res){
  var num_of_days  = getDaysBetweenDates(req.body.start, req.body.end);
  //console.log(num_of_days);
  // console.log(req.body);
  var userdata = {
    title:req.body.title,
    start:req.body.start,
    end:req.body.end,
    num_of_days:num_of_days,
    vehi_id:req.body.vehi_id,
    user_id:req.user.user_id
  };
  connection.query("INSERT INTO events SET ?",userdata,function(err,result){
    if(err) throw err;
    res.send(result);
  });
});

router.get('/booking_show',function(req,res){
  res.render('display_booking_calander');
});

router.post('/update_booking',function(req,res){
  var num_of_days  = getDaysBetweenDates(req.body.start, req.body.end);
  var userdata = {
    title : req.body.title,
    start : req.body.start,
    end : req.body.end,
    num_of_days:num_of_days
  }
  // connection.query("UPDATE events SET title = "+title+", start= "+start+", end = "+end+", WHERE id = "+req.body.id,function(err,result){
  //   if(err) throw err;
  //   res.send("12");
  // });
  connection.query("UPDATE events SET ? WHERE id = "+req.body.id,userdata,function(err,result){
    if(err) throw err;
    res.send(result);
  });
});

router.post('/delete_booking',function(req,res){
  console.log(req.body.id)
  console.log(req);
  var id = req.body.id;
  connection.query("DELETE FROM events WHERE id =?",id,function(err,result){
    if(err) throw err;

    res.send(result);
  });
});

router.get('/finalize_book',function(req,res){
  connection.query("SELECT * FROM events WHERE user_id ="+req.user.user_id+" ORDER BY id DESC LIMIT 1",function(err,result){
    if(err) throw err;
    var start = dateFormat(result[0]["start"],"yyyy-mm-dd h:MM");
    var end = dateFormat(result[0]["end"],"yyyy-mm-dd h:MM");
    var num_of_days = result[0]["num_of_days"];
    res.render("final_booking",{start:start,end:end,num_of_days:num_of_days});
  });
});
module.exports = router;
