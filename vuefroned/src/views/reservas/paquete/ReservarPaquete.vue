<template>
  <div class="container mt-4">
    <h2>Reservar Paquete Personalizado</h2>

    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else-if="packageData" class="card mt-3">
      <div class="card-body">
        <h5 class="card-title">{{ packageData.name }}</h5>
        <p><strong>Total:</strong> S/. {{ formatPrice(packageData.total_amount) }}</p>

        <h6>Productos:</h6>
        <ul>
          <li v-for="product in packageData.products" :key="product.id">
            {{ product.name }} - S/. {{ formatPrice(product.price) }}
          </li>
        </ul>

        <div class="mt-3">
          <button class="btn btn-success" @click="makeReservation">
            Confirmar reserva
          </button>
        </div>
      </div>
    </div>

    <div v-else class="alert alert-danger mt-4">
      No se pudo cargar el paquete.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/axios'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const packageData = ref(null)

const formatPrice = (val) => {
  const num = Number(val)
  return isNaN(num) ? '0.00' : num.toFixed(2)
}

const loadPackage = async () => {
  try {
    const { data } = await api.get(`/custom-packages/${route.params.id}`)
    packageData.value = data
  } catch (error) {
    console.error('Error cargando paquete:', error)
  } finally {
    loading.value = false
  }
}

const makeReservation = async () => {
  try {
    const res = await api.post('/reservations', {
      custom_package_id: route.params.id,
      quantity: 1,
      reservation_date: dayjs().format('YYYY-MM-DD HH:mm:ss')
    })

    alert('Reserva realizada con éxito')
    router.push(`/pago-paquete/${res.data.id}`)

  } catch (err) {
    console.error('Error al reservar:', err)
    alert('No se pudo completar la reserva')
  }
}

onMounted(() => {
  loadPackage()
})
</script>

<style scoped>
.container {
  max-width: 700px;
}
</style>
