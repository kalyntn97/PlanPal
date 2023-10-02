import mongoose from 'mongoose'

const Schema = mongoose.Schema

const hashtagSchema = new Schema({
  content: String,
}, {
  timestamps: true
})

const profileSchema = new Schema({
  name: String,
  displayName: String,
  avatar: String,
  zelleId: String,
  venmoId: String,
  paypalId: String,
  hashtags: [hashtagSchema],
  friends: [{type: Schema.Types.ObjectId, ref: 'Profile'}],
  friendRequests: [{type: Schema.Types.ObjectId, ref: 'Profile'}],
}, {
  timestamps: true
})

const Profile = mongoose.model('Profile', profileSchema)

export {
  Profile
}
