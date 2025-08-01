import mongoose, { Schema } from "mongoose"
import jwt from "jsonwetoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String, // cloudinary url
        required: true,
    },
    coverImage: {
        type: String,
    },
    watchHistory: [{
        type: Schema.Types.ObjectId,
        ref: "Video"
    }],
    password: {
        type: String,
        required: [true, 'Password i required']
    }

}, { timestamps })

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function() {
    jwt.sign({
            _id: this.id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function() {
    jwt.sign({
            _id: this.id,
        },
        process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}





export const User = mongoose.model("User", userSchema)