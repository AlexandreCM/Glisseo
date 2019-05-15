const fs = require('fs');
const PDF = require('./extractPdf');

/**
 * Extraction et mise en forme d'une variable pour le body de l'API
 * 
 * @param files array
 * @returns entitiesJson
 */
module.exports = (files) => {
    return new Promise(function (resolve, reject) {
        console.log('toJson')
        var entities = [];
        let i = 1;
        files.forEach(file => {
        
            let dataBuffer = fs.readFileSync(file.path);
            PDF(dataBuffer)
            .then(data => { 
                console.log(file.filename + ' => ' + data.nombrePage + ' pages.');

                // pour chaque page, recuperation des donnees
                data.content.forEach(element => {

                    entity = {
                        ocr: element.text,
                        noPage: element.noPage,
                        pdf150:  file.filename,
                        thumbnail:  file.fieldname + '-min-72.tif',
                        nombrePage: data.nombrePage
                    };
                    
                    entities.push(entity);
                });
                console.log('fichier terminé');
                // Une fois tous les documents parcourus, résolution de la promesse
                if(i >= files.length) {
                    var entitiesJson = { entities: entities };
                    resolve(JSON.stringify(entitiesJson));
                    // var entitiesJson = '{ "entities": [' + entities + ']}';
                    // resolve(entitiesJson);
                };
                i++;
            })
            .catch(err => reject(new Error('Traitement fichier')));
        });
    });
};