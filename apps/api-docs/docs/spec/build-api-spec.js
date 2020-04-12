const DIR_SPEC = './spec';
const DIR_BUILD = './build';

var JsonRefs = require('json-refs');
var PathLoader = require('path-loader');
var YAML = require('js-yaml');
var fs = require('fs');
var root = YAML.load(fs.readFileSync(DIR_SPEC + '/api-docs.yaml').toString());
var options = {
    loaderOptions: {
        processContent: function(res, callback) {
            callback(YAML.safeLoad(res.text));
        }
    },
    location: DIR_SPEC + '/api-docs.yaml'
};
JsonRefs.resolveRefs(root, options).then(function(results) {
    if (!fs.existsSync(DIR_BUILD)) {
        fs.mkdirSync(DIR_BUILD);
    }
    fs.writeFileSync(DIR_BUILD + '/api-docs-output.yaml', YAML.dump(results.resolved), function(err) {
        if (err) {
            return console.log(err);
        }
        console.log('Specification compiled successfully.');
    });
}, function(err) {
    console.log(err);
});
