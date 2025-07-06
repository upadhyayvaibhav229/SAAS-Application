import React, { useState } from "react";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Vaibhav Upadhyay",
    email: "upadhyayvaibhav229@email.com",
    phone: "9004523446",
    location: "Mumbai, India",
    role: "MERN Stack Developer",
    avatar: "https://i.pravatar.cc/150?img=3",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Updated profile:", profile);
    // You can also send this to your backend here
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl max-w-md w-full p-6">
        <div className="flex flex-col items-center">
          <img
            className="w-24 h-24 rounded-full shadow-md"
            src={profile.avatar}
            alt="Profile"
          />
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="text-xl font-semibold mt-4 text-center border-b border-gray-300 focus:outline-none"
            />
          ) : (
            <h2 className="text-2xl font-semibold mt-4">{profile.name}</h2>
          )}
          <p className="text-gray-500 text-sm">{profile.role}</p>
        </div>

        <div className="mt-6 space-y-4">
          {["email", "phone", "location"].map((field) => (
            <div key={field}>
              <label className="block text-sm text-gray-600 capitalize">{field}</label>
              {isEditing ? (
                <input
                  type="text"
                  name={field}
                  value={profile[field]}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="mt-1 p-2 bg-gray-50 border rounded-lg text-gray-700">
                  {profile[field]}
                </p>
              )}
            </div>
          ))}

          {isEditing ? (
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleSave}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
