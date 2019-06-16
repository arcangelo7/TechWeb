const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const exphbs  = require('express-handlebars');
const flash= require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const {accessoSicuro} = require('./helpers/auth');

var app = express();

// Dove cercare i file statici da renderizzare
app.use(express.static(__dirname + '/public'));

// INTEGRAZIONE FILE CONFIG PASSPORT
require('./config/passport')(passport);

// CONNESSIONE A MONGOOSE
// mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/whereami', {useNewUrlParser: true})
  .then(() => console.log(' Server connesso'))
  .catch(err => console.log(err));

// SCHEMA E MODELLO PER UTENTI
require('./models/utenti');
const Utenti = mongoose.model('utenti');

// MIDDLEWARE PER HANDLEBARS
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// MIDDLEWARE BODY PARSER
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

//MIDDLEWARE PER SESSIONE
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
}));

// MIDDLEWARE PASSPORT
app.use(passport.initialize());
app.use(passport.session()); // Al login apro una sessione

//MIDDLEWARE PER MESSAGGI FLASH
app.use(flash());

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

// ROUTE PER PAGINA INDEX.HTML
app.get('/', (req, res)=>{
    res.render('index');
});

// ROUTE PER PAGINA MAPPA.HTML
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
})

//GESTIONE FORM REGISTRAZIONE
app.post('/registrazione', (req, res) => {  
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
    }else{
        Utenti.findOne({email: req.body.email})
        .then(utente =>{
            if(utente){
                req.flash('msg_errore' , 'Questa mail è già registrata');
                res.redirect('/registrazione');
            }else{
                const nuovoUtente = new Utenti({
                    nome: req.body.nome,
                    cognome: req.body.cognome,
                    email: req.body.email,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt)=>{
                    bcrypt.hash(nuovoUtente.password, salt, (err, hash)=>{
                        if(err) throw err;
                        nuovoUtente.password = hash;
                        nuovoUtente.save()
                            .then(utente =>{
                                req.flash('msg_successo', 'Bene, ti sei registrato');
                                res.redirect('login');
                            })
                            .catch(err =>{
                                console.log(err);
                                return
                            });
                    });
                });
            }
        });
    }
});

// GESTIONE  LOGIN
app.post('/login', (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect: '/mappa',
        failureRedirect: '/login',
        failureFlash: true // return a message called error, using the message options set by the verify callback 
    })(req, res, next); //curryng: that the first function returns another function and then that returned function is called immediately
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
})