var Sequelize = require('sequelize');
var pg = require('pg').native;
var config = require('../db_config');

var sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  port: config.port,
  logging: config.logging,
  pool: { maxConnections: 10, maxIdleTime: 30},
  dialect: config.dialect,
  native: config.native
});

var Video = sequelize.define('video', {
  video_id: {type: Sequelize.STRING, unique: true, primaryKey: true},
  user_id: Sequelize.STRING,
  url: Sequelize.STRING,
  duration: Sequelize.INTEGER
});

Video.sync();

var sendResponse = function(res, query){
  Video.findAll(query).success(function(video){
    res.send(video);
  });
};

var newVideo = function(json, res){
  Video.findOrCreate(json).success(function() {
    sendResponse(res, {where: {video_id: json.video_id}});
  });
};

var createVideo = function(req, res){
  if(req.user){
    var videoCreate = {
      user_id: req.user.username,
      video_id: req.body.video_id,
      url: req.body.url,
      duration: req.body.duration
    };
    newVideo(videoCreate, res);
  } else {
    console.log("Not logged in");
  }
};

var getVideo = function(req, res){
  var query = {where: {'video_id': req.params.vidID}};
  sendResponse(res, query);
};

module.exports.createVideo = createVideo;
module.exports.getVideo = getVideo;