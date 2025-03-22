const dbConfig=require('../Config/db.config')

const mongoose = require("mongoose");
mongoose.Promise=global.promise


const db={}
db.mongoose=mongoose
db.url = dbConfig.url;



db.users=require('../Model/CreateUser');
db.Leads=require('../Model/Lead');
db.Notes=require('../Model/notes');








module.exports = db;