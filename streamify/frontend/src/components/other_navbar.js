import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import styles from "./other_navbar.module.css";
import { FaHome, FaSearch, FaFilm, FaTv, FaRegStar, FaHistory, FaBookmark } from 'react-icons/fa';
import { useEffect, useState } from "react";
import {CgProfile} from 'react-icons/cg';


const OtherNavbar = () => {
  const { user, logoutUser } = useAuth();
  const [scrolling, setScrolling] = useState(false);
  const navigate = useNavigate();

  if (user.is_superuser){
    const superuser=true;
  }

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

    // return (
  
    //   <header className="header">
  
    //     <div className="logo">MovieStream</div>
  
    //     <nav className="nav">
  
    //       <ul>
  
    //         <li><a href="/">Home</a></li>
  
    //         <li><a href="/movies">Movies</a></li>
  
    //         <li><a href="/tv-shows">TV Shows</a></li>
  
    //         <li><a href="/originals">Originals</a></li>
  
    //         <li><a href="/genres">Genres</a></li>
  
    //       </ul>
  
    //     </nav>
  
    //     <div className="search-container">
  
    //       <input type="text" placeholder="Search..." />
  
    //     </div>
  
    //     <div className="user-account">
  
    //       {user ? (

    //       <div className="user-info">

    //         <img src={user.image} alt={user.username} className="user-image" />

    //         <span className="username">{user.username}</span>

    //       </div>

    //       ) : (

    //       <>

    //         <li><a href="/login">Login</a></li>

    //         <li><a href="/signup" className="signup">Sign Up</a></li>

    //       </>

    //       )}
  
    //     </div>
  
    //   </header>
  
    // );
    useEffect(() => {
      const handleScroll = () => {
        if (window.scrollY > 50) {
          setScrolling(true);
        } else {
          setScrolling(false);
        }
      };
  
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return (
      <nav className={`${styles.navbar} ${scrolling ? styles.scrolled : ""}`}>
        <div className={styles.navbar__brand}>Streamify</div>
        {user.is_superuser && <a href="/admin" className={styles.navbar__admin}>Admin</a>}
        <div className={styles.navbar__items}>
            <a href="/home"><NavItem icon={<FaHome />} label="Home" /></a>
            <a href="/search"><NavItem icon={<FaSearch />} label="Search" /></a>
            <a href="/movies"><NavItem icon={<FaFilm />} label="Movie" /></a>
            <a href="/history"><NavItem icon={<FaHistory />} label="History" /></a>
            <a href="/watchlist"><NavItem icon={<FaBookmark />} label="Watchlist" /></a>
        </div>
        <a href="/profile"><span className={styles.navbar__profile}><CgProfile size={30}/></span></a> 
      </nav>
    );
  } 
    
    function NavItem({ icon, label }) {
      return (
        <div className={styles.navbar__item}>
          <span>{icon}</span>
          <span>{label}</span>
        </div>
      );
    }

export default OtherNavbar;
