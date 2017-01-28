var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');


app.set('view engine', 'ejs');
app.use(express.static(__dirname));


var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    url = 'https://www.blm.gov/az/paria/hikingcalendar.cfm?areaid=1',
    collection = [],
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

app.get('/scrape', function(req, res){
  request(url, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);
      var calendaravailable = $('#content .calendaravailable');
      var htmlTemplate = '<ul>';

      var mailOptions = {
        from: 'ragnaroksj@gmail.com',
        to: 'ragnaroksj@gmail.com',
        subject: 'test',
        text: 'New position are avaiable!'
      };

      calendaravailable.each(function(index, element){
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
    }
  })
})

/*app.get('/book', function(req, res){
  request.post({url: 'https://www.blm.gov/az/paria/backcountryapp.cfm?AreaID=1&RequestedDate=2/9/2017', form: {watchvideo: "1", "AROLPSpa": "I Agree"}},function(err, httpResponse, body){
    res.render('book', function(err, html){
      res.send(httpResponse.body);
    });
  });
})*/

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);
exports = module.exports = app;
