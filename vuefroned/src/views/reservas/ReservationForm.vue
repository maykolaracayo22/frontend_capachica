<template>
  <div>
    <h1>{{ editing ? 'Editar Reserva' : 'Crear Nueva Reserva' }}</h1>

    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <label class="form-label">Producto</label>
        <select v-model="form.product_id" class="form-select" required>
          <option v-for="product in products" :key="product.id" :value="product.id">
            {{ product.name }}
          </option>
        </select>
        <div v-if="errors.product_id" class="text-danger">{{ errors.product_id[0] }}</div>
      </div>

      <div class="mb-3">
        <label class="form-label">Cantidad</label>
        <input v-model.number="form.quantity" type="number" min="1" class="form-control" required>
        <div v-if="errors.quantity" class="text-danger">{{ errors.quantity[0] }}</div>
      </div>

      <div class="mb-3">
        <label class="form-label">Fecha de Reserva</label>
        <input v-model="form.reservation_date" type="date" class="form-control" required>
        <div v-if="errors.reservation_date" class="text-danger">{{ errors.reservation_date[0] }}</div>
      </div>

      <div class="mb-3">
        <button type="submit" class="btn btn-primary" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-1" role="status"></span>
          {{ editing ? 'Actualizar Reserva' : 'Crear Reserva' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import api from '@/services/axios';

export default {
  data() {
    return {
      form: {
        product_id: null,
        quantity: 1,
        reservation_date: '',
      },
      products: [],
      errors: {},
      loading: false,
      editing: false,
    };
  },
  async created() {
    await this.fetchProducts();
    if (this.$route.params.id) {
      this.editing = true;
      await this.fetchReservation(this.$route.params.id);
    }
  },
  methods: {
    async fetchProducts() {
      try {
        const res = await api.get('/products');
        this.products = res.data;
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    async fetchReservation(id) {
      try {
        const res = await api.get(`/reservations/${id}`);
        this.form = res.data;
      } catch (error) {
        console.error('Error fetching reservation:', error);
      }
    },
    async submitForm() {
      this.loading = true;
      this.errors = {};
      try {
        const payload = { ...this.form };
        if (this.editing) {
          await api.put(`/reservations/${this.$route.params.id}`, payload);
        } else {
          await api.post('/reservations', payload);
        }
        this.$router.push('/reservations');
      } catch (err) {
        if (err.response?.status === 422) {
          this.errors = err.response.data.errors || {};
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.form-control {
  width: 300px;
  margin: 10px auto;
}
</style>
