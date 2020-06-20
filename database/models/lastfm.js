const mongoose = require('mongoose')
const lastFMSchema = new mongoose.Schema({
    userID: { type: String, required: true },
    username: { type: String, required: true }
})

const lastFMModel = module.exports = mongoose.model('lastfm', lastFMSchema)