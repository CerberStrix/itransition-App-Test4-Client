import React from 'react';
import Form from 'react-bootstrap/Form';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const schema = yup.object().shape({
  name: yup.string().min(3).max(15).required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
});

function Login() {
  const nav = useNavigate();

  const goToAuth = () => {
    nav('/newlogin');
  };

  return (
    <Formik
      validationSchema={schema}
      onSubmit={(data) => {
        axios.post('https://itransition-task4-app-usersbs.herokuapp.com/authentification/registration', data).then(() => {
          nav('/newlogin');
        });
      }}
      initialValues={{
        email: '',
        name: '',
        password: '',
      }}
    >
      {({
        handleSubmit,
        handleChange,
        values,
        touched,
        errors,
      }) => (
        <Form onSubmit={handleSubmit} className="registrationForm">
          <h1>Registration</h1>
          <Form.Group controlId="validationFormik01" className="formGroup">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your email"
              name="email"
              value={values.email}
              onChange={handleChange}
              isValid={values.email.length > 0 && !errors.email}
              isInvalid={touched.email && !!errors.email}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="validationFormik02" className="formGroup">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              name="name"
              value={values.name}
              onChange={handleChange}
              isValid={values.name.length > 0 && !errors.name}
              isInvalid={touched.name && !!errors.name}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="validationFormik03" className="formGroup">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Create password"
              name="password"
              value={values.password}
              onChange={handleChange}
              isValid={values.password.length > 0 && !errors.password}
              isInvalid={touched.password && errors.password}
            />
            <Form.Control.Feedback> Great password! </Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>
          <button type="submit" className="btn btn-primary btn-block"> Go! </button>
          <div type="button" onClick={() => { goToAuth(); }} style={{ textAlign: 'center' }}>Allready have account? </div>
        </Form>
      )}
    </Formik>
  );
}

export default Login;
