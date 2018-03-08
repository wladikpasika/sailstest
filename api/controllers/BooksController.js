/**
 * BooksController
 *
 * @description :: Server-side logic for managing books
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  create:function(req,res){
    "use strict";

    Books.create(req.params.all(),function BooksCreated(err,book){
      if (err||!book) {
        req.session.flash = {
          err:{message: "Ошибка валидации, возможно, Вы ввели в поле  \"год\" текст, или книга с таким названием уже существует"}
        };
        return res.redirect("/user/show/"+req.session.User.id);
      }
      return res.redirect("/books/show/"+book.id);
    });
  },
  show:function(req,res, next){
    "use strict";
    Books.findOne(req.param('id')).exec(function (err, book) {

      if (err) return next(err);
      if (!book) return next();
      res.locals.book = book;

      res.view();

    });
  },

  destroy:function(req,res, next){
    "use strict";
    Books.findOne(req.param('id')).exec(function(err, book){

      if (err||!book){

        req.session.flash ={

          err:{message: "Книги не существует или другая ошибка"}
        };
        return res.redirect('/user/show/'+req.session.User.id);
      }

      return Books.destroy(req.param('id')).exec(function (err){
        if (err) {
          req.session.flash = {
            err:err
          };
          return res.redirect('/user/show/'+req.session.User.id)
        }
        req.session.flash ={

          success:{message: "Книга успешно удалена"}
        };
        return res.redirect('/user/show/'+req.session.User.id);
      });
    });

    },
  updateStatus:function(req,res){
    "use strict";
    var id = req.param('id');
    var attribute = req.query.inLibrary;


    return Books.update({id:id},{inLibrary:attribute}).exec(function(err, attribute){

      if (err||!attribute) {
        req.session.flash = {
          err:err
        };
      }
      return res.redirect('/user/show/'+req.session.User.id);
    });

  },
  showAll:function(){
    "use strict";
    return new Promise(function(resolve,reject){
      Books.find(function books(err, books){
        if(err) {
          return reject(err);
        }
        return resolve(books);
      })
    });
  }
};

