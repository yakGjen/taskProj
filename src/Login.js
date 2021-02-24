import { useState } from "react";
import { Link } from "react-router-dom";



const Login = ({logIn}) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    setLogin(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className='app'>
      <div className='login-card'>
        <h1 className='login-card__header'>Авторизация</h1>
        <div className='login-card__inputs'>
          <input type='text' value={login} onChange={handleLogin} className='login-card__item' placeholder='Логин' />
          <input type='password' value={password} onChange={handlePassword} className='login-card__item' placeholder='Пароль' />
          <button
            onClick={() => logIn(login, password)}
            className='login-card__item'
          >
            Авторизоваться
          </button>
          <Link
            to={'/'}
            exact='true'
            className='login-card__btn-back'
          >
            Вернуться на главную
          </Link>
          {/* <button className='login-card__item'>Вернуться на главную</button> */}
        </div>
      </div>
    </div>
  );
};


export default Login;
