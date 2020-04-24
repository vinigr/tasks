import React, { lazy, Suspense } from 'react';

import { BrowserRouter, Route } from 'react-router-dom';
import * as RRD from 'react-router-dom';

import Loading from './components/Loading';
import { isLoggedIn } from './helpers/auth';

const Routes = (RRD as any).Routes;
const Navigate = (RRD as any).Navigate;

const Login = lazy(() => import('./pages/Login/Login'));
const Register = lazy(() => import('./pages/Register/Register'));

const TaskList = lazy(() => import('./pages/TaskList/TaskList'));
const TaskDetails = lazy(() => import('./pages/TaskDetails/TaskDetails'));
const TaskAdd = lazy(() => import('./pages/TaskAdd/TaskAdd'));

interface RouteProps extends RRD.RouteProps {
  element: any;
}

const PrivateRoute = (props: RouteProps) => {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return <Route {...props} />;
};

const AuthRoute = (props: RouteProps) => {
  if (isLoggedIn()) {
    return <Navigate to="/" replace />;
  }

  return <Route {...props} />;
};

const RoutesApp = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <AuthRoute path="/login" element={<Login />} />
          <AuthRoute path="/register" element={<Register />} />
          <PrivateRoute path="/" element={<TaskList />} />
          <PrivateRoute path="/task/:id" element={<TaskDetails />} />
          <PrivateRoute path="add" element={<TaskAdd />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default RoutesApp;
