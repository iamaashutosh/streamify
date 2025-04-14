import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Layout from './layout';
import { Heading } from '@chakra-ui/react';

import { useNavigate } from 'react-router-dom';

const SuperPrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  
  if (loading) return <Layout><Heading>Loading...</Heading></Layout>;

  if (user.is_superuser) {
    return children
  }
  else {
    <div>
        <Layout>
            <Heading>Access Denied</Heading>
            <p>You do not have permission to access this page.</p>
        </Layout>
    </div>
  }

};

export default SuperPrivateRoute;
