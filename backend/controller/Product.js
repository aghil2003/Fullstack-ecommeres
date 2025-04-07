import Favorite from "../model/Favorite.js"
import Product from "../model/Product.js"
import Cart from "../model/Cart.js"
import User from "../model/User.js"
import Address from "../model/Address.js";
import mongoose from "mongoose";

export const addProduct = async (req, res) => {
  try {
    const { name, price, description,category } = req.body;
    const productImage = req.file ? req.file.location : null; 
    console.log(productImage);
    

    if (!name || !price || !description || !category || !productImage) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = new Product({
      name,
      productImage,
      price,
      description,
      category,
    });

    await newProduct.save();

    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// export const getproduct = async (req, res) => {
//   try {
//     const { userId } = req.query;

//     if (!userId) {
//       return res.status(400).json({ message: "User ID is required" });
//     }

   
//     const products = await Product.find()
//       .sort({ createdAt: -1 }) 
//       .limit(6); 

//     const favoriteProducts = await Favorite.find({ userId }).select("productId");

//     const favoriteSet = new Set(favoriteProducts.map((fav) => fav.productId.toString()));

//     const productsWithLikes = products.map((product) => ({
//       ...product.toObject(),
//       isLiked: favoriteSet.has(product._id.toString()),
//     }));

//     res.json({ products: productsWithLikes });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };


export const getproduct = async (req, res) => {
  try {
    const { category } = req.query;
    console.log(category,"category");
    
    const userId =  req.query.userId ;

    console.log(userId,"userId");
    // Extract user from token (if authenticated)
    if(userId){
 // Fetch products based on category
 let query = {};
 if (category) query.category = category;
 const products = await Product.find(query).sort({ createdAt: -1 });
 console.log(products,"6788");
 

 let favoriteSet = new Set();
 if (userId) {
   const favoriteProducts = await Favorite.find({ userId }).select("productId");
   console.log(favoriteProducts,"favoriteProducts");
   
   favoriteSet = new Set(favoriteProducts.map((fav) => fav.productId.toString()));
 }

 // Attach 'isLiked' status for authenticated users
 const productsWithLikes = products.map((product) => ({
   ...product.toObject(),
   isLiked: userId ? favoriteSet.has(product._id.toString()) : false,
 }));

 res.json(productsWithLikes);
    }
    else{
      let query = {};
 if (category) query.category = category;
 const productsWithLikes = await Product.find(query).sort({ createdAt: -1 });
 console.log(productsWithLikes,"6788");
 



 res.json(productsWithLikes);
    }
   
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error", error });
  }
};



export const getWishlistByUserId = async (req, res) => {
  try {
      const { id } = req.params;
      // console.log(id,"....");

      if (!id) {
          return res.status(400).json({ message: "User ID is required" });
      }
      
      const wishProduct = await Favorite.find({ userId: id });
      // console.log(wishProduct, "...");
      
      const productIds = wishProduct.map(item => item.productId);
      // console.log(productIds, "productIds");
      
      const wishlist = await Product.find({ _id: { $in: productIds } });
      // console.log("wishlist....", wishlist);
      
      // if (!wishlist || wishlist.length === 0) {
      //     return res.status(404).json({ message: "No wishlist items found" });
      // }
      
      res.status(200).json({ products: wishlist });
      
  } catch (error) {
      console.error("Error fetching wishlist:", error);
      res.status(500).json({ message: "Server error fetching wishlist" });
  }
}

export const productdetial=async(req,res)=>{
  try {
    const { id } = req.params; 

    const product = await Product.findById(id); 

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product); 
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const favorites=async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Check if the favorite already exists
    const existingFavorite = await Favorite.findOne({ userId, productId });
    if (existingFavorite) {
      return res.status(400).json({ message: "Product already in favorites" });
    }

    // Add new favorite
    const newFavorite = new Favorite({ userId, productId });
    await newFavorite.save();

    res.status(201).json({ message: "Added to favorites" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
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


export const cart=async (req, res) => {
  try {
    const { userId, productId, size, quantity } = req.body;

    if (!userId || !productId || !size) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Add to database (MongoDB example)
    const newCartItem = new Cart({
      userId,
      productId,
      size,
      quantity,
    });

    await newCartItem.save();
    res.status(201).json({ message: "Item added to cart" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}



export const cartuserId = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id, "......");

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch user's cart items
    const cartItems = await Cart.find({ userId: id });
    console.log(cartItems, "cartItems...");

    if (!cartItems || cartItems.length === 0) {
      return res.status(404).json({ message: "No cart items found" });
    }

    // Extract product details and include size & quantity from Cart collection
    const productDetails = await Promise.all(
      cartItems.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (product) {
          return {
            ...product.toObject(),
            size: item.size, // Include the size from the Cart collection
            quantity: item.quantity, // Include the quantity from the Cart collection
          };
        }
        return null;
      })
    );  

    // Remove null values if any product was not found
    const filteredProducts = productDetails.filter((product) => product !== null);
    res.status(200).json({ products: filteredProducts });

  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ message: "Server error fetching cart items" });
  }
};


export const GetCartByUserIdAndProductId= async (req, res) => {
    const { userId, productId } = req.params;
    console.log("Received DELETE request for:", userId, productId);
  
    try {
      const deletedItem = await Cart.findOneAndDelete({
        userId: new mongoose.Types.ObjectId(userId),
        productId: new mongoose.Types.ObjectId(productId),
      });
  
      if (!deletedItem) {
        console.log("Cart item not found:", userId, productId);
        return res.status(404).json({ message: "Product not found in cart" });
      }
  
      console.log("Deleted item:", deletedItem);
      res.json({ message: "Product removed successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Error deleting product", error });
    }
  }


  export const CartAddByUser=async (req, res) => {
    try {
      const { userId } = req.params;
      let { productId } = req.body;
  
      console.log("Received userId:", userId);
      console.log("Received productId:", productId);
  
      if (!userId || !productId) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      let existingCartItem = await Cart.findOne({ userId, productId });
  
      if (existingCartItem) {
        existingCartItem.quantity += 1;
        await existingCartItem.save();
        return res.status(200).json({ message: "Quantity increased", cart: existingCartItem });
      } else {
        const newCartItem = new Cart({ userId, productId, quantity: 1 });
        await newCartItem.save();
        return res.status(201).json({ message: "Product added", cart: newCartItem });
      }
  
    } catch (error) {
      console.error("Error updating cart:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  }

  export const CartdecreassByUser=async (req, res) => {
    try {
      const { userId } = req.params;
      const { productId, } = req.body;
  
      if (!userId || !productId) {
        return res.status(400).json({ message: "Missing required fields (userId, productId, or size)" });
      }
  
      const cartItem = await Cart.findOne({ userId, productId });
  
      if (!cartItem) {
        return res.status(404).json({ message: "Product not found in cart" });
      }
  
      if (cartItem.quantity > 1) {
        cartItem.quantity -= 1;
        await cartItem.save();
        return res.status(200).json({ message: "Quantity decreased", cart: cartItem });
      } else {
        await Cart.deleteOne({ userId, productId });
        return res.status(200).json({ message: "Product removed from cart" });
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  
  

  export const products=async (req, res) => {
    console.log("hello");
    
    const  category  = req.query.category;  
    console.log( category," category")
    let user= req.query.userId;
    console.log(user,"user");
    
    if (user === 'null' || user === null || user === undefined || user === '') {
      user = null;  
  }  
    
    try {
      if(!user){
        const updatedProducts = await Product.find({ category }).sort({ createdAt: -1 }) ;
        res.json(updatedProducts);
      }
      else{
        const products = await Product.find({ category }).sort({ createdAt: -1 }) ;
        // console.log(products,"products");
        
  
        const favoriteProducts = await Favorite.find({  userId:user })
        console.log(favoriteProducts,"favoriteProducts");
        
  
        const favoriteProductIds = new Set(favoriteProducts.map(fav => fav.productId.toString()));
      
        const updatedProducts = products.map(product => ({
          ...product.toObject(),
          isLiked: favoriteProductIds.has(product._id.toString()) 
        }));
  
        res.json(updatedProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  export const users=async (req, res) => {
    try {
      const users = await User.find({ role: "User" });
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  export const productById=async (req, res) => {
    try {
      const { id } = req.params;
      await Product.findByIdAndDelete(id);
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Server error" });
    }
  }


  export const AddproductById=async (req, res) => {
    try {
      const { id } = req.params;
      const { price } = req.body;
  
      if (!price) {
        return res.status(400).json({ message: "Price is required" });
      }
  
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { price },
        { new: true }
      );
  
      res.json(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  export const address=async (req, res) => {
    try {
        const {userId}=req.params
        console.log(userId,"test for address");
        
        const { fullName, street, city, state, zip } = req.body;
        console.log(fullName, street, city, state, zip,"test for address");
        
        if (!userId) return res.status(401).json({ message: "Unauthorized: User ID missing" });
  
        const newAddress = new Address({ userId, fullName, street, city, state, zip });
        await newAddress.save();
  
        res.status(201).json(newAddress);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  export const getaddressById= async (req, res) => {
    try {
        const { userId } = req.params;
        const addresses = await Address.find({ userId }); 
  
        res.status(200).json({ addresses });
    } catch (error) {
        console.error("Error fetching addresses:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  export const editaddressById=async (req, res) => {
    try {
      const { userId } = req.params;
      const { fullName, street, city, state, zip } = req.body;
  
      const updatedAddress = await Address.findOneAndUpdate(
        { userId },
        { fullName, street, city, state, zip },
        { new: true, upsert: true } // `upsert: true` creates the document if it doesn't exist
      );
  
      res.status(200).json({ address: updatedAddress });
    } catch (error) {
      console.error("Error updating address:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  export const deleteaddressById=async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find and delete the address
        const deletedAddress = await Address.findByIdAndDelete(id);
  
        if (!deletedAddress) {
            return res.status(404).json({ message: "Address not found" });
        }
  
        res.status(200).json({ message: "Address deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
  } 

  // export const checkout=async (req, res) => {
  //   try {
  //       const { productId, addressId } = req.params;
  
  //       // Fetch the selected address
  //       const address = await Address.findById(addressId);
  //       if (!address) {
  //           return res.status(404).json({ message: "Address not found" });
  //       }
  
  //       // Fetch product details
  //       const product = await Product.findById(productId);
  //       if (!product) {
  //           return res.status(404).json({ message: "Product not found" });
  //       }
  
  //       res.status(200).json({ address, product });
  //   } catch (error) {
  //       res.status(500).json({ message: "Server error", error: error.message });
  //   }
  // }

  export const checkout=async (req, res) => {
    try {
        const { productId} = req.params;
  
        // Fetch the selected address
        // const address = await Address.findById(addressId);
        // if (!address) {
        //     return res.status(404).json({ message: "Address not found" });
        // }
  
        // Fetch product details
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
  
        res.status(200).json({ product });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
  }


  export const clearcart=async (req, res) => {
      try {
           const userId = req.params.userId
           console.log(userId,"000000");
           
          // await Cart.deleteMany({ user: userId });  
          // res.json({ success: true, message: "Cart cleared successfully" });
          if (!mongoose.Types.ObjectId.isValid(userId)) {
              return res.status(400).json({ success: false, message: "Invalid User ID" });
          }
  
          // Delete cart items for the user
          await Cart.deleteMany({ userId: new mongoose.Types.ObjectId(userId) });
  
          res.json({ success: true, message: "Cart cleared successfully" });
      } catch (error) {
          res.status(500).json({ success: false, message: "Error clearing cart" });
      }
  }

  export const productcartdetial=async (req, res) => {
    try {
        const { productIds } = req.body; 
        if (!Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({ message: "Product IDs are required" });
        }

        // Find all products with the given IDs
        const products = await Product.find({
            '_id': { $in: productIds }
        });

        // Return the found products
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch products", error: error.message });
    }
}