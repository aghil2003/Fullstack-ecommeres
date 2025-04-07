import express, { Router } from "express";
import dotenv from 'dotenv';
import connectDB from "./configue/db.js";
import cors from 'cors';
import cookieParser from "cookie-parser";
import Routes from "./Route/authRoute.js";
import ProductRoutes from "./Route/productRoute.js"
import OrderRoutes from "./Route/orderRoute.js"




const app=express();
app.use(express.json());  
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser()); 
app.use(cors({
    origin: "http://localhost:5173", 
    methods: "GET,POST,PUT,DELETE", 
    credentials: true
  }));



const PORT=process.env.PORT||5000

app.use('/',Routes)
app.use('/',ProductRoutes)
app.use('/',OrderRoutes)

dotenv.config();
connectDB();
app.listen(PORT,()=>{
    console.log(`the server is runing on port ${PORT} `);
    
})