<template>
  <div class="container mt-4">
    <h2>Mis paquetes personalizados</h2>

    <div class="text-end mb-3">
      <router-link to="/mis-paquetes/crear" class="btn btn-primary">
        + Crear nuevo paquete
      </router-link>
    </div>

    <table class="table table-bordered" v-if="packages.length">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Estado</th>
          <th>Total (S/)</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pkg in packages" :key="pkg.id">
          <td>{{ pkg.name || '(Sin título)' }}</td>
          <td>
            <span class="badge bg-secondary text-capitalize">{{ pkg.status }}</span>
          </td>
          <td>S/. {{ formatPrice(pkg.total_amount) }}</td>
          <td class="d-flex flex-wrap gap-2">
            <!-- Reservar -->
            <router-link
              :to="`/reservar-paquete/${pkg.id}`"
              class="btn btn-success btn-sm"
            >
              Reservar
            </router-link>

            <!-- Ver detalles -->
            <router-link
              :to="`/mis-paquetes/${pkg.id}`"
              class="btn btn-info btn-sm"
            >
              Detalles
            </router-link>

            <!-- Eliminar -->
            <button
              @click="deletePackage(pkg.id)"
              class="btn btn-danger btn-sm"
            >
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else class="alert alert-info">
      Aún no tienes paquetes personalizados.
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import {
  getMyCustomPackages,
  deleteCustomPackage
} from '@/services/customPackages'

export default {
  name: 'CustomPackageList',
  setup() {
    const packages = ref([])

    const fetchPackages = async () => {
      try {
        const res = await getMyCustomPackages()
        packages.value = res.data
      } catch (err) {
        console.error('Error cargando paquetes:', err)
        alert('No se pudieron cargar los paquetes')
      }
    }

    const deletePackage = async (id) => {
      if (!confirm('¿Seguro que deseas eliminar este paquete?')) return

      try {
        await deleteCustomPackage(id)
        packages.value = packages.value.filter((p) => p.id !== id)
      } catch (err) {
        console.error('Error al eliminar:', err)
        alert('No se pudo eliminar el paquete')
      }
    }

    const formatPrice = (value) => {
      const num = Number(value)
      return isNaN(num) ? '0.00' : num.toFixed(2)
    }

    onMounted(fetchPackages)

    return {
      packages,
      deletePackage,
      formatPrice
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 800px;
}

.badge {
  font-size: 0.9rem;
}
</style>
