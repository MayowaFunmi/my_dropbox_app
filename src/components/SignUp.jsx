import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { Link, useNavigate } from 'react-router-dom';
import './SignUp.css';
import { toast } from 'react-toastify';
import logo from '../images/dropbox.png';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState(0);
  const [confirmForm, setConfirmForm] = useState(false);

  const notifyError = (msg) => toast.error(msg);
  const notifySuccess = (msg) => toast.success(msg);
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  const navigate = useNavigate();

  async function confirmUser(username, confirmationCode) {
    try {
      await Auth.confirmSignUp(username, confirmationCode);
      notifySuccess('Sign up completed succesfully');
      // check if userID exists
      navigate('/signin');
    } catch (error) {
      notifyError(error);
      notifyError(error)
    }
  }

  async function handleSignUp(e) {
    if (password !== confirmPassword) {
      notifyError("Passwords don't match!!!");
      return;
    }
    if (!emailRegex.test(email)) {
      notifyError('Email is invalid!!!');
      return;
    }
    try {
      const { user } = await Auth.signUp({
        username,
        password,
        attributes: {
          email,
        },
      });

      if (user) {
        setConfirmForm(true);
        notifySuccess(
          'COnfirmation code has been sent to your email address. Enter the code in the space provided below'
        );
      }
    } catch (error) {
      notifyError(error);
      console.log('error = ', error);
    }
  }

  return (
    <div className="signUp">
      <div className="form-container">
        {!confirmForm ? (
          <div className="form">
            <img className="signUpLogo" src={logo} alt="" />
            <p className="loginPara">
              Sign up to see photos and videos <br /> from your friends
            </p>
            <div>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />
            </div>
            <p
              className="loginPara"
              style={{ fontSize: '12px', margin: '3px 0px' }}
            >
              By signing up, you agree to our terms, <br /> privacy policy and
              cookies policy
            </p>
            <input
              type="submit"
              id="submit-btn"
              value="Sign Up"
              onClick={() => handleSignUp()}
            />
          </div>
        ) : (
          <div className="form">
            <p className="loginPara">
              Enter the confirmation code sent to your email address
            </p>
            <div>
              <input
                type="text"
                name="code"
                placeholder="Enter confirmation code"
                value={confirmationCode}
                onChange={(e) => {
                  setConfirmationCode(e.target.value);
                }}
              />
            </div>

            <input
              type="submit"
              id="submit-btn"
              value="Confirm SignUp"
              onClick={() => confirmUser(username, confirmationCode)}
            />
          </div>
        )}

        <div className="form2">
          Already have an account?
          <Link to="/signin">
            <span style={{ color: 'blue', cursor: 'pointer' }}>Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
