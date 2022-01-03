import mongoose from'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type:String,
        required:true,
    },
    email: {
        type:String,
        required:true,
    },
    password: {
        type:String,
        required:true,
    },
});

const userSchema = mongoose.model("user",UserSchema);
export default userSchema