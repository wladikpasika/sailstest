/**
 * Registry.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
module.exports = {

  attributes: {
    book:{
      type: "integer",
      required:true,
      unique:true
    },
    user:{
      type: "integer",
      required:true,
    },
    take_date:{
      type: "date",
      required:true
    },
    return_date:{
      type: "date",
      required:true
    }
  }
};

