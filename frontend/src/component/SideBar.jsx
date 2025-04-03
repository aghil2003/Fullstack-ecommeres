import { useState } from "react";
import { Link } from "react-router-dom";

function SideBar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white">
        <div className="sidecontainer w-[240px] h-[660px] bg-gray-800 text-white p-6 shadow-lg  mb-5 mr-2 ml-2 rounded-[10px]">

            <div className="sidenav space-y-4">
                <div className="pt-4">
                <Link to="/shipping"
                 className="p-3 text-xl font-semibold hover:bg-gray-700 rounded-lg cursor-pointer transition duration-200">
                    Shipped Product
                </Link>
                </div>
                <div className="pt-4">
                <Link to="/pending" className="p-3 text-xl font-semibold hover:bg-gray-700 rounded-lg cursor-pointer transition duration-200">
                    Pending Product
                </Link>
                </div>
                <div className="pt-4">
                 <Link to="/completed"    
                 className="p-3 text-xl font-semibold hover:bg-gray-700 rounded-lg cursor-pointer transition duration-200">
                    Done Product
                </Link>
                </div>
                <div className="p-3 text-xl font-semibold hover:bg-gray-700 rounded-lg cursor-pointer transition duration-200">
                  <Link to="/userlistpage" className="hover:text-gray-500 transition">User's</Link>
                </div>

                <div className="relative">
                    <div
                        className="order p-3 text-xl font-semibold cursor-pointer flex items-center justify-between hover:bg-gray-700 rounded-lg transition duration-200"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        Product
                        <span className="ml-2">{isOpen ? "▲" : "▼"}</span>
                    </div>

                    {isOpen && (
                        <div className="absolute left-0 mt-2 w-48 bg-gray-700 text-white rounded-lg shadow-lg">
                            <div className="p-3 text-lg hover:bg-gray-600 cursor-pointer transition duration-200 rounded-t-lg">
                            <Link to="/adminproducts/men" className="hover:text-gray-500 transition">Mens</Link>
                            </div>
                            <div className="p-3 text-lg hover:bg-gray-600 cursor-pointer transition duration-200 rounded-b-lg">
                            <Link to="/adminproducts/women" className="hover:text-gray-500 transition">Womens</Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </div>
    );
}

export default SideBar;
