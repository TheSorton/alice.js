const mongoose = require('mongoose')
const MessageScheme = new mongoose.Schema({
    guildID: { type: String, required: true },
    config: { type: mongoose.SchemaTypes.Mixed }
})

const ConfigModel = module.exports = mongoose.model('config', MessageScheme)