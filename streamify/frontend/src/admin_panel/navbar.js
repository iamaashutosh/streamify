import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import styles from './navbar.css';
const AdminNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div class="sidebar">
        <h2>Admin Panel</h2>
        <ul>
            <li>Dashboard</li>
            <a href="/admin_movies"><li>Manage Movies</li></a>
            <a href="/type"><li>Manage Type</li></a>
            <a href="/cast"><li>Manage Cast</li></a>
            <a href="/home"><li>Home</li></a>
        </ul>
    </div>

  );
};

export default AdminNavbar;
