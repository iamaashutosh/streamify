import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/'

const LOGIN_URL = `${BASE_URL}token/`
const REGISTER_URL = `${BASE_URL}register/`
const LOGOUT_URL = `${BASE_URL}logout/`
const NOTES_URL = `${BASE_URL}movies/`
const AUTHENTICATED_URL = `${BASE_URL}authenticated/`

axios.defaults.withCredentials = true; 

export const login = async (username, password) => {
    try {
        const response = await axios.post(
            LOGIN_URL, 
            { username, password },
            { withCredentials: true }  
        );
        
        return response.data
    } catch (error) {
        console.error("Login failed:", error);
        return false;  
    }
};

export const get_movies = async () => {
    const response = await axios.get(NOTES_URL, { withCredentials: true });
    return response.data;
};
export const get_movie = async (id) => {
    const response = await axios.get(`${NOTES_URL}${id}/`, { withCredentials: true });
    return response.data;
};
export const update_movie = async(id)=>{
    const response = await axios.put(`http://127.0.0.1:8000/movies/${id}/`, { withCredentials: true },{
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
}


export const logout = async () => {
    const response = await axios.post(LOGOUT_URL, { withCredentials: true });
    return response.data;
};

export const register = async (username,first_name,last_name, email, password) => {
    const response = await axios.post(REGISTER_URL, {username,first_name, last_name, email, password}, { withCredentials: true });
    return response.data;
};

export const authenticated_user = async () => {
    const response = await axios.get(AUTHENTICATED_URL, { withCredentials: true });
    return response.data
}
export const get_user_profile = async()=>{
    const response = await axios.get(`${BASE_URL}user_profile/`, { withCredentials: true });
    return response.data
}
export const get_subsciption_data = async()=>{
    const response = await axios.get(`${BASE_URL}subscription/status/`, { withCredentials: true });
    return response.data
}
export const get_type = async()=>{
    const response = await axios.get(`${BASE_URL}type/`,{withCredentials:true});
    return response.data;
}

export const get_cast = async()=>{
    const response = await axios.get(`${BASE_URL}cast/`,{withCredentials:true});
    return response.data;
}
export const get_history = async()=>{
    const response = await axios.get(`${BASE_URL}history/`,{withCredentials:true})
    return response.data
}
export const get_watchlist = async()=>{
    const response = await axios.get(`${BASE_URL}watchlist/`,{withCredentials:true})
    return response.data
}

export const get_recommended_movies = async() => {
    const response = await axios.get(`${BASE_URL}recommendations/`,{withCredentials:true})
    return response.data
}