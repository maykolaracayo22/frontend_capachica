<template>
    <div v-if="isSuperAdmin" class="max-w-xl mx-auto mt-10 p-4 bg-white rounded shadow">
      <h2 class="text-xl font-bold mb-4">Registrar Pago</h2>
      <form @submit.prevent="createPago">
        <input v-model="form.reserva_id" type="number" placeholder="ID de Reserva" class="input" required />
        <input v-model="form.monto" type="number" step="0.01" placeholder="Monto" class="input" required />
        <input v-model="form.metodo_pago" type="text" placeholder="Método de pago" class="input" required />
        <input v-model="form.fecha_pago" type="date" class="input" required />
        <button type="submit" class="btn">Registrar Pago</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  const form = ref({
    reserva_id: '',
    monto: '',
    metodo_pago: '',
    fecha_pago: '',
  })
  
  const isSuperAdmin = ref(false)
  
  onMounted(async () => {
    const response = await axios.get('/api/user')
    isSuperAdmin.value = response.data.role === 'super-admin'
  })
  
  const createPago = async () => {
    try {
      await axios.post('/api/pagos', form.value)
      alert('Pago registrado correctamente')
    } catch (error) {
      console.error(error)
      alert('Error al registrar el pago')
    }
  }
  </script>
  