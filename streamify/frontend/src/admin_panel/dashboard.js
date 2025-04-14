import react, { use } from 'react';
import { useEffect, useState } from 'react';
import { get_movies } from '../api/endpoints';
import { useAuth } from '../context/useAuth';
import Navbar from '../components/navbar';
import AdminNavbar from './navbar';


const Dashboard=()=>{
    const [movies, setMovies] = useState([]);
   
    const fetchmovies= async () => {
        try {
            const response = await get_movies();
            setMovies(response);
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    }
    useEffect(() => {
        fetchmovies();
    }, []);
    return(
    <>
        <AdminNavbar/>
    </>
    );
    
}
export default  Dashboard;