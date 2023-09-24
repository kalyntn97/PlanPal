import mongoose from 'mongoose'

const Schema = mongoose.Schema

const commentSchema = new Schema({
  content: String,
  author: {type: Schema.Types.ObjectId, ref: 'Profile'}
})

const taskSchema = new Schema({
  name: String,
  date: Date,
  creator: {type: Schema.Types.ObjectId, ref: 'Profile'},
  notes: String,
  status: String,
  comments: [commentSchema],
}, {
  timestamps: true
})

const Task = mongoose.model('Task', taskSchema)

export {
  Task
}