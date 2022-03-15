const mongoose = require('mongoose')

const User = mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        quote: { type: String },
    },
    { collection: 'user-data' },
);

module.exports = mongoose.model('UserData', User);