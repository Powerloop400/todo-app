const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: mongoose.Schema.Types.ObjectId,
    description: {
        type: String,
        required: false
    },
    createAt : {
        type: Date,
        default: Date.now
    },
    lastUpdateAt : {
        type: Date,
        default: Date.now
    },
    state: {
        type: String,
        enum: ['pending', 'completed', 'deleted'],
        default: 'pending'
    },
});

module.exports = mongoose.model('Tasks', TaskSchema);