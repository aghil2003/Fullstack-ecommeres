export default function AboutPage() {
    return (
        <div className="container mx-auto p-8 bg-gray-50 rounded-lg shadow-lg">
            <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">About Us</h1>
            <p className="text-lg text-gray-700 text-center max-w-2xl mx-auto mb-6 leading-relaxed">
                Welcome to <span className="text-indigo-600 font-semibold">TrendNest</span>, your ultimate destination for trendy and stylish men's and women's clothing. 
                Our mission is to provide high-quality, fashionable apparel that makes you look and feel your best.
            </p>
            <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                    <h2 className="text-2xl font-semibold text-indigo-700 mb-3">For Men</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Discover a range of stylish clothing for men, from casual wear to formal attire. 
                        Whether you're looking for comfortable everyday outfits or something special for an occasion, 
                        we have you covered.
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                    <h2 className="text-2xl font-semibold text-indigo-700 mb-3">For Women</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Explore our exclusive collection of women's clothing, designed to bring out elegance and confidence. 
                        From chic dresses to trendy tops, we offer a variety of styles to match your unique fashion sense.
                    </p>
                </div>
            </div>
            <div className="mt-10 text-center bg-indigo-100 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-indigo-800 mb-3">Our Commitment</h2>
                <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
                    At <span className="text-indigo-600 font-semibold">TrendNest</span>, we are committed to delivering high-quality fabrics, modern designs, and an exceptional shopping experience. 
                    Our goal is to help you stay ahead in fashion while ensuring comfort and affordability.
                </p>
            </div>
        </div>
    );
}
