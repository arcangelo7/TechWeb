const express = require('express');
var mongodb = require('mongodb');
require("./config/dbconnection.js").open();
var dbconn = require("./config/dbconnection.js");
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
const exphbs  = require('express-handlebars');
const path = require('path');
const flash= require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const cloudinary = require('cloudinary').v2;

var app = express();

// INTEGRAZIONE FILE CONFIG PASSPORT
require('./config/passport')(passport);
const {accessoSicuro} = require('./config/auth.js');

// DOVE CERCARE I FILE STATICI 
app.use(express.static( __dirname + "/public" ));

// MIDDLEWARE BODY PARSER
app.use(bodyParser.urlencoded({limit: '100mb', extended: true})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json({limit: '100mb', extended: true})); // parse application/json

// OVERRIDE MIDDLEWARE
app.use(methodOverride('_method'));

// MIDDLEWARE PER HANDLEBARS
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

//MIDDLEWARE PER MESSAGGI FLASH
app.use(flash());

//MIDDLEWARE PER SESSIONE
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
}));

// MIDDLEWARE PASSPORT
app.use(passport.initialize());
app.use(passport.session()); // Al login apro una sessione

//VARIABILI GLOBALI PER MESSAGGI FLASH
app.use((req , res, next)=>{
    res.locals.msg_successo = req.flash('msg_successo');
    res.locals.msg_errore = req.flash('msg_errore');
    // Messaggi per passport
    res.locals.error = req.flash("error");
    // Variabile globale contenente l'utente loggato, se c'è
    res.locals.user = req.user;
    next();
});

// DOVE TROVARE I FILE STATICI DI INDEX
app.use(express.static( __dirname + "/views/img" ));

// ROUTE PER PAGINA INDEX
app.get('/', (req, res)=>{
    res.render('index');
});

// GESTIONE LOGIN DA INDEX
app.post('/', (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect: '/browser-mappa',
        failureRedirect: '/login',
        failureFlash: true // return a message called error, using the message options set by the verify callback
    })(req, res, next); //curryng: that the first function returns another function and then that returned function is called immedia$
});

// ROUTE PER PAGINA PREFERENZE
app.get('/preferenze', accessoSicuro, (req, res)=>{
    var db = dbconn.get();
    var collection = db.collection('utenti');
    collection.findOne({"_id": new mongodb.ObjectID(req.session.passport.user)}, function(err, result) {
        if(err) console.log("Errore: impossibile inserire clip all'interno del database");
        console.log("req.session.passport.user: " + req.session.passport.user);
        console.log(result);
        res.render('preferenze', {
            nome: result.nome,
            cognome: result.cognome,
            email: result.email,
            lingua: result.lingua
        });
    });
});

//AGGIORNAMENTO DELLE PREFERENZE
app.post('/preferenze', accessoSicuro, (req, res)=>{
    console.log("preferenze");
    const lingua = req.body.lingua;
    console.log("lingua: " + lingua);
    var newvalue = { $set: { lingua: req.body.lingua } };
    var db = dbconn.get();
    var collection = db.collection('utenti');
    collection.updateOne({"_id": new mongodb.ObjectID(req.session.passport.user)}, newvalue, (err, result)=>{
        if(err) console.log("Errore, impossibile aggiornare l'utente nel database: " + err);
        res.redirect("/browser-mappa");
    });
});

// ROUTE PER PAGINA MAPPA BROWSER
app.get('/browser-mappa', accessoSicuro, (req, res)=>{
    var db = dbconn.get();
    var collection = db.collection('utenti');
    collection.findOne({"_id": new mongodb.ObjectID(req.session.passport.user)}, function(err, result) {
        if(err) console.log("Errore: impossibile inserire clip all'interno del database");
        console.log("req.session.passport.user: " + req.session.passport.user);
        res.render('mappaBrowser', {
            lingua: result.lingua
        });
    });
});


/// ROUTE PER PAGINA MAPPA.HTML
app.get('/editor-mappa', accessoSicuro, (req, res)=>{
    res.sendFile('mappaEditor.html', {root: __dirname + "/views"});
});

