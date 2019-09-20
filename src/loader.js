var path = require('path');

function pageLoader(page) {
    return require('./src/pages/'+page+'.html');
}

module.exports = pageLoader;