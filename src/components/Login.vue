<template>
    <div class="auth-container">
      <h2>Login</h2>
      <input v-model="email" placeholder="Email" />
      <input v-model="password" placeholder="Password" type="password" />
      <button @click="login">Login</button>
      <p @click="$router.push('/register')">No account? <span class="link">Register</span></p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { toast } from 'vue3-toastify';
  export default {
    name: 'UserLogin',
    data() { return { email: '', password: '' }; },
    methods: {
      async login() {
        if (!this.email || !this.password) {
            toast.error('Email and password are required!');
            return;
        }

        try {
          const apiURL = process.env.VUE_APP_API_URL;
          const response = await axios.post(`${apiURL}/login`, {
          email: this.email,
          password: this.password
          });
          localStorage.setItem('token', response.data.token);
          toast.success('Login successful!');
          setTimeout(() => {
            this.$router.push('/dashboard');
          }, 2000);
        } catch (error) {
          toast.error('Invalid credentials!');
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .auth-container {
    max-width: 400px;
    margin: 80px auto;
    padding: 30px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .auth-container h2 {
    text-align: center;
    color: #333;
    margin-bottom: 20px;
  }
  
  .auth-container input {
    width: 100%;
    padding: 12px;
    margin-bottom: 15px;
    border-radius: 8px;
    border: 1px solid #ddd;
    transition: 0.3s;
  }
  
  .auth-container input:focus {
    border-color: #ff7f00;
    outline: none;
  }
  
  .auth-container button {
    width: 100%;
    padding: 12px;
    background-color: #ff7f00;
    color: #fff;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }
  
  .auth-container button:hover {
    background-color: #e76b00;
  }
  
  .auth-container p {
    text-align: center;
    margin-top: 15px;
    cursor: pointer;
  }
  
  .link {
    color: #ff7f00;
    text-decoration: underline;
  }
  </style>
  