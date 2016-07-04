import util from './util'
import Stream from 'stream'

function typeOf(data) {
    if (data === null && typeof data === 'object') {
        return 'null';
    } else if (data !== undefined && isBinary(data)) {
        return 'Binary';
    } else if (data !== undefined && data.constructor) {
        return util.typeName(data.constructor);
    } else {
        return 'undefined';
    }
}

function isBinary(data) {
    var types = [
    'Buffer', 'File', 'Blob', 'ArrayBuffer', 'DataView',
    'Int8Array', 'Uint8Array', 'Uint8ClampedArray',
    'Int16Array', 'Uint16Array', 'Int32Array', 'Uint32Array',
    'Float32Array', 'Float64Array'
    ];
    if (util.isNode()) {
        if (util.Buffer.isBuffer(data) || data instanceof Stream.Stream)
            return true;
    } else {
        for (var i = 0; i < types.length; i++) {
            if (data !== undefined && data.constructor) {
                if (util.isType(data, types[i])) return true;
                if (util.typeName(data.constructor) === types[i]) return true;
            }
        }
    }
    return false;
}


function convertInput(data) {
    if (typeOf(data) === 'Object') {
        var map = {M: {}};
        for (var key in data) {
            map['M'][key] = convertInput(data[key]);
        }
        return map;
    } else if (typeOf(data) === 'Array') {
        var list = {L: []};
        for (var i = 0; i < data.length; i++) {
            list['L'].push(convertInput(data[i]));
        }
        return list;
    } else if (typeOf(data) === 'Set') {
        return formatSet(data);
    } else if (typeOf(data) === 'String') {
        return { 'S': data };
    } else if (typeOf(data) === 'Number') {
        return { 'N': data.toString() };
    } else if (typeOf(data) === 'Binary') {
        return { 'B': data };
    } else if (typeOf(data) === 'Boolean') {
        return {'BOOL': data};
    } else if (typeOf(data) === 'null') {
        return {'NULL': true};
    }
}

function formatSet(data) {
    var map = {};
    switch (data.type) {
        case 'String': map['SS'] = data.values; break;
        case 'Binary': map['BS'] = data.values; break;
        case 'Number': map['NS'] = data.values.map(function (value) {
            return value.toString();
        });
    }
    return map;
}

function convertOutput(data) {
    var list, map, i;
    for (var type in data) {
        var values = data[type];
        if (type === 'M') {
            map = {};
            for (var key in values) {
                map[key] = convertOutput(values[key]);
            }
            return map;
        } else if (type === 'L') {
            list = [];
            for (i = 0; i < values.length; i++) {
                list.push(convertOutput(values[i]));
            }
            return list;
        } else if (type === 'SS') {
            list = [];
            for (i = 0; i < values.length; i++) {
                list.push(values[i] + '');
            }
            return new DynamoDBSet(list);
        } else if (type === 'NS') {
            list = [];
            for (i = 0; i < values.length; i++) {
                list.push(Number(values[i]));
            }
            return new DynamoDBSet(list);
        } else if (type === 'BS') {
            list = [];
            for (i = 0; i < values.length; i++) {
                list.push(new util.Buffer(values[i]));
            }
            return new DynamoDBSet(list);
        } else if (type === 'S') {
            return values + '';
        } else if (type === 'N') {
            return Number(values);
        } else if (type === 'B') {
            return new util.Buffer(values);
        } else if (type === 'BOOL') {
            return (values === 'true' || values === 'TRUE' || values === true);
        } else if (type === 'NULL') {
            return null;
        }
    }
}

module.exports = {
    input: convertInput,
    output: convertOutput
};