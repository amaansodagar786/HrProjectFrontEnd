import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
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

  // Function to handle API call on submit
  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      // Your form data preparation
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('phone', values.phone);
      formData.append('email', values.email);
      formData.append('position', values.position);
      formData.append('message', values.message);
      formData.append('resume', values.resume);

      // API call to submit the form data
      const response = await submitApplication(formData);

      if (response.success) {
        setSnackbarMessage('Application submitted successfully!');
        setSnackbarSeverity('success');
        resetForm();
      } else {
        setSnackbarMessage('Failed to submit application. Please try again.');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      setSnackbarMessage('Please try again.');
      setSnackbarSeverity('error');
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setOpen(true);
    }
  };

  // Function to submit application data via API
  const submitApplication = async (formData) => {
    setLoading(true);

    try {
      const response = await fetch('https://newprojectbackend.vercel.app/career', {
        method: 'POST',
        body: formData,
      });

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <div className="career-form">
      <h1>We're Hiring!</h1>
      <h2>Join Our Team</h2>
      <p>If you're interested in one of our open positions, start by applying here and attaching your resume.</p>
      <Formik
        initialValues={{ name: '', phone: '', email: '', position: '', message: '', resume: null }}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit} // Use handleFormSubmit function for form submission
      >
        {({ setFieldValue }) => (
          <Form>
            <div className="form-group">
              <Field name="name">
                {({ field }) => (
                  <div className="input-container">
                    <input type="text" {...field} placeholder="Name*" />
                    <ErrorMessage name="name" component="div" className="error" />
                  </div>
                )}
              </Field>
            </div>
            <div className="form-group">
              <Field name="phone">
                {({ field }) => (
                  <div className="input-container">
                    <input type="text" {...field} placeholder="Phone*" />
                    <ErrorMessage name="phone" component="div" className="error" />
                  </div>
                )}
              </Field>
            </div>
            <div className="form-group">
              <Field name="email">
                {({ field }) => (
                  <div className="input-container">
                    <input type="email" {...field} placeholder="Email*" />
                    <ErrorMessage name="email" component="div" className="error" />
                  </div>
                )}
              </Field>
            </div>
            <div className="form-group">
              <Field name="position">
                {({ field }) => (
                  <div className="input-container">
                    <input type="text" {...field} placeholder="Position Applied" />
                    <ErrorMessage name="position" component="div" className="error" />
                  </div>
                )}
              </Field>
            </div>
            <div className="form-group">
              <Field name="message">
                {({ field }) => (
                  <div className="input-container">
                    <textarea {...field} placeholder="Message"></textarea>
                  </div>
                )}
              </Field>
            </div>
            <div className="form-group">
              <div className="input-container">
                <input
                  type="file"
                  id="resume"
                  name="resume"
                  onChange={(event) => {
                    setFieldValue('resume', event.currentTarget.files[0]);
                  }}
                />
                <ErrorMessage name="resume" component="div" className="error" />
              </div>
            </div>
            {loading ? (
              <button type="submit" className="submit-button" disabled>
                Sending...
              </button>
            ) : (
              <button type="submit" className="submit-button">
                Submit Application
              </button>
            )}
          </Form>
        )}
      </Formik>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CareerForm;
