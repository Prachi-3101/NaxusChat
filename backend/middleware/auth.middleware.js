import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const protect = async(req,res,next) => {
    let token;
    try {
        if(req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
            //get token
            token = req.headers.authorization.split(" ")[1];

            //verify token
            const decoded = jwt.verify(token,process.env.JWT_SECRET);

            //get user from token
            req.user = await User.findById(decoded.id).select("-password");
            next();
   }else{
    return res.status(401).json({
        message: "No token, authorization denied",
    })
   }} catch (error) {
        return res.status(401).json({
            message: "Token Failed",
        });
    }
};

export default protect;