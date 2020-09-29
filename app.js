var express = require('express') 
var app = express() 
var bodyParser = require('body-parser'); 
var mongoose = require('mongoose');
app.use(express.static("public")); 

var fs = require('fs'); 
var path = require('path'); 
require('dotenv/config'); 

// Connecting to the database 
mongoose.connect("mongodb+srv://Avinash2609:urlencoded@cluster0.qa8fk.mongodb.net/Mergingfiles?retryWrites=true&w=majority", 
	{ useNewUrlParser: true, useUnifiedTopology: true }, err => { 
		console.log('database connected') 
    }); 
    
    app.use(bodyParser.urlencoded({ extended: false })) 
    app.use(bodyParser.json()) 
    
    // Set EJS as templating engine 
    app.set("view engine", "ejs"); 

    var fs = require('fs'); 
    var path = require('path'); 
    var multer = require('multer'); 
    
    var storage = multer.diskStorage({ 
        destination: (req, file, cb) => { 
            cb(null, 'uploads') ;
        }, 
        filename: (req, file, cb) => { 
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)) ;
        } 
    }); 
    
    var upload = multer({ storage: storage }); 
       
    var imgModel = require('./model'); 

    app.post('/result', upload.array('myfiles',10), (req, res, next) => { 
        const files=req.files;
        var list=[];
        files.forEach(function(file){
            list.push(file.path);
        })
        const spawn=require('child_process').spawn;
        if(req.body.b1){
            var mylist=[];
            mylist.push('./merge.py');
            mylist=mylist.concat(list);
            const process = spawn ('python',mylist);
            process.stdout.on('data',data=>{
            res.send(data)
        });
        }
        else if(req.body.b2){
            var mylist=[];
            mylist.push('./merge2.py');
            mylist=mylist.concat(list);
            const process = spawn ('python',mylist);
            // const process = spawn ('python',['./merge2.py',req.files.file1,req.files.file2,req.files.file3,req.files.file4,req.files.file5,req.files.file6,req.files.file7,req.files.file8,req.files.file9,req.files.file10]);    
            process.stdout.on('data',data=>{
            res.send(data)
        });
        }
    });

app.get("/",function(req,res){
    res.render("index");
})


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}



//////////////////////////////
app.listen(port,function(){
    console.log("server has been started");
})