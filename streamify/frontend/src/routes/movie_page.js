import React, { useEffect, useState } from 'react';
import { get_recommended_movies } from '../api/endpoints';
import OtherNavbar from '../components/other_navbar';
import styles from '../assets/css/recommend.module.css';
import { FaStar,FaPlus } from 'react-icons/fa';

const RecommendationList= () => {
  const [movies, setMovies] = useState([]);

  const fetchMovies=async()=>{
    const response = await get_recommended_movies();
    setMovies(response);
  }
  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className={styles.recommend_container}>
        <OtherNavbar/>
      <h2>Recommended For You</h2>
        <div className={styles.movie_grid}>
        {movies.map(movie => (
          <div className={styles.movie_card}>
            <a href={`/movie/${movie.id}`}>
                {/* Movie Poster */}
                <img className={styles.movie_poster} src={`http://127.0.0.1:8000/${movie.image}`} alt={movie.title} />

                {/* Floating Plus Button */}
                <button className={styles.add_button}>
                <FaPlus />
                </button>

                {/* Movie Overlay Info */}
                <div className={styles.movie_info}>
                <div className={styles.top_info}>
                    <span>{movie.category} • {new Date(movie.release_date).getFullYear()}</span>
                    <div className={styles.movie_rating}>
                    <FaStar className={styles.star_icon} />
                    <span>{movie.rating}</span>
                    </div>
                </div>
                <div className={styles.movie_title}>{movie.title}</div>
                </div>
            </a>
            </div>
        ))}
        </div>
    </div>

  );
}

export default RecommendationList;