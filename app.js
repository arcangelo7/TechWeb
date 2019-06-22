const express = require('express');
require("./config/dbconnection.js").open();
var dbconn = require("./config/dbconnection.js");
const bodyParser = require('body-parser');
const exphbs  = require('express-handlebars');
const path = require('path');
const flash= require('connect-flash');
const session = require('express-session');
const passport = require('passport');

var app = express();

// INTEGRAZIONE FILE CONFIG PASSPORT
require('./config/passport')(passport);
const {accessoSicuro} = require('./config/auth.js');

// DOVE CERCARE I FILE STATICI DA RENDERIZZARE
app.use(express.static(__dirname + '/public'));

// MIDDLEWARE BODY PARSER
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

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

// MIDDLEWARE PASSPORT
app.use(passport.initialize());
app.use(passport.session()); // Al login apro una sessione

// ROUTE PER PAGINA INDEX.HTML
app.get('/', (req, res)=>{
    res.render('index');
});

/// ROUTE PER PAGINA MAPPA.HTML
app.get('/mappa', accessoSicuro, (req, res)=>{
    res.sendFile('mappa.html', {root: __dirname + '/public'});
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
    } else {
        var db = dbconn.get();
        var collection = db.collection("utenti");
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

// app.post('/login', function(req,res) {
//     var db = dbconn.get();
//     var collection = db.collection("utenti");
//     collection.findOne({ email: req.body.email, password: req.body.password}, function(err, user) {
//         if(!user){
//             req.flash('msg_errore', 'Email o password incorrette, riprova');
//             res.redirect("/login");
//         } else if (user.email === req.body.email && user.password === req.body.password){
//             res.redirect("/mappa");
//         } 
//     });
// });

// GESTIONE  LOGIN
app.post('/login', (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect: '/mappa',
        failureRedirect: '/login',
        failureFlash: true // return a message called error, using the message options set by the verify callback
    })(req, res, next); //curryng: that the first function returns another function and then that returned function is called immedia$
});

// GESTIONE LOGOUT
app.get('/logout', (req, res)=>{
    // Passport function
    // Invoking logout() will remove the req.user property and clear the login session (if any).
    req.logout();
    req.flash('msg_successo', "Sei disconesso. Ciao, alla prossima sessione");
    res.redirect('/');
});

var port = 8000
app.listen(port, ()=>{
    console.log(`Running on port ${port}`);
});

