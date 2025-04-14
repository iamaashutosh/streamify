import React, { useState, useEffect } from 'react';
import styles from './MovieCarousel.module.css' 
import axios from 'axios';
import { get_movies } from "../api/endpoints";
import { FaCalendar,FaStar,FaPlay } from 'react-icons/fa';


const MovieCarousel = () => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await get_movies();
        setMovies(response);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  const nextMovie = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };

  const prevMovie = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + movies.length) % movies.length);
  };

  // If movies are not loaded yet, show a loading message
  if (movies.length === 0) {
    return <div>Loading...</div>;
  }

  const { title, release_date, rating, desc, banner } = movies[currentIndex];

  return (
    <div className={styles.carousel}>
       <div className={styles.carousel_image_container}>
            <img className={styles.carousel_image} src={banner} alt={title} />
            <div className={styles.carousel_overlay}></div> {/* Dark overlay */}
         </div>
        <div className={styles.carousel_content}>
            <div className={styles.icons}>
                <div className={styles.movie_year}><FaCalendar/>{new Date(release_date).getFullYear()}</div>
                <div className={styles.movie_rating}><FaStar/>5</div>
            </div>
            <h1 className={styles.movie_title}>{title}</h1>
            
            
            <p className={styles.movie_description}>{desc}</p>
            <p><button className={styles.watch_now_button}><FaPlay/>Watch Now</button></p>
        </div>
      <div className={styles.carousel_controls}>
        <button onClick={prevMovie} className={styles.carousel_button}>❮</button>
        <button onClick={nextMovie} className={styles.carousel_button}>❯</button>
      </div>
    </div>
  );
};

export default MovieCarousel;