//GESTIONE DEI POST DI EDITOR MAPPA
app.post('/editor-mappa',function(req, res) {
    var db = dbconn.get();
    var collection = db.collection('clip');
    const nuovaClip = {
        titolo: req.body.titolo,
        testo: req.body.testo,
        metadati: req.body.olc + ":" + req.body.scopo + ":" + req.body.lingua + ":" + req.body.categoria + ":" + req.body.audience + ":" + req.body.dettaglio,
        audio: req.body.audio,
        utente: req.session.passport.user
    }
    collection.insertOne(nuovaClip, function(err, result) {
        if(err) console.log("Errore: impossibile inserire clip all'interno del database");
    });
    res.redirect("/lista-clip");
});

//ROUTE DELLA PAGINA CHE MOSTRA LE CLIP
app.get('/lista-clip', accessoSicuro, function(req,res){
    var db = dbconn.get();
    var collection = db.collection('clip');
    collection
        .find({utente: req.session.passport.user})
        .toArray(function(err, result) {
            if (err) {console.log("Errore: impossibile connettersi al db")};   
            res.render('listaClip', { 
                clip: result
            });
    });
});

//GESTIONE ELIMINAZIONE CLIP
app.delete('/lista-clip/:id', accessoSicuro, (req , res) =>{
    var db = dbconn.get();
    var collection = db.collection('clip');
    collection.deleteOne({
        "_id": new mongodb.ObjectID(req.params.id)        
    })
    .then(() =>{
        req.flash('msg_successo',  'Nota cancellata correttamente');
        res.redirect('/lista-clip');
    });
});

// CONFIGURAZIONE CLOUDINARY
cloudinary.config({
  cloud_name: 'dxajlzvkm',
  api_key: '531971128589859',
  api_secret: 'oyMM379F8kPhn0INbE_1WMvRCpk'
}); 

//GESTIONE CARICAMENTO CLIP SU YOUTUBE
app.post('/lista-clip/:id', accessoSicuro, (req , res) =>{
    function trovaclip()
    {
        return new Promise(function(resolve)
        {
            var db = dbconn.get();
            var collection = db.collection('clip');
            collection.findOne({"_id": new mongodb.ObjectID(req.params.id)}, function(err, result) {
                resolve(result);
            })
        });
    }
    trovaclip().then(function(value) {
        const audio = 'data:audio/mp3;base64,' + value.audio;
        cloudinary.uploader.upload(audio, { resource_type: "auto", format: "mp4", transformation: [
                {overlay: "sample"}
            ] }, function (err, audio) {
            console.log("** File Upload");
            if (err) { console.warn(err); }
            console.log("* public_id for the uploaded image is generated by Cloudinary's service.");
            console.log("* " + audio.public_id);
            console.log("* " + audio.secure_url);
            var db = dbconn.get();
            var collection = db.collection('clip');
            collection.deleteOne({"_id": value._id});
            collection
                .find({utente: req.session.passport.user})
                .toArray(function(err, result) {
                    if (err) {console.log("Errore: impossibile connettersi al db")};   
                    res.render('listaClip', {
                        clip: result,
                        videoToUpload: audio.secure_url,
                        metadata: value
                    });
            });
        });
    });
});

