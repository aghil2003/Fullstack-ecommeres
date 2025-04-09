import { useEffect, useState } from "react";
import axiosInstance from "../axios/axiosInstance";

export default function Shipped() {
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchShippedOrders = async () => {
            try {
                const response = await axiosInstance.get("/shipped");
                setProduct(response.data); 
            } catch (error) {
                console.error("Error fetching pending orders:", error);
            }
        };

        fetchShippedOrders();
    }, []);

    
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            setLoading(true);
            const response = await axiosInstance.put(`/order/${orderId}/status`, {
                status: newStatus
            });

            if (response.status === 200) {
                setProduct((prevProduct) =>
                    prevProduct.map((order) =>
                        order._id === orderId ? { ...order, status: newStatus } : order
                    )
                );
            }
        } catch (error) {
            console.error("Error updating order status:", error);
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Shipped Orders</h1>
            {product.length === 0 ? (
                <p className="text-center text-lg text-gray-600">No pending orders found.</p>
            ) : (
                <ul className="space-y-4">
                    {product.map((order, index) => (
                        <li key={index} className="bg-gray-100 p-6 rounded-lg shadow-md">
                            <p className="text-lg font-medium text-gray-700"><strong>Order ID:</strong> {order._id}</p>
                            
                            {order.address ? (
                                <>
                                    <p className="text-md text-gray-600"><strong>Full Name:</strong> {order.address.fullName}</p>
                                    <p className="text-md text-gray-600"><strong>Street:</strong> {order.address.street}</p>
                                    <p className="text-md text-gray-600"><strong>City:</strong> {order.address.city}</p>
                                    <p className="text-md text-gray-600"><strong>State:</strong> {order.address.state}</p>
                                    <p className="text-md text-gray-600"><strong>Zip:</strong> {order.address.zip}</p>
                                </>
                            ) : (
                                <p className="text-md text-gray-600"><strong>Address:</strong> No address provided</p>
                            )}
                            <p className="text-md text-gray-600"><strong>Product ID:</strong> {order.productId}</p>
                            <p className="text-md text-gray-600"><strong>Quantity:</strong> {order.quantity}</p>
                            <p className="text-md text-gray-600"><strong>Status:</strong> {order.status}</p>
                            <p className="text-md text-blue-600"><strong>User Email:</strong> {order.useremail}</p>

                            {/* Buttons to update status */}
                            {order.status === "shipped" && (
                                <div className="mt-4 flex space-x-4">
                                    <button
                                        onClick={() => updateOrderStatus(order._id, "completed")}
                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                        disabled={loading}
                                    >
                                        {loading ? "Processing..." : "Mark as Completed"}
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
