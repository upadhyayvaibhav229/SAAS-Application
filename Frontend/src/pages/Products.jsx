import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectShop } from "../Features/ShopSlice";

const Products = () => {
  const navigate = useNavigate();
  const { products, currency } = useSelector(selectShop);

  if (!products || products.length === 0) {
    return <div className="text-center mt-10">No products found.</div>;
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.slice(0, 20).map((product) => (
          <div
            key={product._id}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition-all"
          >
            <img
              src={product.image[0]}
              cla
              alt={product.name}
              className="w-full h- object-cover rounded"
            />
            <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
            <p className="text-gray-600 mt-1">{currency} {product.price}</p>
            <button
              onClick={() => navigate(`/product/${product._id}`)}
              className="mt-3 w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
