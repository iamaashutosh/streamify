// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FaSearch, FaStar } from 'react-icons/fa';
// import { Link } from 'react-router-dom';
// import styles from '../assets/css/search_movie.module.css';
// import OtherNavbar from '../components/other_navbar';
// import { FaPlus } from 'react-icons/fa';

// const SearchMovies = () => {
//   const [query, setQuery] = useState('');
//   const [filteredMovies, setFilteredMovies] = useState([]);
//   const [allMovies, setAllMovies] = useState([]);
//   const [movies, setMovies] = useState([]);
//   const [genres, setGenres] = useState([]);
//   const [filters, setFilters] = useState({
//     releaseYear: '',
//     category: '',
//     minRating: ''
//   });


//   useEffect(() => {
//     const fetchMovies = async () => {
//       try {
//         const res = await axios.get('http://127.0.0.1:8000/movies/');
//         setAllMovies(res.data);
//         setFilteredMovies(res.data);
//       } catch (err) {
//         console.error('Error fetching movies:', err);
//       }
//     };


//     fetchMovies();
//   }, []);

//    const handleSearch = async () => {
//     const params = new URLSearchParams();

//     if (query) params.append('title', query);
//     if (filters.category) params.append('category', filters.category);
//     if (filters.minRating) params.append('min_rating', filters.minRating);
//     if (filters.releaseYear) params.append('release_year', filters.releaseYear);

//   try {
//     const res = await axios.get(`http://127.0.0.1:8000/movies/search_?${params.toString()}`);
//     setMovies(res.data);
//   } catch (err) {
//     console.error("Error fetching filtered movies", err);
//   }
// }


//   return (
//     <div className={styles.styles.search_container}>
//         <div>
//             <OtherNavbar/>
//         </div>
//         {/* <div className={styles.styles.search_page}>
//         <div className={styles.styles.search_bar}>
//             <FaSearch className={styles.styles.search_icon} />
//             <input
//             type="text"
//             value={query}
//             onChange={handleSearch}
//             placeholder="Search movies..."
//             />
//         </div>

//         <div className={styles.styles.movie_grid}>
//             {filteredMovies.length > 0 ? (
//             filteredMovies.map(movie => (
//                 <div className={styles.styles.movie_card}>
//                 <a href={`/movie/${movie.id}`}>
//                     }
//                     <img className={styles.styles.movie_poster} src={movie.image} alt={movie.title} />

//                     }
//                     <button className={styles.styles.add_button}>
//                     <FaPlus />
//                     </button>

//                     }
//                     <div className={styles.styles.movie_info}>
//                     <div className={styles.styles.top_info}>
//                         <span>
//                             <div className={styles.styles.movie_rating}>
//                             <FaStar className={styles.styles.star_icon} />
//                             <span>{movie.rating}</span>
//                             </div> • {new Date(movie.release_date).getFullYear()}
//                         </span>
//                     </div>
//                     <div className={styles.styles.movie_title}>{movie.title}</div>
//                     </div>
//                 </a>
//                 </div>
//             ))
//             ) : (
//             <p className={styles.styles.no_results}>No movies found.</p>
//             )}
//         </div>
//         </div> */}
//         <div className={styles.styles.search_page}>
//       <div className={styles.styles.filters}>
//         <input
//           type="text"
//           placeholder="Search movie title..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//         />

//         <input
//           type="number"
//           placeholder="Release Year"
//           value={filters.releaseYear}
//           onChange={(e) => setFilters({ ...filters, releaseYear: e.target.value })}
//         />

//         <select
//           value={filters.category}
//           onChange={(e) => setFilters({ ...filters, category: e.target.value })}
//         >
//           <option value="">All Genres</option>
          
//           <option value="Action">Action</option>
//             <option value="Drama">Drama</option>
//             <option value="Comedy">Comedy</option>
//             <option value="Horror">Horror</option>
//             <option value="Thriller">Thriller</option>
//             <option value="Romance">Romance</option>
//             <option value="Sci-Fi">Sci-Fi</option>
//         </select>

//         <input
//           type="number"
//           placeholder="Min Rating"
//           step="0.1"
//           max="10"
//           value={filters.minRating}
//           onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
//         />

