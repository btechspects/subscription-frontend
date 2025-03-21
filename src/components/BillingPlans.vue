<template>
  <div class="billing-plans">
    <h3 class="billing-header">Billing</h3>
    <p class="billing-description">Monitor user plans, billing, and upgrades in one place.</p>

    <div class="plans-container">
      <div class="plan-card" v-for="plan in plans" :key="plan.id">
        <h4 class="plan-head">{{ plan.name }}</h4>
        <p class="price">
          <span class="price-number" v-if="plan.price">${{ plan.price }}</span> 
          <span class="price-number" v-else>{{ 'Custom' }}</span> 
          <span v-if="plan.price" class="price-per-month">/month</span>
        </p>
        <p class="plan-description">{{ plan.description }}</p>
        <button v-if="plan.id === currentPlanId" class="current-plan">Current Plan</button>
        <button v-else class="upgrade-plan" :disabled="subscriptionActive"
        @click="openModal(plan)">Upgrade Plan</button>
        <ul class="features-list">
          <li v-for="(feature, index) in plan.features" :key="index" class="feature-item">
            <i 
              :class="[feature.icon, (plan.id === currentPlanId) ? 'green-icon' : '']">
            </i> 
            {{ feature.text }}
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-content">
      <p>Are you sure you want to upgrade to <strong>{{ selectedPlan?.name }}</strong>?</p>
      <div class="modal-buttons">
        <button @click="confirmSubscribe">Yes</button>
        <button @click="cancelSubscribe">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { toast } from 'vue3-toastify';
export default {
  data() {
    return {
      plans: [],
      currentPlanId: null,
      showModal: false,
      selectedPlan: null,
      subscriptionActive: false,
    };
  },
  created() {
    this.fetchPlans();
    this.fetchSubscription();
  },
  methods: {
    fetchPlans() {
      const apiURL = process.env.VUE_APP_API_URL;
      const token = localStorage.getItem('token');
      axios.get(`${apiURL}/plans`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        this.plans = response.data;
      })
      .catch(error => {
        console.error('Failed to fetch plans:', error);
      });
    },
    fetchSubscription() {
      const apiURL = process.env.VUE_APP_API_URL;
      const token = localStorage.getItem('token');
      axios.get(`${apiURL}/subscriptions`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        if (response.data.length > 0) {
          const latestSubscription = response.data[response.data.length - 1]; 
          this.currentPlanId = latestSubscription.plan_id;
          this.subscriptionActive = true;
        }
      })
      .catch(error => {
        console.error('Failed to fetch subscription:', error);
      });
    },
    openModal(plan) {
      if (this.subscriptionActive) return;
      this.selectedPlan = plan;
      this.showModal = true;
    },

    cancelSubscribe() {
      this.showModal = false;
      this.selectedPlan = null;
    },

    confirmSubscribe() {
      this.showModal = false;
      if (!this.selectedPlan) return;

      const apiURL = process.env.VUE_APP_API_URL;
      const token = localStorage.getItem('token');
      axios.post(`${apiURL}/subscribe`, {
        plan_id: this.selectedPlan.id,
        payment_method: 'visa_card_****_1234'
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        toast.success(response.data.message);
        this.fetchSubscription();
      })
      .catch(error => {
        console.error('Subscription failed:', error.response.data);
        toast.error('Subscription failed');
      });
    }
  }
};
</script>

<style scoped>
.billing-plans {
  margin: 20px;
  padding: 20px;
  background-color: #f7f7f7;
  border-radius: 8px;
}

.billing-header {
  font-size: 24px;
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;
}

.billing-description {
  text-align: center;
  font-size: 16px;
  color: #555;
}

.plans-container {
  display: flex;
  justify-content: center;
  gap: 30px;
}

.plan-card {
  background-color: white;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  width: 320px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.plan-head {
  font-size: 16px;
  color: #E68C41;
  text-align: left;
  margin-bottom: 5px;
  margin-left: 20px;
}

.price {
  font-size: 24px;
  font-weight: bold;
  color: #1F2429;
  text-align: left;
  margin-bottom: 5px;
}

.price-number {
  font-size: 30px; 
  font-weight: bold;
}

.price-per-month {
  font-size: 16px;
  color: #555;
}

button {
  padding: 8px 20px;
  border-radius: 10px;
  border-color: grey;
  width: 100%;
  cursor: pointer;
  margin-top: 10px;
  margin-bottom: 10px;
}

button.current-plan {
  background-color: white;
  color: black;
}

button.upgrade-plan {
  background-color: #ff7f00;
  color: white;
}

button:hover {
  opacity: 0.8;
}

.plan-description {
  font-size: 16px;
  color: #777;
  text-align: left;
  margin-bottom: 5px;
}

.features-list {
  list-style: none;
  padding: 0;
  font-size: 14px;
  text-align: left;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.green-icon {
  color: green;
}

i {
  color: #777;
  margin-right: 10px;
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; 
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 300px;
}

.modal-buttons button {
  padding: 10px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.modal-buttons button:first-child {
  background-color: #ff7f00; 
  color: #fff;
}

.modal-buttons button:first-child:hover {
  background-color: #e86f00;
}

.modal-buttons button:last-child {
  background-color: #ddd;
  color: #333;
}

.modal-buttons button:last-child:hover {
  background-color: #bbb;
}

@media (max-width: 768px) {
  .billing-plans {
    margin: 10px;
    padding: 15px;
  }

  .billing-header {
    font-size: 20px;
  }

  .billing-description {
    font-size: 14px;
  }

  .plans-container {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .plan-card {
    width: 90%;
    padding: 15px;
  }

  .plan-head {
    font-size: 18px;
    margin-left: 10px;
  }

  .price {
    font-size: 20px;
  }

  .price-number {
    font-size: 24px;
  }

  .price-per-month {
    font-size: 14px;
  }

  .plan-description {
    font-size: 14px;
  }

  .features-list {
    font-size: 12px;
  }

  button {
    padding: 10px;
    font-size: 14px;
  }

  .modal-content {
    width: 90%;
    padding: 15px;
  }

  .modal-buttons button {
    padding: 8px 16px;
    font-size: 14px;
  }
}
</style>
