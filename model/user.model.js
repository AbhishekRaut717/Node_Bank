var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');


var UserSchema = mongoose.Schema({

	local: {
		email: String,
		password: String,
		},
	google: {
		name: String,
		email: String,
		token: String,
		id: String,
  },
  details :
		[{ac_no: String, ac_type: String, branch_id: String, balance: Number, fname: String, lname: String }]

});


UserSchema.methods.generateHash = function(password)
{
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

UserSchema.methods.validatePassword = function(password)
{
	return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model('User', UserSchema);
