import express from "express";
const Routes = express();
import {OtpLogin,Login,verifyOtp,resendOtp} from "../controller/authcontroller.js"

Routes.post("/register",OtpLogin);
Routes.post("/login",Login);
Routes.post("/verification",verifyOtp);
Routes.post("/resendOtp",resendOtp);
  

export default Routes;