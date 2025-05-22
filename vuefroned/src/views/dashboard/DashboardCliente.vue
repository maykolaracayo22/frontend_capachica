<template>
  <div class="dashboard-container">
    <!-- Hero Section -->
    <div class="dashboard-hero bg-gradient-tourism text-white py-4 mb-4">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h1 class="mb-1">👋 ¡Bienvenido, <strong>{{ user.name }}</strong>!</h1>
            <p class="mb-0">Aquí puedes gestionar tus actividades turísticas</p>
          </div>
          <div class="text-end">
            <router-link to="/reservar" class="btn btn-light btn-sm">
              <i class="bi bi-compass me-1"></i> Explorar más tours
            </router-link>
          </div>
          <div class="text-end">
        <button @click="logout" class="btn btn-outline-light btn-sm">
          <i class="bi bi-box-arrow-right me-1"></i> Cerrar sesión
        </button>
      </div>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- User Profile Card -->
      <div class="row mb-4">
        <div class="col-lg-8">
          <div class="card shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <img
                  :src="user.profile_image || 'https://via.placeholder.com/100'"
                  alt="Perfil"
                  class="rounded-circle me-4 border border-3 border-primary"
                  style="width: 100px; height: 100px; object-fit: cover;"
                />
                <div class="flex-grow-1">
                  <h4 class="mb-2">Mi Perfil</h4>
                  <div class="row">
                    <div class="col-md-6">
                      <p class="mb-2"><i class="bi bi-envelope me-2 text-primary"></i> <strong>Correo:</strong> {{ user.email }}</p>
                      <p class="mb-2"><i class="bi bi-telephone me-2 text-primary"></i> <strong>Teléfono:</strong> {{ user.phone || 'No registrado' }}</p>
                    </div>
                    <div class="col-md-6">
                      <p class="mb-2"><i class="bi bi-calendar-check me-2 text-primary"></i> <strong>Miembro desde:</strong> {{ formatDate(user.created_at) }}</p>
                      <p class="mb-0"><i class="bi bi-geo-alt me-2 text-primary"></i> <strong>Ubicación:</strong> {{ user.location || 'No especificada' }}</p>
                    </div>
                  </div>
                </div>
                <router-link to="/perfil" class="btn btn-outline-primary align-self-start">
                  <i class="bi bi-pencil-square me-1"></i> Editar
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-4">
        <div class="card bg-primary text-white h-100 shadow mb-4">
          <div class="card-body d-flex flex-column justify-content-center">
            <h5 class="card-title"><i class="bi bi-star-fill me-2"></i> Programa de Fidelidad</h5>
            <div class="progress mb-3" style="height: 20px;">
              <div class="progress-bar bg-warning" role="progressbar"
                   :style="{ width: loyaltyProgress + '%' }"
                   :aria-valuenow="loyaltyProgress"
                   aria-valuemin="0" aria-valuemax="100">
                {{ loyaltyProgress }}%
              </div>
            </div>
            <p class="card-text mb-0">
              ¡Solo te faltan {{ loyaltyRemaining }} reserv{{ loyaltyRemaining === 1 ? 'a' : 'as' }} para alcanzar
              el siguiente nivel!
            </p>
          </div>
        </div>
      </div>
      </div>
      <!-- Stats Cards -->
      <div class="row mb-4 g-4">
        <div class="col-md-4" v-for="card in summaryCards" :key="card.title">
          <div class="card h-100 shadow-sm border-0" :class="`border-top border-4 border-${card.color}`">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                  <div class="icon-container" :class="`bg-${card.color}-light`">
                      <i :class="{ [card.icon]: true, [`text-${card.color}`]: true }" class="fs-4"></i>
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <h6 class="text-muted mb-1">{{ card.title }}</h6>
                  <h3 class="mb-0">{{ card.value }}</h3>
                  <p class="text-muted mb-0" v-if="card.trend">
                    <i :class="`bi bi-arrow-${card.trend}-circle-fill text-${card.trend === 'up' ? 'success' : 'danger'}`"></i>
                    {{ card.trendValue }}% vs último mes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reservations Section -->
      <div class="card shadow-sm mb-4">
        <div class="card-header bg-white border-0 py-3">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="mb-0"><i class="bi bi-calendar-event me-2 text-primary"></i> Tus Reservas Recientes</h5>
            <div>
              <router-link to="/reservations" class="btn btn-sm btn-outline-secondary me-2">
                Ver todas
              </router-link>
              <router-link to="/reservar" class="btn btn-sm btn-primary">
              <i class="bi bi-plus-circle me-1"></i> Nueva reserva
              </router-link>

            </div>
          </div>
        </div>
        <div class="card-body p-0">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>
          <div v-else-if="reservations.length === 0" class="text-center py-5">
            <i class="bi bi-calendar-x text-muted" style="font-size: 3rem;"></i>
            <h5 class="mt-3">No tienes reservas aún</h5>
            <p class="text-muted">Explora nuestros productos turísticos y realiza tu primera reserva</p>
            <router-link to="/products" class="btn btn-primary">
              <i class="bi bi-compass me-1"></i> Explorar productos
            </router-link>
          </div>
          <div v-else class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th>Producto</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in reservations" :key="r.id">
                  <td>
                    <div class="d-flex align-items-center">
                      <img 
      :src="r.product?.main_image || r.custom_package?.products?.[0]?.main_image || 'https://via.placeholder.com/80'" 
      class="rounded me-3" 
      style="width: 60px; height: 40px; object-fit: cover;"
    >

                      <div>
                          <h6 class="mb-0">
        {{ r.product?.name || r.custom_package?.name || 'Producto no disponible' }}
      </h6>
      <small class="text-muted">
        {{ r.product?.entrepreneur?.business_name || r.custom_package?.products?.[0]?.entrepreneur?.business_name || 'Emprendedor no disponible' }}
      </small>

                      </div>
                    </div>
                  </td>
                  <td>
                    <div>{{ formatDate(r.reservation_date) }}</div>
