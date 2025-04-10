
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { deleteItem, fetchCart } from "../redux/cartSlice";
import { fetchAddresses, saveAddress, deleteAddress } from "../redux/actions/addressActions";
import { selectAddress } from "../redux/reducers/addressReducer";
import axiosInstance from "../axios/axiosInstance";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

export default function CheckOut() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const cart = useSelector((state) => state.cart.products);
    const { name, email } = useSelector((state) => state.auth);
    const { addresses, selectedAddress } = useSelector((state) => state.address);
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ fullName: "", street: "", city: "", state: "", zip: "" });

    useEffect(() => {
        dispatch(fetchCart());
        dispatch(fetchAddresses());
    }, [dispatch]);

    useEffect(() => {
        if (cart.length > 0) {
            setProducts(cart);
            setLoading(false);
        }
    }, [cart]);

    const handleSelectAddress = (address) => {
        dispatch(selectAddress(address));
        Swal.fire("Selected", "Address selected successfully!", "success");
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteAddress(id));
            }
        });
    };

    const handleAddAddress = async (e) => {
            e.preventDefault();
            console.log("Form Data Submitted:", formData); 
        
            try {
                await dispatch(saveAddress(formData)).unwrap();
                setIsEditing(false);
                setFormData({
                    fullName: "",
                    street: "",
                    city: "",
                    state: "",
                    zip: ""
                });
                Swal.fire("Success", "Address added successfully!", "success");
            } catch (error) {
                console.error("Error saving address:", error);
                Swal.fire("Error", error.message || "Failed to save address!", "error");
            }
        };

    const handleSubmit = () => {
        if (!selectedAddress) {
            Swal.fire("Warning", "Please select an address before continuing.", "warning");
            return;
        }
       
    };

    if (loading) return <p className="text-center text-lg font-semibold">Loading...</p>;

    const totalAmount = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
    const product = products.reduce((ids, product) => {
        ids.push(product._id);
        return ids;
    }, []);

    const checkoutPayment = async (order) => {
        console.log("order:", order);
        let orderId = "";
    
        const orderData = {
            useremail: email,
            address: selectedAddress,
            productId: product,
            totalAmount: totalAmount,
            status: "Pending",
            orderstatus:"Pending" 
        };
    
        try {
            const result = await axiosInstance.post("/orders", orderData);
            console.log(result.data, "result");
    
            if (result.data.success) {
                orderId = result.data.order._id;
                console.log(orderId, "orderId");
            } else {
                throw new Error("Failed to save order.");
            }
        } catch (error) {
            console.error("Error saving order:", error);
            Swal.fire("Error", "Failed to save order.", "error");
            return;
        }
    
        const options = {
            key: "rzp_test_ZKcJLyt29WoYex",
            amount: order.amount,
            currency: order.currency,
            name: "VINERGO",
            description: "Thank you for shopping with us!",
            order_id: order.id, 
            handler: async function (response) {
                Swal.fire({
                    title: "Booking Confirmed!",
                    text: "Your order has been successfully placed.",
                    icon: "success",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "OK",
                }).then(async () => {
                    const paymentDetails = {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    };
    
                    try {
                        const updateResult = await axiosInstance.put(`/orders/${orderId}`, {
                            orderstatus: "Completed",
                            paymentDetails,
                        });
    
                        if (updateResult.data.success) {
                            console.log("Order saved successfully!");
                            const token = Cookies.get("token");
                            const decodedToken = jwtDecode(token);
                            const userId = decodedToken.userId || decodedToken.id;
                            console.log(userId,"345rtyu");
                                                    
                            await axiosInstance.delete(`/cartclear/${userId}`);  
                            dispatch(fetchCart()); 
                            
                            Swal.fire("Success", "Your order has been saved.", "success")
                            navigate("/orders", { replace: true }); 
                            window.location.reload();
                        } else {
                            throw new Error("Failed to update order status.");
                        }
                    } catch (error) {
                        console.error("Error updating order status:", error);
                        Swal.fire("Error", "Failed to complete the order.", "error");
                    }
                });
            },
            prefill: {
                name: name,
                email: email,
                contact: "6282717057", 
            },
            theme: {
                color: "#AF6900",
            },
        };
    
        const razorpay = new Razorpay(options);
        razorpay.open();
    };
    
    
      const newBooking = async () => {
        try {
          let response = await axiosInstance.post("/payement", {
            amount: totalAmount,
            currency: "INR",
          });
          if (response) {
            await checkoutPayment(response.data.order);
            
          }
        } catch (error) {
          console.error(error);
        }
      };
    
      const handleSubmitForPay = ()=>{
        if (!selectedAddress) {
            Swal.fire("Warning", "Please select an address before continuing.", "warning");
            return;
        }
        newBooking()
      }

    return (
        <div className="p-8 bg-white shadow-lg rounded-2xl w-[800px] mt-[100px] mx-auto border border-gray-200 grid grid-cols-2 gap-6">
            <div className="p-6 bg-gray-100 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">Checkout</h1>
                {products.map((product) => (
                    <div key={product._id} className="mb-4 flex items-center gap-4 border p-4 rounded-xl shadow-sm bg-white">
                        <img src={product.productImage} alt={product.name} className="w-20 h-20 object-cover rounded-xl shadow-md" />
                        <div className="flex-1">
                            <h2 className="text-lg font-semibold text-gray-700">{product.name}</h2>
                            <p className="text-lg font-bold text-blue-600">${product.price}</p>
                            <p className="text-gray-600">Quantity: <span className="font-semibold">{product.quantity}</span></p>
                        </div>
                    </div>
                ))}
                <div className="text-[20px] ml-[100px] pt-4 pb-4">
                     <strong>Total Amount:${totalAmount}</strong>
                 </div>
                <h2 className="text-xl font-semibold mb-3 text-gray-700">Selected Address</h2>
                {selectedAddress ? (
                    <div className="p-4 border rounded-lg bg-white shadow">
                        <p><strong>{selectedAddress.fullName}</strong></p>
                        <p>{selectedAddress.street}, {selectedAddress.city}</p>
                        <p>{selectedAddress.state}, {selectedAddress.zip}</p>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center">Please select an address.</p>
                )}
                <button onClick={ handleSubmitForPay} className="mt-6 w-full bg-purple-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-purple-600 transition">Proceed to Payment</button>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-3 text-gray-700">Select Address</h2>
                {addresses.map((address) => (
                    <div key={address._id} className="border p-4 rounded-lg shadow-sm mb-3 bg-gray-100 hover:bg-gray-200 transition-all">
                        <p><strong>{address.fullName}</strong></p>
                        <p>{address.street}, {address.city}</p>
                        <p>{address.state}, {address.zip}</p>
                        <button onClick={() => handleSelectAddress(address)} className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-green-600 transition">Select</button>
                        <button onClick={() => handleDelete(address._id)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">Delete</button>
                    </div>
                ))}
                <button onClick={() => setIsEditing(true)} className="w-full bg-blue-500 text-white px-5 py-2 rounded-lg mt-4 hover:bg-blue-600 transition">Add New Address</button>
                {isEditing && (
                    <form onSubmit={handleAddAddress} className="p-6 border rounded-lg shadow-sm bg-gray-50 mt-4">
                        {Object.keys(formData).map((field) => (
                            <input key={field} type="text" name={field} value={formData[field]} onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} placeholder={field.charAt(0).toUpperCase() + field.slice(1)} required className="border p-3 rounded-lg w-full mb-2" />
                        ))}
                        <button type="submit" className="w-full bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition">Save</button>
                        <button type="button" onClick={() => setIsEditing(false)} className="mt-2 w-full bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 transition">Cancel</button>
                    </form>
                )}
            </div>
        </div>
    );
}
