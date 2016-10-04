/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var expreso = require('express');
var app = expreso();
var mongo = require('mongodb').MongoClient;
var codigoId = require('mongodb').ObjectId
var urlconexion = 'mongodb://localhost:27017/urlCorta'


app.get('/', function (req,res){
    res.sendFile(__dirname+'/index.html')
})

app.get('/new/*', function (req,res){
    var parametro = req.params[0];
    var regex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");

    if(parametro.match(regex)){
    mongo.connect(urlconexion, function (err,db){
        
        db.collection('paginas').insert({'urlpagina':parametro},function(err,data){
            var id = data.ops[0]._id;
            var url = data.ops[0].urlpagina;
            res.json({'Orginal_url':url, 'id':id})
        })
        })
    }
    else
        res.send('URl Wrong path')
})

app.get('/:id', function (req,res){
    var parametro = new codigoId(req.params.id)
    mongo.connect(urlconexion, function(err,db){
        
     db.collection('paginas').findOne({_id: parametro}, function(err,data){
         res.redirect(data.urlpagina)
                
     })
         
        
        
    })
})

app.listen(process.env.port, function(err, thePort){
   console.log(this.address().port)  
})