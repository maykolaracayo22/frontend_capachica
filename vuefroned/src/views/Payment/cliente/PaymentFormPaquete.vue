<template>
  <div class="payment-container">
    <!-- Encabezado -->
    <div class="payment-header text-center mb-5">
      <div class="payment-icon mb-3">
        <i class="bi bi-phone"></i>
      </div>
      <h2 class="mb-2">Pago de Paquete Personalizado</h2>
      <p class="text-muted">Adjunta tu comprobante de pago para validar la reserva</p>
    </div>

    <!-- Cargando -->
    <div v-if="!reservation" class="text-center py-5">
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;"></div>
      <p class="mt-3 text-muted">Cargando datos de la reserva...</p>
    </div>

    <!-- Contenido principal -->
    <div v-else class="payment-card card shadow-sm border-0">
      <div class="card-body p-4 p-md-5">

        <!-- Información del paquete -->
        <div class="reservation-info mb-4 p-3 bg-light rounded-3">
          <h5 class="text-primary mb-3">
            <i class="bi bi-box2-heart me-2"></i> Detalles del Paquete
          </h5>
          <p><strong>Cliente:</strong> {{ reservation.user?.name || 'Sin nombre' }}</p>
          <p><strong>Nombre del paquete:</strong> {{ reservation.custom_package?.name || 'Sin título' }}</p>
          <p><strong>Total a pagar:</strong> <span class="text-success fw-bold">S/. {{ formatPrice(reservation.total_amount) }}</span></p>

          <div v-if="entrepreneurPhone">
            <p class="mt-3">
              <i class="bi bi-credit-card-2-back-fill text-info me-1"></i>
              <strong>Yape / Plin:</strong> <span class="text-dark">{{ entrepreneurPhone }}</span>
            </p>

            <a :href="whatsappLink" target="_blank" class="btn btn-success btn-sm">
              <i class="bi bi-whatsapp me-1"></i> Contactar vía WhatsApp
            </a>
          </div>
        </div>

        <!-- Formulario de pago -->
        <form @submit.prevent="submitPayment" enctype="multipart/form-data">
          <div class="mb-4">
            <label class="form-label fw-bold">Subir Comprobante</label>
            <input type="file" @change="handleFileUpload" accept="image/*" class="form-control" required />
            <div v-if="previewImage" class="mt-2">
              <img :src="previewImage" class="img-thumbnail" style="max-width: 250px;" />
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label fw-bold">Código de Operación</label>
            <input v-model="form.operation_code" class="form-control" placeholder="Ej: YAPE123456" required />
          </div>

          <div class="mb-4">
            <label class="form-label">Nota Adicional (opcional)</label>
            <textarea v-model="form.note" rows="3" class="form-control" placeholder="Ej: Pagado a las 9:30am"></textarea>
          </div>

          <button class="btn btn-primary w-100" :disabled="loading || !form.image || !form.operation_code">
            <template v-if="loading">
              <span class="spinner-border spinner-border-sm me-2"></span> Enviando...
            </template>
            <template v-else>
              <i class="bi bi-send-check me-2"></i> Enviar Comprobante
            </template>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/axios'

const route = useRoute()
const router = useRouter()
const reservation = ref(null)
const previewImage = ref(null)
const loading = ref(false)

const form = ref({
  reservation_id: null,
  image: null,
  operation_code: '',
  note: ''
})

const formatPrice = (val) => {
  const num = Number(val)
  return isNaN(num) ? '0.00' : num.toFixed(2)
}

const entrepreneurPhone = computed(() => {
  const products = reservation.value?.custom_package?.products
  return products?.length ? products[0]?.entrepreneur?.user?.phone : null
})

const whatsappLink = computed(() => {
  const phone = entrepreneurPhone.value
  const message = `Hola, realicé el pago para la reserva #${reservation.value?.id}`
  return phone ? `https://wa.me/51${phone}?text=${encodeURIComponent(message)}` : '#'
})

const loadReservation = async () => {
  try {
    const res = await api.get(`/reservations/${route.params.id}`)
    reservation.value = res.data
    form.value.reservation_id = res.data.id
  } catch {
    alert('Error cargando la reserva')
    router.push('/mis-paquetes')
  }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.image = file
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImage.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const submitPayment = async () => {
  if (!form.value.image || !form.value.operation_code) {
    alert('Completa todos los campos obligatorios.')
    return
  }

  if (!confirm('¿Confirmas el envío del pago?')) return

  loading.value = true
  const data = new FormData()
  data.append('reservation_id', form.value.reservation_id)
  data.append('image_file', form.value.image)
  data.append('operation_code', form.value.operation_code)
  data.append('payment_method', 'yape')
  if (form.value.note) data.append('note', form.value.note)

  try {
    await api.post('/payments', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    alert('Pago enviado correctamente')
    router.push('/reservations')
  } catch (err) {
    console.error('Error al enviar pago:', err)
    alert('Error al enviar el comprobante')
  } finally {
    loading.value = false
  }
}

onMounted(loadReservation)
</script>
<style scoped>
.payment-container {
  max-width: 800px;
  margin: auto;
  padding: 2rem 1rem;
}

.payment-header {
  background-color: #f8f9fa;
  padding: 2rem;
  border-radius: 10px;
}

.payment-icon {
  width: 60px;
  height: 60px;
  font-size: 1.5rem;
  background-color: #0d6efd;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
}
</style>