<small class="text-muted">{{ formatTime(r.reservation_date) }}</small>

                  </td>
                  <td>
                    <span :class="statusBadge(r.status)" class="badge">
                      <i :class="statusIcon(r.status)" class="me-1"></i>
                      {{ r.status }}
                    </span>
                  </td>
                  <td>
                    <strong>{{ formatCurrency(r.total_amount) }}</strong>
                  </td>
                  <td>
                    <div class="d-flex gap-2">
                      <router-link :to="`/reservations/${r.id}`" class="btn btn-sm btn-outline-primary">
                        <i class="bi bi-eye"></i>
                      </router-link>
                      <button
                      v-if="r.status === 'pendiente'"
                      class="btn btn-sm btn-outline-danger"
                      @click="deleteReservation(r.id)"
                      >
                      <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- Recommended Products -->
            <!-- Recommended Products -->
      <div class="card shadow-sm">
        <div class="card-header bg-white border-0 py-3">
          <h5 class="mb-0"><i class="bi bi-lightbulb me-2 text-warning"></i> Recomendaciones para ti</h5>
        </div>
        <div class="card-body">
          <div class="row g-4">
            <div 
              class="col-md-4" 
              v-for="(product, index) in recommendedProducts" 
              :key="index"
              v-animate-on-scroll="{animation: 'fadeInUp', delay: index * 100}"
            >
              <div class="card h-100 border-0 shadow-sm product-card">
                <div class="product-image-container">
                  <img 
                    :src="product.image" 
                    class="card-img-top product-image" 
                    :alt="product.name"
                  >
                  <div class="product-badge">
                    <span class="badge bg-info">{{ product.type }}</span>
                  </div>
                </div>
                <div class="card-body">
                  <h5 class="card-title">{{ product.name }}</h5>
                  <p class="card-text text-muted small">{{ product.description }}</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="rating">
                      <i class="bi bi-star-fill text-warning"></i>
                      <i class="bi bi-star-fill text-warning"></i>
                      <i class="bi bi-star-fill text-warning"></i>
                      <i class="bi bi-star-fill text-warning"></i>
                      <i class="bi bi-star-half text-warning"></i>
                      <small class="text-muted ms-1">(24)</small>
                    </div>
                    <strong class="text-primary">{{ product.price }}</strong>
                  </div>
                </div>
                <div class="card-footer bg-white border-0 pt-0">
                  <router-link 
                    :to="`/products/${product.id}`" 
                    class="btn btn-sm btn-primary w-100 btn-explore"
                  >
                    <i class="bi bi-compass me-1"></i> Explorar
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Custom Packages Section -->
<div class="card shadow-sm mb-4">
  <div class="card-header bg-white border-0 py-3">
    <div class="d-flex justify-content-between align-items-center">
      <h5 class="mb-0">
        <i class="bi bi-box2-heart me-2 text-success"></i> Tus Paquetes Personalizados
      </h5>
      <router-link to="/mis-paquetes" class="btn btn-sm btn-outline-primary">
        Ver todos
      </router-link>
    </div>
  </div>
  <div class="card-body">
    <div v-if="loadingPackages" class="text-center">
      <div class="spinner-border text-success"></div>
    </div>
    <div v-else-if="customPackages.length === 0" class="text-center py-3 text-muted">
      No tienes paquetes personalizados aún.
      <br />
      <router-link to="/mis-paquetes/crear" class="btn btn-sm btn-primary mt-2">
        Crear uno ahora
      </router-link>
    </div>
    <ul class="list-group" v-else>
      <li 
        v-for="pkg in customPackages.slice(0, 3)" 
        :key="pkg.id" 
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div>
          <strong>{{ pkg.name || 'Sin título' }}</strong>
          <br />
          <small class="text-muted">Estado: {{ pkg.status }}</small>
        </div>
        <span class="badge bg-success">{{ formatCurrency(pkg.total_amount) }}</span>

      </li>
    </ul>
  </div>
