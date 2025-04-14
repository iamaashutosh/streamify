import React, { useEffect, useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './add_type.module.css';
import AdminNavbar from './navbar';

const EditType = () => {
    
    const { id } = useParams();
  const [name, setName] = useState('');
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  

  const fetchTypeDetail = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/update_type/${id}`, { withCredentials: true });
      setName(response.data.name);
      setSelectedMovies(response.data.movies);
    } catch (err) {
      setError('Failed to fetch type');
      setSuccess(null);
    }
  };
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
    fetchTypeDetail();
  }, [id]);

  const handleMovieSelect = (id) => {
    setSelectedMovies((prev) =>
      prev.includes(id) ? prev.filter((mid) => mid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async(e)=>{
    e.preventDefault();
    const formData = new FormData();
        formData.append('name', name);
        selectedMovies.forEach(movieId => {
            formData.append('movies', movieId);
          });

        try {
            const response = await axios.put(`http://127.0.0.1:8000/update_type/${id}/`, formData,{
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              withCredentials: true,
            });
        
            console.log("Update successful", response.data);
            setSuccess('Movie updated successfully!');
            setError('');
            setTimeout(() => navigate('/type'), 1000);
          } catch (err) {
            console.error("Update failed", err.response?.data || err.message);
            setError('Failed to update movie.');
          }
        };

  return (
    <div className={styles.add_type_container}>
    <div>
        <AdminNavbar/>
    </div>
    <div className={styles.add_type_form}>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Type Name:</label>
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
        <button type="submit">Add Type</button>
      </form>
      {success && <p className={styles.success}>{success}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
    </div>
  );
};

export default EditType;
