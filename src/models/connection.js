const mongoose = require('mongoose')

const connectionSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: {
            values: [ 'accepted', 'interested', 'ignored', 'rejected'],
            message: '{VALUE} is not supported'
        },
    }
}, {timestamps: true})

connectionSchema.index({ senderId: 1, receiverId: 1 });

connectionSchema.pre('save', async function(next){  // pre-save hook to check if sender and receiver are the same
    if(this.senderId.toString() === this.receiverId.toString()){
        throw new Error('Sender and receiver cannot be the same');
    }
    next();
}) 

const ConnectionModel = mongoose.model('Connection', connectionSchema)

module.exports = ConnectionModel