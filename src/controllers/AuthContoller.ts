import * as CT from "types/controllers";
import * as U from "../utils/index";
import { errorHandler } from '../middlewares/errorHandler';
import { Request, Response, NextFunction } from "express";
import bcrypt from 'bcrypt';
import Auth from "../models/authSchema";
import jwt from 'jsonwebtoken';




const cookiesOptions = U.getCookiesOptions();



export const signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { fullName, email, password }: CT.SignUp = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Auth({ fullName, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully!', success: true });
    } catch (error) {
        next(error);
    }
};

export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Parsing query parameters
        const search: string = req.query.search ? String(req.query.search) : "";
        const role: string = req.query.role ? String(req.query.role) : "all";
        const page: number = req.query.page ? parseInt(String(req.query.page)) - 1 : 0;
        const limit: number = req.query.limit ? parseInt(String(req.query.limit)) : 50;
        let sort: any = req.query.sort || "_id";

        const sortBy = U.buildSortByObject(sort);

        // Querying database
        const query: { [key: string]: any } = { fullName: { $regex: search, $options: "i" } };
        if (role.toLowerCase() !== "all") {
            query.role = role;
        }
        const users = await Auth.find(query).sort(sortBy).skip(page * limit).limit(limit);

        // Counting total users
        const totalUsers = await Auth.countDocuments(query);
        const pageCount = Math.ceil(totalUsers / limit);

        // Sending response         
        res.status(200).json({ users, totalUsers, page: page + 1, limit, pageCount, success: true });
    } catch (error) {
        next(error);
    }
};



export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const values: CT.ValidUser = req.body;

    try {
        // Check if the user exists
        const existingUser = await Auth.findById(id);
        if (!existingUser) {
            return next(errorHandler('User not found'));
        }

        // Store the previous avatar filename
        const previousAvatar = existingUser.avatar;

        // Check if avatar is provided and upload it
        if (values.avatar) {
            try {
                // Delete previous avatar file if it exists
                if (previousAvatar) {

                    const file = previousAvatar.split('/').slice(-1)[0];


                    await U.deleteFile({ type: "imgs", folder: "users", file })
                }
                // Upload the new image and get the file name
                values.avatar = await U.imageUploading({ image: values.avatar, folder: 'users' });
            } catch (uploadError) {
                return next(errorHandler('Error uploading image'));
            }
        }

        // Hash password if provided
        let hashedPassword;
        if (values.password) {
            hashedPassword = await bcrypt.hash(values.password, 10);
        }

        // Update fields
        const updatedFields: Partial<CT.ValidUser> = {
            fullName: values.fullName,
            email: values.email,
            role: values.role,
            ...(values.avatar && { avatar: values.avatar }), // Add avatar only if provided
            ...(hashedPassword && { password: hashedPassword }), // Add password only if provided
        };

        // Update user
        const updatedUser = await Auth.findByIdAndUpdate(id, updatedFields, { new: true });

        // Send response
        res.status(200).json({ message: 'User updated successfully!', success: true, user: updatedUser });
    } catch (error) {
        next(error);
    }
};


export const byId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    try {
        const user = await Auth.findById(id);

        if (!user) {
            return next(errorHandler('User not found'));
        }

        res.status(200).json({ user, success: true });
    } catch (error) {
        next(error);
    }
};



export const deleteAcc = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    try {
        // Find the user by ID
        const user = await Auth.findById(id);

        if (!user) {
            return next(errorHandler('User not found'));
        }

        // Delete the user's image if it exists
        if (user.avatar) {
            const file = user.avatar.split('/').slice(-1)[0];
            await U.deleteFile({ type: "imgs", folder: "users", file });
        }

        // Delete the user
        const deletedUser = await Auth.deleteOne({ _id: id });

        if (deletedUser.deletedCount === 0) {
            return next(errorHandler('User not found'));
        }

        res.status(200).json({ message: 'User deleted successfully!', success: true });
    } catch (error) {
        next(error);
    }
};




export const signIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password }: CT.SignIn = req.body;

    try {
        const validUser: CT.ValidUser = await Auth.findOne({ email });

        if (!validUser) {
            return next(errorHandler('User not found'));
        }

        const validPassword = await bcrypt.compare(password, validUser.password);

        if (!validPassword) {
            return next(errorHandler({ message: 'Wrong credentials!' }));
        }

        // Generate JWT token
        const token = jwt.sign({ id: validUser._id, exp: U.expirationDate.getTime() / 1000, payload: validUser }, process.env.JWT_SECRET_KEY);

        // Omit password from the user object before sending it back
        const { password: _, ...rest } = validUser._doc;

        // Set token cookie in the response
        res.cookie('token', token, cookiesOptions).status(200)
            .json({ rest, token, message: "Login Successfully !", success: true });
    } catch (error) {
        next(error);
    }
};
