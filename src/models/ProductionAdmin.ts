import mongoose, { Document, Schema, model } from "mongoose";

interface UserInterface extends Document {
    productionName: string,
    email: string,
    password: string,
    isBlocked: boolean,
    role: string,
    otpCode: number,
    isVerified: boolean
}

const userSchema = new Schema<UserInterface>({
    productionName: {
        type: String,
        required: true

    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type: String,
        default: 'production'
    },
    otpCode:{
        type: Number,

    },
    isVerified:{
        type:Boolean,
        default:false
    }
})

const productionAdmin = model<UserInterface>('ProductionAdmin', userSchema)

export default productionAdmin;