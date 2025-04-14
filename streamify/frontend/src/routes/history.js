import {useEffect, useState} from "react";
import { get_history } from "../api/endpoints";
import styles from "../assets/css/history.module.css";
import OtherNavbar from "../components/other_navbar";
import { FaPlus,FaStar } from "react-icons/fa";
const History = ()=>{
    const[history,setHistory] = useState([]);

    const fetchMovies = async()=>{
        const response = await get_history();
        setHistory(response);
    }
    useEffect(()=>{

        fetchMovies();
    },[])

    return(
        <div className={styles.history_container}>
            <OtherNavbar/>
        <div className={styles.movie_grid}>
        {history.map((history) => (
          <div className={styles.movie_card}>
                <a href={`/movie/${history.movies_info.id}`}>
                    {/* Movie Poster */}
                    <img className={styles.movie_poster} src={history.movies_info.image} alt={history.movies_info.title} />

                    {/* Floating Plus Button */}
                    <button className={styles.add_button}>
                    <FaPlus />
                    </button>

                    {/* Movie Overlay Info */}
                    <div className={styles.movie_info}>
                    <div className={styles.top_info}>
                        <span>{history.movies_info.category} • {new Date(history.movies_info.release_date).getFullYear()}</span>
                        <div className={styles.movie_rating}>
                        <FaStar className={styles.star_icon} />
                        <span>{history.movies_info.rating}</span>
                        </div>
                    </div>
                    <div className={styles.movie_title}>{history.movies_info.title}</div>
                    </div>
                </a>
            </div>
        ))}
        </div>
      </div>
    )

}
export default History