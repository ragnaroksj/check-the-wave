var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');
var bodyParser = require('body-parser');
var DB = require('./db').DB;
var assert = require('assert');

app.set('view engine', 'ejs');
app.use(express.static(__dirname));
app.use(bodyParser());

var docName = 'register';

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    urlNorth = 'https://www.blm.gov/az/paria/hikingcalendar.cfm?areaid=2',
    urlSouth = 'https://www.blm.gov/az/paria/hikingcalendar.cfm?areaid=1',
    dayText = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

var smtpTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    xoauth2: xoauth2.createXOAuth2Generator({
      user: 'ragnarokmj@gmail.com',
      clientId: '459460394137-ad80c4ujol0g2r5h2aeolt9eppjjv5cm.apps.googleusercontent.com',
      clientSecret: 'voNnEoW0YD_vhcDyZh8ChyLd',
      refreshToken: '1/2F7JITXerJOCiFn0oCXVj3sZrJAPkWmZF35cPYbY8HZZpInBvmWl_kXrpZCkAz1Q',
      accessToken: 'ya29.GlvgA--MOTQJAfr6QMEY7EPhlWPMIqNd8XyEPDCIuNvz4bxDORAtYmzqzuNLKRWViOzgx8FYDoHZZlWKHWBwaA0iP6KlrkLMQk-AtjRcYh_6CTV3hsJud7DPi2Mr',
    })
  }
});

app.get('/north', function(req, res) {
  var collection = [];
  var emailCollection = [];
  var mailOptions = {
    from: 'ragnaroksj@gmail.com',
    subject: 'Reminder North',
    text: 'New positions are avaiable!'
  };

  request(urlNorth, function(error, response, html) {
    if(!error){
      var $ = cheerio.load(html);
      var calendaravailable = $('#content .calendaravailable');
      var htmlTemplate = '<ul>';

      calendaravailable.each(function(index, element) {
        var item = {date : "",day: "", number : "", requestLink: "", isWeekends:""};
        item.requestLink = $(this).find('a').attr('href');
        item.number = $(this).find('.calendar a').text();
        item.date = item.requestLink.split("RequestedDate=")[1];
        var d = new Date(item.date);
        item.day = dayText[d.getDay()];
        item.isWeekends = (d.getDay() === 0 || d.getDay() === 6) ? 'weekends' : 'weekdays';
        htmlTemplate += '<li>'+ item.date + '    ' + item.day + '    ' + item.number + '    ' +'<a href="'+ item.requestLink + '">Book</a>' + '</li>';
        collection.push(item);
      });
      htmlTemplate += '</ul>';

      res.render('index',{ collection: collection, updateDate: new Date()});

      DB(docName, function(db, collection) {
        collection.find({}).toArray(function(err, docs) {
          assert.equal(err, null);
          docs.map(function(item, index){
            emailCollection.push(item.email);
          });

          mailOptions.to = emailCollection;

          if( calendaravailable.length > 0 ) {
            mailOptions.html = htmlTemplate;
            smtpTransporter.sendMail(mailOptions, function(error, response){
              if(error) {
                console.log(error);
              } else {
                console.log('message sent', response);
              }

              smtpTransporter.close();
            });
          }

        });
      });
    }
  })
})

app.get('/south', function(req, res) {
  var collection = [];
  var emailCollection = [];
  var mailOptions = {
    from: 'ragnaroksj@gmail.com',
    subject: 'Reminder South',
    text: 'New positions are avaiable!'
  };

  request(urlSouth, function(error, response, html) {
    if(!error){
      var $ = cheerio.load(html);
      var calendaravailable = $('#content .calendaravailable');
      var htmlTemplate = '<ul>';

      calendaravailable.each(function(index, element) {
        var item = {date : "",day: "", number : "", requestLink: "", isWeekends:""};
        item.requestLink = $(this).find('a').attr('href');
        item.number = $(this).find('.calendar a').text();
        item.date = item.requestLink.split("RequestedDate=")[1];
        var d = new Date(item.date);
        item.day = dayText[d.getDay()];
        item.isWeekends = (d.getDay() === 0 || d.getDay() === 6) ? 'weekends' : 'weekdays';
        htmlTemplate += '<li>'+ item.date + '    ' + item.day + '    ' + item.number + '    ' +'<a href="'+ item.requestLink + '">Book</a>' + '</li>';
        collection.push(item);
      });
      htmlTemplate += '</ul>';

      res.render('index',{ collection: collection, updateDate: new Date()});

      DB(docName, function(db, collection) {
        collection.find({}).toArray(function(err, docs) {
          assert.equal(err, null);
          docs.map(function(item, index){
            emailCollection.push(item.email);
          });

          mailOptions.to = emailCollection;

          if( calendaravailable.length > 0 ) {
            mailOptions.html = htmlTemplate;
            smtpTransporter.sendMail(mailOptions, function(error, response){
              if(error) {
                console.log(error);
              } else {
                console.log('message sent', response);
              }

              smtpTransporter.close();
            });
          }

        });
      });
    }
  })
})

app.post('/register-ragnaroksj-wavechecker', function(req, res) {
  DB(docName, function(db, collection) {
    collection.insertOne({email: req.body.email}, function(err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        assert.equal(1, result.ops.length);
        db.close();
        res.send('ok');
    }); 
  });
});

app.get('/register-ragnaroksj-page', function(req, res) {
  var emailListItem = [];
  DB(docName, function(db, collection) {
    collection.find({}).toArray(function(err, docs) {
      assert.equal(err, null);
      docs.map(function(item){
        emailListItem.push(item.email);
      });

      res.render('register', {emailListItem: emailListItem});
      db.close();
    });
  });
});

app.post('/delete-ragnaroksj-wavechecker', function(req, res) {
  DB(docName, function(db, collection) {
    collection.deleteOne({email: req.body.email}, function(err, docs) {
      assert.equal(err, null);
      db.close();
    });
  })
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);
exports = module.exports = app;
