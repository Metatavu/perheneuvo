var flagDAO = require('../../DAO/flagDAO');
var userDAO = require('../../DAO/userDAO');
var mailer = require('../../services/mailer/mailer');

function notEmpty(values){
    for(var i = 0, j = values.length;i < j;i++){
      if(typeof(values[i]) === 'undefined' || values[i] === ''){
        throw "Value missing!";
      }
    }
}

exports.create = function(req, res){
  var target_name = typeof(req.body.target_name) === 'undefined' ? '' : req.body.target_name;
  var target_address = typeof(req.body.target_address) === 'undefined' ? '' : req.body.target_address;
  var target_phone = typeof(req.body.target_phone) === 'undefined' ? '' : req.body.target_phone;
  var desc = typeof(req.body.target_info) === 'undefined' ? '' : req.body.target_info;
  var target_told = typeof(req.body.target_told) === 'undefined' ? false : req.body.target_told;
  var source_anonym = typeof(req.body.source_anonym) === 'undefined' ? false : req.body.source_anonym;
  var source_email = typeof(req.body.source_email) === 'undefined' ? '' : req.body.source_email;
  var problem_category = typeof(req.body.problem_category) === 'undefined' ? '' : req.body.problem_category;
  var contact_source = typeof(req.body.contact_source) === 'undefined' ? 'lomake' : req.body.contact_source;
  try{
    notEmpty([req.body.source_name, req.body.source_address, req.body.source_phone, req.body.source_relation]);
    var source_name = req.body.source_name;
    var source_address = req.body.source_address;
    var source_phone = req.body.source_phone;
    var source_relation = req.body.source_relation;
    flagDAO.create(target_name, target_address, target_phone, target_told, problem_category, source_anonym, source_name, source_address, source_phone, source_email, source_relation, desc, contact_source, function(flag){
      userDAO.list(function(users){
        for(var i = 0, j = users.length;i < j;i++){
                mailer.sendMail(users[i].email, 'Uusi avun pyyntö', 'Perheneuvo järjestelmään on tullut uusi avun pyyntö, käy katsomassa tarkemmat tiedot: https://essote.perheneuvo.fi/login');
        }
      });
      res.send(flag);
    });
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.listByState = function(req, res){
  var state = req.param('state');
  flagDAO.listByState(state, function(flags){
    res.send(flags);
  });
};

exports.process = function(req, res){
  var id = req.body.flag_id;
  var comment = req.body.comment;
  var userId = req.user._id

  userDAO.findById(userId, function(user){
    switch (req.body.operation) {
      case 'set_to_processing':
        flagDAO.setProcessing(id, function(flag){
          res.send(flag);
        });
      break;
      case 'set_to_processed':
        flagDAO.setProcessed(id, user.email, function(flag){
          if (comment) {
            flagDAO.addComment(id, user.email, comment, function(flag){
              res.send(flag);
            });
          } else {
            res.send(flag);
          }
        });
      break;
      case 'add_comment':
        flagDAO.addComment(id, user.email, comment, function(flag){
          res.send(flag);
        });
      break;
      default:
        console.error("Unknown operation " + req.body.operation);
      break;
    }
  });
};

exports.list = function(req, res){
  flagDAO.listAllOrderByCreated(function(flags){
    res.send(flags);
  });
};

exports.listByCreatedRange = function(req, res){
  var start = parseInt(req.param('start'), 10);
  var end = parseInt(req.param('end'), 10);
  flagDAO.listByCreatedRange(start, end, function(flags){
    res.send(flags);
  });
};
