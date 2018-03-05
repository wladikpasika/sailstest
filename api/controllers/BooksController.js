/**
 * BooksController
 *
 * @description :: Server-side logic for managing books
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  create:function(req,res){
    "use strict";

    Books.create(req.params.all(),function UserCreated(err,book){
      if (err) {
        return err;
      }
      res.redirect("/books/show/"+book.id);
    });
  },
  show:function(req,resб, next){
    "use strict";
    Books.findOne(req.param('id')).exec(function (err, book) {

      if (err) return next(err);
      if (!book) return next();
      res.locals.book = book;

      res.view();

    });
  }

};