</div>

    </div>
  </div>
</template>

<script>
import api from '@/services/axios'

export default {
name: 'DashboardCliente',
data() {
  return {
    user: {
      name: '',
      email: '',
      phone: '',
      profile_image: '',
      created_at: '',
      location: ''
    },
    reservations: [],
    recommendedProducts: [],
    customPackages: [],
loadingPackages: true,
    loading: true
  }
},

computed: {
  summaryCards() {
    const total = this.reservations.length
    const pending = this.reservations.filter(r => r.status === 'pendiente').length
    const completed = this.reservations.filter(r => r.status === 'confirmada').length


    return [
      {
        title: 'Reservas Totales',
        value: total,
        icon: 'bi bi-list-check',
        color: 'primary',
        trend: 'up',
        trendValue: 15
      },
      {
        title: 'Pendientes',
        value: pending,
        icon: 'bi bi-hourglass-split',
        color: 'warning',
        trend: pending > 0 ? 'down' : 'up',
        trendValue: pending > 0 ? 10 : 0
      },
      {
        title: 'Completadas',
        value: completed,
        icon: 'bi bi-check-circle',
        color: 'success',
        trend: 'up',
        trendValue: 25
      }
    ]
  },
  loyaltyProgress() {
    const totalNeeded = 5
    const count = this.reservations.length
    return Math.min(Math.floor((count / totalNeeded) * 100), 100)
  },
  loyaltyRemaining() {
    const totalNeeded = 5
    return Math.max(totalNeeded - this.reservations.length, 0)
  }

},

methods: {
  async fetchUserAndReservations() {
  try {
    const resUser = await api.get('/me')
    this.user = resUser.data

    const resReservations = await api.get('/my-reservations') // ✅ solo reservas del usuario autenticado
    this.reservations = resReservations.data

    const resProducts = await api.get('/products')
    this.recommendedProducts = resProducts.data
  } catch (err) {
    console.error('Error cargando datos:', err)
    this.$router.push('/login')
  } finally {
    this.loading = false
  }
  const resPackages = await api.get('/custom-packages') // endpoint del cliente autenticado
this.customPackages = resPackages.data
this.loadingPackages = false

  
},


async deleteReservation(reservationId) {
if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) return;

try {
  // Asegúrate de que el token CSRF esté presente
  await api.get('/sanctum/csrf-cookie')

  await api.delete(`/reservations/${reservationId}`)
  this.reservations = this.reservations.filter(r => r.id !== reservationId)
  alert('Reserva cancelada correctamente.')
} catch (error) {
  console.error('Error al cancelar la reserva:', error)
  alert('No se pudo cancelar la reserva. Intenta de nuevo más tarde.')
}
},


  formatDate(dateStr) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateStr).toLocaleDateString('es-ES', options)
  },

  formatTime(dateStr) {
    const options = { hour: '2-digit', minute: '2-digit' }
    return new Date(dateStr).toLocaleTimeString('es-ES', options)
  },

  formatCurrency(value) {
    const num = Number(value)
    return isNaN(num) ? 'S/. 0.00' : `S/. ${num.toFixed(2)}`
  },

  statusBadge(status) {
    switch (status) {
      case 'pendiente': return 'bg-warning text-dark'
      case 'confirmada': return 'bg-info text-dark'
      case 'completada': return 'bg-success text-white'
      case 'cancelada': return 'bg-danger text-white'
      default: return 'bg-secondary text-white'
    }
  },

  statusIcon(status) {
    switch (status) {
      case 'pendiente': return 'bi-hourglass-split'
      case 'confirmada': return 'bi-check-circle'
      case 'completada': return 'bi-check-circle-fill'
      case 'cancelada': return 'bi-x-circle-fill'
      default: return 'bi-question-circle'
    }
  },

  async logout() {
    try {
      await api.post('/logout', {}, { withCredentials: true })
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_roles')
      localStorage.removeItem('entrepreneur_id')
      delete api.defaults.headers.common['Authorization']
      this.$router.push('/login')
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    }
  }
},

