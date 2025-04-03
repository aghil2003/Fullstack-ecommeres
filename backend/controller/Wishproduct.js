import Favorite from "../model/Favorite.js"

export const getWishlistByUserId = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id,"......");
  
        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }
        
        const wishProduct = await Favorite.find({ userId: id });
        console.log(wishProduct, "....");
        
        const productIds = wishProduct.map(item => item.productId);
        console.log(productIds, "productIds");
        
        const wishlist = await Product.find({ _id: { $in: productIds } });
        console.log("wishlist....", wishlist);
        
        if (!wishlist || wishlist.length === 0) {
            return res.status(404).json({ message: "No wishlist items found" });
        }
        
        res.status(200).json({ products: wishlist });
        
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        res.status(500).json({ message: "Server error fetching wishlist" });
    }
  }
  
  
  
//   export const favorites=async (req, res) => {
//     try {
//         const { userId, productId } = req.body;
  
//         const existingFavorite = await Favorite.findOne({ userId, productId });
//         if (existingFavorite) {
//             return res.status(400).json({ message: "Product already in favorites" });
//         }
  
//         const newFavorite = new Favorite({ userId, productId });
//         await newFavorite.save();
//         res.status(201).json({ message: "Added to favorites" });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error });
//     }
//   }
  
export const favorites = async (req, res) => {
    try {
      const { userId, productId } = req.body; // Ensure you're reading the body properly
      
      if (!userId || !productId) {
        return res.status(400).json({ message: "User ID or Product ID missing" });
      }
  
      const existingFavorite = await Favorite.findOne({ userId, productId });
      if (existingFavorite) {
        return res.status(400).json({ message: "Product already in favorites" });
      }
  
      const newFavorite = new Favorite({ userId, productId });
      await newFavorite.save();
      res.status(201).json({ message: "Added to favorites" });
    } catch (error) {
      console.error(error); // Log the error
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  export const favoritesProduct=async (req, res) => {
    try {
        const { userId } = req.body;
        const { productId } = req.params;
  
        const deletedFavorite = await Favorite.findOneAndDelete({ userId, productId });
  
        if (!deletedFavorite) {
            return res.status(404).json({ message: "Favorite not found" });
        }
  
        res.json({ message: "Removed from favorites" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
  }
  