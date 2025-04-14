/* import { useParams } from 'react-router-dom'
import VideoPlayer from '../components/videoplayer'
import { useRef } from 'react'
import videojs from 'video.js'

function Movie(){
  const playerRef = useRef(null)
  const {id} = useParams();
  const videoLink = `http://127.0.0.1:8000/media/videos/hls/${id}/playlist.m3u8`

  const videoPlayerOptions = {
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: videoLink,
        type: "application/x-mpegURL"
      }
    ]
  }
  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };
  return (
    <>
      <div>
        <h1>Video player</h1>
      </div>
      <VideoPlayer
      options={videoPlayerOptions}
      onReady={handlePlayerReady}
      />
    </>
  )
}

export default Movie */

import { useParams } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import videojs from "video.js";
import VideoPlayer from "../components/videoplayer";
import styles from "../assets/css/movie_detail.module.css";
import { FaCalendar, FaStar } from "react-icons/fa";
import axios from "axios";
import { get_movie } from "../api/endpoints";
import '../assets/css/video_player.css';
import OtherNavbar from "../components/other_navbar";

function Movie() {
  const playerRef = useRef(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState({});
  const [cast ,setCast] = useState([]);

  const videoLink = `http://127.0.0.1:8000/media/videos/hls/${id}/master.m3u8`;

  const fetchMovie= async()=>{
    try{
      const response = await get_movie(id);
      setMovie(response);
    }
    catch(error){
      console.error('Error fetching movie:',error);
    }
  }
  useEffect(()=>{
    fetchMovie();
    fetchCast();
  },[id])

  const fetchCast = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/movies/${id}/cast/`);
      setCast(response.data);
    } catch (error) {
      console.error("Error fetching cast:", error);
    }
  };

  const videoPlayerOptions = {
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: videoLink,
        type: "application/x-mpegURL",
      },
    ],
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;
    setLoading(false);

    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  return (
    <div className={styles.movie_detail_page}>
      <div>
        <OtherNavbar/>
      </div>
    <div className={styles.container}>
  {/* Banner */}
  <div className={styles.banner} style={{ backgroundImage: `url(${movie.banner || movie.image})` }}>
    <div className={styles.overlay}>
      {/*<h1 className={styles.bannerTitle}>{movie.title}</h1>
      <p className={styles.bannerMeta}>
        {new Date(movie.release_date).getFullYear()} • <FaStar className={styles.starIcon} /> {movie.rating}
      </p> */}
    </div>
  </div>

  {/* Content */}
  <div className={styles.content}>

    
    <div className={styles.details}>
      <div className={styles.info}>
        <h1 className={styles.movieTitle}>{movie.title}</h1>
        <p className={styles.bannerMeta}>
        {new Date(movie.release_date).getFullYear()} • <FaStar className={styles.starIcon} /> {movie.rating}
      </p>
        <p className={styles.description}>{movie.desc}</p>
      </div>
      <img className={styles.poster} src={movie.image} alt={movie.title} />
    </div>
    <div className={styles.video}>
      <VideoPlayer className="vjs-netflix" options={videoPlayerOptions} onReady={handlePlayerReady} />
    </div>
  </div>

  {/* Cast */}
  <div className={styles.cast}>
    <h2>Cast</h2>
    <div className={styles.cast_list}>
      {cast.map((actor) => (
        <div key={actor.id} className={styles.cast_member}>
          <img
            src={`http://127.0.0.1:8000/${actor.image}`}
            alt={actor.name}
            className={styles.cast_image}
          />
          <p className={styles.cast_name}>{actor.name}</p>
        </div>
      ))}
    </div>
  </div>
</div>
</div>

  );
}

export default Movie;
