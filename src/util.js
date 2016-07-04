var Buffer = require('buffer').Buffer;

var util = {
    typeName: function typeName(type) {
        if (Object.prototype.hasOwnProperty.call(type, 'name')) return type.name;
        var str = type.toString();
        var match = str.match(/^\s*function (.+)\(/);
        return match ? match[1] : str;
    },
    isBrowser: function isBrowser() { return process && process.browser; },
    isNode: function isNode() { return !util.isBrowser(); },
    nodeRequire: function nodeRequire(module) {
        if (util.isNode()) return require(module);
    },
    Buffer: Buffer,
    isType: function isType(obj, type) {
        if (typeof type === 'function') type = util.typeName(type);
        return Object.prototype.toString.call(obj) === '[object ' + type + ']';
    },
}

module.exports = util