// LoadingSpinner.jsx
import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-cyan-300 border-b-transparent rounded-full animate-spin animate-reverse"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;