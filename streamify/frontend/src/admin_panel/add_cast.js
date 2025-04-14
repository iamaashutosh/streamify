import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './add_type.module.css';
import AdminNavbar from './navbar';

const AddCast = () => {
  const [name, setName] = useState('');
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/movies/');
        setAllMovies(res.data);
      } catch (err) {
        console.error('Failed to fetch movies');
      }
    };
    fetchMovies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/cast/', {
        name,
        movies: selectedMovies,
      }, { withCredentials: true });
      setSuccess('Cast added successfully!');
      setError(null);
      setName('');
      setSelectedMovies([]);
    } catch (err) {
      setError('Failed to add Cast');
      setSuccess(null);
    }
  };

  const handleMovieSelect = (id) => {
    setSelectedMovies((prev) =>
      prev.includes(id) ? prev.filter((mid) => mid !== id) : [...prev, id]
    );
  };

  return (
    <div className={styles.add_type_container}>
    <div>
        <AdminNavbar/>
    </div>
    <div className={styles.add_type_form}>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Select Movies:</label>
          <div style={{ maxHeight: '200px', overflowY: 'scroll', border: '1px solid #ccc' }}>
            {allMovies.map((movie) => (
              <div key={movie.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedMovies.includes(movie.id)}
                    onChange={() => handleMovieSelect(movie.id)}
                  />
                  {movie.title}
                </label>
              </div>
            ))}
          </div>
        </div>
        <button type="submit">Add Cast</button>
      </form>
      {success && <p className={styles.success}>{success}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
    </div>
  );
};

export default AddCast;
