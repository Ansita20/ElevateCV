import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/", { replace: true });
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-gray-900">Page Not Found</h1>
        <p className="mt-2 text-gray-600">Redirecting to main page...</p>
        <button
          type="button"
          onClick={() => navigate("/", { replace: true })}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Go to Main Page
        </button>
      </div>
    </div>
  );
};

export default NotFound;