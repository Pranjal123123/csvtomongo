const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const resourceSchema = new mongoose.Schema({
    Name:{
        type: String
    },
    Email:{
        type: String
    },
    MobileNumber:{
        type: Number
    },
    DateOfBirth:{
        type: String
    },
    WorkExperience:{
        type: String
    },
    ResumeTitle:{
        type: String
    },
    CurrentLocation:{
        type: String
    },
    PostalAddress:{
        type: String
    },
    CurrentEmployer:{
        type: String
    },
    CurrentDesignation:{
        type: String
    }
  });
  module.exports = mongoose.model("ExclResource", resourceSchema);
  