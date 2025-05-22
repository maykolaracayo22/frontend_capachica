<template>
  <div class="admin-dashboard">
    <div class="dashboard-header bg-gradient-nature text-white py-5">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="display-5 fw-bold mb-3">
              <i class="bi bi-compass me-3"></i>Panel de Administración Turística
            </h1>
            <p class="lead mb-0">Gestión integral de recursos y proveedores</p>
          </div>
          <router-link
            to="/dashboard"
            class="btn btn-light btn-lg d-inline-flex align-items-center"
            aria-label="Volver al Panel Principal"
          >
            <i class="bi bi-arrow-left me-2"></i>
            Panel Principal
          </router-link>
        </div>

        <div class="row g-4 quick-stats">
          <div class="col-12 col-md-3">
            <StatCard
              icon="bi-people"
              :value="associationsCount"
              label="Asociaciones"
            />
          </div>
          <div class="col-12 col-md-3">
            <StatCard
              icon="bi-tags"
              :value="categoriesCount"
              label="Categorías"
            />
          </div>
          <div class="col-12 col-md-3">
            <StatCard
              icon="bi-person-badge"
              :value="entrepreneursCount"
              label="Emprendedores"
            />
          </div>
          <div class="col-12 col-md-3">
            <StatCard
              icon="bi-calendar-event"
              :value="reservationsCount"
              label="Reservas Activas"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="container py-5">
      <div class="row g-4">
        <div class="col-12 col-lg-4">
          <div class="management-card card border-0 shadow-lg h-100 d-flex flex-column">
            <div class="card-header bg-gradient-mountain text-white">
              <div class="d-flex justify-content-between align-items-center">
                <h3 class="h5 mb-0">
                  <i class="bi bi-geo-alt me-2"></i>
                  Asociaciones
                </h3>
                <router-link
                  :to="{ name: 'AssociationForm' }"
                  class="btn btn-light btn-sm"
                  aria-label="Crear nueva asociación"
                >
                  <i class="bi bi-plus-lg"></i> Nueva
                </router-link>
              </div>
              <p class="mb-0 small mt-2 opacity-85">Grupos y comunidades locales</p>
            </div>
            <div class="card-body d-flex flex-column justify-content-center align-items-center">
              <p class="text-muted mb-2">Total: {{ associationsCount }}</p>
              <router-link
                :to="{ name: 'AssociationList' }"
                class="btn btn-outline-primary"
                aria-label="Ver lista completa de asociaciones"
              >
                <i class="bi bi-list me-2"></i> Ver Lista
              </router-link>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-4">
          <div class="management-card card border-0 shadow-lg h-100 d-flex flex-column">
            <div class="card-header bg-gradient-forest text-white">
              <div class="d-flex justify-content-between align-items-center">
                <h3 class="h5 mb-0">
                  <i class="bi bi-bookmarks me-2"></i>
                  Categorías
                </h3>
                <router-link
                  :to="{ name: 'CategoryForm' }"
                  class="btn btn-light btn-sm"
                  aria-label="Crear nueva categoría"
                >
                  <i class="bi bi-plus-lg"></i> Nueva
                </router-link>
              </div>
              <p class="mb-0 small mt-2 opacity-85">Clasificación de experiencias</p>
            </div>
            <div class="card-body d-flex flex-column justify-content-center align-items-center">
              <p class="text-muted mb-2">Total: {{ categoriesCount }}</p>
              <router-link
                :to="{ name: 'AdminCategoriesList' }"
                class="btn btn-outline-success"
                aria-label="Ver catálogo de categorías"
              >
                <i class="bi bi-list me-2"></i> Ver Catálogo
              </router-link>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-4">
          <div class="management-card card border-0 shadow-lg h-100 d-flex flex-column">
            <div class="card-header bg-gradient-sunset text-white">
              <div class="d-flex justify-content-between align-items-center">
                <h3 class="h5 mb-0">
                  <i class="bi bi-person-workspace me-2"></i>
                  Emprendedores
                </h3>
                <router-link
                  :to="{ name: 'EntrepreneurForm' }"
                  class="btn btn-light btn-sm"
                  aria-label="Crear nuevo emprendedor"
                >
                  <i class="bi bi-plus-lg"></i> Nuevo
                </router-link>
              </div>
              <p class="mb-0 small mt-2 opacity-85">Proveedores de servicios turísticos</p>
            </div>
            <div class="card-body d-flex flex-column justify-content-center align-items-center">
              <p class="text-muted mb-2">Total: {{ entrepreneursCount }}</p>
              <router-link
                :to="{ name: 'EntrepreneurList' }"
                class="btn btn-outline-warning"
                aria-label="Ver registros de emprendedores"
              >
                <i class="bi bi-list me-2"></i> Ver Registros
              </router-link>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-4">
          <div class="management-card card border-0 shadow-lg h-100 d-flex flex-column">
            <div class="card-header bg-gradient-info text-white">
              <div class="d-flex justify-content-between align-items-center">
                <h3 class="h5 mb-0">
                  <i class="bi bi-calendar-event me-2"></i>
                  Reservas
                </h3>
                <router-link
                  to="/reservation/create"
                  class="btn btn-light btn-sm"
                  aria-label="Crear nueva reserva"
                >
                  <i class="bi bi-plus-lg"></i> Nueva
                </router-link>
              </div>
              <p class="mb-0 small mt-2 opacity-85">Gestión de reservas de usuarios</p>
            </div>
            <div class="card-body d-flex flex-column justify-content-center align-items-center">
              <p class="text-muted mb-2">Total Activas: {{ reservationsCount }}</p>
              <router-link
                to="/reservations"
                class="btn btn-outline-info"
                aria-label="Ver lista completa de reservas"
              >
                <i class="bi bi-list me-2"></i> Ver Reservas
              </router-link>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-4">
          <div class="management-card card border-0 shadow-lg h-100 d-flex flex-column">
            <div class="card-header bg-gradient-teal text-white">
              <div class="d-flex justify-content-between align-items-center">
                <h3 class="h5 mb-0">
                  <i class="bi bi-signpost-2 me-2"></i>
                  Lugares Turísticos
                </h3>
                <router-link
                  to="/places/create"
                  class="btn btn-light btn-sm"
                  aria-label="Crear nuevo lugar turístico"
                >
                  <i class="bi bi-plus-lg"></i> Nuevo
                </router-link>
              </div>
              <p class="mb-0 small mt-2 opacity-85">Administración de puntos de interés</p>
            </div>
            <div class="card-body d-flex flex-column justify-content-center align-items-center">
              <p class="text-muted mb-2">Total: {{ placesCount }}</p>
              <router-link
                to="/places"
                class="btn btn-outline-teal"
                aria-label="Ver lista de lugares turísticos"
              >
                <i class="bi bi-list me-2"></i> Ver Lugares
              </router-link>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-4">
          <div class="management-card card border-0 shadow-lg h-100 d-flex flex-column">
            <div class="card-header bg-gradient-purple text-white">
              <div class="d-flex justify-content-between align-items-center">
                <h3 class="h5 mb-0">
                  <i class="bi bi-people-fill me-2"></i>
                  Usuarios
                </h3>
                <router-link
                  to="/users/create"
                  class="btn btn-light btn-sm"
                  aria-label="Crear nuevo usuario"
                >
                  <i class="bi bi-plus-lg"></i> Nuevo
                </router-link>
              </div>
              <p class="mb-0 small mt-2 opacity-85">Gestión de cuentas de usuarios</p>
            </div>
            <div class="card-body d-flex flex-column justify-content-center align-items-center">
              <p class="text-muted mb-2">Total: {{ usersCount }}</p>
              <router-link
                to="/users"
                class="btn btn-outline-purple"
                aria-label="Ver lista de usuarios"
              >
                <i class="bi bi-list me-2"></i> Ver Usuarios
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/axios'
import StatCard from '@/components/StatCard.vue'

