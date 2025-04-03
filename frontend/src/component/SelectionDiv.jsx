import { Link } from "react-router-dom";
import GirlImg from "../assets/girl1.jpg";
import BoyImg from "../assets/boy1.jpg";

export default function SelectionDiv() {
  return (
    <div className="selectionContainer w-full h-[400px] bg-white flex justify-center pt-10 items-center gap-6">
      {/* Women's Section */}
      <Link to="/products/women" className="w-[40%] h-[300px] group">
        <div className="relative w-full h-full bg-[#e9eae3] rounded-xl shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer">
          <img src={GirlImg} alt="Shop Women's Collection" className="w-full h-full object-cover rounded-xl" />
          <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-40 text-white text-center py-3 text-lg font-semibold transition-opacity duration-300 opacity-0 group-hover:opacity-100">
            Shop Women's Collection
          </div>
        </div>
      </Link>

      {/* Men's Section */}
      <Link to="/products/men" className="w-[40%] h-[300px] group">
        <div className="relative w-full h-full bg-amber-50 rounded-xl shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer">
          <img src={BoyImg} alt="Shop Men's Collection" className="w-full h-full object-cover rounded-xl" />
          <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-40 text-white text-center py-3 text-lg font-semibold transition-opacity duration-300 opacity-0 group-hover:opacity-100">
            Shop Men's Collection
          </div>
        </div>
      </Link>
    </div>
  );
}
