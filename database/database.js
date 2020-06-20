const mongoose = require('mongoose')
module.exports = mongoose.connect('mongodb://localhost:27017/main', {useNewUrlParser: true, useUnifiedTopology: true});

