const PDFJS = require('./pdfjs/build/pdf');

// source : https://www.npmjs.com/package/pdf-parse 
function render_page(pageData) {
    //check documents https://mozilla.github.io/pdf.js/
    let render_options = {
        //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
        normalizeWhitespace: false,
        //do not attempt to combine same line TextItem's. The default value is `false`.
        disableCombineTextItems: false
    }
 
    return pageData.getTextContent(render_options)
    .then(function(textContent) {
        let text = '';
        for (let item of textContent.items) {
            text += item.str;
        };
        return text.replace(/\\/g, '').replace(/"/g, '\\"');
    });
}

async function PDF(dataBuffer) {
    let ret = {
        nombrePage: 0,
        info: null,
        metadata: null,
        content: [],
        version: null
    };

    ret.version = PDFJS.version;

    // Disable workers to avoid yet another cross-origin issue (workers need
    // the URL of the script to be loaded, and dynamically loading a cross-origin
    // script does not work).
    PDFJS.disableWorker = true;
    let doc = await PDFJS.getDocument(dataBuffer);
    ret.nombrePage = doc.numPages;

    let metaData = await doc.getMetadata().catch((err) => {
        return null;
    });

    ret.info = metaData ? metaData.info : null;
    ret.metadata = metaData ? metaData.metadata : null;

    for (var i = 1; i <= doc.numPages; i++) {
        let pageText = await doc.getPage(i).then(pageData => render_page(pageData)).catch((err)=>{
            // todo log err using debug
            debugger;
            return "";
        });

        element  = {};
        element.noPage = i;
        element.text = pageText;
        ret.content.push(element);
    }

    doc.destroy();

    return ret;
}

module.exports = PDF;