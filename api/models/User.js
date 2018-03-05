var  bcrypt = require('bcrypt');
/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name:{
      type: "string",
      required:true,
      unique:true
    },
    email:{
      type: "string",
      email:true,
      required:true,
      unique:true
    },
    firstname:{
      type: "string"
    },
    lastname:{
      type: "string"
    },
    encryptedPassword:{
      type: "string"
    },
    status:{
      type: "string"
    }
  },
  beforeCreate: function(val, next){
    if(!val.password&&vall.password!==val.confirmPassword){
      return next({err:['Пароли в полях не совпадают']});
    }
    bcrypt.hash(val.password,10, function passwordEncrypted(err, encryptedPassword){
      "use strict";
      if(err){return next(err)};
      console.log(encryptedPassword, 'пароль');
      val.encryptedPassword = encryptedPassword;
      next();
    })
}
};

