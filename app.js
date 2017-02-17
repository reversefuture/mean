var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var index = require('./routes/index');
var users = require('./routes/users');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 连接字符串格式为mongodb://主机/数据库名
mongoose.connect('mongodb://localhost/contactList');
//骨架模版
var contactListSchema = new Schema({
    name:  String,
    email: String,
    number: Number
});
//Mongoose pluralizes the lower-cased model name when determining the collection name to use. So with a model name of 'Co' it's going to be looking in the cos collection by default.
var ContactList = mongoose.model('ContactList', contactListSchema,'contactList');
//存储数据
/*
var cList = new ContactList({
    name:  'Pony',
    email: 'pony@asdf.com',
    number: 014
})
console.log(cList.name);
cList.save(function(err) {
    if (err) {
        console.log('保存失败');
        return;
    }
    console.log('saved a document/record');
});
*/

var app = express();

// view engine setup
app.engine("html", swig.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

app.get('/contactList',function (req, res) {
    ContactList.find(function (err, contactList) {
        res.json(contactList);
        console.log(contactList);
    })
    console.log('server received request!');
});
//update data
app.get('/contactList/:id', function (req, res) {
    var id = req.params.id;
    console.log(id + ' edit');
    ContactList.findOne({_id:id}, function (err, cList) {
        if (err) {
            console.log('edit failed');
            return;
        }
        res.send(cList);
        // res.json(cList);
    });
});

app.put('/contactList/:id', function (req, res) {
    var id = req.params.id;
    console.log(id+ 'update') ;
    ContactList.findOneAndUpdate({_id: id}, { $set: { "name": req.body.name, 'email': req.body.email, 'number': req.body.number}}, { new: true }, function (err, cList) {
        if (err) {
            console.log('update failed');
            return;
        }
        res.json(cList);
    });
})

app.post('/contactList',function (req, res) {
    console.log(req.body);
    var cList = new ContactList(req.body);
    cList.save(function(err) {
        if (err) {
            console.log('保存失败');
            return;
        }
        res.json(cList);
        console.log('saved a document/record');
    });
});

app.delete('/contactList/:id',function (req, res) {
    var id = req.params.id;
    console.log(id);

   /* ContactList.remove({ _id: id}, function(err) {
        if (err) {
            // message.type = 'error';
            console.log('删除失败');
        }else {
            // message.type = 'notification!';
            console.log('删除成功');
        }
    });*/
    ContactList.findByIdAndRemove(id, function (err, response) {
        if (err) {
            // message.type = 'error';
            console.log('删除失败');
            res.send(删除失败);
        }
        console.log('删除成功');
        res.write('response');
    });

    ContactList.findOneAndRemove({ _id: id}, function(err) {
        if (err) {
            // message.type = 'error';
            console.log('删除失败');
            res.send('删除失败')
        }else {
            // message.type = 'notification!';
            console.log('删除成功');
            res.write('删除成功')
        }
    });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
