const { ExtractJwt, Strategy } = require('passport-jwt');
const { User }      = require('../models');
const CONFIG        = require('../config/config');
const {to}          = require('../services/util.service');

module.exports = function(passport){
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = CONFIG.jwt_encryption;
    // opts.passReqToCallback = function(request, jwt_payload, done_callback){
    //     console.log(jwt_payload);
    //     //done_callback()
    // }

    passport.use(new Strategy(opts, async function(jwt_payload, done){
        let err, user;
        [err, user] = await to(User.findById(jwt_payload.user_id));

        if(err) return done(err, false);
        if(user) {
            user.role = 'user'; //@todo make it dynamic
            return done(null, user);
        }else{
            return done(null, false);
        }
    }));

    passport.serializeUser(function(user, done) { 
        console.log("serialize");
        done(null, user); 
    });
    passport.deserializeUser(function(obj, done) {
        console.log("deserialise");
         done(null, obj); 
        });

}