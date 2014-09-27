var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

var fs = require('fs');
var path = require('path');

//mongo
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {

    var userSchema = mongoose.Schema({
        username: String,
        password: String,
        photos: [{ url: String, date: Date,  comments: [{ body: String, date: Date }], likes: [{ user_id: String }]}]
    // <api вызов cloudinary>?photo_id=<айдишка фотки>
    });

    userSchema.methods.validPassword = function (pwd) {
        return ( this.password === pwd);
        console.log('pas strings: '+ this.password + ', ' + pwd);
    };

    var User = mongoose.model('User', userSchema);

    // if there isn't admin user we need to create
    User.findOne({ 'username': 'admin' }, function(err, user) {
        debugger;
        if (err) { return console.error(err); }
        if ( !user) {
            var testUs =  new User({ username: 'admin', password: '107220' }); 
            testUs.save(function (err, testUs) {
              if (err) return console.error(err);
            });
            var testUs2 = new User({ username: 'guest', password: '123' });
            testUs2.save(function (err, testUs) {
              if (err) return console.error(err);
            });
            console.log('Admin and Guest added to db.');
        }
    });
    // logging users from db
    User.find(function (err, users) {
      if (err) return console.error(err);
      console.log(users);
    });

    // passportjs
    passport.use(new LocalStrategy(
        function(username, password, done) {
        // replace it with mongoose model
        User.findOne({ 'username': username }, function(err, user) {
            if (err) { return done(err); }
            if ( !user) {
                console.log('Incorrect username.');
                return done(null, false, { message: 'Incorrect username. '});
                
            }
            if ( !user.validPassword(password)) {
                console.log('Incorrect password.');
                return done(null, false, { message: 'Incorrect password. '});
                
            }
            else {
                console.log('success');
                return done(null, user, { message: 'Signed in successfully. '});
               
            }
        });

        // if (username == 'valid_user' && password == 'valid_password') {
        //     return done(null, { username: 'valid_user' }, { message: 'Signed in successfully' });
        // } else {
        //     return done(null, false, { message: 'Incorrect username or password' });
        // }
    }));

    // store(serialize) user to session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // get user using id from session
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            console.log('deserialize');
            done(err, user);
        });
    });
// end of mongo callback
});

app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({ secret: 'SOME_SECRET' }));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

// application routing (logic)
app.get('/login', function(req, res) {
    fs.readFile(path.join(__dirname, 'index.html'), { encoding: 'utf-8' }, function(err, data) {
        if (!err) {
            res.send(data);
        }
    });
});

app.get('/hello', function(req, res) {
    if (req.isAuthenticated()) {
        res.send('Hello, friend!');
    } else {
        res.send('Get away, stranger!');
    }
});


//maby to do it with angular???
app.get('/signup', function(req, res) {
    fs.readFile(path.join(__dirname, 'index.html'), { encoding: 'utf-8' }, function(err, data) {
        if (!err) {
            res.send(data);
        }
    });
});

app.post('/login', passport.authenticate('local', { successRedirect: '/hello', failureRedirect: '/login' }));
app.get('/logout', function(req, res) {
    req.logout();
    redirect('/login');
});

// server initialization
var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
