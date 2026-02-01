import { Authenticator } from '@aws-amplify/ui-react';
import AppRouter from './app/router';
import './App.css';

function App() {
  return (
    <Authenticator.Provider>
      <AppRouter />
    </Authenticator.Provider>
  );
}

export default App;