mounted() {
  this.fetchUserAndReservations()
}
}

</script>

<style scoped>
.dashboard-container {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.dashboard-hero {
  background: linear-gradient(135deg, #1e88e5, #0d47a1);
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.bg-gradient-tourism {
  background: linear-gradient(135deg, #1e88e5, #0d47a1);
}

.icon-container {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-primary-light {
  background-color: rgba(13, 110, 253, 0.1);
}

.bg-warning-light {
  background-color: rgba(255, 193, 7, 0.1);
}

.bg-success-light {
  background-color: rgba(25, 135, 84, 0.1);
}

.table th {
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
  color: #6c757d;
}

.card {
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1) !important;
}

.badge {
  padding: 0.5em 0.8em;
  font-weight: 500;
  letter-spacing: 0.5px;
  font-size: 0.75rem;
}

.btn-outline-primary {
  border-width: 2px;
}

.progress {
  border-radius: 10px;
  height: 10px !important;
}

.progress-bar {
  border-radius: 10px;
}

@media (max-width: 768px) {
  .dashboard-hero h1 {
    font-size: 1.5rem;
  }
  
  .icon-container {
    width: 40px;
    height: 40px;
  }
}
/* Estilos para la sección de recomendaciones */
.product-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}

.product-image-container {
  position: relative;
  overflow: hidden;
  height: 180px;
}

.product-image {
  transition: transform 0.5s ease;
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
}

.product-badge .badge {
  font-size: 0.7rem;
  padding: 0.35em 0.65em;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.btn-explore {
  transition: all 0.3s ease;
  border-radius: 8px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.btn-explore:hover {
  background-color: #0b5ed7;
  transform: translateY(-2px);
}

.rating {
  font-size: 0.9rem;
}

/* Animaciones */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.v-animate {
  animation-duration: 0.6s;
  animation-fill-mode: both;
}

.fadeInUp {
  animation-name: fadeInUp;
}


</style>