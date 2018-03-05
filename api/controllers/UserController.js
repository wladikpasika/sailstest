var setBook = require('./BooksController').create;
/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	registration: function(req,res){
	  "use strict";
    res.locals.flash={};
    res.locals.flash = _.clone(req.session.flash);
    req.session.flash = {};
	  res.view();
  },
  create:function(req,res,next){
	  "use strict";

	  User.create(req.params.all(),function UserCreated(err,user){
	    if (err) {
	      req.session.flash = {
	        err:err
        };
        return res.redirect('/user/registration')
	    }
	    res.redirect('/sessions/new');
      req.session.flash = {};

    });
  },
  show:function(req,res,next){
    "use strict";

    User.findOne(req.param('id'), function foundUser(err,user){
      if (err) return next(err);
      if (!user) return next();
      res.locals.user = user;
      res.locals.flash = {};
      res.locals.flash = _.clone(req.session.flash);
      req.session.flash = {};

      res.view();
    });
  },
  update:function(req,res,next){
    "use strict";

    if(req.params.all().firstname.length<3&&req.params.all().lastname.length<3){

        req.session.flash = {
          err:{
            name:'Updating', message:"Вы не задали Имя и Фамилию, или они слишком короткие"
          }
        };
        return res.redirect('/user/show/'+req.session.User.id)

    }

    User.update(req.param('id'),req.params.all()).exec(function afterwards(err, updated){

      if (err) {
        req.session.flash = {
        err:[{
          name:'Updating', message:"Неизвестная ошибка"
        }]
      };
        return res.redirect('/user/show/'+updated[0].id)
      }


      req.session.flash = {
        success:{
          name:'Updating', message:"Имя и фамилия успешно добавлены/обновлены"
        }
      };

      req.session.User = updated[0];
      return res.redirect('/user/show/'+updated[0].id)

    });
  }
};

//module.exports.update({id:1, firstname:'Влад', lastname:'Пасика'});
