var getBooks = require('./BooksController').showAll;
var getRegisterBooks = require('./RegistryController').showRegisterBooks;
var getAllRegister = require('./RegistryController').getAllRegister;
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
    /*Устанавливаем крайнюю дату возврата книг*/
    this.setMonthLaterIso(res);/*данные добавляются в res.locals.monthLaterIso*/
    /*после выполнения двух промисов выполняем основную функцию*/

    if(+req.param('id')!==+req.session.User.id){
      res.locals.owner = false;
    }else{res.locals.owner = true}


    Promise.all([getBooks(),getRegisterBooks({user:req.param('id')}), getAllRegister(), this.showAll()]).then(function(result){

      res.locals.books = result[0];

      let registerBooks = [];

      result[1].forEach(function(itemRegister){
        result[0].find(function(itemBook){
          if(itemBook.id===itemRegister.book){
            itemBook.take_date = itemRegister.take_date;
            itemBook.return_date = itemRegister.return_date;
            itemBook.registerId = itemRegister.id;
            registerBooks.push(itemBook);
          }
        });
      });

      let allRegister = [];
        result[2].forEach(function(register){
          result[3].find(function(user){
            if(register.user===user.id)
            {
              register.name = user.name;
              register.email = user.email;
              register.firstname = user.firstname;
              register.lastname = user.lastname;
              register.status = user.status;

              result[0].find(function(book){
                if(register.book===book.id){

                  register.title = book.title;
                  register.author = book.author;
                  register.year = book.year;
                  register.editor = book.editor;
                  register.inLibrary = book.inLibrary;

                  allRegister.push(register);
                }
              });
            }
          })
        });

      res.locals.registerBooks = registerBooks;
      res.locals.allRegister = allRegister;
      res.locals.allUsers = result[3];

      return result;

    },function(reject){
      res.locals.registerBooks = [];
      res.locals.books = [];
      return reject
    }).then(function(resolve){

      User.findOne(req.param('id'), function foundUser(err,user){
        if (err) {return next(err)}
        if (!user) {return next()}
        res.locals.user = user;
        user.status==='admin'?res.locals.admin=true:res.locals.admin=false;
        res.locals.flash = _.clone(req.session.flash);
        req.session.flash = {};
        return res.view();
      });
    });
  },
  showAll:function(){
    "use strict";
    return new Promise(function(resolve,reject){

      User.find(function(err,users){
        if(err) {
          return reject(err);
        }
        return resolve(users);
      })
    });

  },
  update:function(req,res){
    "use strict";
    console.log(req.params.all());

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
  },
  setMonthLaterIso:function(res){
    "use strict";
    var date = new Date();
    date.setDate(date.getDate() + 30);
    var m = date.getMonth()+1;
    var d = date.getDate();
    var day= d<10?'0'+d:d;
    var month= m<10?'0'+m:m;
    var year = date.getFullYear();

    var monthLaterIso = year+'-'+month+'-'+day;
    return res.locals.monthLaterIso = monthLaterIso;
  }
};

//module.exports.update({id:1, firstname:'Влад', lastname:'Пасика'});
