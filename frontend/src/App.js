import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/shared/Navigation/Navigation';
import Home from './pages/Home/Home';
import Authenticate from './pages/Authenticate/Authenticate';
import Activate from './pages/Activate/Activate';
import Rooms from './pages/Rooms/Rooms';
import { useSelector } from 'react-redux';
import { useLoadingWithRefresh } from './hooks/useLoadingWithRefresh';
import Loader from './components/shared/Loader/Loader';

function App() {
  const { loading } = useLoadingWithRefresh();

  return loading ? (
    <Loader message="Loading..."/>
  ) : (
    <Router>
      <Navigation />
      <Routes>
        <Route path='/' element={
          <GuestRoute>
            <Home />
          </GuestRoute>
        } />

        <Route path='/authenticate' element={
          <GuestRoute>
            <Authenticate />
          </GuestRoute>
        } />

        <Route path='/activate' element={
          <SemiProtectedRoute>
            <Activate />
          </SemiProtectedRoute>
        } />

        <Route path='/rooms' element={
          <ProtectedRoute>
            <Rooms />
          </ProtectedRoute>
        } />

      </Routes>
    </Router>
  );
}

const GuestRoute = ({ children }) => {
  const { isAuth } = useSelector((state) => state.authSlice);
  return isAuth ? (
    <Navigate to="/rooms" />
  ) : (
    children
  );
};

const SemiProtectedRoute = ({ children }) => {
  const { user, isAuth } = useSelector((state) => state.authSlice);
  return !isAuth ? (
    <Navigate to="/" />
  ) : isAuth && !user.activated ? (
    children
  ) : (
    <Navigate to="/rooms" />
  );
};

const ProtectedRoute = ({ children }) => {
  const { user, isAuth } = useSelector((state) => state.authSlice);
  return !isAuth ? (
    <Navigate to="/" />
  ) : isAuth && !user.activated ? (
    <Navigate to="/activate" />
  ) : (
    children
  );
};

export default App;
