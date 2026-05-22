import { User } from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";

//*************Registration**************
const registerUser = async(req,res) => {
    try {
        const { name,email,password,picture} = req.body;
        //check empty fields
        if(!name || !email || !password){
            return res.status(400).json({
                message: "Please fill all the fields",
            });
        }
        //check if the user exists
        const userExists = await User.findOne({ email });

        if(userExists){
            return res.status(400).json({
                message: "User already exists",
            })
        }

        //create user
        const user = await User.create({
            name,
            email,
            password,
            picture,
        });
        //response
        if(user){
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else{
            res.status(400).json({
                message: "Failed to create user",
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

//*************Login**************
const authUser = async(req,res) => {
    try {
        const {email,password} = req.body;
        //find user 
        const user = await User.findOne({ email });

        //check password
        if(user && (await user.matchPassword(password))){
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else{
            res.status(401).json({
                message: "Invalid email or password",
            })
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export { registerUser, authUser};