var express = require('express');
var router = express.Router();
var connection = require('../config/connection');
var bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var randomstring = require('randomstring');
var mailer = require('../misc/mailer');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index1');
});

router.get('/login',function(req,res){
  res.render("login/login");
});

router.post('/login', passport.authenticate(
  'local',
  {
    successRedirect: '/home',
    failureRedirect: '/login'
  }
));

router.get('/register',function(req,res){
  res.render("register/register",{errors:req.session.errors,role:req.query.role_id});
  req.session.errors =null;
});



router.get('/logout',function(req,res){
  req.logout();
  req.session.destroy();
  res.redirect('/');

});

router.post('/registeruser',function(req,res){
  var username=req.body.username;
  var email=req.body.email;
  var confirmpassword = req.body.confirmpassword;
  var pwd = req.body.password;
  var role_id = req.body.role;
  //validations
  req.check('username', 'Username is required').notEmpty();
  req.check('email','Email is required').notEmpty();
  req.check('email','Email is not valid').isEmail();
  // req.check('email',' This Email exist').isUnique();
  req.check('password','Password is required').notEmpty();
  req.check('confirmpassword','Password do not match').equals(pwd);


  var errors= req.validationErrors();
  if(errors){
    req.session.errors = errors;
    res.redirect('/register');
  }else{
    connection.query("SELECT * FROM users WHERE username=?",username,function(err,result){
      if(err) throw err;
      if(result.length > 0){
        res.render('register/register',{info2:'Username Already exists in the database',errors:errors})
      }else{
        connection.query("SELECT * FROM users WHERE email=?",email,function(err,result){
          if(err) throw err;
          if(result.length > 0){
            res.render('register/register',{info1:'Email Already exists in the database',errors:errors})
          }else{
            bcrypt.hash('pwd', 10, function(err, hash) {
              if(err) throw err;
              var secrettoken = randomstring.generate();
              var userdata={
                username:req.body.username,
                email:req.body.email,
                password:hash,
                secrettoken:secrettoken,
                active:false,
                role_id:role_id
              };
              connection.query("INSERT INTO users SET ?",userdata,function(err,result){
                if(err) throw err;
                // var html = 'HI there</br>Thank you for Registering</br>Please verify your email by entering the following</br>TOken:<b>${secrettoken}</b></br> onthe following page<a href="http://www.localhost:3000/users/verify">http://www.localhost:3000/users/verify</a>';
                // mailer.sendEmail('emai@gmail.com',email,'please verify',html);
                // req.flash('info', 'Sucessfully Registerd now you may login.');
                res.render('login/login',{info: 'Sucessfully Registerd now you may login.'});
              });
            });
          }
        });
      }
    });



  }

});

