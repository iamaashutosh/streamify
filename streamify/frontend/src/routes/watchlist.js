import {useState,useEffect} from 'react'
import OtherNavbar from '../components/other_navbar';
import styles from '../assets/css/watchlist.module.css';
import { get_watchlist } from '../api/endpoints';
import { FaPlus,FaStar } from 'react-icons/fa';

const WatchList =()=>{
    const [watchlist, setWatchlist] = useState([]);

    const fetchMovies=async()=>{
        const response = await get_watchlist();
        setWatchlist(response)
    }
    useEffect(()=>{

        fetchMovies();
    },[])
    return(
        <div className={styles.watchlist_container}>
            <OtherNavbar/>
            <div className={styles.movie_grid}>
                {watchlist.map((watchlist) => (
                    <div className={styles.movie_card}>
                        <a href={`/movie/${watchlist.movies_info.id}`}>
                            {/* Movie Poster */}
                            <img className={styles.movie_poster} src={watchlist.movies_info.image} alt={watchlist.movies_info.title} />
        
                            {/* Floating Plus Button */}
                            <button className={styles.add_button}>
                            <FaPlus />
                            </button>
        
                            {/* Movie Overlay Info */}
                            <div className={styles.movie_info}>
                            <div className={styles.top_info}>
                                <span>{watchlist.movies_info.category} • {new Date(watchlist.movies_info.release_date).getFullYear()}</span>
                                <div className={styles.movie_rating}>
                                <FaStar className={styles.star_icon} />
                                <span>{watchlist.movies_info.rating}</span>
                                </div>
                            </div>
                            <div className={styles.movie_title}>{watchlist.movies_info.title}</div>
                            </div>
                        </a>
                    </div>
                ))}
                </div>
        </div>
    )
}
export default WatchList;