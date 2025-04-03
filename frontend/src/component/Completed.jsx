import { useEffect, useState } from "react";
import axiosInstance from "../axios/axiosInstance";

export default function Completed() {
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Asynchronous function to fetch data
        const fetchCompletedOrders = async () => {
            try {
                const response = await axiosInstance.get("/comleted");
                setProduct(response.data); 
            } catch (error) {
                console.error("Error fetching pending orders:", error);
            }
        };

        fetchCompletedOrders();
    }, []);


    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Completed Orders</h1>
            {product.length === 0 ? (
                <p className="text-center text-lg text-gray-600">No completed orders found.</p>
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
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}