// var total =0;
// var pageSize = 2;
// var pageCount = 0;
// var start = 0;
// var currentPage = 1;
//
// router.get('/home',authenticationMiddleware(),function(req,res){
//   if(req.query.colorid){
//     var color_id = req.query.colorid;
//     connection.query("SELECT DISTINCT brand_id FROM vehicle WHERE color_id = ?",color_id,function(err,result){
//       if(err) throw err;
//       var res1 =result;
//       //console.log(res1);
//
//       var b_ids=[];
//         for (i = 0; i < res1.length; i++) {
//           var json_str = JSON.stringify(res1[i]);
//           try {
//             var j_obj = JSON.parse(json_str);
//           }
//           catch (err) {}
//           b_ids[i]= j_obj.brand_id;
//        }
//
//
//        connection.query("SELECT * FROM brand WHERE b_id IN (" + b_ids.join() + " ) " ,function(err,result2){
//          if(err) throw err;
//          //console.log(JSON.stringify(result2));
//
//          res.send(result2);
//        });
//        //console.log(b_id);
//       // console.log(b_id);
//       // // //connection.query()
//
//
//     })
//   }else if(req.query.brandid){
//     var brand_id = req.query.brandid;
//     connection.query("SELECT * FROM model WHERE brand_id = ?",brand_id,function(err,result){
//       if(err) throw err;
//       res.send(result);
//     });
//
//   }else{
//     connection.query("SELECT * FROM color",function(err,result){
//       if(err) throw err;
//       var colors = result;
//       connection.query("SELECT * FROM brand",function(err,result2){
//         if(err) throw err;
//         //console.log(result2);
//         var b_ids = [];
//         for(var i=0; i<result2.length; i++){
//           b_ids[i] =result2[i].b_id;
//         }
//         connection.query("SELECT COUNT(id) AS ids_count FROM model WHERE brand_id IN (" + b_ids.join() + ")",function(err,result3){
//           if(err) throw err;
//           //console.log(result2.length)
//           if(req.query.color !=null || req.query.page > 1){
//               var color = req.query.color;
//               var brand_id = req.query.brand;
//               var model_id = req.query.model;
//
//
//             connection.query("SELECT COUNT(vehicle_id) AS id_count FROM vehicle WHERE color_id ="+color+" AND brand_id="+brand_id +" AND model_id= "+model_id,function(err,result1){
//               //console.log(result1[0].id_count);
//               if(err) throw err;
//               total = result1[0].id_count;
//               pageCount = Math.ceil(total/pageSize);
//               //console.log(req.query.page);
//               if (typeof req.query.page !== 'undefined') {
//                 currentPage = req.query.page;
//               }
//
//               if (parseInt(currentPage)>1) {
//                 start = (currentPage - 1) * pageSize;
//               }
//
//
//                 connection.query("SELECT vehicle.vehicle_id,brand.b_name,vehicle.owner,vehicle.year,vehicle.color_id FROM vehicle INNER JOIN brand ON brand.b_id =vehicle.brand_id WHERE brand_id ="+brand_id+
//               " AND color_id = "+ color +" AND model_id = "+ model_id +" LIMIT "+ pageSize + " OFFSET "+ start,function(err,result){
//                   if(err) throw err;
//                   var arr = [];
//                   for(var j=0;j<pageCount;j++){
//                     arr[j]=j+1;
//                   }
//
//                   res.render('home', {colors: colors, brand1:result2, num_cars:result3,result1:result,pageCount: pageCount,
//                      pageSize: pageSize, currentPage: currentPage,color:color,brand:brand_id,model:model_id,array:arr});
//                 });
//           });
//         }else{
//             res.render('home',{colors: result, brand1:result2, num_cars:result3});
//           }
//         });
//
//       });
//
//     });
//
//
//   }
//
//
// });
//
function dateCheck(start,end,startdb,enddb) {

    var fDate,lDate,cDate,dbeDate;
    fDate = Date.parse(start);
    lDate = Date.parse(end);
    dbsDate = Date.parse(startdb);
    dbeDate = Date.parse(enddb);

    if(fDate < dbsDate && lDate < dbsDate){
      console.log("true");
        return true;
    }else if(fDate > dbeDate && lDate > dbeDate){
      console.log("true");
        return true;
    }else{
      console.log("false");
        return false;
    }
    // console.log("false");
    // return false;
}


 router.get('/home',function(req,res){
     connection.query("SELECT vehicle.vehicle_id,vehicle.rate,color.color,brand.b_name,model.m_name FROM vehicle JOIN brand ON brand.b_id = vehicle.brand_id JOIN color ON color.color_id=vehicle.color_id JOIN model ON model.id=vehicle.model_id WHERE type_id =1",function(err,result1){
       if(err) throw err;
       console.log(result1);
       connection.query("SELECT vehicle.vehicle_id,vehicle.rate,color.color,brand.b_name,model.m_name FROM vehicle JOIN brand ON brand.b_id =vehicle.brand_id JOIN color ON color.color_id=vehicle.color_id JOIN model ON model.id=vehicle.model_id WHERE type_id =2",function(err,result2){
         console.log(result2);
         if(err) throw err;
         connection.query("SELECT vehicle.vehicle_id,vehicle.rate,color.color,brand.b_name,model.m_name FROM vehicle JOIN brand ON brand.b_id =vehicle.brand_id JOIN color ON color.color_id=vehicle.color_id JOIN model ON model.id=vehicle.model_id WHERE type_id =3",function(err,result3){
           if(err) throw err;
           connection.query("SELECT * FROM brand",function(err,result4){
             if(err) throw err;
             connection.query("SELECT vehicle.vehicle_id,image.img_url,brand.b_name FROM vehicle JOIN brand ON brand.b_id =vehicle.brand_id JOIN image ON image.vehi_id=vehicle.vehicle_id WHERE vehicle.vehi_cond='luxury' GROUP BY vehicle.vehicle_id ORDER BY vehicle.vehicle_id DESC LIMIT 4",function(err,result7){
               if(err) throw err;
               // console.log(result7);
               connection.query("SELECT vehicle.vehicle_id,image.img_url,brand.b_name FROM vehicle JOIN brand ON brand.b_id =vehicle.brand_id JOIN image ON image.vehi_id=vehicle.vehicle_id WHERE vehicle.vehi_cond='luxury' GROUP BY vehicle.vehicle_id ORDER BY vehicle.vehicle_id ASC LIMIT 4",function(err,result8){
                 if(err) throw err;
                 connection.query("SELECT vehicle.vehicle_id,image.img_url,brand.b_name FROM vehicle JOIN brand ON brand.b_id =vehicle.brand_id JOIN image ON image.vehi_id=vehicle.vehicle_id WHERE vehicle.vehi_cond='normal' GROUP BY vehicle.vehicle_id ORDER BY vehicle.vehicle_id DESC LIMIT 4",function(err,result9){
                   if(err) throw err;
                   // console.log(result7);
                   connection.query("SELECT vehicle.vehicle_id,image.img_url,brand.b_name FROM vehicle JOIN brand ON brand.b_id =vehicle.brand_id JOIN image ON image.vehi_id=vehicle.vehicle_id WHERE vehicle.vehi_cond='normal' GROUP BY vehicle.vehicle_id ORDER BY vehicle.vehicle_id ASC LIMIT 4",function(err,result10){
                     if(err) throw err;
                     res.render('home',{result1:result1,result2:result2,result3:result3,result4:result4,result7:result7,result8:result8,result9:result9,result10:result10});
                   })
                 })
                 // res.render('home',{result1:result1,result2:result2,result3:result3,result4:result4,result7:result7,result8:result8});
               })
             })
           });
         })
       });
     });

 });

