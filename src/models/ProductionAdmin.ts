import mongoose, { Document, Schema, model } from "mongoose";

interface UserInterface extends Document {
    productionName: string,
    email: string,
    password: string,
    isBlocked: boolean,
    role: string,
    otpCode: number,
    isVerified: boolean,
    description: string,
    availableItems: string[],
    requestedRetailer: mongoose.Schema.Types.ObjectId[],
    connectedRetailer: mongoose.Schema.Types.ObjectId[],
    recievedRetailer : mongoose.Schema.Types.ObjectId[],
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
    role: {
        type: String,
        default: 'production'
    },
    otpCode: {
        type: Number,

    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    description: {
        type: String
    },
    availableItems: {
        type: [String]
    },
    connectedRetailer: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RetailerAdmin'
    }],
    requestedRetailer: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RetailerAdmin'
    }],
    recievedRetailer:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RetailerAdmin'
    }]

})

const productionAdmin = model<UserInterface>('ProductionAdmin', userSchema)

export default productionAdmin;