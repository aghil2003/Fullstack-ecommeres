import express from "express";
const ProductRoutes = express.Router()
import {upload} from "../middleware/S3middleware.js"
import {addProduct,getproduct,productdetial,productcartdetial,getWishlistByUserId,favorites,favoritesProduct,cart,cartuserId,GetCartByUserIdAndProductId,CartAddByUser,CartdecreassByUser,products,users,productById,AddproductById,address,getaddressById,editaddressById,deleteaddressById,checkout,clearcart} from "../controller/Product.js";


ProductRoutes.post("/trendingproduct",upload.single("image"),addProduct);
ProductRoutes.get("/trendingproduct/:userId",getproduct);
ProductRoutes.get("/product/:id",productdetial);
ProductRoutes.get("/wishgproduct/:id",getWishlistByUserId) 
ProductRoutes.post("/favorites",favorites );
ProductRoutes.delete("/favorites/:productId",favoritesProduct);
ProductRoutes.post("/cart",cart);
ProductRoutes.get("/cart/:id",cartuserId );
ProductRoutes.delete("/cart/:userId/:productId",GetCartByUserIdAndProductId);
ProductRoutes.post('/cart/:userId/add',CartAddByUser);
ProductRoutes.put('/cart/:userId/decrease',CartdecreassByUser);
ProductRoutes.delete("/cartclear/:userId",clearcart);
ProductRoutes.get("/products/:userId",products);
ProductRoutes.get("/users", users);
ProductRoutes.post('/products/details',productcartdetial);
ProductRoutes.delete("/products/:id", productById);
ProductRoutes.put("/products/:id",AddproductById);
ProductRoutes.post("/address/:userId",address);
ProductRoutes.get("/address/:userId",getaddressById);
ProductRoutes.put("/address/:userId",editaddressById);
ProductRoutes.delete("/address/:id",deleteaddressById );
// ProductRoutes.get("/checkout/:productId/:addressId",checkout );
ProductRoutes.get("/checkout/:productId",checkout );

export default ProductRoutes;