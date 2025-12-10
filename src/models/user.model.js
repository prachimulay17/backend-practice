import mongoose,{Schema} from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
   
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, 

    {timestamps:true}

);

const user = mongoose.model("User", userSchema);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))return next();

    this.password = await bcrypt.hash(this.password, 10);
    next()
    });

    userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
    };


user.generateAccessToken = function() {
   return jwt.sign(
    {id: this._id,
     username: this.username,
     username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn: process.env.ACCESS_TOKEN_EXPIRY},
)
};

export default user;