const mysql = require('mysql');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const db = mysql.createConnection({
    host: process.env.HOST,
    user: 'root',
    password: 'Yw131452!',
    database: process.env.DATABASE
});

exports.stats = (req, res)=>{
    db.query('SELECT COUNT(*) AS number FROM users', (err, results)=>{
        if(err){
            console.log(err);
        } else{
            const number = results[0].number;
            console.log(results[0]);
            db.query('SELECT COUNT(*) AS numberF FROM friends', (err, results)=>{
                res.render('stats', {message: `The total number of users are ${number} and the total number of friends are ${results[0].numberF}`})
            })
            
            
        }
    }); 

}


    