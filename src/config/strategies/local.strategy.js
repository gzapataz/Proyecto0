var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

var pgPool = require('../../js/pgPool');
var pool = pgPool.getPool();

module.exports = function() {
    passport.use(new LocalStrategy({
            usernameField: 'eMail',
            passwordField: 'password'
        },
        function(eMail, password, done) {
            //Revisar base de datos
            pool.query('SELECT * FROM "user" WHERE email = $1;', [eMail],
                function(err, results) {
                    if (results.rows[0] === undefined) {
                        //Error no existe usauruio
                        done(null, false);
                    } else {
                        if (results.rows[0].password === password) {
                            var user = results.rows[0];
                            done(null, user);
                        } else {
                            done(null, false);
                        }
                    }
                });
        }));
}