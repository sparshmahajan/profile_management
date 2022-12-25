const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const mongoURL = process.env.MONGODB_URL || 'mongodb://localhost:27017/socialMediaDB';

mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to db.");
    }
});

const db = mongoose.connection;
module.exports = db;