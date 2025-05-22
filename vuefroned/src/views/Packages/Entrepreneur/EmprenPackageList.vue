<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0 text-primary fw-bold">Mis paquetes turísticos</h2>
      <router-link to="/emprendedor/paquetes/crear" class="btn btn-primary btn-lg shadow">
        <i class="bi bi-plus-circle me-2"></i> Crear nuevo paquete
      </router-link>
    </div>

    <div v-if="!packages.length" class="alert alert-info text-center py-4">
      <i class="bi bi-info-circle-fill fs-3 d-block mb-2"></i>
      <h4 class="alert-heading">Aún no has creado paquetes turísticos</h4>
      <p class="mb-0">Comienza creando tu primer paquete para ofrecerlo a los viajeros</p>
    </div>

    <div v-else class="row g-4">
      <div v-for="pkg in packages" :key="pkg.id" class="col-md-6 col-lg-4">
        <div class="card shadow-sm h-100 border-0 overflow-hidden package-card">
          <!-- Carrusel de imágenes mejorado -->
          <div v-if="pkg.images && pkg.images.length > 0" class="position-relative">
            <div :id="'carousel-' + pkg.id" class="carousel slide" data-bs-ride="carousel">
              <div class="carousel-inner rounded-top">
                <div
                  v-for="(img, index) in pkg.images"
                  :key="img.id"
                  :class="['carousel-item', { active: index === 0 }]"
                >
                  <img
                    :src="getImageUrl(img.image_path)"
                    class="d-block w-100 package-image"
                    :alt="'Imagen ' + (index + 1) + ' de ' + pkg.name"
                  />
                </div>
              </div>
              <button 
                class="carousel-control-prev" 
                type="button" 
                :data-bs-target="'#carousel-' + pkg.id" 
                data-bs-slide="prev"
              >
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Anterior</span>
              </button>
              <button 
                class="carousel-control-next" 
                type="button" 
                :data-bs-target="'#carousel-' + pkg.id" 
                data-bs-slide="next"
              >
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Siguiente</span>
              </button>
              <div class="carousel-indicators position-static bg-dark bg-opacity-25 py-1">
                <button
                  v-for="(img, index) in pkg.images"
                  :key="'indicator-'+img.id"
                  type="button"
                  :data-bs-target="'#carousel-' + pkg.id"
                  :data-bs-slide-to="index"
                  :class="{ active: index === 0 }"
                  aria-current="true"
                  :aria-label="'Slide ' + (index + 1)"
                ></button>
              </div>
            </div>
            <span class="position-absolute top-0 end-0 bg-primary text-white px-2 py-1 small rounded-bl">
              <i class="bi bi-images me-1"></i> {{ pkg.images.length }}
            </span>
          </div>
          <!-- Fallback si no hay imagen -->
          <div v-else class="bg-light text-center py-5 text-muted">
            <i class="bi bi-image-fill text-muted" style="font-size: 3rem;"></i>
            <div class="small">No hay imágenes disponibles</div>
          </div>

          <!-- Contenido mejorado -->
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="card-title fw-bold text-truncate">{{ pkg.name }}</h5>
              <span class="badge bg-success bg-opacity-10 text-success ms-2">
                S/. {{ isNumeric(pkg.price) ? Number(pkg.price).toFixed(2) : 'Calculado' }}
              </span>
            </div>
            
            <p class="card-text text-muted mb-3">
              {{ pkg.description?.slice(0, 120) || 'Este paquete no tiene descripción aún...' }}
              <span v-if="pkg.description?.length > 120">...</span>
            </p>

            <div class="mt-auto">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="badge bg-info bg-opacity-10 text-info">
                  <i class="bi bi-box-seam me-1"></i> {{ pkg.products?.length || 0 }} productos
                </span>
                <small class="text-muted">
                  <i class="bi bi-calendar3 me-1"></i> {{ formatDate(pkg.created_at) }}
                </small>
              </div>

              <div class="d-grid gap-2 d-md-flex justify-content-between">
                <router-link
                  :to="`/emprendedor/paquetes/${pkg.id}/editar`"
                  class="btn btn-outline-primary btn-sm flex-grow-1"
                >
                  <i class="bi bi-pencil-square me-1"></i> Editar
                </router-link>

                <button
                  @click="confirmDelete(pkg.id, pkg.name)"
                  class="btn btn-outline-danger btn-sm flex-grow-1"
                >
                  <i class="bi bi-trash me-1"></i> Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal de confirmación para eliminar -->
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">Confirmar eliminación</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>¿Estás seguro de que deseas eliminar el paquete <strong>{{ packageToDelete.name }}</strong>?</p>
            <p class="text-danger small">Esta acción no se puede deshacer.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button 
              type="button" 
              class="btn btn-danger" 
              @click="deletePackage"
              :disabled="deleting"
            >
              <span v-if="deleting" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              <span v-else><i class="bi bi-trash me-1"></i></span>
              {{ deleting ? 'Eliminando...' : 'Eliminar definitivamente' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/axios'
import { Modal } from 'bootstrap'

export default {
  name: 'EntrepreneurPackageList',
  data() {
    return {
      packages: [],
      packageToDelete: { id: null, name: '' },
      deleting: false,
      deleteModal: null
    }
  },
  methods: {
    isNumeric(val) {
      return !isNaN(parseFloat(val)) && isFinite(val)
    },
    getImageUrl(path) {
      return path ? `/storage/${path}` : ''
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const options = { year: 'numeric', month: 'short', day: 'numeric' }
      return new Date(dateString).toLocaleDateString('es-ES', options)
    },
    async fetchPackages() {
      try {
        const res = await api.get('/packages/my')
        this.packages = res.data
      } catch (err) {
        console.error('Error al cargar paquetes:', err)
        this.$toast.error('No se pudieron cargar los paquetes.', {
          position: 'top-right',
          timeout: 3000
        })
      }
    },
    confirmDelete(id, name) {
      this.packageToDelete = { id, name }
      if (!this.deleteModal) {
        this.deleteModal = new Modal(document.getElementById('deleteModal'))
      }
      this.deleteModal.show()
    },
    async deletePackage() {
      this.deleting = true
      try {
        await api.delete(`/packages/${this.packageToDelete.id}`)
        this.packages = this.packages.filter(p => p.id !== this.packageToDelete.id)
        this.$toast.success('Paquete eliminado correctamente', {
          position: 'top-right',
          timeout: 3000
        })
        this.deleteModal.hide()
      } catch (err) {
        console.error('Error al eliminar paquete:', err)
        this.$toast.error('No se pudo eliminar el paquete', {
          position: 'top-right',
          timeout: 3000
        })
      } finally {
        this.deleting = false
      }
    }
  },
  async mounted() {
    await this.fetchPackages()
  }
}
</script>

<style scoped>
.package-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 0.75rem !important;
}

.package-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.15) !important;
}

.package-image {
  height: 200px;
  object-fit: cover;
  object-position: center;
}

.carousel-indicators button {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin: 0 3px;
  border: none;
  background-color: rgba(255, 255, 255, 0.5);
}

.carousel-indicators .active {
  background-color: white;
}

.card-title {
  font-size: 1.15rem;
  color: #2c3e50;
}

.card-text {
  font-size: 0.9rem;
  line-height: 1.5;
}

.btn-outline-primary, .btn-outline-danger {
  transition: all 0.2s ease;
}

.btn-outline-primary:hover {
  background-color: var(--bs-primary);
  color: white;
}

.btn-outline-danger:hover {
  background-color: var(--bs-danger);
  color: white;
}

.badge {
  font-weight: 500;
  padding: 0.35em 0.65em;
}

.carousel-control-prev, .carousel-control-next {
  background-color: rgba(0, 0, 0, 0.2);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.carousel:hover .carousel-control-prev,
.carousel:hover .carousel-control-next {
  opacity: 1;
}
</style>