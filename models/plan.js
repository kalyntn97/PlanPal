import mongoose from 'mongoose'

const Schema = mongoose.Schema

const commentSchema = new Schema({
  content: String,
  author: {type: Schema.Types.ObjectId, ref: 'Profile'}
})

const planSchema = new Schema({
  name: String,
  date: Date,
  creator: {type: Schema.Types.ObjectId, ref: 'Profile'},
  members: [{type: Schema.Types.ObjectId, ref: 'Profile'}],
  notes: String,
  tasks: [{type: Schema.Types.ObjectId, ref: 'Task'}],
  comments: [commentSchema],
  isPublicForEveryone: {type: Boolean, default: false},
  isPublicForFriends: {type: Boolean, default: false},
}, {
  timestamps: true
})

const Plan = mongoose.model('Plan', planSchema)

export {
  Plan
}