import { createAsyncThunk } from '@reduxjs/toolkit';
import { googleRegisterApi, googleSignInApi, loginUserApi, registerUserApi } from '../../services/api';

const saveUser = (data) => {
  const userObj = { ...data.user, token: data.token };
  localStorage.setItem('mla_user', JSON.stringify(userObj));
  return userObj;
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ signInInput, signInPassword }, { rejectWithValue }) => {
    try {
      const data = await loginUserApi({ signInInput, signInPassword });
      return saveUser(data);
    } catch (error) {
      return rejectWithValue(error.message || 'Server error, please try again');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await registerUserApi(userData);
      return saveUser(data);
    } catch (error) {
      return rejectWithValue(error.message || 'Server error, please try again');
    }
  }
);

// Resolves to { user } when the student is signed in, or to
// { needsSignUp, signupToken, profile } when they still need to finish the sign-up form
export const loginWithGoogle = createAsyncThunk(
  'auth/google',
  async (credential, { rejectWithValue }) => {
    try {
      const data = await googleSignInApi(credential);
      if (data.needsSignUp) {
        return { needsSignUp: true, signupToken: data.signupToken, profile: data.profile };
      }
      return { user: saveUser(data) };
    } catch (error) {
      return rejectWithValue(error.message || 'Google sign-in failed, please try again');
    }
  }
);

export const registerWithGoogle = createAsyncThunk(
  'auth/googleRegister',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await googleRegisterApi(userData);
      return saveUser(data);
    } catch (error) {
      return rejectWithValue(error.message || 'Server error, please try again');
    }
  }
);
