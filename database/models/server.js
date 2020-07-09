const mongoose = require('mongoose')
const MessageScheme = new mongoose.Schema({
    guildID: { type: String, required: true },
    config: { 
        logChan: String,
        welChan: String,
        muteRole: String 
    }
})

const ConfigModel = module.exports = mongoose.model('config', MessageScheme)