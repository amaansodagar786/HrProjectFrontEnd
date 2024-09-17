import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import './Career.scss';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CareerForm = () => {
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    phone: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email format').required('Required'),
    position: Yup.string().required('Required'),
    message: Yup.string(),
    resume: Yup.mixed().required('Required'),
  });

  const submitApplication = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.post('https://hrprojecbackend.onrender.com/career', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = response.data;

      if (data.success) {
        setSnackbarMessage('Application submitted successfully!');
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage(`Failed to submit application: ${data.error}. Please try again.`);
        setSnackbarSeverity('error');
      }
    } catch (error) {
      console.error('API Error:', error);
      setSnackbarMessage('API Error. Please try again later.');
      setSnackbarSeverity('error');
    } finally {
      setLoading(false);
      setOpen(true);
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('phone', values.phone);
    formData.append('email', values.email);
    formData.append('position', values.position);
    formData.append('message', values.message);
    formData.append('resume', values.resume);

    await submitApplication(formData);
    resetForm();
  };

  return (
    <div className="career-form">
      <h2>Career Application</h2>
      <Formik
        initialValues={{
          name: '',
          phone: '',
          email: '',
          position: '',
          message: '',
          resume: null,
        }}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ setFieldValue }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <Field type="text" id="name" name="name" />
              <ErrorMessage name="name" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone:</label>
              <Field type="text" id="phone" name="phone" />
              <ErrorMessage name="phone" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <Field type="email" id="email" name="email" />
              <ErrorMessage name="email" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="position">Position:</label>
              <Field type="text" id="position" name="position" />
              <ErrorMessage name="position" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message:</label>
              <Field as="textarea" id="message" name="message" />
              <ErrorMessage name="message" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="resume">Resume:</label>
              <input
                type="file"
                id="resume"
                name="resume"
                onChange={(event) => setFieldValue('resume', event.target.files[0])}
              />
              <ErrorMessage name="resume" component="div" className="error" />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </Form>
        )}
      </Formik>

      <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
        <Alert onClose={() => setOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CareerForm;
