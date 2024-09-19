import { Document, Types } from 'mongoose';


export type Role = 'admin' | 'storeOwner' | 'user' | 'manager';


export interface Address {
    userId: Types.ObjectId;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

export interface Auth extends Document {
    fullName: string;
    email: string;
    phoneNumber?: string;
    password: string;
    avatar?: string;
    role: Role
    createdAt: Date;
    updatedAt: Date;
    address: Auth['_id'] | null;
}


export interface Project extends Document {
    img: string;
    title: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
}



export interface Brand extends Document {
    title: string;
}

export interface Category extends Document {
    title: string;
    url: string;
    image?: string;
    parent?: Category['_id'] | null;
    children?: Category['_id'][];
    products?: Product['_id'][];
}

export interface Product extends Document {
    title: string;
    image: string[];
    slug: string;
    description: string;
    price: number;
    categories: Types.Array<Category['_id']>;
    brand: string;
    availability: boolean;
    quantity: number;
    color: {
        _id: Types.Array<Color['_id']>;
        quantity: number;
    }[];
    size: {
        size: string;
        quantity: number;
    }[]
    gender: 'male' | 'female' | 'unisex';
    reviews: Types.Array<Review['_id']>;
    sale: Sale | null;
    discount: number;
}

export interface Review extends Document {
    userId: Types.ObjectId;
    rating: number;
    comment: string;
}

export interface Color extends Document {
    name: string;
    hexCode: string;
    products: Product['_id']
}

export interface Sale extends Document {
    startDate: Date;
    endDate: Date;
    discountPercentage: number;
}

export interface Banner extends Document {
    bnr: string[];
    hero: string[];
}

