import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/context/AuthContext';
import AssignmentList from './components/pages/AssignmentList';
import AssignmentAttempt from './components/pages/AssignmentAttempt';
import Login from './components/pages/Login';
import Signup from './components/pages/Signup';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Router>
        <div className="app-shell">
          <Routes>
            <Route path="/" element={<Navigate to="/assignments" replace />} />
            <Route path="/assignments" element={<AssignmentList />} />
            <Route path="/assignment/:id" element={<AssignmentAttempt />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
