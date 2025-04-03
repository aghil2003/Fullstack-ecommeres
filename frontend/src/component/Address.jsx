import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAddresses, saveAddress, deleteAddress } from "../redux/actions/addressActions";
import { selectAddress } from "../redux/reducers/addressReducer";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function Address() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { addresses, selectedAddress, loading } = useSelector(state => state.address);
    const [isEditing, setIsEditing] = useState(false);
    const [isNewAddress, setIsNewAddress] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        street: "",
        city: "",
        state: "",
        zip: "",
    });

    useEffect(() => {
        dispatch(fetchAddresses());
    }, [dispatch]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(saveAddress({ formData, isNewAddress }));
        setIsEditing(false);
        setIsNewAddress(false);
        setFormData({ fullName: "", street: "", city: "", state: "", zip: "" });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteAddress(id));
            }
        });
    };

    const handleSelectAddress = (address) => {
        dispatch(selectAddress(address));
        Swal.fire("Selected", "Address selected successfully!", "success");
    };

    const handleDeselectAddress = () => {
        dispatch(selectAddress(null));
    };

    const handleContinue = () => {
        if (!selectedAddress) {
            Swal.fire("Warning", "Please select an address before continuing.", "warning");
            return;
        }
        navigate(`/checkout/${productId}/${selectedAddress._id}`);
    };

    const handleEdit = (address) => {
        setIsEditing(true);
        setIsNewAddress(false);
        setFormData(address);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-6 w-[650px] mx-auto bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Saved Addresses</h2>

            {/* Show selected address if available */}
            {selectedAddress && (
                <div className="p-4 border-2 border-green-500 bg-green-100 rounded-lg shadow-sm mb-4">
                    <h3 className="text-lg font-semibold text-green-700">Selected Address</h3>
                    <p><strong>Name:</strong> {selectedAddress.fullName}</p>
                    <p><strong>Street:</strong> {selectedAddress.street}</p>
                    <p><strong>City:</strong> {selectedAddress.city}</p>
                    <p><strong>State:</strong> {selectedAddress.state}</p>
                    <p><strong>ZIP:</strong> {selectedAddress.zip}</p>
                    <button onClick={handleDeselectAddress} className="bg-gray-500 text-white px-3 py-1 rounded mt-2">Deselect</button>
                </div>
            )}

            {/* List of saved addresses */}
            {addresses.length > 0 ? (
                addresses.map((address) => (
                    <div key={address._id} className={`border p-4 rounded-lg shadow-sm mb-3 ${selectedAddress && selectedAddress._id === address._id ? "border-blue-500 bg-blue-100" : ""}`}>
                        <p><strong>Name:</strong> {address.fullName}</p>
                        <p><strong>Street:</strong> {address.street}</p>
                        <p><strong>City:</strong> {address.city}</p>
                        <p><strong>State:</strong> {address.state}</p>
                        <p><strong>ZIP:</strong> {address.zip}</p>
                        <button onClick={() => handleSelectAddress(address)} className="bg-green-500 text-white px-3 py-1 rounded mr-2">Select</button>
                        <button onClick={() => handleEdit(address)} className="bg-blue-500 text-white px-3 py-1 rounded mr-2">Edit</button>
                        <button onClick={() => handleDelete(address._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                    </div>
                ))
            ) : (
                <p>No addresses found.</p>
            )}

            <button onClick={() => { setIsEditing(true); setIsNewAddress(true); setFormData({ fullName: "", street: "", city: "", state: "", zip: "" }); }} 
                className="bg-blue-500 text-white px-4 py-2 rounded mt-3">
                Add Address
            </button>

            {isEditing && (
                <form onSubmit={handleSubmit} className="p-4 border rounded-lg shadow-sm bg-gray-100 mt-4">
                    <input 
                        type="text" 
                        name="fullName" 
                        value={formData.fullName} 
                        onChange={handleChange} 
                        placeholder="Full Name" 
                        required 
                        className="border p-2 rounded w-full mb-2"
                    />
                    <input 
                        type="text" 
                        name="street" 
                        value={formData.street} 
                        onChange={handleChange} 
                        placeholder="Street" 
                        required 
                        className="border p-2 rounded w-full mb-2"
                    />
                    <input 
                        type="text" 
                        name="city" 
                        value={formData.city} 
                        onChange={handleChange} 
                        placeholder="City" 
                        required 
                        className="border p-2 rounded w-full mb-2"
                    />
                    <input 
                        type="text" 
                        name="state" 
                        value={formData.state} 
                        onChange={handleChange} 
                        placeholder="State" 
                        required 
                        className="border p-2 rounded w-full mb-2"
                    />
                    <input 
                        type="text" 
                        name="zip" 
                        value={formData.zip} 
                        onChange={handleChange} 
                        placeholder="ZIP Code" 
                        required 
                        className="border p-2 rounded w-full mb-2"
                    />
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
                    <button type="button" onClick={() => setIsEditing(false)} className="ml-2 bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                </form>
            )}

            {selectedAddress && (
                <button onClick={handleContinue} className="bg-green-500 text-white px-4 py-2 rounded mt-3">
                    Continue
                </button>
            )}
        </div>
    );
}
