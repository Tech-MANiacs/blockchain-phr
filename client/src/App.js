import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage';
import { useSelector } from 'react-redux';
import Spinner from './components/Spinner';
import ProtectedRoute from './components/ProtectedRoute';
import UserProfile from './pages/UserProfile';
import LandingPage from './pages/LandingPage';
import AccessManagement from './pages/AccessManagement';
import DoctorProfile from './pages/DoctorProfile';
import AddRecord from './pages/AddRecord';
function App() {
  //getting the boolean from the store

  //using this state we can target reducer which in our case is alerts

  //this is constantly fetching the state from the store,
  //In the login and register pages we are updating the loading boolean and whenever it is updated, this entire section renders again and hence invoking the spinner component if loading is true 
  const { loading } = useSelector(state => state.alerts);
  return (
    <>
      <BrowserRouter>
        {/* if loading? show spinner componenet else visit routes */}
        {loading ? (
          <Spinner />
        ) : (
          <Routes>

            <Route path="/userprofile" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
            
            <Route path="/doctorprofile" element={
              <ProtectedRoute>
                <DoctorProfile />
              </ProtectedRoute>
            } />
            <Route path="/*" element={
             
                <LandingPage />
              
            } />
            
            <Route path="/accessManagement" element={
              <ProtectedRoute>
                <AccessManagement />
              </ProtectedRoute>
            } />

            <Route path="/addRecord" element={
              <ProtectedRoute>
                <AddRecord />
              </ProtectedRoute>
            } />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
          </Routes>
        )}

      </BrowserRouter>
    </>
  );
}

export default App;
