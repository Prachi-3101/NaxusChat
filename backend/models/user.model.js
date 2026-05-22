import mongoose,{ model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhwaLDKaK49tsHmdMGOrmTdns5qiw080F2Yw&s"
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
},
{timestamps: true}
);

//hash password before save
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")){
        next();
    }
    //generate salt
    const salt = await bcrypt.genSalt(10);
    //hash password
    this.password = await bcrypt.hash(this.password,salt);
});

    //compare password
    userSchema.methods.matchPassword = async function (enteredPassword) {
        return await bcrypt.compare(enteredPassword,this.password);
    }

 export const User = mongoose.model("User",userSchema);


