var express = require('express') 
var app = express() 
var bodyParser = require('body-parser'); 
var mongoose = require('mongoose');
var mongodb=require('mongodb');
app.use(express.static("public")); 


app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json()) 

// Set EJS as templating engine 
app.set("view engine", "ejs"); 

var fs = require('fs'); 
var path = require('path'); 
var multer = require('multer'); 
const options = require('dotenv/lib/env-options');
require('dotenv/config'); 

// Connecting to the database 
mongoose.connect("mongodb+srv://Avinash2609:urlencoded@cluster0.qa8fk.mongodb.net/Mergingfiles?retryWrites=true&w=majority", 
	{ useNewUrlParser: true, useUnifiedTopology: true }, (err,client)=> { 
        console.log('database connected') ;     
    }); 
    

var storage = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        cb(null, 'uploads') ;
    }, 
    filename: (req, file, cb) => { 
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)) ;
    } 
}); 

var upload = multer({ storage: storage }); 
    
var imgModel = require(path.join(__dirname + '/model')); 

    app.post('/result', upload.array('myfiles',10), (req, res, next) => { 

        var obj=[];
        req.files.forEach(function(file){
        console.log(file.filename);            
        var xyz={ 
            data: fs.readFileSync(path.join('./uploads/' + file.filename)), 
            contentType: 'csv'
        } ;
        obj.push(xyz);
      });
        var final={
            img:obj
        }
       imgModel.create(final, (err, objects) => { 
            if (err) { 
                console.log(err); 
            } else {
                objects.save();
                var list=[];
                var ar=objects.img;
                ar.forEach(function(object){
                    list.push(object.data);
                })
                if(req.body.b1){
                    var mylist=[]; 
                    mylist.push(('./merge.py'));
                    mylist=mylist.concat(list);
                    const child_process=require('child_process');

                    const process = child_process.spawn ('./myenv/Scripts/python.exe',mylist,options);
                    process.stdout.on('data',data=>{
                        res.send("success");
                });
                    process.stderr.on('data', (data) => {
                    console.log(`error:${data}`);
                 });
                    process.on('exit', function (code, signal) {
                    console.log('child process exited with ' +
                                `code ${code} and signal ${signal}`);
                  });
                }
                else if(req.body.b2){
                    var mylist=[];
                    mylist.push('./merge2.py');
                    mylist=mylist.concat(list);
                const spawn=require('child_process').spawn;
                    const process = spawn ('./myenv/Scripts/python.app',mylist);
                    process.stdout.on('data',data=>{
                    res.send(data);
                });
                }
            }
        });
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

// const process = spawn ('python',['./merge2.py',req.files.file1,req.files.file2,req.files.file3,req.files.file4,req.files.file5,req.files.file6,req.files.file7,req.files.file8,req.files.file9,req.files.file10]);    
// to activate env: myenv\Scripts\activate
// you can install dependencies after activating the enc(pip instal ..........)
//to deactivate: deactivate
// to clear cache: npm cache clean --force
