const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title:	{ type: String,	required: true 	},
  author:	{ type: String,	required: true	},
  url:		{ type: String,	required: true	},
  likes:	{ type: Number,	default: 0	},
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  'toJSON': {
    transform: (doc, rObj) => {
      rObj.id = rObj._id.toString()
      delete rObj._id
      delete rObj.__v
    }
  }
})

module.exports = mongoose.model('Blog', blogSchema)