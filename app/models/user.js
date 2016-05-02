// models/user.js

const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
    username: { type: String, unique: true },
	email: { type: String, unique: true },
  	password: String,
  	avatar: String
});

userSchema.methods.generateHash = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

userSchema.methods.comparePassword = (password) => {
	return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model('User', userSchema);
