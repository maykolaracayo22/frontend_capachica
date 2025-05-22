<template>
    <div v-if="isSuperAdmin" class="max-w-xl mx-auto mt-10 p-4 bg-white rounded shadow">
      <h2 class="text-xl font-bold mb-4">Crear Reserva</h2>
      <form @submit.prevent="createReserva">
        <input v-model="form.tour_id" type="number" placeholder="ID del Tour" class="input" required />
        <input v-model="form.cliente_id" type="number" placeholder="ID del Cliente" class="input" required />
        <input v-model="form.fecha_reserva" type="date" class="input" required />
        <input v-model="form.estado" type="text" placeholder="Estado" class="input" required />
        <button type="submit" class="btn">Crear Reserva</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  const form = ref({
    tour_id: '',
    cliente_id: '',
    fecha_reserva: '',
    estado: '',
  })
  
  const isSuperAdmin = ref(false)
  
  onMounted(async () => {
    const response = await axios.get('/api/user')
    isSuperAdmin.value = response.data.role === 'super-admin'
  })
  
  const createReserva = async () => {
    try {
      await axios.post('/api/reservas', form.value)
      alert('Reserva creada exitosamente')
    } catch (error) {
      console.error(error)
      alert('Error al crear la reserva')
    }
  }
  </script>
  