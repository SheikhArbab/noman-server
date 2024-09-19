import * as MT from 'mongoose';


export interface Document extends MT.Document { }

export interface SignIn {
    email: string,
    password: string
}


export interface SignUp extends SignIn {
    fullName: string,
}


export interface Project extends Document {
    img: string;
    title: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
}


export interface ValidUser {
    _id: MT.ObjectId;
    fullName: string;
    email: string;
    password: string;
    avatar: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
    _doc?: {
        fullName: string;
        email: string;
        password: string;
    }
} 