//MODIFICA DELLE CLIP
app.post('/modifica-clip/:id', accessoSicuro, (req , res) =>{
    console.log("POST MODIFICA CLIP");
    console.log("mod: " + req.body.mod);
    if(req.body.mod == '0')
    {
        function trovaclip()
        {
            return new Promise(function(resolve)
            {
                var db = dbconn.get();
                var collection = db.collection('clip');
                collection.findOne({"_id": new mongodb.ObjectID(req.params.id)}, function(err, result) {
                    resolve(result);
                })
            });
        }
        trovaclip().then(function(value) {
            const audio = 'data:audio/mp3;base64,' + value.audio;
            cloudinary.uploader.upload(audio, { resource_type: "auto", format: "mp3" }, function (err, audio) {
                console.log("** Audio Upload");
                if (err) { console.warn(err); }
                console.log("* " + audio.public_id);
                console.log("* " + audio.secure_url);
                console.log("* duration: " + audio.duration + "(" + Math.round(audio.duration) + ")");
                res.render('modificaClip', { 
                    titolo: value.titolo,
                    audioLink: audio.secure_url,
                    audioId: audio.public_id,
                    duration: Math.round(audio.duration),
                    id: req.params.id
                });
            });
        });
    }
    else if(req.body.mod == '1')
    {
        var video = cloudinary.url(req.body.audioId, {transformation: [{effect: "volume:" + req.body.volume , start_offset: req.body.inizio, end_offset: req.body.fine}]});
        video = video.replace("http", "https");
        video = video.replace("image", "video");
        video = video.concat(".mp3");
        console.log(video);
        console.log("fatto");
        res.send(video);
    }
    else if(req.body.mod == '2')
    {
        function trovaclip()
        {
            return new Promise(function(resolve)
            {
                var db = dbconn.get();
                var collection = db.collection('clip');
                collection.findOne({"_id": new mongodb.ObjectID(req.params.id)}, function(err, result) {
                    resolve(result);
                })
            });
        }
        trovaclip().then(function(value) {
            res.redirect('/lista-clip');
            const audio = req.body.audio;
            console.log(value);
            var newvalue = { $set: { audio: audio } };
            console.log(newvalue);
            var db = dbconn.get();
            var collection = db.collection('clip');
            collection.updateOne({"_id": new mongodb.ObjectID(req.params.id)}, newvalue, (err, result)=>{
                if(err) console.log("Errore, impossibile aggiornare la clip nel database: " + err);
            });
        });
    }
});

//ROUTE PER PAGINA REGISTRAZIONE
app.get('/registrazione', (req, res) => {
    res.render('registrazione');
});

//ROUTE PER PAGINA LOGIN
app.get('/login' , (req , res)=>{
    res.render('login');
});

//GESTIONE FORM REGISTRAZIONE
app.post("/registrazione", (req, res)=>{
    let errori = [];
    if(req.body.password != req.body.conferma_psw){
        errori.push({text: 'Password non corrispondenti'});
    }
    if(req.body.password.length < 8){
        errori.push({text: 'La password deve avere almeno 8 caratteri'});
    }
    if(errori.length > 0){
        res.render('registrazione', {
            errori: errori,
            nome: req.body.nome,
            cognome: req.body.cognome,
            email: req.body.email,
            password: req.body.password,
            conferma_psw: req.body.conferma_psw
        });
    } 
    function controllaUtente() 
    {
        return new Promise(function(resolve)
        {
            var db = dbconn.get();
            var collection = db.collection('utenti');
            collection.find({email : req.body.email}).toArray(function(err, result) {
                resolve(JSON.stringify(result));
            });
        });
    }
    controllaUtente().then(function(value) {
        if(value != '[]')
        {
            errori.push({text: 'Mail già registrata'});
        }
        if(errori.length > 0){
            res.render('registrazione', {
                errori: errori,
                nome: req.body.nome,
                cognome: req.body.cognome,
                email: req.body.email,
                password: req.body.password,
                conferma_psw: req.body.conferma_psw
            });
        }
        else
        {
            var db = dbconn.get();
            var collection = db.collection('utenti');
            const nuovoUtente = {
                nome: req.body.nome,
                cognome: req.body.cognome,
                email: req.body.email,
                password: req.body.password
            }
            collection.insertOne(nuovoUtente, (err, result)=>{
                if(err) {
                    console.log("Errore, impossibile inserire utente nel database: " + err);
                } else {
                    req.flash('msg_successo', 'Bene, ti sei registrato');
                    res.redirect("/login");
                }
            });
        }
    });   
});

// GESTIONE  LOGIN
app.post('/login', (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect: '/browser-mappa',
        failureRedirect: '/login',
        failureFlash: true // return a message called error, using the message options set by the verify callback
    })(req, res, next); //curryng: that the first function returns another function and then that returned function is called immedia$
});

// GESTIONE LOGOUT
app.get('/logout', (req, res)=>{
    // Passport function
    // Invoking logout() will remove the req.user property and clear the login session (if any).
    req.logout();
    res.redirect('/');
});

var port = 8000
app.listen(port, ()=>{
    console.log(`Running on port ${port}`);
});

