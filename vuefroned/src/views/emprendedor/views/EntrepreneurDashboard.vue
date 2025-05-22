<template>
   <div class="dashboard-background">
  <div class="entrepreneur-dashboard container-fluid px-4 py-5">
    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay d-flex align-items-center justify-content-center">
      <div class="text-center">
        <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-3 text-muted">Cargando tu panel de control...</p>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-else-if="error" class="alert alert-danger mx-auto" style="max-width: 800px;">
      <i class="bi bi-exclamation-octagon me-2"></i>
      {{ error }}
    </div>

    <!-- Main Dashboard Content -->
    <div v-else class="dashboard-content">
      <!-- Header Section -->
      <header class="dashboard-header mb-5 rounded-4 shadow">
        <div class="d-flex flex-wrap justify-content-between align-items-center p-4">
          <div>
            <h1 class="h2 text-white mb-1">
              <i class="bi bi-person-badge me-3"></i>
              Hola, {{ entrepreneur?.user?.name || 'Usuario' }}
            </h1>
            <p class="text-white-50 mb-0">{{ entrepreneur?.business_name || '—' }}</p>
          </div>
          <button @click="logout" class="btn btn-light btn-lg" aria-label="Cerrar sesión">
            <i class="bi bi-box-arrow-right me-2"></i> Salir
          </button>
        </div>
      </header>

      <div class="row g-4">
        <!-- Perfil -->
        <div class="col-12 col-xl-4">
          <div class="card profile-card h-100 border-0 shadow-lg">
            <div class="card-header bg-transparent py-4">
              <h3 class="h5 mb-0 text-primary">
                <i class="bi bi-person-circle me-2"></i> Mi Perfil
              </h3>
            </div>
            <div class="card-body pt-0 text-center">
              <img
                :src="entrepreneur?.profile_image_url || defaultAvatar"
                class="profile-img rounded-circle shadow mb-3"
                alt="Foto de perfil"
              />
              <router-link
                v-if="entrepreneur && entrepreneur.id"
                :to="{ name: 'EntrepreneurEdit', params: { id: entrepreneur.id } }"
                class="btn btn-primary w-100 mb-3"
              >
                <i class="bi bi-pencil-square me-2"></i> Editar Perfil
              </router-link>

              <dl class="profile-details text-start mx-auto" style="max-width: 250px;">
                <div class="detail-item">
                  <dt><i class="bi bi-envelope me-2"></i>Correo</dt>
                  <dd>{{ entrepreneur?.user?.email || '—' }}</dd>
                </div>
                <div class="detail-item">
                  <dt><i class="bi bi-telephone me-2"></i>Teléfono</dt>
                  <dd>{{ entrepreneur?.phone || '—' }}</dd>
                </div>
                <div class="detail-item">
                  <dt><i class="bi bi-geo-alt me-2"></i>Ubicación</dt>
                  <dd>{{ entrepreneur?.district || '—' }}</dd>
                </div>
                <div class="detail-item">
                  <dt><i class="bi bi-building me-2"></i>RUC</dt>
                  <dd>{{ entrepreneur?.ruc || 'No registrado' }}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <!-- Panel derecho -->
        <div class="col-12 col-xl-8">
          <!-- Métricas -->
          <div class="row g-4 mb-4">
            <div v-for="stat in stats" :key="stat.label" class="col-6 col-md-3">
              <div class="metric-card bg-white p-4 rounded-3 shadow-sm border">
                <div class="d-flex align-items-center">
                  <div class="metric-icon bg-primary text-white rounded-circle me-3">
                    <i class="bi" :class="stat.icon"></i>
                  </div>
                  <div>
                    <div class="metric-value h4 mb-0">{{ stat.value }}</div>
                    <small class="text-muted">{{ stat.label }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Gestión del Negocio -->
          <div class="card border-0 shadow mb-4">
            <div class="card-header bg-transparent py-3">
              <h3 class="h5 mb-0 text-primary">
                <i class="bi bi-gear me-2"></i>
                Gestión del Negocio
              </h3>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div v-for="item in links" :key="item.label" class="col-6 col-md-4">
                  <router-link :to="item.to" class="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center">
                    <i :class="['bi', item.icon, 'me-2']"></i> {{ item.label }}
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <!-- Productos recientes -->
          <div class="card border-0 shadow mb-4">
            <div class="card-header bg-transparent py-3">
              <h3 class="h5 mb-0 text-primary">
                <i class="bi bi-box-seam me-2"></i>Productos Recientes
              </h3>
            </div>
            <div class="card-body p-0">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="product in products.slice(0, 3)" :key="product.id">
                    <td>
                      <img
                        :src="product.images?.[0]?.image_url || defaultAvatar"
                        alt="img"
                        width="50"
                        height="50"
                        class="rounded shadow-sm"
                      />
                    </td>
                    <td>{{ product.name }}</td>
                    <td>S/ {{ formatCurrency(product.price) }}</td>
                    <td>
                      <span :class="['badge', product.is_active ? 'bg-success' : 'bg-secondary']">
                        {{ product.is_active ? 'Activo' : 'Inactivo' }}
                      </span>
                    </td>
                    <td>
                      <router-link :to="{ name: 'ProductEdit', params: { id: product.id } }" class="btn btn-sm btn-outline-primary me-1">

                        <i class="bi bi-pencil"></i>
                      </router-link>
                      <router-link :to="`/products/${product.id}`" class="btn btn-sm btn-outline-secondary">
                        <i class="bi bi-eye"></i>
                      </router-link>
                    </td>
                  </tr>
                  <tr v-if="!products.length">
                    <td colspan="5" class="text-center text-muted py-4">No hay productos registrados</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Pagos recientes -->
          <div class="card border-0 shadow mb-4">
            <div class="card-header bg-transparent py-3">
              <h3 class="h5 mb-0 text-primary"><i class="bi bi-currency-exchange me-2"></i>Pagos Recientes</h3>
            </div>
            <div class="card-body p-0">
              <table class="table table-striped mb-0">
                <thead class="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Producto</th>
                    <th>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="payment in payments.slice(0, 5)" :key="payment.id">
                    <td>#{{ payment.id }}</td>
                    <td>{{ payment.product?.name || '—' }}</td>
                    <td>S/ {{ formatCurrency(payment.total_amount) }}</td>

                  </tr>
                  <tr v-if="!payments.length">
                    <td colspan="3" class="text-center text-muted py-4">No hay pagos recientes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Actividad reciente -->
          <div class="card border-0 shadow">
            <div class="card-header bg-transparent py-3">
              <h3 class="h5 mb-0 text-primary"><i class="bi bi-clock-history me-2"></i>Actividad Reciente</h3>
            </div>
            <div class="card-body p-0">
              <ul class="list-group list-group-flush">
                <li v-for="item in history.slice(0, 5)" :key="item.created_at + item.action" class="list-group-item border-0 py-3">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <span class="badge bg-primary me-2">{{ item.type }}</span>
                      <strong>{{ item.action }}</strong>
                      <p class="text-muted mb-0 small">{{ item.details }}</p>
                    </div>
                    <div class="text-end">
                      <small class="text-muted">{{ formatDate(item.created_at) }}</small>
                    </div>
                  </div>
                </li>
                <li v-if="!history.length" class="list-group-item text-center text-muted py-4">No hay actividades recientes</li>
              </ul>
            </div>
            <div class="card-footer bg-transparent py-3 text-end">
              <router-link
  v-if="entrepreneur && entrepreneur.id"
  :to="{ name: 'EntrepreneurDetail', params: { id: entrepreneur.id } }"
  class="btn btn-link text-decoration-none"
>
  Ver historial completo <i class="bi bi-arrow-right ms-2"></i>
</router-link>


            </div>
          </div>
 <!-- Paquetes turísticos -->
<div class="card border-0 shadow mb-4">
  <div class="card-header bg-transparent py-3">
    <h3 class="h5 mb-0 text-primary"><i class="bi bi-suitcase2 me-2"></i>Paquetes Turísticos</h3>
  </div>
  <div class="card-body p-0">
    <table class="table table-hover mb-0">
      <thead class="table-light">
        <tr>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pkg in packages.slice(0, 3)" :key="pkg.id">
          <td>{{ pkg.name }}</td>
          <td>S/ {{ formatCurrency(pkg.price ?? 0) }}</td>
          <td>
            <span :class="['badge', pkg.is_active ? 'bg-success' : 'bg-secondary']">
              {{ pkg.is_active ? 'Activo' : 'Inactivo' }}
            </span>
          </td>
          <td>
            <router-link :to="{ name: 'EntrepreneurPackageEdit', params: { id: pkg.id } }" class="btn btn-sm btn-outline-primary me-1">
              <i class="bi bi-pencil"></i>
            </router-link>
            <router-link :to="`/paquetes/${pkg.id}`" class="btn btn-sm btn-outline-secondary">
              <i class="bi bi-eye"></i>
            </router-link>
          </td>
        </tr>
        <tr v-if="!packages.length">
          <td colspan="4" class="text-center text-muted py-4">No has creado paquetes aún.</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import api from '@/services/axios'

export default {
  name: 'EntrepreneurDashboard',
  data() {
    return {
      loading: true,
      error: '',
      entrepreneur: null,
      products: [],
      payments: [],
      history: [],
      stats: [],
      links: [],
      packages: [],
      defaultAvatar: 'https://via.placeholder.com/150'
    }
  },
  async mounted() {
    try {
      await this.loadDashboardData()
    } catch (e) {
      console.error('Error al cargar el dashboard:', e)
      this.error = 'Falló la carga de datos. Intenta recargar la página.'
    } finally {
      this.loading = false
    }
  },
  methods: {
    formatCurrency(value) {
      const num = parseFloat(value)
      return isNaN(num) ? '0.00' : num.toFixed(2)
    },
    formatDate(dt) {
      return new Date(dt).toLocaleString()
    },
    logout() {
      localStorage.clear()
      this.$router.push({ name: 'Login' })
    },
    async loadDashboardData() {
      const [entreRes, productsRes, paymentsRes, packagesRes] = await Promise.all([
        api.get('/entrepreneur/authenticated'),
        api.get('/products/my'),
        api.get('/payments?mine=true'),
        api.get('/packages?mine=true')
      ])

      this.entrepreneur = entreRes.data.entrepreneur
      this.history = entreRes.data.history || []
      this.products = productsRes.data
      this.payments = paymentsRes.data
      this.packages = packagesRes.data

      console.log('🧪 Datos del emprendedor:', this.entrepreneur)
      console.log('🧪 Pagos:', this.payments)

      // Generar métricas
      const totalIngresos = this.payments.reduce((sum, p) => sum + parseFloat(p.total_amount || 0), 0)
      const totalReservas = this.entrepreneur?.reservations_count ?? 0
      const rating = this.entrepreneur?.rating ?? '—'

      this.stats = [
        { label: 'Productos', value: this.products.length, icon: 'bi-box-seam' },
        { label: 'Reservas', value: totalReservas, icon: 'bi-calendar-check' },
        { label: 'Ingresos', value: `S/ ${totalIngresos.toFixed(2)}`, icon: 'bi-currency-dollar' },
        { label: 'Valoración', value: rating !== '—' ? `${rating}/5` : '—', icon: 'bi-star-fill' }
      ]

      this.links = [
        { label: 'Mis Paquetes', to: '/emprendedor/paquetes', icon: 'bi-suitcase2' },
        { label: 'Crear Paquete', to: '/emprendedor/paquetes/crear', icon: 'bi-plus-circle' },
        { label: 'Reservas de Paquetes', to: '/emprendedor/reservas-de-paquetes', icon: 'bi-calendar-check' },
        { label: 'Mis Productos', to: '/products/my', icon: 'bi-box' },
        { label: 'Crear Producto', to: '/products/create', icon: 'bi-plus-circle' },
        { label: 'Mis Reservas', to: '/reservations', icon: 'bi-calendar-check' },
        { label: 'Mis Lugares', to: '/admin/places', icon: 'bi-geo-alt' },
        { label: 'Tours Destacados', to: '/admin/tours-manager', icon: 'bi-map' },
        { label: 'Pagos', to: '/pagos', icon: 'bi-credit-card' },
        ...(this.entrepreneur?.id ? [{
          label: 'Editar Perfil',
          to: { name: 'EntrepreneurEdit', params: { id: this.entrepreneur.id } },
          icon: 'bi-pencil-square'
        }] : [])
      ]
    }
  }
}
</script>

<style scoped>

.entrepreneur-dashboard {
  background-color: var(--bs-light); /* Fondo general claro */
  min-height: 100vh; /* Asegura que el fondo cubra toda la pantalla */
}

.dashboard-header {
  background: linear-gradient(135deg, var(--bs-primary), #563d7c); /* Degradado moderno */
  color: var(--bs-white);
  border-radius: 0.75rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
}

.dashboard-header h1 {
  font-weight: 500;
}

.btn-outline-secondary {
  border-radius: 0.5rem;
}

.profile-card {
  border: none;
  border-radius: 0.75rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.08);
}

.profile-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border: 3px solid var(--bs-white);
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.05);
}