//         <button onClick={handleSearch}>Search</button>
//       </div>

//       <div className={styles.styles.movies}>
//         {movies.map((movie) => (
//           <Link to={`/movie/${movie.id}`} key={movie.id} className={styles.styles.movie_card}>
//             <img src={movie.image} alt={movie.title} />
//             <div className={styles.styles.movie_info}>
//               <h3 className={styles.styles.movie_title}>{movie.title}</h3>
//               <p>{new Date(movie.release_date).getFullYear()} • <FaStar /> {movie.rating}</p>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//     </div>
//   );
// };

// export default SearchMovies;
// src/SearchMovies.js
// src/SearchMovies.js
import React, { useState } from 'react';
import axios from 'axios';
import styles from '../assets/css/search_movie.module.css'; // Import the CSS file
import OtherNavbar from '../components/other_navbar';
import { FaSearch, FaStar, FaPlus} from 'react-icons/fa';
import { useEffect,useCallback } from 'react';
import { Link } from 'react-router-dom';

const SearchMovies = () => {
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [allMovies, setAllMovies] = useState([]);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [year, setYear] = useState('');
    const [rating, setRating] = useState('');
    const [isPremium, setIsPremium] = useState(false);
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [moviesPerPage] = useState(15); 

    // const fetchMovies = async (e) => {
    //     e.preventDefault();
    //     const res = await axios.get('http://127.0.0.1:8000/movies/', {
    //         // params: {
    //         //     title,
    //         //     category,
    //         //     rating,
    //         //     is_premium: isPremium,
    //         // },
    //     });
    //     setAllMovies(res.data);
    //     setFilteredMovies(res.data);
    // };
    // useEffect(() => {

    //     const results = allMovies.filter(movie => {

    //         const matchesTitle = movie.title.toLowerCase().includes(title.toLowerCase());

    //         const matchesCategory = category ? movie.category === category : true;

    //         const matchesRating = rating ? movie.rating >= rating : true;

    //         const matchesPremium = isPremium ? movie.is_premium : true;


    //         return matchesTitle && matchesCategory && matchesRating && matchesPremium;

    //     });

    //     setFilteredMovies(results);
    //     fetchMovies();

    // }, [title, category, rating, isPremium, allMovies]);


    // const handleSearch = (e) => {

    //     setTitle(e.target.value);

    // };
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/movies/');
                setAllMovies(res.data);
                setFilteredMovies(res.data.slice(0, moviesPerPage));
            } catch (err) {
                console.error('Error fetching movies:', err);
            }
        };
        fetchMovies();
    }, [moviesPerPage]);

    useEffect(() => {

        const results = allMovies.filter(movie => {
            const matchesTitle = movie.title.toLowerCase().includes(title.toLowerCase());
            const matchesCategory = category ? movie.category === category : true;
            const matchesYear = year 
            ? new Date(movie.release_date).getFullYear() === parseInt(year) 
            : true;
            const matchesRating = rating ? movie.rating >= rating : true;
            return matchesTitle && matchesCategory && matchesYear && matchesRating;
        });
        setFilteredMovies(results.slice(0, page * moviesPerPage));
    }, [title, category, rating, isPremium, allMovies,year,page,moviesPerPage]);

    const handleSearch = (e) => {
        setTitle(e.target.value);
        setPage(1);
    };
    const handleScroll = useCallback(() => {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
        setPage(prevPage => prevPage + 1);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    return (
        // <div className={styles.styles.search_container}>
        //     <div>
        //         <OtherNavbar/>
        //     </div>
        //     <h1 className={styles.styles.search_title}>Search Movies</h1>
        //     <form className={styles.styles.search_form} onSubmit={handleSearch}>
        //         <label class>Search
        //         <input
        //             type="text"
        //             placeholder="Title"
        //             value={title}
        //             onChange={(e) => setTitle(e.target.value)}
        //             className={styles.styles.search_input}
        //         />
        //         </label>
        //         <div className={styles.styles.other_inputs}>

                
        //         <select value={category} onChange={(e) => setCategory(e.target.value)} className={styles.styles.search_select}>
        //             <option value="">Genre</option>
        //             <option value="Action">Action</option>
        //             <option value="Drama">Drama</option>
        //             <option value="Comedy">Comedy</option>
        //             <option value="Horror">Horror</option>
        //             <option value="Thriller">Thriller</option>
        //             <option value="Romance">Romance</option>
        //             <option value="Sci-Fi">Sci-Fi</option>
        //         </select>
        //         <input
        //             type="number"
        //             placeholder="Rating"
        //             value={rating}
        //             onChange={(e) => setRating(e.target.value)}
        //             className={styles.styles.search_input}
        //         />
        //         <label className={styles.styles.premium_label}>
        //             <input
        //                 type="checkbox"
        //                 checked={isPremium}
        //                 onChange={(e) => setIsPremium(e.target.checked)}
        //             />
        //             Premium Only
        //         </label>
                
        //         <button type="submit" ><FaSearch/></button>
        //         </div>
        //     </form>
        //     <div className={styles.styles.movies_list}>
        //         {movies.map((movie) => (
        //             <div key={movie.id} className={styles.styles.movie_card}>
        //                 <h3>{movie.title}</h3>
        //                 <p>{movie.desc}</p>
        //                 {movie.image && <img src={movie.image} alt={movie.title} className={styles.styles.movie_image} />}
        //             </div>
        //         ))}
        //     </div>
        // </div>
        <div className={styles.search_container}>
            <div>
                <OtherNavbar/>
            </div>
            <form className={styles.search_filters_container} onSubmit={handleSearch}>
                <div className={styles.search_filters_row}>
                <div className={styles.filter_item}>
                    <span className={styles.filter_label}>Search</span>
                    <input value={title} type="text" placeholder="Search..." className={styles.search_input} onChange={(e) => setTitle(e.target.value)}/>
                </div>
                
                <div className={styles.filter_item}>
                    <span className={styles.filter_label}>Genres</span>
                    <div className={styles.filter_value}>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className={styles.search_select}>
                            <option value="">Genre</option>
                            <option value="Action">Action</option>
                            <option value="Drama">Drama</option>
                            <option value="Comedy">Comedy</option>
                            <option value="Horror">Horror</option>
                            <option value="Thriller">Thriller</option>
                            <option value="Romance">Romance</option>
                        <option value="Sci-Fi">Sci-Fi</option>
                        </select>
                    </div>
                </div>
                
                {/* <div className={styles.filter_item}>
                    <span className={styles.filter_label}>Year</span>
                    <input value={year} type="text" placeholder="Year" className={styles.filter_value} onChange={(e) => setYear(e.target.value)}/>
                </div> */}
                <div className={styles.filter_item}>
                    <span className={styles.filter_label}>Year</span>
                    <select 
                        value={year} 
                        className={styles.filter_value} 
                        onChange={(e) => setYear(e.target.value)}
                    >
                        <option value="">All Years</option>
                        {Array.from({length: 16}, (_, i) => 2025 - i).map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                
                <div className={styles.filter_item}>
                    <span className={styles.filter_label}>Rating</span>
                    <input value={rating} type="text" placeholder="Rating" className={styles.filter_value} onChange={(e) => setRating(e.target.value)}/>
                </div>
                
                <button type="submit" className={styles.search_btn}><FaSearch/></button>
                </div>
            </form>
            <div className={styles.movie_grid}>
                {filteredMovies.length > 0 ? (
                filteredMovies.map(movie => (
                    <div className={styles.movie_card}>
                        <a href={`/movie/${movie.id}`}>
                            {/* Movie Poster */}
                            <img className={styles.movie_poster} src={movie.image} alt={movie.title} />

                            {/* Floating Plus Button */}
                            <button className={styles.add_button}>
                            <FaPlus />
                            </button>

                            {/* Movie Overlay Info */}
                            <div className={styles.movie_info}>
                            <div className={styles.top_info}>
                                <span>Movie • {new Date(movie.release_date).getFullYear()}</span>
                                <div className={styles.movie_rating}>
                                <FaStar className={styles.star_icon} />
                                <span>{movie.rating}</span>
                                </div>
                            </div>
                            <div className={styles.movie_title}>{movie.title}</div>
                            </div>
                        </a>
                    </div>
                ))
                ) : (
                <p className="no-results">No movies found.</p>
                )}
            </div>
    </div>
    );
};

export default SearchMovies;