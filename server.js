// says if our secret key is not valid not to allow changes
if(process.env.NODE_ENV !== 'production'){
   require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const ejs = require('ejs')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const bitcore = require('bitcore-lib')

const initializePassport = require('./passport-config')
// const initalizeAddress = require('./wallet.js')

initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

//initalizeAddress(
 //   address,
  //  email => users.find(user => user.email === email,
  //  id => users.find(user => user.id === id))
//)

const users = []

// tells server we are using ejs view-engine set to ejs
app.set('view engine', 'ejs')
// take forms from login and register page, and be able to access later
app.use(express.urlencoded({extended: true}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

//creating a route Home Page/login/register
app.get('/', checkAuthenticated, (req, res) => {
   res.render('index.ejs', {name: req.user.name} )
})
app.get('/login', checkNotAuthenticated, (req,res) => {
    res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req,res) => {
    res.render('register.ejs')
})


app.post('/register', checkNotAuthenticated, async (req,res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
       // const hashedPrivateKey = await bcrypt.hash(req.body.privateKey, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            address: initializeAddress
        })
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/')
}
        next()
}

app.listen(3000)

