const express = require('express');
const path = require('path');
const mysql = require('mysql');
const ejs = require('ejs');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const passport = require('passport');

dotenv.config({path: './.env'});

const app = express();

const db = mysql.createConnection({
    host: process.env.HOST,
    user: 'root',
    password: 'Yw131452!',
    database: process.env.DATABASE
});

app.use(passport.initialize());
//parse url-encoded bodies (as sent by html forms post)
app.use(express.urlencoded({extended: true}));
//parse JSON bodies (as send by API clients)
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'ejs');

db.connect((err)=>{
    if(err){
        console.log(err);
    } else{
        console.log(('MYSQL Connected'));
    }
});

//import routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

app.listen('5000', ()=>{
console.log('server is up running on port 5000');
})
