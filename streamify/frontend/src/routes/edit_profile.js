import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/css/edit_profile.css";
import { get_user_profile } from "../api/endpoints";

const UserProfileEdit = () => {
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    image: null,
  });

  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    // Fetch user profile data from API
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/user_profile/");
        setUserData(response.data);
        setPreviewImage(response.data.image);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setUserData({ ...userData, image: file });

    // Show preview of new image
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("first_name", userData.first_name);
    formData.append("last_name", userData.last_name);
    formData.append("email", userData.email);
    if (userData.image) {
      formData.append("image", userData.image);
    }

    try {
      await axios.put("http://127.0.0.1:8000/user_profile/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="profile-edit-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="profile-image-container">
          <label htmlFor="image-upload">
            <img
              src={previewImage || "https://via.placeholder.com/150"}
              alt="Profile"
              className="profile-image"
            />
          </label>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="first_name"
            value={userData.first_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="last_name"
            value={userData.last_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="save-button">Save Changes</button>
      </form>
    </div>
  );
};

export default UserProfileEdit;