export default {
  name: 'AdminDashboard',
  components: {
    StatCard,
  },
  data() {
    return {
      associationsCount: 0,
      categoriesCount: 0,
      entrepreneursCount: 0,
      reservationsCount: 0,
      placesCount: 0,
      usersCount: 0,
      error: null
    }
  },
  methods: {
    loadCounts() {
      return Promise.all([
        api.get('/associations/count'),
        api.get('/categories/count'),
        api.get('/entrepreneurs/count'),
        api.get('/reservations/count'), // Asegúrate de tener esta ruta en tu API
        api.get('/places/count'),       // Asegúrate de tener esta ruta en tu API
        api.get('/users/count')        // Asegúrate de tener esta ruta en tu API
      ])
    }
  },
  async mounted() {
    try {
      const [a, c, e, r, p, u] = await this.loadCounts()
      this.associationsCount  = a.data.count
      this.categoriesCount    = c.data.count
      this.entrepreneursCount = e.data.count
      this.reservationsCount  = r.data.count
      this.placesCount        = p.data.count
      this.usersCount         = u.data.count
    } catch (err) {
      console.error('Error al cargar contadores', err)
      this.error = 'No se pudieron cargar los datos de resumen.'
    }
  }
}
</script>

<style scoped>
.dashboard-header {
  background: linear-gradient(135deg, #2c5282, #38a169);
  position: relative;
  overflow: hidden;
}
.dashboard-header::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url('~@/assets/map-pattern.png');
  opacity: 0.1;
  pointer-events: none;
}

.management-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 15px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.management-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.bg-gradient-mountain { background: linear-gradient(135deg, #2c5282, #4a90e2); }
.bg-gradient-forest   { background: linear-gradient(135deg, #38a169, #48bb78); }
.bg-gradient-sunset   { background: linear-gradient(135deg, #dd6b20, #f6ad55); }
.bg-gradient-info     { background: linear-gradient(135deg, #17a2b8, #20c997); }
.bg-gradient-teal     { background: linear-gradient(135deg, #20c997, #00b8d4); }
.bg-gradient-purple   { background: linear-gradient(135deg, #6f42c1, #e83e8c); }

.stat-card {
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.1);
}
.stat-icon { font-size: 2rem; margin-right: 1rem; }

.stat-number {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.1;
}
.stat-label {
  font-size: 0.9rem;
  line-height: 1.3;
  opacity: 0.9;
}

.btn-light {
  background-color: rgba(255,255,255,0.15);
  border-color: rgba(255,255,255,0.2);
  transition: background 0.2s ease;
}
.btn-light:hover {
  background-color: rgba(255,255,255,0.25);
}

.quick-stats { margin-top: 2rem; }

/* Estilos para centrar el contenido del body de la tarjeta */
.management-card .card-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.management-card .card-body p {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.management-card .card-body .btn {
  width: 80%;
}
</style>