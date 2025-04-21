
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Tus componentes
import { Login } from './components/Login';
import { Dashboard } from './pages/Dashboard';
import RegisterForm from './components/RegisterForm';
// otros imports...

function App() {
  return (
    <Router>
      {/* Tu estructura de rutas */}
      <Routes>
        <Route path="/" element={<RegisterForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Más rutas si tienes */}
      </Routes>

      {/* Aquí el ToastContainer */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Router>
  );
}

export default App;
