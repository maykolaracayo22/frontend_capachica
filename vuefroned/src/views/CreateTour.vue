<template>
    <div v-if="isSuperAdmin" class="max-w-xl mx-auto mt-10 p-4 bg-white rounded shadow">
      <h2 class="text-xl font-bold mb-4">Crear Tour</h2>
      <form @submit.prevent="createTour">
        <input v-model="form.nombre" type="text" placeholder="Nombre del tour" class="input" required />
        <textarea v-model="form.descripcion" placeholder="Descripción" class="input" required></textarea>
        <input v-model="form.precio" type="number" step="0.01" placeholder="Precio" class="input" required />
        <input v-model="form.lugar_salida" type="text" placeholder="Lugar de salida" class="input" required />
        <input v-model="form.fecha_salida" type="date" class="input" required />
        <input v-model="form.fecha_retorno" type="date" class="input" required />
        <button type="submit" class="btn">Crear Tour</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  const form = ref({
    nombre: '',
    descripcion: '',
    precio: '',
    lugar_salida: '',
    fecha_salida: '',
    fecha_retorno: '',
  })
  
  const isSuperAdmin = ref(false)
  
  onMounted(async () => {
    const response = await axios.get('/api/user')
    isSuperAdmin.value = response.data.role === 'super-admin'
  })
  
  const createTour = async () => {
    try {
      await axios.post('/api/tours', form.value)
      alert('Tour creado exitosamente')
    } catch (error) {
      console.error(error)
      alert('Error al crear el tour')
    }
  }
  </script>
  
  <style scoped>
  .input {
    display: block;
    width: 100%;
    margin-bottom: 10px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
  .btn {
    background-color: #2563eb;
    color: white;
    padding: 10px 15px;
    border-radius: 8px;
  }
  </style>
  