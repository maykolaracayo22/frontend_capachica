<template>
  <div class="container mt-4">
    <h2 class="mb-3">Detalle del paquete personalizado</h2>

    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-3">Cargando paquete...</p>
    </div>

    <div v-else-if="!packageData">
      <div class="alert alert-danger">Paquete no encontrado.</div>
    </div>

    <div v-else>
      <div class="card shadow-sm">
        <div class="card-body">
          <h4 class="card-title">{{ packageData.name || '(Sin título)' }}</h4>
          <p>
            <strong>Estado:</strong>
            <span class="badge bg-secondary text-capitalize">{{ packageData.status }}</span>
          </p>

          <table class="table table-bordered mt-3">
            <thead class="table-light">
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio unitario (S/)</th>
                <th>Subtotal (S/)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in packageData.products" :key="p.id">
                <td>{{ p.name }}</td>
                <td>{{ p.pivot.quantity }}</td>
                <td>S/. {{ formatPrice(p.price) }}</td>
                <td>S/. {{ formatPrice(p.price * p.pivot.quantity) }}</td>
              </tr>
            </tbody>
          </table>

          <div class="text-end mt-3">
            <strong>Total: S/. {{ formatPrice(packageData.total_amount) }}</strong>
          </div>

          <div class="mt-4 text-end">
            <router-link
              :to="`/reservar-paquete/${packageData.id}`"
              class="btn btn-success"
            >
              <i class="bi bi-calendar-check me-1"></i>
              Reservar este paquete
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/axios'

export default {
  name: 'CustomPackageDetail',
  data() {
    return {
      loading: true,
      packageData: null
    }
  },
  methods: {
    formatPrice(value) {
      const num = Number(value)
      return isNaN(num) ? '0.00' : num.toFixed(2)
    }
  },
  async mounted() {
    const id = this.$route.params.id
    try {
      const res = await api.get(`/custom-packages/${id}`)
      this.packageData = res.data
    } catch (err) {
      console.error('Error al cargar el paquete:', err)
    } finally {
      this.loading = false
    }
  }
}
</script>

<style scoped>
.card-title {
  font-size: 1.5rem;
}
</style>
