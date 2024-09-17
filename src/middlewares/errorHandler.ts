import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, req?: Request, res?: Response, next?: NextFunction) => {
    let error: any = { ...err };
    error.message = err.message;

    // Handling Mongoose Validation Error
    if (err.name === 'ValidationError') {
        const message = Object.values(err?.errors).map((value: any) => value.message).join(", ");
        error = Error(message);
        res.status(400); // Bad Request
    }

    // Handling Mongoose duplicate key errors
    else if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        error = Error(message);
        res.status(400); // Bad Request
    }

    // Wrong Mongoose Object ID Error
    else if (err.name === 'CastError') {
        const message = `Resource not found. Invalid: ${err.path}`;
        error = Error(message);
        res.status(404); // Not Found
    }

    else if (err.name === 'JsonWebTokenError') {
        const message = 'JSON Web Token is invalid, Try again';
        error = Error(message);
        res.status(401); // Unauthorized
    }

    else if (err.name === 'TokenExpiredError') {
        const message = 'JSON Web Token is Expired, Try again';
        error = Error(message);
        res.status(401); // Unauthorized
    }

    else {

        err.message = null

    }

    res.json({
        success: false,
        message: error.message,
    }).status(500);

};
