const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3
  },
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (doc, rObj) => {
    rObj.id = rObj._id.toString()
    delete rObj._id
    delete rObj.__v
    delete rObj.passwordHash
  }
})

const User = mongoose.model('User', userSchema)
module.exports = User
