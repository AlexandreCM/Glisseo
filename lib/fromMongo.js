const fetch = require('node-fetch');
const config = require('../config.json');

/**
 * Récupération des données de mongoDB en fonction des noms des fichiers téléversés pour vérification
 * 
 * @param token
 * @param files array
 * @returns filesControl : array
 */ 
module.exports = (token, files) => {
    return new Promise(function (resolve, reject) {
        console.log('fromMongo')

        let filesControl = [];
        let errorFile = [];
        let i = 1;
        files.forEach(file => {

            let url = config.apiAddress + '/api/entities/search/page',
            body = {
                query: 
                {
                    term: 
                    [
                        {
                            field: 'pdf150',
                            value: file.filename
                        },
                        {
                            field: 'noPage',
                            value: 1
                        }
                    ]
                }
            },
            options = {
                method: 'post',
                body: JSON.stringify(body),
                headers: { 
                    'Content-Type': 'application/json',
                    'x-access-token' : token
                }
            };

            fetch(url, options)
            .then(response => {
                if(response.status === 200 ) return response.json();
                else reject(new Error('Lecture des données'));
            })
            .then(data => {
                if(data.total === 0) errorFile.push(' ' + file.filename); 
                filesControl.push(data.entities[0]);
                if(i >= files.length) {
                    if(errorFile != 0) reject([new Error(errorFile.length + ' fichier(s) non enregistré(s) :' + errorFile), filesControl]);
                    if(filesControl.length != 0) resolve(filesControl)
                };
                i++;
            })
            .catch(err => reject(err));
        });
    })
};