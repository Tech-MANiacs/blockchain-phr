import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import { useSelector } from 'react-redux';
import Spinner from './components/Spinner';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import ApplyDoctor from './pages/ApplyDoctor';
import NotificationPage from './pages/NotificationPage';
import Users from './pages/admin/Users';
import Doctors from './pages/admin/Doctors';
import Profile from './pages/doctor/Profile';
import BookingPage from './pages/BookingPage';
import Appointments from './pages/Appointments';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import UserProfile from './pages/UserProfile';
import LandingPage from './pages/LandingPage';
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

            
            <Route path="/apply-doctor" element={
              <ProtectedRoute>
                <ApplyDoctor />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            } />
            <Route path="/admin/doctors" element={
              <ProtectedRoute>
                <Doctors />
              </ProtectedRoute>
            } />

            {/* because this will be dynamic i.e profile will shown based on the id and we defined it in layout in the profile doctor data */}
            <Route path="/doctor/profile/:id" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            <Route path="/doctor/book-appointment/:id" element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            } />

            <Route path="/notification" element={
              <ProtectedRoute>
                <NotificationPage />
              </ProtectedRoute>
            } />

            <Route path="/userprofile" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
            
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/*" element={
             
                <LandingPage />
              
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            
            <Route path="/appointments" element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            } />
            <Route path="/doctor-appointments" element={
              <ProtectedRoute>
                <DoctorAppointments />
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
