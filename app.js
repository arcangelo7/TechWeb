var express = require('express');

var app = express();

// Dove cercare i file statici da renderizzare
app.use(express.static(__dirname + '/public'));

// Route per pagina index.html
app.get('/', (req, res)=>{
    res.render('index.html');
});

var port = 8000
app.listen(port, ()=>{
    console.log(`Running on port ${port}`);
})