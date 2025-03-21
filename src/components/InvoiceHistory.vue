<template>
  <div class="invoice-history">
    <h3 class="invoice-header">Invoice & Payment History</h3>

    <div class="table-actions">
      <div class="search-container">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input v-model="searchQuery" type="text" placeholder="Search" class="search-input" />
      </div>
      <!-- <button class="filter-btn"><i class="fa-solid fa-filter"></i> Filter</button> -->
    </div>
    <div class="table-responsive">
      <table>
        <thead>
          <tr>
            <th>
              <label class="checkbox-container">
                <input type="checkbox" class="select-all" @change="toggleSelectAll" />
                <span class="checkbox">
                  <span class="check-icon"><i class="fa-solid fa-check"></i></span>
                </span>
              </label>
            </th>
            <th class="click-method">
              <span class="sortable" @click="sortInvoices('invoice_number')">Invoice Number <i class="fa-solid fa-sort"></i></span>
            </th>
            <th class="click-method">
              <span class="sortable" @click="sortInvoices('date')">Date <i class="fa-solid fa-sort"></i></span>
            </th>
            <th class="click-method">
              <span class="sortable" @click="sortInvoices('amount')">Amount <i class="fa-solid fa-sort"></i></span>
            </th>
            <th>Payment Method</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody v-if="filteredInvoices.length > 0">
          <tr v-for="invoice in invoices" :key="invoice.invoice_number">
            <td>
              <label class="checkbox-container">
                <input type="checkbox" v-model="selectedInvoices" :value="invoice.invoice_number" />
                <span class="checkbox">
                  <span class="check-icon"><i class="fa-solid fa-check"></i></span>
                </span>
              </label>
            </td>
            <td>{{ invoice.invoice_number }}</td>
            <td>{{ invoice.date }}</td>
            <td>{{ invoice.amount }}</td>
            <td>{{ invoice.payment_method }}</td>
            <td>
              <span class="status" :class="invoice.status"><i v-if="invoice.status=== 'Paid'" class="fa-regular fa-circle-check check-icon"></i>{{ invoice.status }}</span>
            </td>
            <td>
              <button class="actions-btn" @click="toggleActions(invoice.invoice_number)">
                <i class="fa-solid fa-ellipsis-vertical"></i>
              </button>
              <div v-if="activeAction === invoice.invoice_number" class="action-menu">
                <button @click="deleteInvoice(invoice)">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr><td colspan="7" class="no-data">No data</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { toast } from 'vue3-toastify';