router.post('/home',function(req,res){
  var start = req.body.datepicker;
  var end = req.body.datepicker1;
  var brandid = req.body.brand;
  var arr= [];
  connection.query("SELECT * FROM events",function(err,result){

    if(result.length>0){
      for(var i=0;i<result.length;i++){
        var dbsDate= result[i].start;
        var dbeDate= result[i].end;
        var cond = dateCheck(start,end,dbsDate,dbeDate);
        if(cond){
          arr[i] = result[i].vehi_id;
        }
      };

      arr = arr.filter( function( item, index, inputArray ) {
          return inputArray.indexOf(item) == index;
        });
        var k=arr.length;
        connection.query("SELECT * FROM vehicle WHERE vehicle_id <> ?",arr,function(err,result67){
          if(err) throw err;
          var t=0;
          for(var j=k;j<result67.length+k;j++){
            arr[j] = result67[t]["vehicle_id"];
            t= t+1;
          }
          if(arr.length>0){
            connection.query("SELECT vehicle.brand_id,vehicle.vehicle_id,vehicle.rate,color.color,brand.b_name,model.m_name FROM vehicle JOIN brand ON brand.b_id =vehicle.brand_id JOIN color ON color.color_id=vehicle.color_id JOIN model ON model.id=vehicle.model_id WHERE type_id =1 AND vehicle.brand_id="+brandid +" AND vehicle_id IN (" + arr.join() + ")",function(err,result1){
              if(err) throw err;
              console.log(result1);
              connection.query("SELECT vehicle.vehicle_id,vehicle.rate,color.color,brand.b_name,model.m_name FROM vehicle JOIN brand ON brand.b_id =vehicle.brand_id JOIN color ON color.color_id=vehicle.color_id JOIN model ON model.id=vehicle.model_id WHERE type_id =2 AND vehicle.brand_id="+brandid +" AND vehicle_id IN ("+ arr.join() + ")",function(err,result2){
                if(err) throw err;
                connection.query("SELECT vehicle.vehicle_id,vehicle.rate,color.color,brand.b_name,model.m_name FROM vehicle JOIN brand ON brand.b_id =vehicle.brand_id JOIN color ON color.color_id=vehicle.color_id JOIN model ON model.id=vehicle.model_id WHERE type_id =3 AND vehicle.brand_id="+brandid +" AND vehicle_id IN ("+ arr.join() + ")",function(err,result3){
                  if(err) throw err;
                  connection.query("SELECT * FROM brand",function(err,result4){
                    if(err) throw err;
                    res.render('home',{result1:result1,result2:result2,result3:result3,result4:result4});
                })
              });
            });

          });
        }else{
          res.redirect('/home');
        }
        });
      //console.log(arr.length);


    }else{
      res.redirect('/home');
    }



});
});
//router.get('/home',function(req,res){
//   var color = req.body.color;
//   var brand_id = req.body.brand;
//   var model_id = req.body.model;
//
//   connection.query("SELECT COUNT(vehicle_id) AS id_count FROM vehicle WHERE color_id ="+color+" AND brand_id="+brand_id +" AND model_id= "+model_id,function(err,result1){
//     //console.log(result1[0].id_count);
//     if(err) throw err;
//     total = result1[0].id_count;
//     pageCount = Math.ceil(total/pageSize);
//     //console.log(req.query.page);
//     if (typeof req.query.page !== 'undefined') {
//       currentPage = req.query.page;
//     }
//
//     if (parseInt(currentPage)>1) {
//       start = (currentPage - 1) * pageSize;
//     }
//
//
//       connection.query("SELECT brand.b_name,vehicle.owner,vehicle.year,vehicle.color_id FROM vehicle INNER JOIN brand ON brand.b_id =vehicle.brand_id WHERE brand_id ="+brand_id+
//     " AND color_id = "+ color +" AND model_id = "+ model_id +" LIMIT "+ pageSize + " OFFSET "+ start,function(err,result){
//         if(err) throw err;
//         res.render('home', {result1:result,pageCount: pageCount, pageSize: pageSize, currentPage: currentPage});
//       });
// });
//});

