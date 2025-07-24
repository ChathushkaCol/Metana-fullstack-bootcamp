import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';

const PrivateRoute = ({ children }) => {
  const { isAdmin } = useContext(AuthContext);
  return isAdmin ? children : <Navigate to="/404" />;
};

export default PrivateRoute;
