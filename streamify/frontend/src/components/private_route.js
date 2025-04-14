import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Layout from './layout';
import { Heading } from '@chakra-ui/react';

import { useNavigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  
  if (loading) return <Layout><Heading>Loading...</Heading></Layout>;

  if (user) {
    return children
  }
  else {
    nav('/login')
  }

};

export default PrivateRoute;