.detail-item dt {
  font-weight: 500;
  color: var(--bs-secondary);
}

.detail-item dd {
  color: var(--bs-primary);
  font-weight: bold;
}

.metric-card {
  background-color: var(--bs-white);
  border-radius: 0.5rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease-in-out;
}

.metric-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.08);
}

.metric-icon {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: rgba(var(--bs-primary-rgb), 0.15); /* Tono suave del primario */
  color: var(--bs-primary);
  font-size: 1.2rem;
}

.btn-primary {
  border-radius: 0.5rem;
}

.btn-outline-primary {
  border-radius: 0.5rem;
}

.table {
  background-color: var(--bs-white);
  border-radius: 0.5rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.05);
  overflow: hidden; /* Para redondear las esquinas */
}

.table thead th {
  background-color: #f8f9fa; /* Gris claro */
  border-bottom: 2px solid #dee2e6;
  color: var(--bs-secondary);
}

.badge-success-subtle {
  background-color: rgba(var(--bs-success-rgb), 0.15);
  color: var(--bs-success);
}

.badge-secondary-subtle {
  background-color: rgba(var(--bs-secondary-rgb), 0.15);
  color: var(--bs-secondary);
}

.list-group-item {
  border-color: #e9ecef;
}

.badge-primary-subtle {
  background-color: rgba(var(--bs-primary-rgb), 0.15);
  color: var(--bs-primary);
}

.card-footer {
  background-color: #f8f9fa;
  border-top: 1px solid #dee2e6;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(var(--bs-white-rgb), 0.8);
  z-index: 1050;
  backdrop-filter: blur(5px);
}

.spinner-border-primary {
  border-color: var(--bs-primary);
}

.text-secondary {
  color: var(--bs-secondary) !important;
}
</style>
