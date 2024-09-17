import * as CT from "types/controllers";
import * as AT from "types/models/index";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";


interface ValidUserRes extends Request {
    validUser: CT.ValidUser;
}

// isAuthenticated middleware
export const isAuthenticated = async (req: ValidUserRes, res: Response, next: NextFunction) => {
    const { token } = req.cookies; 
    
    if (!token) {
        return next(new Error("Please login to get access"));
    }

    try {
        const { payload } = jwt.verify(token, process.env.JWT_SECRET_KEY) as { payload: CT.ValidUser };
        req.validUser = payload 
        next();
    } catch (error) {
        return next(new Error("Invalid token. Please login again."));
    }
}

// isAuthorized middleware
export const isAuthorized = (...roles: string[]) => {
    return (req: ValidUserRes, res: Response, next: NextFunction) => {
        if (!roles.includes(req.validUser.role)) {
            return next(new Error(`Role ${req.validUser.role} is not allowed to access this resource`));
        }
        next();
    }
}