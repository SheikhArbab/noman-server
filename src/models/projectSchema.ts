import mongoose, { Schema } from 'mongoose';
import * as T from "../types/models/index"



const ProjectSchema = new Schema<T.Project>({

    img: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
        unique: true,
    },
    url: {
        type: String,
        required: true,
        unique: true,
    },


},
    { timestamps: true }
);

const Project = mongoose.model<T.Project>('Project', ProjectSchema);

export default Project; 