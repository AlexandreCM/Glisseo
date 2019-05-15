const fetch = require('node-fetch');
const config = require('../config.json');

/**
 * Authentification à l'API
 * 
 * @param null
 * @returns token
 */
module.exports = () => {
    return new Promise(function (resolve, reject) {
        console.log('auth')
        let url = config.apiAddress + '/api/authenticate',
        options = {
            method: 'POST',
            body: JSON.stringify({ key: config.apiKey }),
            headers: { 'Content-Type': 'application/json' }
        };

        fetch(url, options)
        .then(response => response.json())
        .then(data => resolve(data.token))
        .catch(err => reject(new Error('Problème d\'authentification')));
    });
};