import mongoose from 'mongoose';
const { Schema } = mongoose;

export const mongoSchema = new Schema({
  lastUpdated: Date,
  username: String,
  userID: Number,
  created: Date,
  lastfm: String,
});
