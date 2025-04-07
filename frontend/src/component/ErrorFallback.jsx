import { Link, useLocation, useNavigate } from "react-router-dom";
const ErrorFallback = () => {
    return (
      <div className="p-6 text-center pt-[20px]">
        <h2 className="text-2xl font-bold text-red-600">Something went wrong 😢</h2>
        <p className="mt-4">Please try again later or go back to the homepage.</p>
        <Link
  to="/"
  className="text-blue-600 border-b-2 border-blue-600 hover:text-blue-800 transition"
>
  Home
</Link>

      </div>
    );
  };
  
  export default ErrorFallback;
  