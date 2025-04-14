import React from "react";
import {useEffect,useState} from "react";
import AdminNavbar from "./navbar";
import styles from './cast.module.css';
import { get_cast } from "../api/endpoints";

const Cast =()=>{
    const [cast,setCast] = useState([]);

    const fetchCast = async()=>{
        const response = await get_cast();
        setCast(response);
    }
    useEffect(()=>{
        fetchCast();
    },[])
    return(
        <div className={styles.cast_container}>
            <div>
                <AdminNavbar/>
            </div>
            <div className={styles.content}>
                            <div className={styles.header}>
                                <h1>Manage Cast</h1>
                                <a href="/add_cast" className={styles.addTypeButton}>
                                + Add People
                                </a>
                            </div>
                            <div className={styles.tableContainer}>
                                {cast.length === 0 ? (
                                <p className={styles.noMovies}>No People available</p>
                                ) : (
                                <table className={styles.movieTable}>
                                    <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Name</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {cast.map((cast) => (
                                        <tr key={cast.id}>
                                        <td>
                                            {cast.id}
                                        </td>
                                        <td>{cast.name}</td>
                                        <td>
                                            <a href={`/edit_movie/${cast.id}`} className={styles.editButton}>Edit</a>
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
    )

}
export default Cast