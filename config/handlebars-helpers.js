// var hbs = require("express-handlebars");
module.exports = {
    // Specify helpers which are only registered on this instance.

        inc: function(value,options) { return parseInt(value)+1 },
        ifCond: function(v1,v3,options) {
          if(v1 >= v3){
            return options.fn(this);
          }else{
            return options.inverse(this);
          }
        },
        times:function( n, block ) {
            var accum = '',
                i = -1;

            while( ++i < n ) {
                accum += block.fn( i );
            }

            return accum;
        },
        ifCondition: function(url,options){
          if(url === '/vendor/register_vendor'){
            return options.fn(this);
          }else{
            return options.inverse(this);
          }
        },
        ifEquals: function(arg1, arg2, options) {
          return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
       }


};
