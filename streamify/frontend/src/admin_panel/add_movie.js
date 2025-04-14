// import React, { useEffect, useState } from "react";
// import AdminNavbar from "./navbar";
// import { get_movies, add_movie } from "../api/endpoints";
// import "./admin_movie.css";

// const AdminMovies = () => {
//   const [movies, setMovies] = useState([]);

//   // Form state
//   const [title, setTitle] = useState("");
//   const [desc, setDesc] = useState("");
//   const [image, setImage] = useState(null);
//   const [banner, setBanner] = useState(null);
//   const [video, setVideo] = useState(null);
//   const [category, setCategory] = useState("Drama");
//   const [rating, setRating] = useState("");
//   const [releaseDate, setReleaseDate] = useState("");
//   const [isPremium, setIsPremium] = useState(false);

//   useEffect(() => {
//     const fetchMovies = async () => {
//       const moviesData = await get_movies();
//       setMovies(moviesData);
//     };
//     fetchMovies();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("desc", desc);
//     formData.append("category", category);
//     formData.append("rating", rating);
//     formData.append("release_date", releaseDate);
//     formData.append("is_premium", isPremium);
//     if (image) formData.append("image", image);
//     if (banner) formData.append("banner", banner);
//     if (video) formData.append("video", video);

//     try {
//       await add_movie(formData);
//       const updated = await get_movies();
//       setMovies(updated);
//       // Reset form
//       setTitle(""); setDesc(""); setImage(null); setBanner(null); setVideo(null);
//       setCategory("Drama"); setRating(""); setReleaseDate(""); setIsPremium(false);
//     } catch (error) {
//       console.error("Failed to add movie", error);
//     }
//   };

//   return (
//     <div className="moviess">
//       <AdminNavbar />
//       <div className="content">
//         <div className="manage-movies">
//           <h2>Manage Movies</h2>
//           <form className="movie-form" onSubmit={handleSubmit}>
//             <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
//             <textarea placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} required />
//             <select value={category} onChange={(e) => setCategory(e.target.value)}>
//               <option value="Action">Action</option>
//               <option value="Drama">Drama</option>
//               <option value="Comedy">Comedy</option>
//               <option value="Horror">Horror</option>
//               <option value="Thriller">Thriller</option>
//               <option value="Romance">Romance</option>
//               <option value="Sci-Fi">Sci-Fi</option>
//             </select>
//             <input type="number" placeholder="Rating (1-10)" value={rating} onChange={(e) => setRating(e.target.value)} />
//             <input type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
//             <label>
//               <input type="checkbox" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} />
//               Premium Movie
//             </label>
//             <label>Poster Image: <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} /></label>
//             <label>Banner Image: <input type="file" accept="image/*" onChange={(e) => setBanner(e.target.files[0])} /></label>
//             <label>Video File: <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} /></label>
//             <button type="submit">Add Movie</button>
//           </form>

//           <div className="movie-list">
//             <h3>Movie List</h3>
//             {movies.map((movie) => (
//               <div key={movie.id} className="movie-item">
//                 <span>{movie.title}</span>
//                 <button>Delete</button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminMovies;

import React, { useState } from 'react';
import { useEffect } from 'react';
import { get_movies } from '../api/endpoints';
import axios from 'axios';
import './add_movie.css';
import AdminNavbar from './navbar';

const AddMovie= () => {

    const [movies, setMovies] = useState([]);
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


    useEffect(() => {
        const fetchMovies = async () => {
          const moviesData = await get_movies();
          setMovies(moviesData);
        };
        fetchMovies();
      }, []);

    const handleAddMovie = async () => {
        if (!title || !desc) {

            setError('Title and description are required.');
    
            return;
    
        }
    
        if (rating < 1 || rating > 10) {
    
            setError('Rating must be between 1 and 10.');
    
            return;
    
        }
        const formData = new FormData();
        formData.append('title', title);
        formData.append('desc', desc);
        if (image) formData.append('image', image);
        if (video) formData.append('video', video);
        formData.append('category', category);
        if (rating) formData.append('rating', rating);
        formData.append('is_premium', isPremium);
        if (banner) formData.append('banner', banner);

        try {
            const response = await axios.post('http://127.0.0.1:8000/movies/', formData,{withCredentials:true}, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSuccess('Movie added successfully!');
            setError(null);
            // Reset fields
            setTitle('');
            setDesc('');
            setImage(null);
            setVideo(null);
            setCategory('Drama');
            setRating('');
            setIsPremium(false);
            setBanner(null);
        } catch (err) {
            setError('Failed to add movie. Please try again.');
            setSuccess(null);
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
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
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
                <input
                    type="file"
                    onChange={(e) => setBanner(e.target.files[0])}
                />
            </div>
            <button onClick={handleAddMovie}>Add Movie</button>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
        </div>
    );
};

export default AddMovie;