import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import User from "../model/User.js"
import Otp from "../model/Otp.js"

dotenv.config();

// Nodemailer Transporter Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
  tls: { rejectUnauthorized: false },
});

// Function to Send OTP via Email
const sendOtp = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `ChatApp <${process.env.EMAIL}>`,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP Code is: ${otp}`,
    });
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP. Try again.");
  }
};

// OTP Login Function
// export const OtpLogin = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     console.log(password);
    

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }
    
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       isVerified: false,
//     });
    
//     const otp = crypto.randomInt(1000, 9999).toString();
//     console.log("Generated OTP:", otp);

//     await Otp.deleteOne({ userId: user._id });

//     await Otp.create({
//       userId: user._id,
//       otp,
//       expiresAt: Date.now() + 60 * 1000, 
//     });


//     const token = jwt.sign(
//       { id: user._id, username: user.name, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "3d" }
//     );
//     console.log(token,"rftyuijnm");

//     await sendOtp(email, otp);

   
//     return res.status(201).json({ message: "User registered successfully. OTP sent to email.",token });
//   } catch (error) {
//     console.error("Error registering user:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

export const OtpLogin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists. Please log in." });
    }

    // Hash password and create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    // Generate OTP
    const otp = crypto.randomInt(1000, 9999).toString();
    console.log("Generated OTP:", otp);

    // Remove existing OTPs for the user (if any)
    await Otp.deleteOne({ userId: user._id });

    // Save new OTP with expiry
    await Otp.create({
      userId: user._id,
      otp,
      expiresAt: Date.now() + 60 * 1000, // 1 minute expiry
    });

    // Generate token
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role:user.role },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    // Send OTP via email
    await sendOtp(email, otp);

    return res.status(201).json({ message: "OTP sent to email. Verify to continue.", token });

  } catch (error) {
    console.error("Error during OTP login:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



export const Login=async(req,res)=>{
  try {
      const{email,password}=req.body;
      console.log(email,password);
      
      if(!email||!password){
          return res.status(400).json({ message: "All fields are required" });
      }

      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const token = jwt.sign(
        { id: existingUser._id, name:existingUser.name, email: existingUser.email, role:existingUser.role },
        process.env.JWT_SECRET,
        { expiresIn: "3d" }
      );
      console.log(token,"rftyuijnm");
  

      res.status(200).json({ message: "User logged in successfully",token});

  } catch (error) {
      
  }
  
} 





// export const verifyOtp = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     console.log("Received verification request:", { email, otp });

//     if (!email || !otp) {
//       return res.status(400).json({ message: "Email and OTP are required" });
//     }

//     const user = await User.findOne({ email });
//     console.log(user,"dfghui");
    
//     const userdetial = await Otp.findOne({ userId: user._id });
//     console.log(userdetial,"rtyghjk");
    
//     if (!userdetial) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (userdetial.otp !== otp) {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }
//     userdetial.isVerified = true;
//     await userdetial.save();  
//     const token = jwt.sign(
//       { id: user._id, username: user.name, email: user.email, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "3d" }
//     );
//     await Otp.findByIdAndUpdate(user._id, { $unset: { otp: 1 } }, { new: true });
//     res.status(200).json({ success: "OTP verified successfully", token });

//   } catch (error) {
//     console.error("Error verifying OTP:", error);
//     res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// };


export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    console.log("Received verification request:", { email, otp });

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch OTP from the database
    const userOtp = await Otp.findOne({ userId: user._id });
    if (!userOtp) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    // Check if OTP is expired
    if (userOtp.expiresAt < Date.now()) {
      await Otp.deleteOne({ userId: user._id }); // Remove expired OTP
      return res.status(400).json({ message: "OTP expired. Please request a new one." });
    }

    // Validate OTP
    if (userOtp.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark user as verified
    user.isVerified = true;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    // Remove OTP entry after successful verification
    await Otp.deleteOne({ userId: user._id });

    res.status(200).json({ success: "OTP verified successfully", token });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};



// export const resendOtp = async (req, res) => {
//   try {
//     // Extract token from Authorization header
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "Unauthorized. Token missing." });
//     }
    
//     // Extract token from Bearer string
//     const token = authHeader.split(" ")[1];

//     // Decode token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = decoded.id; // Extract user ID

//     // Check if user exists
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Delete any existing OTP for this user
//     await Otp.deleteOne({ userId: user._id });

//     // Generate a new OTP
//     const newOtp = crypto.randomInt(1000, 9999).toString();
//     console.log("Resent OTP:", newOtp);

//     // Save new OTP with a 1-minute expiration time
//     await Otp.create({
//       userId: user._id,
//       otp: newOtp,
//       expiresAt: Date.now() + 60 * 1000, // OTP expires in 1 minute
//     });

//     // Send OTP to user's email
//     try {
//       await sendOtp(user.email, newOtp);
//     } catch (emailError) {
//       console.error("Failed to send OTP:", emailError);
//       return res.status(500).json({ message: "Failed to send OTP. Please try again." });
//     }

//     return res.status(200).json({ message: "OTP resent successfully." });

//   } catch (error) {
//     console.error("Error resending OTP:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// export const resendOtp = async (req, res) => {
//   try {
//     // Extract token from Authorization header
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "Unauthorized. Token missing." });
//     }

//     // Decode token
//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = decoded.id; // Extract user ID

//     // Check if user exists
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Prevent OTP resend if user is already verified
//     if (user.isVerified) {
//       return res.status(400).json({ message: "User already verified. No OTP needed." });
//     }

//     // Delete any existing OTP for this user
//     await Otp.deleteOne({ userId: user._id });

//     // Generate new OTP
//     const newOtp = crypto.randomInt(1000, 9999).toString();
//     console.log("Resent OTP:", newOtp);

//     // Save new OTP with a 1-minute expiration time
//     await Otp.create({
//       userId: user._id,
//       otp: newOtp,
//       expiresAt: Date.now() + 60 * 1000, // OTP expires in 1 minute
//     });

//     // Send OTP to user's email
//     await sendOtp(user.email, newOtp);

//     return res.status(200).json({ message: "OTP resent successfully." });

//   } catch (error) {
//     console.error("Error resending OTP:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };



export const resendOtp = async (req, res) => {
  try {
    // Extract token from cookies
    const token = req.cookies.token; 

    if (!token) {
      return res.status(401).json({ message: "Unauthorized. Token missing." });
    }

    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; // Extract user ID

    // Check if user exists
    const user = await User.findById(userId);
    console.log(user,"user test.......!");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent OTP resend if user is already verified
    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified. No OTP needed." });
    }

    // Delete any existing OTP for this user
    await Otp.deleteOne({ userId: user._id });

    // Generate new OTP
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
    console.log("Resent OTP:", newOtp);

    // Save new OTP with a 1-minute expiration time
    await Otp.create({
      userId: user._id,
      otp: newOtp,
      expiresAt: Date.now() + 60 * 1000, // OTP expires in 1 minute
    });

    // Send OTP to user's email
    await sendOtp(user.email, newOtp);

    return res.status(200).json({ success: true, message: "OTP resent successfully." });

  } catch (error) {
    console.error("Error resending OTP:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
