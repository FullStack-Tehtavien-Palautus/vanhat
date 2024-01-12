const PORT = process.env.PORT || 3003

const TESTING = (process.env.NODE_ENV === 'test')

const MONGODB_URI = TESTING
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI 

module.exports = {
  MONGODB_URI,
  PORT,
  TESTING
}