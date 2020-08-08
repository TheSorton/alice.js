const mongoose = require('mongoose')
const RemindScheme = new mongoose.Schema({
  userID: { type: String, required: true },
  reminder: { 
    text: String,
    created: String,
    ttr: mongoose.SchemaTypes.Mixed 
  }
})

const RemindModel = module.exports = mongoose.model('reminder', RemindScheme)
