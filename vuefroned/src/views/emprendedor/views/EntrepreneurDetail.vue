<template>
  <div class="p-4 max-w-3xl mx-auto">
    <!-- Mostrar contenido solo cuando entrepreneur esté cargado -->
    <div v-if="entrepreneur">
      <h1 class="text-2xl mb-4">Historial de {{ entrepreneur.business_name }}</h1>

      <div v-if="loading" class="text-gray-500">Cargando...</div>
      <div v-else-if="error" class="text-red-600">{{ error }}</div>
      <div v-else>
        <!-- Datos básicos -->
        <div class="mb-6">
          <p><strong>Usuario:</strong> {{ entrepreneur.user.name }} ({{ entrepreneur.user.email }})</p>
          <p><strong>RUC:</strong> {{ entrepreneur.ruc || 'No proporcionado' }}</p>
          <p><strong>Teléfono:</strong> {{ entrepreneur.phone }}</p>
          <!-- otros campos si es necesario -->
        </div>

        <!-- Historial de acciones -->
        <h2 class="text-xl mb-2">Registro de Actividades</h2>
        <table class="w-full border">
          <thead class="bg-gray-100">
            <tr>
              <th class="p-2 border">Fecha</th>
              <th class="p-2 border">Acción</th>
              <th class="p-2 border">Detalle</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in history" :key="item.id">
              <td class="p-2 border">{{ item.created_at }}</td>
              <td class="p-2 border">{{ item.action }}</td>
              <td class="p-2 border">{{ item.details }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- Spinner o mensaje mientras carga antes de tener datos de entrepreneur -->
    <div v-else class="text-center p-4">
      <div v-if="loading" class="text-gray-500">Cargando datos del emprendedor...</div>
      <div v-else class="text-red-600">{{ error || 'No se encontró el emprendedor.' }}</div>
    </div>
  </div>
</template>

<script>
import api from '@/services/axios'

export default {
  name: 'EntrepreneurDetail',
  props: ['id'],
  data() {
    return {
      entrepreneur: null,
      history: [],
      loading: true,
      error: ''
    }
  },
  async mounted() {
    this.loading = true
    this.error = ''
    try {
      const res = await api.get(`/entrepreneurs/${this.id}/history`)
      this.entrepreneur = res.data.entrepreneur
      this.history      = res.data.history
    } catch (e) {
      this.error = 'No se pudo cargar el historial.'
    } finally {
      this.loading = false
    }
  }
}
</script>
