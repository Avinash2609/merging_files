var express=require("express")
var app=express();
app.set("view engine","ejs");
app.use(express.static("public"));

app.get("/result",function(req,res){
    
    const spawn=require('child_process').spawn;
    if(req.query.b1){
        const process = spawn ('python',['./merge.py',req.query.file1,req.query.file2,req.query.file3,req.query.file4,req.query.file5,req.query.file6,req.query.file7,req.query.file8,req.query.file9,req.query.file10]);    
        process.stdout.on('data',data=>{
        res.send(data)
    });
    }
    else if(req.query.b2){
        const process = spawn ('python',['./merge2.py',req.query.file1,req.query.file2,req.query.file3,req.query.file4,req.query.file5,req.query.file6,req.query.file7,req.query.file8,req.query.file9,req.query.file10]);    
        process.stdout.on('data',data=>{
        res.send(data)
    });
    }
})

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
