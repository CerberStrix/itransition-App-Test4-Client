import React, { useContext, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Formik } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';

function Login() {
  const nav = useNavigate();
  const [errors, setErrors] = useState(false);
  const { setAuthState } = useContext(AuthContext);

  const goToReg = () => {
    nav('/newRegistration');
  };
  const login = (data) => {
    axios.post('https://itransition-task4-app-usersbs.herokuapp.com/authentification/login', data).then((response) => {
      if (response.data.error) {
        setErrors(response.data.error);
      } else {
        localStorage.setItem('accessToken', response.data.token);
        setAuthState({ email: response.data.email, id: response.data.id, status: true });
        nav('/');
      }
    });
  };

  return (
    <Formik
      onSubmit={(data) => {
        login(data);
      }}
      initialValues={{
        email: '',
        password: '',
      }}
    >
      {({
        handleSubmit,
        handleChange,
        values,
      }) => (
        <Form onSubmit={handleSubmit} className="formLogin">
          <h1>Log In</h1>
          <Form.Group controlId="validationFormik01" className="formGroup">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your email"
              name="email"
              value={values.email}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="validationFormik03" className="formGroup">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              name="password"
              value={values.password}
              onChange={handleChange}
            />
          </Form.Group>
          <div style={{ textAlign: 'center' }}>{errors}</div>
          <button type="submit" className={errors ? 'btn btn-primary btn-block disabled' : 'btn btn-primary btn-block'}> Go! </button>
          <div type="button" onClick={() => { goToReg(); }} style={{ textAlign: 'center' }}>Don't have account? </div>
        </Form>
      )}
    </Formik>
  );
}

export default Login;
