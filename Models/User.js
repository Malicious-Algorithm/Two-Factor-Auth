const mongoose = require('mongoose');

const user = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        min: 6,
        max: 200
    },
    password:{
        type: String,
        required: true,
        min: 8,
        max: 200
    },
    secret:{
        type: String
    }
});

module.exports = User = mongoose.model('User', user);