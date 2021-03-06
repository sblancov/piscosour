var nopt = require("nopt");

var knownOpts = {
        "junitReport" : Boolean,
        "help" : Boolean,
        "all" : Boolean,
        "list" : ["all","recipes","straws","shots","repoTypes"],
        "output" : ["verbose","debug","silly"],
        //"version" : Boolean,
        "initShot": [String, null],
        "endShot": [String, null]
    },
    shortHands = {
        "u": ["--junitReport"],
        "i": ["--initShot"],
        "e": ["--endShot"],
        "h" : ["--help"],
        "a" : ["--all"],
        "la" : ["--list","all"],
        "lr" : ["--list","recipes"],
        "lst" : ["--list","straws"],
        "lsh" : ["--list","shots"],
        "lt" : ["--list","repoTypes"],
        "ov" : ["--output","verbose"],
        "od" : ["--output","debug"],
        "os" : ["--output","silly"],
        "v" : ["--version"]
    };

var defaultString = function(knownOpts){
    for (var i in process.argv){
        var option = process.argv[i];
        if (option.indexOf("--")>=0){
            knownOpts[option.replace('--','')] = [String, null];
        }
    }
    return knownOpts;
};

knownOpts = defaultString(knownOpts);
var paramsOpt = nopt(knownOpts, shortHands, process.argv, 2);

var getParams = function(){

    var init = function(){
        var result = {};
        for (var name in paramsOpt){
            if (name!=="argv")
                result[name] = paramsOpt[name];
        }
        return result;
    };

    var params = init();
    var origParams = JSON.parse(JSON.stringify(params));

    var merge = function(orig){
        for (var name in origParams){
            orig[name] = origParams[name];
        }
        return orig;
    };

    var info = function(opt){
        var ev = knownOpts[opt];
        var res = "";
        if( Object.prototype.toString.call( ev ) === '[object Array]' && typeof ev[0] === 'string') {
            res = "( "+ev+" )";
        }

        res += " [";
        for (var short in shortHands){
            if (shortHands[short][0]==="--"+opt){
                res += " -"+short;
            }
        }
        res += "]";
        return res;
    };

    params.knownOpts = knownOpts;
    params.merge = merge;
    params.info = info;
    params.commands = paramsOpt.argv.remain;

    return params;
}

module.exports = getParams();