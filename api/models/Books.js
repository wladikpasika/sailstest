/**
 * Books.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    title:{
      type: "string",
      required:true,
      unique:true
    },
    author:{
      type: "string",
      required:true
    },
    year:{
      type: 'integer'
    },
    status:{
      type: "string"
    },
    editor:{
      type: "string"
    },
    publishing_house:{
      type: "string"
    },
    book_existing_yet:{
      type: 'boolean'
    }
  }
};

