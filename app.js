var express = require('express');
var app = express();
var multer = require('multer');
//var mongoose = require('mongoose');
//var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
//var Schema = mongoose.Schema;
var multipart = require('connect-multiparty')
var multipartMiddleware = multipart();
var fs = require('fs');

var db;

var cloudant;

var fileToUpload;

var dbCredentials = {
    dbName: 'my_sample_db'
};

const path = require('path');

//mongoose.connect('mongodb://localhost:27017/fileuploadmulter1');

app.use(express.static(__dirname + '/public'));
//app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended' : 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

function getDBCredentialsUrl(jsonData) {
    var vcapServices = JSON.parse(jsonData);
    // Pattern match to find the first instance of a Cloudant service in
    // VCAP_SERVICES. If you know your service key, you can access the
    // service credentials directly by using the vcapServices object.
    for (var vcapService in vcapServices) {
        if (vcapService.match(/cloudant/i)) {
            return vcapServices[vcapService][0].credentials.url;
        }
    }
}

function initDBConnection() {
    //When running on Bluemix, this variable will be set to a json object
    //containing all the service credentials of all the bound services
    if (process.env.VCAP_SERVICES) {
        dbCredentials.url = getDBCredentialsUrl(process.env.VCAP_SERVICES);
    } else { //When running locally, the VCAP_SERVICES will not be set

        // When running this app locally you can get your Cloudant credentials
        // from Bluemix (VCAP_SERVICES in "cf env" output or the Environment
        // Variables section for an app in the Bluemix console dashboard).
        // Once you have the credentials, paste them into a file called vcap-local.json.
        // Alternately you could point to a local database here instead of a
        // Bluemix service.
        // url will be in this format: https://username:password@xxxxxxxxx-bluemix.cloudant.com
        dbCredentials.url = getDBCredentialsUrl(fs.readFileSync("vcap-local.json", "utf-8"));
    }
	
	cloudant = require('cloudant')(dbCredentials.url);

    // check if DB exists if not create
    cloudant.db.create(dbCredentials.dbName, function(err, res) {
        if (err) {
            console.log('Could not create new db: ' + dbCredentials.dbName + ', it might already exist.');
        }
    });

    db = cloudant.use(dbCredentials.dbName);
}

initDBConnection();

var storage = multer.diskStorage({
	destination: function (req, file, cb){
		cb(null, 'uploads/')
	},
	filename: function(req, file, cb){
		cb(null, file.originalname)
    }
});

var upload = multer({ storage : storage }).single('file');

//var File = mongoose.model ('File', {
//filename : String,
// path : String
//});

app.get('/api/files', function(req, res){

    db.list({include_docs:true}, function(err, data) {
	
	    //if(err)
		//  res.send(err);
		  
		//  res.json(files);
		  console.log(data.value);
	});
});

app.post('/api/files', function(req, res){
   
   upload(req, res, function(err){
		if(err){
			res.send(err);
		}
		
	db.insert({
	      
		  filename : req.file.originalname,
          path : "/upload/"
	      //done : false
	    }, function(err, files){
		  if(err) 
			res.send(err);
    
	    //    File.find(function(err, files) {
		//      if(err)
		//         res.send(err);
			 
		//         res.json(files);
	    //    });
	    });
		
	})
   
});

app.get('/', function(req, res) {
        res.sendFile(__dirname +'/index.html');
});

app.listen(8002);
console.log("App listening on port 8002");