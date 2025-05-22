<template>
  <div class="container mt-4">
    <h2>Reservas de mis productos y paquetes</h2>

    <div v-if="loading" class="text-center mt-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else-if="reservations.length === 0" class="alert alert-info mt-4">
      Aún no hay reservas registradas para tus productos o paquetes.
    </div>

    <table v-else class="table table-bordered mt-4">
      <thead>
        <tr>
          <th>Código</th>
          <th>Cliente</th>
          <th>Fecha</th>
          <th>Tipo</th>
          <th>Total (S/)</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="res in reservations" :key="res.id">
          <td>{{ res.reservation_code }}</td>
          <td>{{ res.user?.name }}</td>
          <td>{{ res.reservation_date?.substring(0,10) }}</td>
          <td>
            <span v-if="res.product_id">Producto</span>
            <span v-else-if="res.custom_package_id">Paquete personalizado</span>
            <span v-else>Otro</span>
          </td>
          <td>S/. {{ Number(res.total_amount).toFixed(2) }}</td>
          <td>
            <select v-model="res.status" class="form-select form-select-sm">
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </td>
          <td>
            <button class="btn btn-sm btn-primary" @click="updateStatus(res)">Guardar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import api from '@/services/axios'

export default {
  name: 'EntrepreneurPackageReservations',
  data() {
    return {
      reservations: [],
      loading: true
    }
  },
  methods: {
    async updateStatus(reservation) {
      try {
        await api.put(`/reservations/${reservation.id}`, {
          product_id: reservation.product_id, // si es null, sigue igual
          quantity: reservation.quantity || 1,
          reservation_date: reservation.reservation_date,
          status: reservation.status
        })
        alert('✅ Estado actualizado correctamente.')
      } catch (err) {
        console.error('Error actualizando estado:', err)
        alert('❌ No se pudo actualizar el estado.')
      }
    }
  },
  async mounted() {
    try {
      const res = await api.get('/entrepreneur/authenticated')
      const entrepreneurId = res.data?.entrepreneur?.id

      if (!entrepreneurId) throw new Error('Emprendedor no encontrado.')

      const resReservations = await api.get(`/reservations/emprendedor/${entrepreneurId}`)
      this.reservations = resReservations.data
    } catch (err) {
      console.error('Error al cargar reservas:', err)
      alert('No se pudieron cargar las reservas.')
    } finally {
      this.loading = false
    }
  }
}
</script>


