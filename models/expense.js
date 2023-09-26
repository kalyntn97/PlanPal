import mongoose from 'mongoose'

const Schema = mongoose.Schema

const expenseSchema = new Schema({
  name: String,
  date: Date,
  occasion: String,
  creator: {type: Schema.Types.ObjectId, ref: 'Profile'},
  cost: Number,
  notes: String,
}, {
  timestamps: true
})

const Expense = mongoose.model('Expense', expenseSchema)

export {
  Expense
}