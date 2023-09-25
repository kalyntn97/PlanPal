import mongoose from 'mongoose'

const Schema = mongoose.Schema

const paymentSchema = new Schema({
  name: String,
  paymentForm: String,
})

const profileSchema = new Schema({
  name: String,
  displayName: String,
  avatar: String,
  paymentForm: [paymentSchema],
}, {
  timestamps: true
})

const Profile = mongoose.model('Profile', profileSchema)

export {
  Profile
}
