const mongoose = require('mongoose');

const memeSchema = new mongoose.Schema({
        id: Number,
        creator: String,
        name: String,
        desc: String,
        img: String,
        comments: [{
            comment: {type: String}
        }],
        upvotes: {
            type: Number,
            default: 0
        },
        downvotes: {
            type: Number,
            default: 0
        },
        memetexts: String,
        template_id: Number
    }, {collection: 'memes'}
);

module.exports = new mongoose.model('Memes', memeSchema);
