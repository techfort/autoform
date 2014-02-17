var express = require('express'),
  config = require('./config'),
  jade = require('jade'),
  ejs = require('ejs'),
  path = require('path'),
  autoform = require('./autoform'),
  app = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.json());
app.use(express.urlencoded());
app.use(express.cookieParser());
app.use(express.methodOverride());
app.use(express.session({
  secret: 'autoform'
}));

var formDescriptor = {
  username: { id: 'username', element: 'input', type: 'text', value: '@@data.username' }
};

app.get('/jade', function (req, res) {
  app.set('view engine', 'jade');
  var af = new autoform('views/index.jade', formDescriptor, 'jade'),
    view = af.process();
  res.send(view({ test: 'TEST!', title: 'Hello autoform', data: { username: 'joe' } }));
});

app.get('/ejs', function (req, res) {
  
  app.set('view engine', 'ejs');
  var af = new autoform('views/index.ejs', formDescriptor, 'ejs'),
    view = af.process();
  res.send(view({ test: 'TEST!', title: 'Hello autoform', data: { username: 'joe' } }));
});

app.listen(config.PORT);