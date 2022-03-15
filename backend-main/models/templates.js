const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
        id: Number,
        creator: String,
        name: String,
        desc: String,
        img: String
    }, {collection: 'templates'}
);

module.exports = new mongoose.model('Templates', templateSchema);
