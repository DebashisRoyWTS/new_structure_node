const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const bools = [true, false];

const UserSchema = new Schema({
  role: { type: Schema.Types.ObjectId, ref: 'Role' },
  first_name: { type: String, default: '' },
  last_name: { type: String, default: '' },
  full_name: { type: String, default: '' },
  email: { type: String, default: '' },
  password: { type: String, default: '' },
  profile_image: { type: String, default: '' },
  isBanned: { type: Boolean, default: false, enum: bools },
  isDeleted: { type: Boolean, default: false, enum: bools },
  isActive: { type: Boolean, default: true, enum: bools },
}, { timestamps: true, versionKey: false });

// generating a hash
UserSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function (password, checkPassword) {
  return bcrypt.compareSync(password, checkPassword);
};

// UserSchema.index({ "geo_loc": "2dsphere" });

// For pagination
UserSchema.plugin(mongooseAggregatePaginate);

// create the model for User and expose it to our app
module.exports = mongoose.model('User', UserSchema);