// (C) daiz
// $ node setup.js works.csv > 0/works.js

var fs = require('fs');
var readline = require('readline');

var getTemplate = function () {
    return {
        'title'      : '',
        'product_uri': '?',
        'about_uri'  : '?',
        'labels'     : [],
        'icon_uri'   : '',
        'short_text' : '',
        'languages'  : [],
        'products'   : []
    }
};
var works = {};

var file = fs.ReadStream(process.argv[2]);
var rl = readline.createInterface({
    'input': file,
    'output': {}
});

var strs = [];

rl.on('line', function (line) {
    var row = line.trim();
    strs.push(row);
}).on('close', function () {
    strs.forEach(function (str, j) {
        if (str !== '') {
            var id = 'work' + (j+1);
            var work = getTemplate();
            // カンマで区切る
            var data = str.split(',');
            data.forEach(function (word, p) {
                word = word.trim();
                if (p === 0) {
                    work.title = word;
                }else if (p === 1) {
                    work.product_uri = word;
                }else if (p === 2) {
                    work.about_uri = word;
                }else if (word[0] === '#') {
                    work.labels.push(word.substring(1, word.length));
                }else if (word[0] === '!') {
                    work.icon_uri = word.substring(1, word.length);
                }else if (word[0] === '>') {
                    work.short_text = word.substring(1, word.length);
                }else if (word[0] === '@') {
                    work.languages.push(word.substring(1, word.length));
                }else if (word[0] === '+') {
                    work.products.push(word.substring(1, word.length));
                }
            });
            works[id] = work;
        }
    });
    console.log('var works = ' + JSON.stringify(works, null, '    '));
});

rl.resume();
