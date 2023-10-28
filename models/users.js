const moogoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserModel = new moogoose.Schema({
    username: String,
    password: String
})


UserModel.plugin(passportLocalMongoose)

module.exports = moogoose.model('users', UserModel)