var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT||8051;
var sub = express.Router({mergeParams: true});
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/sample',function(req,res){
	res.send('this is just a sample');
});

app.set('view engine', 'ejs');
app.listen(port);
console.log('Application running on port:'+port);

app.post('/login',function(req,res){
  var user_name=req.body.user;
  var password=req.body.password;
  console.log("User name = "+user_name+", password is "+password);
  res.end("yes");
});

var router = express.Router();
var defaultRoute = function (req, res) {
    res.render('index');
};
var params = function(req,res){
	res.render('home',{name:req.params.username});
}

var subRouter = function(req,res){
    res.render('subroute',{data:{name:req.params.username,city:req.params.city}});
}
router.get('/',function(req,res){
	res.render('index');
});

router.get('/about',function(req,res){
	res.send('this is about page');
});

router.use(function(req, res, next) {

    // log each request to the console
    console.log(req.method, req.url);

    // continue doing what we were doing and go to the route
    next(); 
});

router.get('/hello/:name',function(req,res){
	res.send('hello'+req.params.name);
});

router.get('/user/:username',params);

router.use('/user/:username',sub);
sub.get('/city/:city',subRouter);
// route middleware to validate :name
router.param('name', function(req, res, next, name) {
    // do validation on name here
    // blah blah validation
    // log something so we know its working
    console.log('doing name validations on ' + name);

    // once validation is done save the new item in the req
    req.name = name;
    // go to the next thing
    next(); 
});

router.use('/hello/:name',sub);

sub.get('/from/:city',function(req,res){
	res.send('hello '+req.params.name+'.nice to meet you.are you from'+req.params.city);
})
app.use('/',router);