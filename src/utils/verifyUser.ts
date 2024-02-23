import { NextFunction,Request,Response } from "express";
import jwt  from "jsonwebtoken";


export const verifyRetailer =async(req:Request, res:Response, next:NextFunction) =>{
    console.log('coming here to verify retailer');
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      return res.sendStatus(401); // If no token, return  401 Unauthorized
    }
  
    try {
      // Decode the token
      const decoded = jwt.decode(token);
      console.log('decoded',decoded); // This will log the decoded payload to the console
  
      // Your logic to block the user goes here
      next()
  
    } catch (err) {
      // Handle the error if the token is not valid
      console.error(err);
      return res.sendStatus(403); // Forbidden
    }
}