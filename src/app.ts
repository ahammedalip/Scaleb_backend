import express, {Express} from 'express';
import http from 'http'; 
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import superAdmin from './routes/superAdmin';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import cors from 'cors'
import errorHandlerMiddleware from './middleware/errohandlerMiddleware';

dotenv.config()
const app: Express = express();
const server = http.createServer(app); 
const mongoURL: string = process.env.MONGO!

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: '*', 
    credentials: true
}))
// const io = new Server(server); 

// app.get('/', (req, res) => {
//     res.send('welcome to home');
// });

app.use(errorHandlerMiddleware);
// Example CORS middleware in Express
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // Replace with your frontend URL
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
//   });
  


mongoose.connect(mongoURL).then(()=>{
    console.log("Connected to mongodb");
}).catch((err)=>{
    console.log('Error in mongoDB', err);
})

// io.on('connection', (socket) => {
//     console.log('A user connected');
    
//   socket.on('disconnect', () => {
//         console.log('User disconnected');
//     });
// });


server.listen(3000, () => {
    console.log('http://localhost:3000/');
});


app.use('/admin', superAdmin)


