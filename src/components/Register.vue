<template>
    <div class="auth-container">
      <h2>Register</h2>
      <input v-model="name" placeholder="Name" />
      <input v-model="email" placeholder="Email" />
      <input v-model="password" placeholder="Password" type="password" />
      <button @click="register">Register</button>
      <p @click="$router.push('/login')">Already have an account? <span class="link">Login</span></p>
  
      <div v-if="toastMessage" class="toast">{{ toastMessage }}</div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { toast } from 'vue3-toastify';
  export default {
    name: 'UserRegister',
    data() {
      return { 
        name: '', 
        email: '', 
        password: '', 
        toastMessage: '' 
      };
    },
    methods: {
      validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
      },
      register() {
        if (!this.name || !this.email || !this.password) {
          toast.error('All fields are required!');
          return;
        }
        if (!this.validateEmail(this.email)) {
          toast.error('Invalid email format!');
          return;
        }
  
        const apiURL = process.env.VUE_APP_API_URL;
        axios.post(`${apiURL}/register`, {
          name: this.name, 
          email: this.email, 
          password: this.password, 
          role: 'customer'
        }).then(res => {
          localStorage.setItem('token', res.data.token);
          toast.success('Registered successfully!');
          setTimeout(() => {  
            this.$router.push('/dashboard');
          }, 2000);
        }).catch(() => {
          toast.error('Registration failed!');
        });
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
  