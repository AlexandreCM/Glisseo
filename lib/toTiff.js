const {execFile} = require('child_process');

let execOptions = {
    encoding: 'utf8',
    maxBuffer: 5000*1024,
    shell: false
};

/**
 * Création d'une miniature du PDF au format TIFF
 * 
 * @param files array
 */
module.exports = (files) => {

    files.forEach(file => {

        // gswin64c -sDEVICE=tiff24nc -r72 -sPageList=1 -sOutputFile="path/to/output/filename.tif" path/input/file.pdf

        let args = [];
        args.push(['-sDEVICE=tiff24nc']);
        args.push(['-r72']);
        args.push(['-sPageList=1']);
        args.push([`-sOutputFile="./files/thumbnails/${file.fieldname}-72-dpi.tif"`]);
        args.push([file.path]);
        // console.log(args);

        execFile('C:\\gs\\gs9.27\\bin\\gswin64c', args, execOptions, (err, stdout, stderr) => {
            if (err) {
                console.error(err);
            }
            else {
                console.log(stdout);
            }
        });

    });
};