<template>
  <div>
    <header class="dashboard-header">
      <h2>Dashboard</h2>
      <div class="user-icon" @click="toggleUserMenu">
        <i class="fa-regular fa-circle-user"></i>
        <div v-if="showUserMenu" class="user-menu">
          <button @click="logout">Logout</button>
        </div>
      </div>
    </header>

    <BillingPlans />
    <InvoiceHistory />
  </div>
</template>
  
<script>
  import BillingPlans from './BillingPlans.vue';
  import InvoiceHistory from './InvoiceHistory.vue';
  export default {
    name: 'UserDashboard',
    components: { BillingPlans, InvoiceHistory },
    data() {
      return {
        showUserMenu: false
      };
    },
    methods: {
      toggleUserMenu() {
        this.showUserMenu = !this.showUserMenu;
      },
      logout() {
        localStorage.removeItem('token');
        this.$router.push('/login');
      }
    }
  };
</script>
  
<style scoped>
  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background-color: #ff7f00;
    color: #fff;
  }
  
  .user-icon {
    position: relative;
    cursor: pointer;
    font-size: 24px;
  }
  
  .user-menu {
    position: absolute;
    right: 0;
    top: 40px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    padding: 10px;
    font-size: 12px;
  }
  
  .user-menu button {
    background: none;
    border: none;
    color: #333;
    cursor: pointer;
    font-weight: bold;
  }
  
  .user-menu button:hover {
    color: #ff7f00;
  }
</style>
  