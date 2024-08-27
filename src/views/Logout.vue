<template>
  <div>
    <h2>Logout</h2>
    <p>Are you sure you want to logout?</p>
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
import { logout as logoutAuth } from './auth'; // Adjust the path to your auth.js file

export default {
  methods: {
    logout() {
      // Clear token from localStorage or Vuex store
      localStorage.removeItem('token');

      // Update the global authentication state
      logoutAuth();

      // Redirect to login page or other route
      this.$router.push('/login');
    }
  }
};
</script>

