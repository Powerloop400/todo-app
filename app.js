const express = require('express');
const passport = require('passport'); 
const connectEnsureLogin = require('connect-ensure-login'); 
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');


const userModel = require('./models/users');
const taskModel = require('./models/tasks');

const session = require('express-session');
require('dotenv').config();

const db = require('./db');

const PORT = 3000;
const app = express();

app.use(methodOverride('_method'))


db.connectToMongoDB();

const tasksRoute = require('./routes/tasks');
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } 
}));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session()); 

passport.use(userModel.createStrategy());

passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

app.set('views', 'views');
app.set('view engine', 'ejs');

const appRoute = require('./routes/tasks');

app.use('/tasks', connectEnsureLogin.ensureLoggedIn(), appRoute);

app.get('/', connectEnsureLogin.ensureLoggedIn(),  (req, res) => {
    res.render('index');
});


app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/create', (req, res) => {
    res.render('create');
});

app.get('/complete', (req, res) => {
    taskModel.find({ state: 'completed', author: req.user._id })
        .then(tasks => {
            res.render('complete', { tasks });
        })
        .catch(err => {
            console.log(err);
            res.send(err);
        });
});


app.get('/signup', (req, res) => {
    res.render('signup');
});



app.post('/signup', (req, res) => {
    const user = req.body;
    userModel.register(new userModel({ username: user.username }), user.password, (err, user) => {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        } else {
            passport.authenticate('local')(req, res, () => {
                res.redirect("/tasks")
            });
        }
    });
});


app.post('/login', passport.authenticate('local', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/');
});

app.post('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});


app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send('Something broke!');
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
