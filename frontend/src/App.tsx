import { AuthProvider } from './app/auth/AuthContext';
import AppRouter from './app/router';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
