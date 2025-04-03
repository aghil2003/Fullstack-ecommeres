import { useState } from "react";
import AddProductModal from "../component/model"; 

function SideDiv() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="admincontainer w-full h-[650px] rounded-[10px] mt-2 mr-2">
            <div className="flex justify-center mt-4">
                <button 
                    className="bg-blue-500 text-white px-6 py-2 rounded-md shadow hover:bg-blue-600"
                    onClick={() => setIsModalOpen(true)}
                >
                    Add Product
                </button>
            </div>

            {isModalOpen && <AddProductModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
}

export default SideDiv;
