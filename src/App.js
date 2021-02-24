import { useState } from "react";
import { Route, BrowserRouter, Redirect } from "react-router-dom";
import Home from './Home';
import Login from "./Login";

const App = () => {
  const [logInToken, setNewToken] = useState('');
  const [logged, setLogged] = useState(false);

  const logIn = (loginValue, passwordValue) => {
    let logInData = new FormData();
    logInData.append("username", loginValue);
    logInData.append("password", passwordValue);

    fetch(`https://uxcandy.com/~shapoval/test-task-backend/v2/login?developer=Evgeniy`, {
      method: 'POST',
      mode: 'cors',
      body: logInData
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.status === 'ok') {
        setNewToken(data.message.token);
        setLogged(true);
      }
    });
  }

  return (
    <BrowserRouter>
      <Route exact path="/" render={() => <Home logged={logged} logInToken={logInToken} />} />
      <Route exact path="/login" render={() => <Login logIn={logIn} />} />
      {logInToken ? <Redirect from="/login" to='/'/> : null}
    </BrowserRouter>
  );
};

export default App;
