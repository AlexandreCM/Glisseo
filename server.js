// {pdf150 : "1971-03-10.pdf"}
const express = require('express');
const bodyParser = require('body-parser');

const upload = require('./lib/upload');
const toJson = require('./lib/toJson');
const auth = require('./lib/auth');
const toMongo = require('./lib/toMongo');
const fromMongo = require('./lib/fromMongo');
const toTiff = require('./lib/toTiff');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ROUTES
// index
app.get('/', (req, res) => {
    res.render('index', {error: null});
    return res.end();
});

// Telechargement d'un ou plisieurs fichiers
app.post('/control', upload.array('file'), (req, res, next) => {
    let files = req.files;
    
    // recuperation fichier(s)
    if (files.length == 0 || !files) {
        let error = new Error('Veuillez choisir un fichier');
        error.httpStatusCode = 400;
        res.render('index', {error: error});
    }
    else {
        
        toJson(files)
        .then((entitiesJson) => auth().then(token => toMongo(token, entitiesJson)))
        .then(token => fromMongo(token, files))
        .then(entities => res.render('control', { error: null, entities: entities }))
        .catch(result => {
            if( result.length == 2 ) res.render('control', { error: result[0], entities: result[1] })
            else res.render('index', { error: result })
        });

        toTiff(files);

        // suppression fichier(s)
        /*files.forEach(file => {
            fs.unlink(file.path, function(err) {
            if (err) throw err;
            console.log('delete');
            });  
        });*/
        
    }
});

app.listen(3001, () => console.log('Express listening on port 3001'));