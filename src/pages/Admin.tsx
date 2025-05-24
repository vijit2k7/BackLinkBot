import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

// Redirect to standalone admin page
const Admin = () => {
  useEffect(() => {
    // Redirect to the actual admin HTML file
    window.location.href = '/admin/index.html';
  }, []);

  return (
    <>
      <Helmet>
        <title>Admin | BacklinkBot</title>
      </Helmet>
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Redirecting to Admin...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            If you are not redirected automatically,{' '}
            <a href="/admin/index.html" className="text-blue-500 hover:underline">
              click here
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Admin; 