export default {
  data() {
    return {
      invoices: [
      ],
      selectedInvoices: [],
      activeAction: null,
      searchQuery: '',
      sortField: '',
      sortAsc: true,
    };
  },
  computed: {
    filteredInvoices() {
      if (!this.searchQuery.trim()) return this.invoices;
      return this.invoices.filter(invoice =>
        invoice.invoice_number.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        invoice.date.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        invoice.amount.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        invoice.payment_method.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        invoice.status.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  created() {
    this.fetchInvoices();
  },
  methods: {
    fetchInvoices() {
      const apiURL = process.env.VUE_APP_API_URL;
      const token = localStorage.getItem('token');
      axios.get(`${apiURL}/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        this.invoices = response.data.map((txn) => ({
          id: txn.id,
          invoice_number: 'INV-' + txn.id,
          date: new Date(txn.timestamp).toLocaleDateString(),
          amount: `$${txn.amount}`,
          payment_method: txn.payment_method,
          status: txn.status === 'success' ? 'Paid' : (txn.status === 'pending' ? 'Pending' : 'Failed'),
        }));
      })
      .catch(error => {
        console.error('Failed to fetch transactions:', error);
      });
    },
    toggleSelectAll(event) {
      if (event.target.checked) {
        this.selectedInvoices = this.invoices.map(invoice => invoice.invoice_number);
      } else {
        this.selectedInvoices = [];
      }
    },
    sortInvoices(field) {
      if (this.sortField === field) {
        this.sortAsc = !this.sortAsc;
      } else {
        this.sortField = field;
        this.sortAsc = true; 
      }

      this.invoices.sort((a, b) => {
        const valueA = String(a[field]).toLowerCase();
        const valueB = String(b[field]).toLowerCase();
        if (valueA < valueB) return this.sortAsc ? -1 : 1;
        if (valueA > valueB) return this.sortAsc ? 1 : -1;
        return 0;
      });
    },
    toggleActions(invoiceNumber) {
      this.activeAction = this.activeAction === invoiceNumber ? null : invoiceNumber;
    },
    deleteInvoice(invoice) {
      if (!confirm(`Are you sure you want to delete ${invoice.invoice_number}?`)) {
        this.activeAction = null;
        return;
      }

      const apiURL = process.env.VUE_APP_API_URL;
      const token = localStorage.getItem('token');

      axios.delete(`${apiURL}/transactions/${invoice.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => {
        this.invoices = this.invoices.filter(inv => inv.invoice_number !== invoice.invoice_number);
        this.activeAction = null;
        toast.success('Transaction deleted successfully');
      })
      .catch(error => {
        console.error('Failed to delete transaction:', error);
        toast.error('Failed to delete transaction');
        this.activeAction = null;
      });
    }
  },
};
</script>

<style scoped>
.invoice-history {
  margin-top: 30px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.invoice-header {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.table-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
}

.search-container {
  position: relative;
  width: 200px;
}

.search-container .fa-magnifying-glass {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: #999;
}

.search-input {
  padding: 10px 10px 10px 35px;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.filter-btn {
  padding: 10px 20px;
  background-color: #ff7f00;
  color: white;
  border: none;
  margin-left: 20px;
  border-radius: 5px;
  cursor: pointer;
}

.filter-btn:hover {
  background-color: #e67e00;
}

table {
  width: 100%;
  border-collapse: collapse;
}

.click-method {
  cursor: pointer;
}

table th, table td {
  padding: 12px;
  text-align: left;
}

th {
  background-color: #f9f9f9;
  font-weight: bold;
}

th.sortable:hover {
  cursor: pointer;
  color: #007bff;
}

.status {
  font-weight: bold;
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
}

.status.Paid {
  background-color: #28a745;
  color: white;
}

.status.Pending {
  background-color: #ff9800;
  color: white;
}

.status.Failed {
  background-color: #f44336;
  color: white;
}

.actions-btn {
  background-color: transparent;
  border: none;
  color: black;
  cursor: pointer;
  font-size: 20px;
}

.actions-btn:hover {
  color: #0056b3;
}

.checkbox-container {
  display: inline-block;
  position: relative;
}

.checkbox-container input[type="checkbox"] {
  opacity: 0; 
  position: relative;
}

.checkbox {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.checkbox-container input[type="checkbox"]:checked + .checkbox {
  background-color: #ff7f00;
  border-color: #ff7f00;
}

.check-icon {
  margin-right: 10px;
}

.checkbox-container input[type="checkbox"]:checked + .checkbox .check-icon {
  display: inline-block;
}

.checkbox-container input[type="checkbox"]:focus + .checkbox {
  outline: 2px solid #007bff;
}

.checkbox-container .check-icon {
  display: none;
  position: absolute;
  left: 2px;
  top: 0;
  font-size: 14px;
  color: white;
}

.action-menu {
  position: absolute;
  background: #fff;
  border: 1px solid #ddd;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  border-radius: 5px;
  padding: 8px;
  z-index: 10;
}

.action-menu button {
  display: block;
  width: 100%;
  padding: 8px 12px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
}

.action-menu button:hover {
  background-color: #f0f0f0;
}

td {
  position: relative;
}


tbody tr {
  border-bottom: 1px solid #ddd;
}

.no-data {
  text-align: center;
  font-size: 18px;
  color: #777;
  margin: 50px 0;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.table-responsive table {
  min-width: 600px;
}

@media (max-width: 768px) {
  .invoice-history {
    padding: 15px;
  }

  .invoice-header {
    font-size: 20px;
  }

  .table-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .search-container {
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>
