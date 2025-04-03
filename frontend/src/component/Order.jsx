import { useState, useEffect } from "react";
import axiosInstance from "../axios/axiosInstance";
import { useSelector } from "react-redux";

export default function Order() {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { email } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axiosInstance.get(`/orders/${email}`);
                setOrders(response.data);
            } catch (err) {
                setError(err.message || "Failed to fetch orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [email]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productIds = orders.flatMap(order => order.productId);
                if (productIds.length > 0) {
                    const response = await axiosInstance.post(`/products/details`, { productIds });
                    setProducts(response.data);
                }
            } catch (err) {
                setError(err.message || "Failed to fetch products");
            }
        };
    
        if (orders.length > 0) {
            fetchProducts();
        }
    }, [orders]);
    
    if (loading) return <p className="text-center text-gray-500">Loading orders...</p>;
    if (error) return <p className="text-red-500 text-center">Error: {error}</p>;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-semibold mb-8 text-center text-gray-800">📦 Your Orders</h1>
    
        {orders.length === 0 ? (
            <p className="text-center text-gray-500">No orders found.</p>
        ) : (
            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order._id} className="bg-white p-6 shadow-xl rounded-lg border border-gray-200">
                        <div className="mt-4">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4">🛍️ Ordered Products</h3>
                            {order.productId.map((id, index) => {
                                const product = products.find((p) => p._id.toString() === id.toString());
                                return (
                                    <div key={index} className="flex items-center space-x-4 mb-3">
                                        {product ? (
                                            <>
                                                <img
                                                    src={product.productImage}
                                                    alt={product.name}
                                                    className="w-20 h-20 object-cover rounded-lg shadow-md"
                                                />
                                                <p className="text-gray-800">{product.name} - <span className="font-semibold">${product.price}</span></p>
                                            </>
                                        ) : (
                                            <p className="text-gray-500">Loading product details...</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
    
                        <div className="mt-4">
                            <h2 className="text-lg font-semibold text-gray-800 mb-2">Order ID: {order._id}</h2>
                            <p className="text-gray-600"><strong>Total Amount:</strong> ${order.totalAmount}</p>
                            <p className="text-gray-600">
                                <strong>Status:</strong> <span className="text-blue-500">{order.status}</span>
                            </p>
                        </div>
    
                        {/* Address Details */}
                        <div className="mt-6 border-t pt-4">
                            <h3 className="text-xl font-semibold text-gray-700">🏡 Shipping Address</h3>
                            <p className="text-gray-600"><strong>Name:</strong> {order.address.fullName}</p>
                            <p className="text-gray-600">
                                {order.address.street}, {order.address.city}, {order.address.state}, {order.address.zip}
                            </p>
                        </div>
    
                        {/* Payment Details */}
                        <div className="mt-6 border-t pt-4">
                            <h3 className="text-xl font-semibold text-gray-700">💳 Payment Details</h3>
                            <p className="text-gray-600"><strong>Order ID:</strong> {order.payment.razorpay_order_id}</p>
                            <p className="text-gray-600"><strong>Payment ID:</strong> {order.payment.razorpay_payment_id}</p>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
    
    );
}
