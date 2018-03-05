var  bcrypt = require('bcrypt');
/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


module.exports = {
	'new':function(req,res){
	  "use strict";
    res.locals.flash = {};
    res.locals.flash = _.clone(req.session.flash);
    req.session.flash ={};
	  res.view();

  },
  create:function(req,res,next){
	  if(!req.param('email')||!req.param('password')){
	    req.session.flash = {
	      err:[{
	        name:'Незаполненные поля', message:"Введите логин и пароль"
        }]
      };
	    res.redirect('/sessions/new'); return;
    };
	  User.findOne({email:req.param('email')}).exec(function (err, user){
      if (err) {
        req.session.flash = {
          err:[{
            name:'Undefined', message:"Неизвестная ошибка"
          }]
        }; res.redirect('/sessions/new'); return;
      };

      if (!user) {

        req.session.flash = {
          err:[{
            name:'Email', message:"Email"+req.param('email')+" - не найден"
          }]
        }; res.redirect('/sessions/new'); return;
      };

      bcrypt.compare(req.param('password'),user.encryptedPassword, function(err,valid){
        "use strict";
        if(!valid){
          req.session.flash = {
            err:[{
              name:'Validation', message:"Неправильный пароль"
            }]
          }; res.redirect('/sessions/new'); return;
        }
        if(err){
          req.session.flash = {
            err:[{
              name:'Undefined', message:"Неизвестная ошибка"
            }]
          }; res.redirect('/sessions/new'); return;
        }
        req.session.authenticated = true;
        var oldDate = new Date();
        var newDate = new Date(oldDate.getTime()+60000*60);
        req.session.cookie.expires = newDate;
        req.session.User = user;
        res.redirect('/user/show/'+user.id);
      })
    });

  },
  destroy:function(req,res,next){
    "use strict";
    req.session.destroy();
    res.redirect('/sessions/new')
  }
};

