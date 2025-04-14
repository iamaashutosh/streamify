import {useEffect,useState} from "react";
import styles from './movie_type.module.css';
import AdminNavbar from "./navbar";
import { get_type } from "../api/endpoints";
import axios from "axios";

const MovieType = () =>{
    const [type ,setType] =useState('');

    const fetchType = async() =>{
        const response = await get_type();
        setType(response);
    }
    const handleDelete = async(id)=>{

        await axios.delete(`http://127.0.0.1:8000/update_type/${id}/`,{withCredentials:true})
        window.location.reload();
    }
    useEffect(()=>{
        fetchType();
    },[])

    return(
        <div className={styles.type}>
            <div>
                <AdminNavbar />
            </div>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1>Manage Types</h1>
                    <a href="/add_type" className={styles.addTypeButton}>
                    + Add Type
                    </a>
                </div>
                <div className={styles.tableContainer}>
                    {type.length === 0 ? (
                    <p className={styles.noMovies}>No movies available</p>
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
                        {type.map((type) => (
                            <tr key={type.id}>
                            <td>
                                {type.id}
                            </td>
                            <td>{type.name}</td>
                            <td>
                                <a href={`/update_type/${type.id}`} className={styles.editButton}>Edit</a>
                                <button onClick={() => handleDelete(type.id)} className={styles.deleteButton}>Delete</button>
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
export default MovieType;