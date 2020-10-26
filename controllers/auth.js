const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const utils = require('../lib/utils');

const db = mysql.createConnection({
  host: process.env.HOST,
  user: 'root',
  password: 'Yw131452!',
  database: process.env.DATABASE,
});

exports.signup = (req, res) => {
  // console.log(req.body);

  const { name, password } = req.body;

  db.query(
    'SELECT name FROM users WHERE name = ?',
    [name],
    async (err, results) => {
      try {
        if (err) {
          console.log(err);
        } else if (results.length > 0) {
          return res.render('signup', {
            message_e: 'Fail, user exist!',
          });
        }
        const saltHash = utils.genPassword(password);
        const salt = saltHash.salt;
        const hashedPassword = saltHash.hash;

        db.query(
          'INSERT INTO users SET ?',
          { name: name, password: hashedPassword, salt: salt },
          (err, user) => {
            if (err) {
              console.log(err);
            } else {
              console.log(user);

              return res.render('login', {
                message: 'user created, please login',
              });
            }
          }
        );
      } catch (err) {
        console.log(err);
      }
    }
  );
};

exports.login = async (req, res) => {
  if (!req.body.name || !req.body.password) {
    return res.status(400).render('login', {
      message: 'please provide an email and password',
    });
  }
  db.query(
    'SELECT * FROM users WHERE name = ?',
    [req.body.name],
    async (err, user) => {
      console.log(user);
      if (
        !user ||
        !(await utils.validPassword(
          req.body.password,
          user[0].password,
          user[0].salt
        ))
      ) {
        res
          .status(401)
          .render('login', { message: 'Fail to login, please try again!' });
      } else {
        const tokenObject = utils.issueJWT(user);

        console.log('the token is: ' + tokenObject);

        const cookieOptions = {
          expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          httpOnly: true,
          secure: false,
        };

        res.cookie('jwt', tokenObject, cookieOptions);

        db.query(
          'SELECT * FROM friends WHERE id = ?',
          [user[0].id],
          async (err, results) => {
            console.log(results);
            res.status(200).render('friends', {
              message: `Congratulations ${req.body.name}, you have successfully login to your friends page`,
              friendList: results,
              name: req.body.name,
            });
          }
        );
      }
    }
  );
};

exports.friends = async (req, res) => {
  try {
    console.log(req.body);
    const { name, newfriend } = req.body;
    db.query(
      'SELECT * FROM friends WHERE name = ?',
      [newfriend],
      async (err, results) => {
        if (err) {
          console.log(err);
        } else if (results.length > 0) {
          return res.render('friends', {
            message_e: 'This is not a new friend!',
          });
        } else {
          db.query(
            'SELECT * FROM users WHERE name = ?',
            [name],
            async (err, results) => {
              const id = results[0].id;
              const sql = `INSERT INTO friends (Name, id) VALUES('${newfriend}', ${id})`;
              db.query(sql);
              db.query(
                'SELECT * FROM friends WHERE id = ?',
                [id],
                async (err, results) => {
                  console.log(results);
                  res.status(200).render('friends', {
                    message: `Congratulations ${name}, you have successfully added new friend to your list`,
                    friendList: results,
                    name: name,
                  });
                }
              );
            }
          );
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};

exports.logout = (req, res) => {
  res.clearCookie('jwt');
  res.status(200).render('login', {
    message: `You have successfully logged out. Please login again`,
  });
};

exports.users = (req, res) => {
  db.query('SELECT COUNT(*) AS number FROM users', (err, results) => {
    if (err) {
      console.log(err);
    } else {
      const number = results[0].number;
      console.log(results[0]);
      db.query('SELECT COUNT(*) AS numberF FROM friends', (err, data) => {
        const friends = data[0].numberF;
        db.query('SELECT * FROM users', (err, results2) => {
          if (err) {
            console.log(err);
          } else {
            console.log(results2);
            res.render('stats', {
              message: `The total number of users are ${number} and the total number of friends are ${friends}`,
              results: results2,
            });
          }
        });
      });
    }
  });
};

exports.friendDB = (req, res) => {
  db.query('SELECT COUNT(*) AS number FROM users', (err, results) => {
    if (err) {
      console.log(err);
    } else {
      const number = results[0].number;
      console.log(results[0]);
      db.query('SELECT COUNT(*) AS numberF FROM friends', (err, data) => {
        const friends = data[0].numberF;
        db.query('SELECT * FROM friends', (err, results3) => {
          if (err) {
            console.log(err);
          } else {
            console.log(results3);
            res.render('stats', {
              message: `The total number of users are ${number} and the total number of friends are ${friends}`,
              resultsF: results3,
            });
          }
        });
      });
    }
  });
};
