var mongoose = require('mongoose');

var flagSchema = mongoose.Schema({
  target_name : String,
  target_address : String,
  target_phone : String,
  target_told : Boolean,
  problem_category: String,
  source_anonym : Boolean,
  source_name : { type: String, required: true },
  source_address : { type: String, required: true },
  source_phone : { type: String, required: true },
  source_email : String,
  source_relation : { type: String, required: true },
  state: { type: String, default: 'odottaa' },
  contact_source:  { type: String, default: 'lomake' },
  desc: String,
  processedBy: String,
  action: String,
  comments: [{
    body: String,
    author: String,
    date: Date 
  }],
  created: Number,
  processed: Number
});

module.exports = mongoose.model('Flag', flagSchema);