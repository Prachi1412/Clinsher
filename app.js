var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var md5 = require('md5');
var port = process.env.port || 3005;
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
var user_panel = require('./routes/user');
app.use(express.static(path.join(__dirname, "views")));
var storage = multer.diskStorage({
	destination : function(req,file,callback){
         callback(null,'./uploads/user');
	},
	filename : function(req,file,callback){
		  var fileUniqueName = md5(Date.now());
          callback(null,fileUniqueName+ path.extname(file.originalname));
	}
});
var upload = multer({storage:storage});
//API
app.post('/user/login', user_panel.login);
app.post('/user/signup', user_panel.signup);
app.post('/user/update', upload.any(), user_panel.update);
app.post('/user/delete', user_panel.delete);
app.post('/user/reset_password',user_panel.reset_password);
app.post('/user/take_me_in', user_panel.take_me_in);
app.listen(port, function() {
    console.log("Server is running on localhost on port" + port);
});