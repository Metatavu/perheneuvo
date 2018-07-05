var Flag = require('../model/flag');

exports.listAllOrderByCreated = function(callback) {
  Flag.find({}).sort({created: 1}).exec(function(err, flags) {
    if (err)
      throw err;

    callback(flags);
  });
};

exports.create = function(target_name, target_address, target_phone, target_told, problem_category, source_anonym, source_name, source_address, source_phone, source_email, source_relation, desc, contact_source, callback) {
  var flag = new Flag();
  flag.target_name = target_name;
  flag.target_address = target_address;
  flag.target_phone = target_phone;
  flag.target_told = target_told;
  flag.problem_category = problem_category;
  flag.source_anonym = source_anonym;
  flag.source_name = source_name;
  flag.source_address = source_address;
  flag.source_phone = source_phone;
  flag.source_email = source_email;
  flag.source_relation = source_relation;
  flag.desc = desc;
  flag.contact_source = contact_source;
  flag.created = new Date().getTime();
  flag.save(function(err, flag) {
    if (err)
      throw err;

    callback(flag);
  });
};

exports.setProcessed = function(id, userid, callback) {
  Flag.findOne({
    _id : id
  }, function(err, flag) {
    if (err)
      throw err;

    flag.state = 'processed';
    flag.processed = new Date().getTime();
    flag.processedBy = userid;
    flag.save(function(err, flag) {
      if (err)
        throw err;

      callback(flag);
    });
  });
};

exports.addComment = function(id, user, commentText, callback) {
  Flag.findOne({
    _id : id
  }, function(err, flag) {
    if (err)
      throw err;

    const comments = flag.comments || [];
    comments.push({
      body: commentText,
      author: user,
      date: new Date()
    });
    
    flag.comments = comments;
    flag.save(function(err, flag) {
      if (err)
        throw err;

      callback(flag);
    });
  });  
};

exports.setProcessing = function(id, callback) {
  Flag.findOne({
    _id : id
  }, function(err, flag) {
    if (err)
      throw err;

    flag.state = 'kasittelyssa';
    //flag.processedBy = userid; //TODO: save person who is processing
    flag.save(function(err, flag) {
      if (err)
        throw err;

      callback(flag);
    });
  });
};

exports.listByState = function(state, callback) {
  Flag.find({
    state : state
  }, function(err, flags) {
    if (err)
      throw err;

    callback(flags);
  });
};

exports.listByCreatedRange = function(start, end, callback) {
  Flag.find({
    created : {
      $lt : end,
      $gt : start
    }
  }, function(err, flags) {
    if(err)
      throw err;
    
    callback(flags);
  });
};

