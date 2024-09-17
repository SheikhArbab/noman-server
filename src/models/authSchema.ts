import mongoose, { Schema } from 'mongoose';
import * as T from "../types/models/index"



const AuthSchema = new Schema<T.Auth>({

    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: `https://res.cloudinary.com/db0hmrjqj/image/upload/v1713034236/al-quddus/imgs/users/default.jpg`
    },
    role: {
        type: String,
        default: 'user',
        enum: ["admin", "user"]
    },


},
    { timestamps: true }
);

const Auth = mongoose.model<T.Auth>('Auth', AuthSchema);

export default Auth; 