import { useAuth } from "../context/useAuth";
import Navbar from "../components/navbar";
import MovieCarousel from "../components/carousel";
import "../assets/css/homepage.css";
import Movies from "../components/movies_list";

const Home = () => {
  
  const { user, logoutUser } = useAuth();

  return (
    <div className="homepage">
      <Navbar/>
      {/*<div className="homepage-background">*/}
        <MovieCarousel/>
      
      <div className="movies">
        <Movies/>
      </div>
    </div>
  );
};
export default Home;