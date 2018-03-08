/**
 * RegistryController
 *
 * @description :: Server-side logic for managing registries
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	create:function(req,res){
	  "use strict";
    var date = new Date();
    var m = date.getMonth()+1;
    var d = date.getDate();
    var day= d<10?'0'+d:d;
    var month= m<10?'0'+m:m;
    var year = date.getFullYear();

    var isoDate = year+'-'+month+'-'+day;

	  var registryObj = {
	    book:req.param('id'),
	    user:req.session.User.id,
      take_date: isoDate,
      return_date:req.query.date

    };

    Books.findOne(req.param('id')).exec(function(err, book){

      if (err || !book) {

        req.session.flash = {

          err: {message: "Книги не существует или другая ошибка"}
        };
        return res.redirect('/user/show/' + req.session.User.id);
      }

      Registry.create(registryObj).exec(function(err,register){

        if (err||!register) {

          req.session.flash = {
            err:!book.inLibrary?'Ошибка, видимо, что книгу уже кто то взял':err
          };
          return res.redirect('/user/show/'+req.session.User.id)
        }

        req.session.flash = {

          success:{message:"Вы взяли книгу "+book.title}
        };
        return res.redirect('/books/update/'+book.id+'?inLibrary=false');
      });

    });

  },

  destroy:function(req,res){
	  "use strict";

    Registry.findOne({id:req.param('id')}).exec(function(err, book){

      if (err||!book){

        req.session.flash ={

          err:{message: "Книги не существует или другая ошибка возврата книги"}
        };
        return res.redirect('/user/show/'+req.session.User.id);
      }

      return Registry.destroy(req.param('id')).exec(function (err){
        if (err) {
          req.session.flash = {
            err:err
          };
          return res.redirect('/user/show/'+req.session.User.id)
        }

        req.session.flash ={
          success:{message: "Книга успешно возвращена"}
        };
        return res.redirect('/books/update/'+book.book+'?inLibrary=true');
      });
    });
  },

  showRegisterBooks:function(param){
    "use strict";

    return new Promise(function(resolve,reject){
      Registry.find(param, function (err, books){

        if (err) {
          return reject(err);
        }
        return resolve(books);
      })
    });

  },
  getAllRegister:function(){
    "use strict";
    return new Promise(function(resolve,reject){
      Registry.find(function (err, books){

        if (err) {
          return reject(err);
        }
        return resolve(books);
      })
    });
  }

};

