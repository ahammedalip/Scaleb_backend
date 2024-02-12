import mongoose,{Document,Schema,model} from "mongoose";

interface UserInterface{
    username: string,
    email: string,
    password: string,
    retailerAdminId: string,
    isBlocked: boolean,
}

const userSchema = new Schema<UserInterface>({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    retailerAdminId: {
        type: String,
        required: true,
    }, 
    isBlocked:{
        type:Boolean,
        default:false
    }
})

const retailerSales = model<UserInterface>('RetailerSales', userSchema);

export default retailerSales;
