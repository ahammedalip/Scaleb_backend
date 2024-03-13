import express, {Express} from 'express';
import http from 'http'; 
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import superAdmin from './routes/superAdmin';
import retailerAdminAuth from './routes/RetailerRoutes/retailerAdminAuthRoute'
import productionAdminAuth from './routes/ProductionRoutes/productionAdminAuthRoute'
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import cors from 'cors'
import session from 'express-session'
import morgan from 'morgan';
import errorHandlerMiddleware from './middleware/errohandlerMiddleware';
import retailerAdmin from './routes/RetailerRoutes/retailerAdmin'
import productionRoute from './routes/ProductionRoutes/productionRoute'
import salesRoute from './routes/SalesRoutes/SalesRoutes'
import conversationRoute from './routes/conversationRoute'
import messageRoute from './routes/messagesRoute'

dotenv.config()
const app: Express = express();
const server = http.createServer(app); 
const mongoURL: string = process.env.MONGO!

app.use(express.json());
app.use(cookieParser())
app.use(morgan('tiny'));
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}))


 

app.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: true,
    })
  );
app.use(errorHandlerMiddleware);
// Example CORS middleware in Express
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); 
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  


mongoose.connect(mongoURL).then(()=>{
    console.log("Connected to mongodb");
}).catch((err)=>{
    console.log('Error in mongoDB', err);
})


server.listen(3000, () => {
    console.log('http://localhost:3000/');
});


app.use('/admin', superAdmin)
app.use('/retailer/auth',retailerAdminAuth)
app.use('/retailer',retailerAdmin)
app.use('/production/auth', productionAdminAuth )
app.use('/production', productionRoute)
app.use('/sales', salesRoute)
app.use('/conversation',conversationRoute)
app.use('/messages', messageRoute)

