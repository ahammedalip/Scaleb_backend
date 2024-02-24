import { NextFunction,Request,Response } from "express";
import jwt, { JwtPayload }  from "jsonwebtoken";
import jwtDecode from 'jsonwebtoken'




export const verifyRetailer =async(req:Request, res:Response, next:NextFunction) =>{
    console.log('coming here to verify retailer admin');
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      return res.sendStatus(401); // If no token, return  401 Unauthorized
    }

  
    try {
     
      const decoded:any  = jwt.decode(token);
      console.log('decoded token from retailer is->',decoded); // This will log the decoded payload to the console
  
      if(decoded?.role !== 'retailerAdmin'){
        res.status(401).json({success:false, message:'Unauthorized user'})
      }
      next()
      
    } catch (err) {
      
      console.error(err);
      return res.sendStatus(403); // Forbidden
    }
}

export const verifyAdmin = async (req:Request, res:Response, next: NextFunction)=>{

  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.sendStatus(401); // If no token, return  401 Unauthorized
  }

  try {
    
    const decoded:any= jwt.decode(token)
    console.log('decoded token from verify admin',decoded); // This will log the decoded payload to the console
    if(decoded?.role !=='SuperAdmin'){
      res.status(401).json({success:false, message:'Unauthorized user'})
    }
    
    return next()

  } catch (err) {
    // Handle the error if the token is not valid
    console.error(err);
    return res.sendStatus(403); // Forbidden
  }

}