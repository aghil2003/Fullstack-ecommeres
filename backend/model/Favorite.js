import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",  
        required: true, 
        trim: true 
    },
    productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product", 
        required: true, 
        trim: true 
    },
}, { timestamps: true });

const Favorite = mongoose.model("Favorite", FavoriteSchema);
export default Favorite;