router.get('/display_vcl',function(req,res){
  connection.query("SELECT * FROM users WHERE id=?",req.user.user_id,function(err,res1){
  if(err) throw err;
  var role_id= res1[0]["role_id"];

  var id = req.query.id;

  connection.query("SELECT * FROM image WHERE vehi_id = ?",id,function(err,result){
    if(err) throw err;
    connection.query("SELECT * FROM vehicle WHERE vehicle_id = ?",id,function(err,result1){
      if(err) throw err;
      var brand_id = result1[0]["brand_id"];
      var model_id = result1[0]["model_id"];
      var color_id = result1[0]["color_id"];

      connection.query("SELECT * FROM model WHERE brand_id = ?",brand_id,function(err,result2){
        if(err) throw err;
        connection.query("SELECT b_name FROM brand WHERE b_id = ?",brand_id,function(err,result3){
          if(err) throw err;
          //console.log(id);
          var b_name = result3[0]["b_name"];
          connection.query("SELECT color FROM color WHERE color_id = ?",color_id,function(err,result4){
            if(err) throw err;
            connection.query("SELECT m_name FROM model WHERE id = ?",model_id,function(err,result5){
              var m_name = result5[0]["m_name"]
              if(err) throw err;
              res.render('display_vcl',{role_id:role_id,images:result,models:result2,b_name1:b_name,color:result4,m_name1:m_name,v_details:result1,id:id});
            });
          });
        });
      });
    });
  });
  });

});
// router.post('/home',function(req,res){
//   console.log(req.params);
// });
router.get('/select_role',function(req,res){
  connection.query("SELECT * FROM role",function(err,result){
    if(err) throw err;
    res.render('role_type',{result:result});
  });
});
passport.serializeUser(function(user_id, done) {
  done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {
  done(null, user_id);
});

function authenticationMiddleware () {
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

	    if (req.isAuthenticated()) return next();
	    res.redirect('/login')
	}
}
module.exports = router;
