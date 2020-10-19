let express = require('express');
let cors=require(`cors`);
let app = express();
let fs = require("fs");
const bodyParser= require('body-parser');

app.use(bodyParser.json());
app.use(cors());

let IDcounter= require(`${__dirname}/IDcounter.json`);
let tasks= require(`${__dirname}/tasks.json`);

app.put(`/`,function(req,res){
   tasks=req.body;
   tasks[tasks.length-1].ID=IDcounter.counter;
   IDcounter.counter++;
   fs.writeFile(`${__dirname}/IDcounter.json`, JSON.stringify(IDcounter), function (err) {
      if (err) return console.log(err);
      console.log(`Check the file`);
   });
   fs.writeFile(`${__dirname}/tasks.json`, JSON.stringify(tasks), function (err) {
      if (err) return console.log(err);
      console.log(`Check the file`);
   });
    res.send(`Got a PUT request`);
 });


fs.readFile( __dirname + "/" + "tasks.json", 'utf8', function (err, data) {
  data = JSON.parse( data );
 });
console.log(tasks);


app.get(`/`, function (req,res){
   res.send(tasks);
});

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})