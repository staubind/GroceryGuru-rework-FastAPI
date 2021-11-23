import React from 'react';
import LoginForm from '../LoginForm/LoginForm';
import { useHistory } from 'react-router-dom';

function LoginPage() {
  const history = useHistory();

  return (
    <div>
      <br />
      <br />
      <br />
      <h1 style={{marginLeft: "100px"}}>Welcome to</h1>
      <center>
      <h1 style={{color: "blue", fontSize: "48pt"}}>Grocery Guru</h1>
      </center>
      <br />
      <br />
      <br />
      <LoginForm />

      <center>
        <button
          type="button"
          className="btn btn_asLink"
          onClick={() => {
            history.push('/registration');
          }}
        >
          Register
        </button>
      </center>
    </div>
  );
}

export default LoginPage;
