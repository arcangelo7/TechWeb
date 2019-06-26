const LocalStrategy = require('passport-local').Strategy;
require("./dbconnection.js").open();
var dbconn = require("./dbconnection.js");

module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done)=>{
    // By default, LocalStrategy expects to find credentials in parameters named username and password. I want an email
            var db = dbconn.get();
            var collection = db.collection("utenti");
            // VERIFICA MAIL
            collection.findOne({email: email}).then(utente => {
            if(!utente){
                return done(null, false, {message: 'Utente non trovato'});
                // parametri = errori del server, non dell'autenticazione
                //             false indicates an authentication failure
            }
            // VERIFICA PASSWORD
            if(password == utente.password){
                return done(null, utente);
            } else {
                return done(null, false, {message: 'Password non corretta'});
            }
        });
    }));

    // The user (you provide as the second argument of the done function) is saved in the session and is later used to retrieve th
    // When subsequent requests are received, this ID is used to find the user, which will be restored to req.user.
    passport.serializeUser(function(utente, done) {
        done(null, utente);
    });

    passport.deserializeUser(function(utente, done) {
        done(null, utente);
    });
}
