const mongoose = require('mongoose')
const MessageScheme = new mongoose.Schema({
  messageID: { type: String, required: true },
  emojiRoleMap: { type: mongoose.SchemaTypes.Mixed }
})

const MessageModel = module.exports = mongoose.model('message', MessageScheme)
