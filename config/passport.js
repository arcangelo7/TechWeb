const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

//SCHEMA E MODELLO PER UTENTI
require('../models/utenti');
const Utenti = mongoose.model('utenti');

module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done)=>{
        // By default, LocalStrategy expects to find credentials in parameters named username and password. I want an email

        // VERIFICA MAIL
        Utenti.findOne({
            email: email
        }).then(utente => {
            if(!utente){
                return done(null, false, {message: 'Utente non trovato'}); 
                // parametri = errori del server, non dell'autenticazione
                //             false indicates an authentication failure
            }
        
        // VERIFICA PASSWORD
            bcrypt.compare(password, utente.password, (err, comparato)=>{
                if(err) throw err;
                if(comparato){
                    return done(null, utente);
                } else {
                    return done(null, false, {message: 'Password non corretta'}); 
                }
            })
        });
    }));

    // The user id (you provide as the second argument of the done function) is saved in the session and is later used to retrieve the whole object via the deserializeUser function.
    // When subsequent requests are received, this ID is used to find the user, which will be restored to req.user.
    passport.serializeUser(function(utente, done) {
        done(null, utente.id);
    });

    passport.deserializeUser(function(id, done) {
        Utenti.findById(id, function(err, utente) {
            done(err, utente);
        });
    });
}