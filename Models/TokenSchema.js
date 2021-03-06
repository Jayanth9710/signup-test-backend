import mongoose from'mongoose';
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
    userId: {
        type:Schema.Types.ObjectId,
        required:true,
        ref:"user",
    },
    token: {
        type:String,
        required:true,
    },
    createdAt: {
        type:Date,
        default:Date.now,
        expires:'15m',
    },
});

const tokenSchema = mongoose.model("tokenSchema",TokenSchema);

export default tokenSchema;