
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCart, addItem, decreaseItem, deleteItem } from "../redux/cartSlice";

function Cards() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, status, error } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const totalPrice = products.reduce((sum, product) => sum + product.price * product.quantity, 0);

  return (
    <div className="cards rounded-2xl m-auto mt-12 w-[90%] sm:w-[70%] md:w-[60%] lg:w-[50%] bg-gray-100 p-6 shadow-lg">
      <h2 className="text-center text-2xl font-bold mb-6 text-gray-800">🛒 Your Cart</h2>

      {/* {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p className="text-red-500">Error: {error?.message || "Something went wrong"}</p>} */}

      {products.length === 0 ? (
        <div className="text-center w-full bg-white p-6 rounded-lg shadow-md">
          <p className="text-lg font-semibold text-gray-700">Your cart is empty.</p>
          <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition" onClick={() => navigate("/")}>
            Go to Home
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div key={`${product._id}-${product.size}`} className="bg-white rounded-xl p-4 shadow-md flex items-center gap-4">
              <img src={product.productImage} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
              <div className="flex-grow flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p>Size: {product.size}</p>
                  <p>Price: ${product.price}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => dispatch(addItem({ productId: product._id, size: product.size }))}>+</button>
                  <span>{product.quantity}</span>
                  <button onClick={() => dispatch(decreaseItem({ productId: product._id, size: product.size }))}>-</button>
                  <button onClick={() => dispatch(deleteItem({ productId: product._id, size: product.size }))}>🗑️</button>
                </div>
              </div>
            </div>
          ))}
          <h1>Total Price: ${totalPrice}</h1> 
          <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600" onClick={() => navigate("/checkout")}>
            Buy Now
          </button>
        </div>
      )}
    </div>
  );
}

export default Cards;
