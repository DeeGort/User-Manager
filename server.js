var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt     = require('jsonwebtoken');
var config  = require('./config');
var User    = require('./app/models/user');

// Configuration
var port = process.env.PORT || 3000;
mongoose.connect(config.database);
app.set('superSecret', config.secret);

// User body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use morgan to log requests to the console
app.use(morgan('dev'));

// Static
app.use(express.static(__dirname + '/client'));

// Server
app.listen(port);
console.log('SERVER RUNNING at http://localhost:' + port);

// Setup
app.get('/setup', function(req, res) {

    var nick = new User({
        username: 'admin',
        password: 'password',
        admin: true
    });

    nick.save(function(err) {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({ success: true });
    })
});

// API routes
var apiRoutes = express.Router();

// Route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {

    // find the user
    User.findOne({
        username: req.body.username
    }, function(err, user) {

        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.'})
        } else if (user) {

            // check if password mathers
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed.' })
            } else {
                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, app.get('superSecret'), {
                    expiresIn : 60*60*24 // expires in 24 hours
                });

                res.set('Authorization', 'Bearer ' + token);
               /* res.json({
                    success: true,
                    token: token
                });*/
                res.end();
            }
        }
    });
});

apiRoutes.use(function(req, res, next) {
     // check header or url parameters or post parameters for token
     var token = req.body.token || req.query.token || req.headers['x-access-token'];

     // decode token
     if (token) {
         // verifies secret and checks exp
         jwt.verify(token, app.get('superSecret'), function(err, decoded) {
             if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
             } else {
                 // if everything is good, save to request for use in other routes
                 req.decoded = decoded;
                 next();
             }
         });
     } else {
        // if there is no token
        // return an error
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.' 
        });
     }
});

// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' });
});

// route to return all user (GET http://localhost:3000/api/users)
apiRoutes.get('/users', function(req, res) {
    User.find({}, function(err, users) {
        res.json(users);
    });
});

apiRoutes.post('/users', function(req, res) {
    var user = new User({
        username: req.body.username,
        password: req.body.password,
        admin: true
    });

    user.save(function(err) {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({ success: true });
    })
});

apiRoutes.delete('/users/:id', function(req, res) {
    var id = req.params.id;

    User.findByIdAndRemove(id, function(err, doc) {
        if (err) throw err;

        console.log('User delete successfully');
        res.json({ success: true });
    })
});


app.use('/api', apiRoutes);
