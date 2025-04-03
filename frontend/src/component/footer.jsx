export default function Footer() {
    return (
        <footer className="w-full bg-gray-900 text-gray-300 py-8">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Logo & About Section */}
                    <div>
                        <h2 className="text-2xl font-bold text-white">TrendNest</h2>
                        <p className="text-gray-400 mt-2">
                            Your one-stop destination for trendy and stylish fashion. Stay ahead with the latest styles!
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="/" className="hover:text-gray-400">Home</a></li>
                            <li><a href="/shop" className="hover:text-gray-400">Shop</a></li>
                            <li><a href="/aboutpage" className="hover:text-gray-400">About Us</a></li>
                            <li><a href="/contact" className="hover:text-gray-400">Contact</a></li>
                        </ul>
                    </div>

                    {/* Contact & Social Media */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Contact Us</h3>
                        <p>Email: support@trendnest.com</p>
                        <p>Phone: +1 234 567 890</p>
                        <div className="flex space-x-4 mt-3">
                            <a href="#" className="text-gray-400 hover:text-white">
                                <i className="fab fa-facebook text-xl"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white">
                                <i className="fab fa-instagram text-xl"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white">
                                <i className="fab fa-twitter text-xl"></i>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="text-center mt-6 border-t border-gray-700 pt-4">
                    <p>&copy; {new Date().getFullYear()} TrendNest. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
