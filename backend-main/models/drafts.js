const mongoose = require('mongoose');

const draftSchema = new mongoose.Schema({
        id: Number,
        creator: String,
        name: String,
        desc: String,
        img: String,
        memetexts: String,
        template_id: Number
    }, {collection: 'drafts'}
);

module.exports = new mongoose.model('Drafts', draftSchema);
