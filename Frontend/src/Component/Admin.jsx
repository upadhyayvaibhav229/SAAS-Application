import React from 'react';

export default function Admin() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 text-2xl font-bold text-blue-600 border-b">Admin Panel</div>
        <nav className="flex-1 px-4 py-6 space-y-2 text-gray-700">
          <a href="#" className="block px-4 py-2 rounded hover:bg-blue-100">Dashboard</a>
          <a href="#" className="block px-4 py-2 rounded hover:bg-blue-100">Users</a>
          <a href="#" className="block px-4 py-2 rounded hover:bg-blue-100">Roles</a>
          <a href="#" className="block px-4 py-2 rounded hover:bg-blue-100">Settings</a>
          <a href="#" className="block px-4 py-2 mt-8 text-red-600 hover:bg-red-100">Logout</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold">Total Users</h2>
            <p className="text-3xl font-bold mt-2">124</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold">Active Sessions</h2>
            <p className="text-3xl font-bold mt-2">38</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold">Roles Assigned</h2>
            <p className="text-3xl font-bold mt-2">5</p>
          </div>
        </div>
      </main>
    </div>
  );
}
