const fetch = require('node-fetch');
const config = require('../config.json');

/**
 * Envoie des données dans mongoDB et met à jour des index pour Elasticsearsch
 * 
 * @param token
 * @param entitiesJson 
 * @returns token
 */
module.exports = (token, entitiesJson) => {
    return new Promise(function (resolve, reject) {
        console.log('toMongo')
        // console.log('token : ' + data);
        // console.log(entitiesJson);

        let url = config.apiAddress + '/api/entities/page',
        options = {
            method: 'post',
            body: entitiesJson,
            headers: { 
                'Content-Type': 'application/json',
                'x-access-token' : token
            }
        };
        
        fetch(url, options)
        .then(response => {
            if(response.status !== 200) reject(new Error('Insertion des données'));
            
            let url = config.apiAddress + '/api/indices/reindex',
            options = {
                method: 'get',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-access-token' : token
                }
            };
            fetch(url, options)
            .then(response => {
                if(response.status !== 200) reject(new Error('Mise à jour des index'));
                setTimeout(function() {
                    resolve(token);
                }, 1000);
            });
        })
        .catch(err => reject(err));
    }); 
};