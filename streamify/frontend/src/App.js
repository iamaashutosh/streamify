import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'

import { AuthProvider } from './context/useAuth';

import Login from './routes/login';
import Home from './routes/menu';
import Register from './routes/register';

import Layout from './components/layout';
import PrivateRoute from './components/private_route';
import LandingPage from './routes/landing';
import Movie from './routes/movie';
import UserProfile from './routes/user_profile';
import theme from './theme';
import Dashboard from './admin_panel/dashboard';
import SuperPrivateRoute from './components/superprivate';
import AdminMovie from './admin_panel/admin_movie';
import AddMovie from './admin_panel/add_movie';
import "./App.css";
import UserProfileEdit from './routes/edit_profile';
import EditMovie from './admin_panel/edit_movie';
import MovieType from './admin_panel/movie_type';
import AddType from './admin_panel/add_type';
import SearchMovies from './routes/search_movie';
import Cast from './admin_panel/cast';
import AddCast from './admin_panel/add_cast';
import EditType from './admin_panel/edit_type';
import Success from './routes/subscription_success';
import History from './routes/history';
import WatchList from './routes/watchlist';
import RecommendationList from './routes/movie_page';

function App() {
  return (
   <ChakraProvider theme={theme}>
        <Router>
          <AuthProvider>
              <Routes>
                <Route element={<Layout><LandingPage/></Layout>} path='/'  />  
                <Route element={<PrivateRoute><Layout><Home /></Layout></PrivateRoute>} path='/home' />
                <Route element={<PrivateRoute><Layout><Movie /></Layout></PrivateRoute>} path="/movie/:id"/>
                <Route element={<Layout><Login /></Layout>} path='/login' /> 
                <Route element={<Layout><Register /></Layout>} path='/register' /> 
                <Route element={<PrivateRoute><Layout><UserProfile/></Layout></PrivateRoute>} path='/profile'/>
                <Route element={<PrivateRoute><Layout><SearchMovies/></Layout></PrivateRoute>} path='/search'/>
                <Route element={<PrivateRoute><Layout><History/></Layout></PrivateRoute>} path='/history'/>
                <Route element={<PrivateRoute><Layout><WatchList/></Layout></PrivateRoute>} path='/watchlist'/>
                <Route element={<PrivateRoute><Layout><RecommendationList/></Layout></PrivateRoute>} path='/movies'/>                                
                <Route element={<PrivateRoute><Layout><UserProfileEdit/></Layout></PrivateRoute>} path='/edit_profile'exact/>
                <Route element={<SuperPrivateRoute><Dashboard/></SuperPrivateRoute>}path='/admin'/>
                <Route element={<SuperPrivateRoute><Layout><AdminMovie /></Layout></SuperPrivateRoute>} path='/admin_movies' />
                <Route element={<SuperPrivateRoute><Layout><AddMovie /></Layout></SuperPrivateRoute>} path='/add_movies' />
                <Route element={<SuperPrivateRoute><Layout><EditMovie/></Layout></SuperPrivateRoute>} path='/edit_movie/:id'/>
                <Route element={<SuperPrivateRoute><Layout><MovieType/></Layout></SuperPrivateRoute>} path ='/type'/>
                <Route element={<SuperPrivateRoute><Layout><AddType/></Layout></SuperPrivateRoute>} path ='/add_type'/>
                <Route element={<SuperPrivateRoute><Layout><EditType/></Layout></SuperPrivateRoute>} path ='/update_type/:id'/>
                <Route element={<SuperPrivateRoute><Layout><Cast/></Layout></SuperPrivateRoute>} path='/cast'/>
                <Route element={<SuperPrivateRoute><Layout><AddCast/></Layout></SuperPrivateRoute>} path='/add_cast'/>
                <Route path="/success" element={<PrivateRoute><Layout><Success /></Layout></PrivateRoute>} />

              </Routes>
          </AuthProvider>
        </Router>
    </ChakraProvider>
    
  );
}

export default App;
