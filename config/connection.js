var mysql = require('mysql');

var setting = {
  host:"localhost",
  user:"root",
  password:"",
  database:"desSrilanka"
}

var db;

// function createdatabase(){
//   if(!db){
//     db = mysql.createConnection(setting);
//     db.connect(function(err){
//       if(!err){
//         console.log('databse connected g');
//       }else {
//         console.log('databse is not coonnectd');
//       }
//     });
//   }
//
//   return db;
// }

function handleDisconnect() {
  db = mysql.createConnection(setting); // Recreate the connection, since
                                                  // the old one cannot be reused.

  db.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  db.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
  return db;
}

module.exports = handleDisconnect();

//module.exports = createdatabase();
