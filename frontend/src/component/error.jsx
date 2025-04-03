import { Link } from "react-router-dom";

export default function ErrorPage() {
    return (
        <div className="h-screen flex flex-col items-center justify-center text-center bg-gray-100">
            <h1 className="text-6xl font-bold text-red-500">404</h1>
            <p className="text-xl text-gray-700 mt-4">Oops! The page you are looking for does not exist.</p>
            <Link to="/" className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                Go Home
            </Link>
        </div>
    );
}
