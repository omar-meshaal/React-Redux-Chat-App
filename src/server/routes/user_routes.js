'user strict';

var bodyparser = require('body-parser');
var User = require('../models/User.js');

module.exports = function loadUserRoutes(router) {
  router.use(bodyparser.json());

  router.post('/sign_up', function (req, res) {
    User.findOne({ 'local.username': req.body.username }, function (err, user) {
      if (err) {
        return res.status(500).send(err);
      }

      var newUser = new User();
      newUser.local.username = req.body.username;
      newUser.local.password = newUser.generateHash(req.body.password);
      newUser.save(function (err, user) {
        if (err) {
          return res.status(500).send(err);
        }
        return res.json(newUser);
      });

    });

    res.json(req.body.username);
  });

  router.post('/sign_in', function (req, res) {
    User.findOne({ 'local.username': req.body.username }, function (err, user) {
      if (err) {
        return res.status(500).send('Error in server');
      }
      if (!user) {
        return res.status(400).send('No user found with this name ,please sign up');
      }
      if (!user.validPassword(req.body.password)) {
        return res.status(400).send('Password is incorrect');
      }
      return res.json(req.body.username);
    });

  });

  router.get('/signout', function (req, res) {
    req.logout();
    res.end();
  });

  router.get('/load_auth_into_state', function (req, res) {
    res.json(req.user);
  });

  router.get('/all_usernames', function (req, res) {
    User.find({ 'local.username': { $exists: true } }, { 'local.username': 1, _id: 0 }, function (err, data) {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: 'internal server error' });
      }
      res.json(data);
    });
  })
};
