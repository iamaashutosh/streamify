import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { get_movies, get_type } from '../api/endpoints';
import styles from './movies_list.module.css';
import { FaStar,FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const[types, setTypes] = useState([]);
    const navigate = useNavigate();

  useEffect(() => {
    // const fetchMovies = async () => {
    //   try {
    //     const response = await get_movies(); // Replace with your API URL
    //     setMovies(response);
    //   } catch (error) {
    //     console.error('Error fetching categories:', error);
    //   }
    // };
    const fetchTypes = async()=>{
        try{
            const response = await get_type();
            setTypes(response);

        }
        catch(error){
            console.error('Error fetching categories:',error);
        }
    }

    //fetchMovies();
    fetchTypes();
  }, []);

  return (
    <div className={styles.movie_container}>
    {types.map((type)=>(
    <div>
    <h2 className={styles.categories_title}>{type.name}</h2>
    <div className={styles.trending_today}>
    {type.movies_info.map((movie)=>(
      <a href={`/movie/${movie.id}`}>
        <div className={styles.movie_card}>
            <img className={styles.movie_poster} src={movie.image} alt={movie.title} />

            <button className={styles.add_button}>
                <FaPlus />
            </button>

            <div className={styles.movie_info}>
                <h3 className={styles.movie_title}>{movie.title}</h3>
                <p className={styles.movie_year}>Movie • {new Date(movie.release_date).getFullYear()}</p>

                <div className={styles.movie_rating}>
                    <FaStar className={styles.star_icon} />
                    <span>{movie.rating}</span>
                </div>
            </div>
        </div>
        </a>
    ))}
    </div>
    </div>
    ))}
    </div>
  );
};

export default Movies;