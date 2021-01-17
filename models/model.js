var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var demoSchema = new Schema({

    id: {
        type: Number
    },
    string: {
        type: String
    },
    integer: {
        type: Number
    },
    float: {
        type: Number
    },
    date: {
        type: Date
    },
    boolean: {
        type: Boolean
    }
});

exports.Demo = mongoose.model('demo', demoSchema, 'demo');