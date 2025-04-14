// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { get_movie, update_movie } from "../api/endpoints"; // API calls
// import AdminNavbar from "./navbar";
// import styles from "./edit_movie.module.css";
// import axios from "axios";

// const EditMovie = () => {
//   const { id } = useParams(); // Get movie ID from URL
//   const navigate = useNavigate(); // Redirect after saving
//   const [movie, setMovie] = useState([]);
//     const [title, setTitle] = useState('');
//     const [desc, setDesc] = useState('');
//     const [image, setImage] = useState(null);
//     const [video, setVideo] = useState(null);
//     const [category, setCategory] = useState('Drama');
//     const [rating, setRating] = useState('');
//     const [isPremium, setIsPremium] = useState(false);
//     const [banner, setBanner] = useState(null);
//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(null);
//   useEffect(() => {
//     const fetchMovie = async () => {
//       const data = await get_movie(id); // Fetch movie details
//       setMovie(data);
//     };
//     fetchMovie();
//   }, [id]);

//   const handleUpdate = async (field, value) => {
//     setMovie({ ...movie, [field]: value });
//   };

//   const saveChanges = async (e) => {
//     e.preventDefault();
  
//     const formData = new FormData();
//     formData.append('title', title);
//     formData.append('desc', desc);
//     if (image) formData.append('image', image);
//     if (video) formData.append('video', video);
//     formData.append('category', category);
//     formData.append('rating', rating);
//     formData.append('is_premium', isPremium);
//     if (banner) formData.append('banner', banner);
  
//     try {
//       await axios.put(`http://127.0.0.1:8000/movies/${id}/`, formData, {
//         withCredentials: true,
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       navigate("/admin_movies");
//     } catch (error) {
//       console.error("Error updating movie:", error);
//     }
//   };
  

//   return (
//     <div className={styles.container}>
//       <AdminNavbar />
//       <div className={styles.content}>
//         <h2>Edit Movie</h2>
//         <div className={styles.movieDetails}>
//           <div className={styles.field}>
//             <label>Title:</label>
//             <input type="text" value={movie.title} onChange={(e) => handleUpdate("title", e.target.value)} />
//           </div>

//           <div className={styles.field}>
//             <label>Description:</label>
//             <textarea value={movie.desc} onChange={(e) => handleUpdate("desc", e.target.value)} />
//           </div>

//           <div className={styles.field}>
//             <label>Category:</label>
//             <select value={movie.category} onChange={(e) => handleUpdate("category", e.target.value)}>
//               <option value="Action">Action</option>
//               <option value="Drama">Drama</option>
//               <option value="Comedy">Comedy</option>
//               <option value="Horror">Horror</option>
//               <option value="Thriller">Thriller</option>
//               <option value="Romance">Romance</option>
//               <option value="Sci-Fi">Sci-Fi</option>
//             </select>
//           </div>

//           <div className={styles.field}>
//             <label>Rating:</label>
//             <input type="number" min="0" max="10" value={movie.rating} onChange={(e) => handleUpdate("rating", e.target.value)} />
//           </div>

//           <div className={styles.field}>
//             <label>Release Date:</label>
//             <input type="date" value={movie.release_date} onChange={(e) => handleUpdate("release_date", e.target.value)} />
//           </div>

//           <div className={styles.checkbox}>
//             <input type="checkbox" checked={movie.is_premium} onChange={(e) => handleUpdate("is_premium", e.target.checked)} />
//             <label>Premium Movie</label>
//           </div>

//           <button className={styles.saveButton} onClick={saveChanges}>Save Changes</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditMovie;
import React, { useState } from 'react';
import { useEffect } from 'react';
import { get_movies } from '../api/endpoints';
import axios from 'axios';
import './add_movie.css';
import AdminNavbar from './navbar';
import { useParams,useNavigate } from 'react-router-dom';


const EditMovie= () => {

    const { id } = useParams();
    const [movie, setMovie] = useState([]);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [category, setCategory] = useState('Drama');
    const [rating, setRating] = useState('');
    const [isPremium, setIsPremium] = useState(false);
    const [banner, setBanner] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [oldImage, setOldImage] = useState(null);
    const [oldVideo, setOldVideo] = useState(null);
    const [oldBanner, setOldBanner] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovies = async () => {
          const moviesData = await axios.get(`http://127.0.0.1:8000/movies/${id}`,{withCredentials:true});
          setMovie(moviesData);
          setTitle(moviesData.data.title || ' ');
          setDesc(moviesData.data.desc || ' ');
          setImage(moviesData.data.image|| ' ');
            setOldImage(moviesData.data.image|| ' ');
          setVideo(moviesData.data.video || ' ');
            setOldVideo(moviesData.data.video || ' ');
          setBanner(moviesData.data.banner|| ' ');
            setOldBanner(moviesData.data.banner|| ' ');
          setCategory(moviesData.data.category|| ' ');
          setRating(moviesData.data.rating|| ' ');
          setIsPremium(moviesData.data.is_premium|| false);
        };
        fetchMovies();
      }, [id]);

      const handleUpdateMovie = async () => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('desc', desc);
        formData.append('category', category);
        formData.append('rating', rating);
        formData.append('is_premium', isPremium);

        if (image) formData.append('image', image);
        else if(oldImage) formData.append('image', oldImage);
        if ( video) formData.append('video', video);
        else if(oldVideo) formData.append('video', oldVideo);
        if (banner) formData.append('banner', banner);
        else if(oldBanner) formData.append('banner', oldBanner);

        try {
          const response = await axios.patch(`http://127.0.0.1:8000/movies/${id}/`,formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
          });
      
          console.log("Update successful", response.data);
          setSuccess('Movie updated successfully!');
          setError('');
          setTimeout(() => navigate('/admin_movies'), 1000);
        } catch (err) {
          console.error("Update failed", err.response?.data || err.message);
          setError('Failed to update movie.');
        }
      };
      
    return (
        <div className="add-movie">
            <h2>Add Movie</h2>
            <div>
                <label>Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div>
                <label>Description:</label>
                <textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                />
            </div>
            <div>
                <label>Image:</label>
                {image && <img src={image} alt="poster" width="100" />}
                <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                />
            </div>
            <div>
                <label>Video:</label>
                <input
                    type="file"
                    onChange={(e) => setVideo(e.target.files[0])}
                />
            </div>
            <div>
                <label>Category:</label>
                <select value={movie.category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Action">Action</option>
                    <option value="Drama">Drama</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Horror">Horror</option>
                    <option value="Thriller">Thriller</option>
                    <option value="Romance">Romance</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                </select>
            </div>
            <div>
                <label>Rating:</label>
                <input
                    type="number"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    min="1"
                    max="10"
                />
            </div>
            <div>
                <label>Is Premium:</label>
                <input
                    type="checkbox"
                    checked={isPremium}
                    onChange={(e) => setIsPremium(e.target.checked)}
                />
            </div>
            <div>
                <label>Banner:</label>
                {banner && <img src={banner} alt="poster" width="100" />}
                <input
                    type="file"
                    onChange={(e) => setBanner(e.target.files[0])}
                />
            </div>
            <button onClick={handleUpdateMovie}>Add Movie</button>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
        </div>
    );
};

export default EditMovie;