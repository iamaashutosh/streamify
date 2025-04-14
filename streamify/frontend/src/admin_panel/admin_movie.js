import react, { useEffect } from 'react';
import AdminNavbar from './navbar';
import styles from './admin_movie.module.css';
import {useState} from 'react';
import { get_movies } from '../api/endpoints';

const AdminMovie=()=>{
    const [movies,setMovies]=useState([]);

    const fetchMovies=async()=>{
        try {
            const response = await get_movies();
            setMovies(response);
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    }
    useEffect(() => {
        fetchMovies();
    }, []);
    return(
        <div className={styles.moviess}>
        <div>
        <AdminNavbar />
        </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>Manage Movies</h1>
          <a href="/add_movies" className={styles.addMovieButton}>
            + Add Movie
          </a>
        </div>

        {/* Movie List Table */}
        <div className={styles.tableContainer}>
          {movies.length === 0 ? (
            <p className={styles.noMovies}>No movies available</p>
          ) : (
            <table className={styles.movieTable}>
              <thead>
                <tr>
                  <th>Poster</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Release Year</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((movie) => (
                  <tr key={movie.id}>
                    <td>
                      <img src={movie.image} alt={movie.title} className={styles.movieImage} />
                    </td>
                    <td>{movie.title}</td>
                    <td>{movie.category}</td>
                    <td>{new Date(movie.release_date).getFullYear()}</td>
                    <td>{movie.rating || "N/A"}</td>
                    <td>
                      <a href={`/edit_movie/${movie.id}`} className={styles.editButton}>Edit</a>
                      <button className={styles.deleteButton}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
    );
    
}
export default AdminMovie;