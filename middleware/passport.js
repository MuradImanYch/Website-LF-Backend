require('dotenv').config();
const db = require('../db.js');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secretkey'
}

module.exports = passport => {
    passport.use(
        new JwtStrategy(options, (payload, done) => {
            db.query(`SELECT * FROM users WHERE username="${payload.username}"`, (err, result) => {
                if(err) throw err;

                result.length > 0 ? done(null, result[0].username) : done(null, false);
            });
        })
    )
}