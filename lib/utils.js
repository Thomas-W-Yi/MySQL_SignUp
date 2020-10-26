const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const pathToKey = path.join(__dirname, '..', 'id_rsa_priv.pem');
const privKey = fs.readFileSync(pathToKey, 'utf8');

function validPassword(password, hash, salt){
    const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}

function genPassword(password) {
    const salt = crypto.randomBytes(32).toString('hex');
    const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

    return {
        salt: salt,
        hash: genHash
    };
}

function issueJWT(user) {
    const id = user.insertId;

    const expiresIn = '1d';

    const payload = {
        sub: id,
        iat: Date.now()
    };

    const signedToken = jsonwebtoken.sign(payload, privKey, {expiresIn: expiresIn, algorithm: 'RS256'});

    return {
        token: 'bearer ' + signedToken,
        expires: expiresIn
    }
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
module.exports.issueJWT = issueJWT;
