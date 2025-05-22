<template>
  <div class="container mt-5">
    <h2 class="mb-4">Paquetes turísticos disponibles</h2>

    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else-if="packages.length === 0" class="alert alert-info">
      No hay paquetes disponibles por el momento.
    </div>

    <div class="row g-4" v-else>
      <div class="col-md-4" v-for="pkg in packages" :key="pkg.id">
        <div class="card h-100 shadow-sm position-relative d-flex flex-column">
          
          <span v-if="parseFloat(calcularPrecio(pkg)) < 30"
                class="badge bg-danger position-absolute top-0 end-0 m-2">
            OFERTA
          </span>

          <img :src="getImagePath(pkg.images?.[0])" class="card-img-top" alt="Imagen del paquete" />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ pkg.name || 'Paquete sin nombre' }}</h5>
            <p class="card-text">{{ pkg.description || 'Sin descripción disponible.' }}</p>
            <p class="text-muted small">Por: {{ pkg.entrepreneur?.business_name || 'Emprendedor no identificado' }}</p>
            <p><strong>S/. {{ calcularPrecio(pkg) }}</strong></p>
            <div class="mt-auto d-flex gap-2">
              <router-link :to="`/paquetes/${pkg.id}`" class="btn btn-outline-primary w-50">Ver detalles</router-link>
              <button class="btn btn-outline-secondary w-50" @click="abrirModal(pkg)">Vista rápida</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL VISTA RÁPIDA -->
    <div class="modal fade" id="quickViewModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ paqueteSeleccionado?.name }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <img :src="getImagePath(paqueteSeleccionado?.images?.[0])" class="img-fluid mb-3" alt="Imagen" />
            <p>{{ paqueteSeleccionado?.description || 'Sin descripción disponible.' }}</p>
            <ul>
              <li v-for="p in paqueteSeleccionado?.products" :key="p.id">
                {{ p.name }} — S/. {{ p.price }}
              </li>
            </ul>
            <p><strong>Duración estimada:</strong> {{ calcularDuracion(paqueteSeleccionado) }}</p>

            <div v-if="getLatLng(paqueteSeleccionado)" class="mt-4">
              <h6>Ubicación de referencia</h6>
              <div id="map" style="height: 250px;"></div>
            </div>
          </div>
          <div class="modal-footer">
            <router-link :to="`/reservar/${paqueteSeleccionado?.id}`" class="btn btn-success">Reserva rápida</router-link>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllPackages } from '@/services/packages'
import L from 'leaflet'
import * as bootstrap from 'bootstrap'

export default {
  name: 'PackageList',
  data() {
    return {
      packages: [],
      loading: true,
      paqueteSeleccionado: null,
      mapInstance: null

    }
  },
  methods: {
    getImagePath(img) {
      const path = img?.image_path
      if (path?.startsWith('http')) return path
      if (path) return `/storage/${path}`
      return 'https://placehold.co/600x300?text=Sin+imagen'
    },
    calcularPrecio(pkg) {
      const precio = parseFloat(pkg?.price)
      if (!isNaN(precio) && precio > 0) return precio.toFixed(2)
      if (Array.isArray(pkg?.products)) {
        const total = pkg.products.reduce((sum, p) => {
          const pPrice = parseFloat(p.price)
          return sum + (isNaN(pPrice) ? 0 : pPrice)
        }, 0)
        return total.toFixed(2)
      }
      return '0.00'
    },
    calcularDuracion(pkg) {
      if (!Array.isArray(pkg?.products)) return 'No disponible'
      const totalHoras = pkg.products.reduce((sum, p) => {
        const match = typeof p.duration === 'string' && p.duration.match(/(\d+)/)
        return sum + (match ? parseInt(match[1]) : 0)
      }, 0)
      return totalHoras > 0 ? `${totalHoras} horas aprox.` : 'No disponible'
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
    if (this.mapInstance) {
      this.mapInstance.remove() // limpia mapa anterior
    }
    this.mapInstance = L.map('map').setView([coords.lat, coords.lng], 13)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.mapInstance)
    L.marker([coords.lat, coords.lng]).addTo(this.mapInstance)
  })
}
,
    abrirModal(pkg) {
      this.paqueteSeleccionado = pkg
      const modal = new bootstrap.Modal(document.getElementById('quickViewModal'))
      modal.show()
      setTimeout(() => this.mostrarMapa(pkg), 300)
    }
  },
  async mounted() {
    try {
      const res = await getAllPackages()
      this.packages = res.data || []
    } catch (err) {
      console.error('Error al cargar paquetes:', err)
    } finally {
      this.loading = false
    }
  }
}
</script>

<style scoped>
.card-img-top {
  object-fit: cover;
  height: 200px;
}
</style>
