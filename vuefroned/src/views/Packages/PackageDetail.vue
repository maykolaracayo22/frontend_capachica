<template>
  <div class="container mt-5">
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary"></div>
      <p class="mt-3">Cargando paquete...</p>
    </div>

    <div v-else-if="!packageData" class="alert alert-danger">
      Paquete no encontrado.
    </div>

    <div v-else>
      <h2 class="mb-2">{{ packageData.name || 'Paquete sin nombre' }}</h2>
      <p class="text-muted">
        Creado por: <strong>{{ packageData.entrepreneur?.business_name || 'Emprendedor desconocido' }}</strong>
      </p>

      <img
        :src="getImageUrl(packageData)"
        class="img-fluid rounded mb-4 w-100"
        alt="Imagen del paquete"
      />

      <p>{{ packageData.description || 'Sin descripción disponible.' }}</p>

      <!-- INFO GENERAL -->
      <div class="row g-3 my-4">
        <div class="col-md-4">
          <div class="bg-light p-3 rounded shadow-sm text-center">
            <i class="bi bi-clock-history fs-3 text-primary"></i>
            <p class="mb-0 mt-2">Duración estimada:</p>
            <strong>{{ calcularDuracion(packageData) }}</strong>
          </div>
        </div>
        <div class="col-md-4">
          <div class="bg-light p-3 rounded shadow-sm text-center">
            <i class="bi bi-box-seam fs-3 text-success"></i>
            <p class="mb-0 mt-2">Productos:</p>
            <strong>{{ packageData.products?.length || 0 }}</strong>
          </div>
        </div>
        <div class="col-md-4">
          <div class="bg-light p-3 rounded shadow-sm text-center">
            <i class="bi bi-calendar-event fs-3 text-info"></i>
            <p class="mb-0 mt-2">Creado:</p>
            <strong>{{ formatDate(packageData.created_at) }}</strong>
          </div>
        </div>
      </div>

      <!-- LISTA DE PRODUCTOS -->
      <table class="table table-bordered mt-4">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Duración</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!packageData.products || packageData.products.length === 0">
            <td colspan="3" class="text-center">Sin productos asociados</td>
          </tr>
          <tr v-else v-for="p in packageData.products" :key="p.id">
            <td>{{ p.name }}</td>
            <td>{{ p.duration || 'N/D' }}</td>
            <td>S/. {{ formatPrice(p.price) }}</td>
          </tr>
        </tbody>
      </table>

      <div class="text-end mt-3">
        <strong>Total: 
          <span v-if="packageData.price">
            S/. {{ formatPrice(packageData.price) }}
          </span>
          <span v-else>
            S/. {{ calcularTotalProductos(packageData.products) }}
          </span>
        </strong>
      </div>

      <!-- MAPA SI EXISTE UBICACIÓN -->
      <div class="mt-4" v-if="getLatLng(packageData)">
        <h5><i class="bi bi-geo-alt-fill me-2 text-danger"></i>Ubicación estimada</h5>
        <div id="map" style="height: 300px;" class="rounded border shadow-sm"></div>
      </div>

      <!-- BOTÓN PAGO -->
      <div class="mt-4 text-end">
        <router-link
          :to="`/pago-paquete/${packageData.id}`"
          class="btn btn-success btn-lg"
        >
          <i class="bi bi-credit-card me-2"></i> Pagar paquete
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import L from 'leaflet'
import { getPackage } from '@/services/packages'

export default {
  name: 'PackageDetail',
  data() {
    return {
      loading: true,
      packageData: null
    }
  },
  methods: {
    formatPrice(value) {
      const num = typeof value === 'number' ? value : parseFloat(value)
      return isNaN(num) ? '0.00' : num.toFixed(2)
    },
    calcularTotalProductos(products = []) {
      return products.reduce((sum, p) => {
        const price = parseFloat(p.price)
        return sum + (isNaN(price) ? 0 : price)
      }, 0).toFixed(2)
    },
    calcularDuracion(pkg) {
      if (!Array.isArray(pkg?.products)) return 'No disponible'
      const total = pkg.products.reduce((sum, p) => {
        const match = p.duration?.match?.(/\d+/)
        return sum + (match ? parseInt(match[0]) : 0)
      }, 0)
      return total > 0 ? `${total} horas aprox.` : 'No disponible'
    },
    formatDate(dateStr) {
      if (!dateStr) return 'Desconocido'
      return new Date(dateStr).toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    getImageUrl(pkg) {
      const path = pkg?.images?.[0]?.image_path
      if (path?.startsWith('http')) return path
      if (path) return `/storage/${path}`
      return 'https://placehold.co/800x300?text=Paquete+Turístico'
    },
    getLatLng(pkg) {
      const prod = pkg?.products?.[0]
      if (!prod?.latitude || !prod?.longitude) return null
      return { lat: parseFloat(prod.latitude), lng: parseFloat(prod.longitude) }
    },
    mostrarMapa(pkg) {
      const coords = this.getLatLng(pkg)
      if (!coords) return
      this.$nextTick(() => {
        const map = L.map('map').setView([coords.lat, coords.lng], 13)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map)
        L.marker([coords.lat, coords.lng]).addTo(map)
      })
    }
  },
  async mounted() {
    try {
      const res = await getPackage(this.$route.params.id)
      this.packageData = res.data
      if (this.getLatLng(res.data)) {
        setTimeout(() => this.mostrarMapa(res.data), 300)
      }
    } catch (err) {
      console.error('Error al cargar paquete:', err)
    } finally {
      this.loading = false
    }
  }
}
</script>

<style scoped>
img {
  max-height: 300px;
  object-fit: cover;
}
</style>
