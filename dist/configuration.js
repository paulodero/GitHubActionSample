"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core = require("@actions/core");
var ConfigKey;
(function (ConfigKey) {
    ConfigKey["GITHUB_WORKSPACE"] = "GITHUB_WORKSPACE";
    ConfigKey["SCHEMA"] = "SCHEMA";
    ConfigKey["JSONS"] = "JSONS";
})(ConfigKey = exports.ConfigKey || (exports.ConfigKey = {}));
exports.configMapping = [
    {
        key: ConfigKey.GITHUB_WORKSPACE,
        setup: 'ENV',
    },
    { key: ConfigKey.SCHEMA, setup: 'INPUT' },
    { key: ConfigKey.JSONS, setup: 'INPUT' },
];
function getConfig() {
    var config = {};
    exports.configMapping.forEach(function (i) {
        var value;
        switch (i.setup) {
            case 'ENV':
                value = process.env[ConfigKey[i.key]];
                break;
            case 'INPUT':
                value = core.getInput(ConfigKey[i.key]);
                break;
            default:
                value = '';
                break;
        }
        core.debug(ConfigKey[i.key] + ": " + value);
        config[ConfigKey[i.key]] = value;
    });
    return config;
}
exports.getConfig = getConfig;
function verifyConfigValues(config) {
    var errors = [];
    Object.keys(config).forEach(function (key) {
        if (config[key] === '') {
            var mapping = exports.configMapping.find(function (i) { return i.key === key; });
            errors.push("Missing " + key + " " + (mapping.setup === 'ENV' ? 'environment variable' : mapping.setup.toLowerCase()));
        }
    });
    return errors.length > 0 ? errors : undefined;
}
exports.verifyConfigValues = verifyConfigValues;
//# sourceMappingURL=configuration.js.map