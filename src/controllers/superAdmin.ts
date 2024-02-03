import superAdmin from "../models/superAdmin";
import { NextFunction, Request, Response } from 'express';
import { errorhandler } from "../utils/errorhandler";
import jwt from 'jsonwebtoken'

interface SuperAdmin {
    username: string;
    password: string;
  
  }

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const {username, password:reqPassword} = req.body;
    
    
    try{
        const validUser = await superAdmin.findOne({username})
        console.log('user found', validUser)
      

         if (!validUser) {
            // If user is not found, call the error handler and pass the error to next
            const error = errorhandler(401, "User not found");
            return res.status(error.StatusCode).json({ success: false, message: error.message });
        }
        if(validUser && validUser.password && validUser.password!== reqPassword){
            const error = errorhandler(401, "Wrong credentials");
            return res.status(error.StatusCode).json({ success: false, message: error.message });
        }
        validUser.password="";
console.log(validUser);

        const token = jwt.sign({ id: validUser._id.toString() }, process.env.JWT_SECRET || '', { expiresIn: '1h' });

        const expiry: Date = new Date(Date.now() + 3600000)
        res.cookie('access_token', token, { httpOnly: true, expires: expiry, secure: false }).status(200).json({user:validUser,token});
       


    }
    catch(err){
        console.log('Error at superAdmin signup',err);

        const error = errorhandler(500, "Internal Server Error");
        res.status(error.StatusCode).json({ success: false, message: error.message });
    }
}