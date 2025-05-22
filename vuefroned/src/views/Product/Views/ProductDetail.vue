<template>
  <div class="product-detail-container">
    <!-- Loading State (manteniendo tu spinner original) -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <!-- Contenido principal (solo mejoras visuales) -->
    <div v-else class="product-detail-content">
      <div v-if="product" class="product-card">
        <!-- Galería de imágenes mejorada -->
        <div class="product-gallery">
          <img 
            :src="product.main_image || 'https://via.placeholder.com/800'" 
            :alt="product.name" 
            class="main-image"
          />
        </div>

        <!-- Información del producto (mismo contenido, mejor diseño) -->
        <div class="product-info">
          <h1 class="product-title">{{ product.name }}</h1>
          
          <div class="price-section">
            <span class="price">S/ {{ product.price }}</span>
            <span class="stock" :class="{ 'low-stock': product.stock <= 5 }">
              <i class="bi bi-box-seam"></i> {{ product.stock }} disponibles
            </span>
          </div>

          <div class="product-description">
            <h3>Descripción</h3>
            <p>{{ product.description || 'No hay descripción disponible' }}</p>
          </div>

          <!-- Información del lugar (mismo contenido) -->
          <div v-if="product.place" class="place-info">
            <h3>
              <i class="bi bi-geo-alt-fill"></i> Ubicación
            </h3>
            <p><strong>{{ product.place.name }}</strong></p>
            <p>{{ product.place.address || 'Dirección no disponible' }}</p>
            <router-link 
              :to="`/places/${product.place.id}`" 
              class="view-place-link"
            >
              Ver detalles del lugar
            </router-link>
          </div>

          <!-- Información del emprendedor (mismo contenido) -->
          <div v-if="product.entrepreneur" class="entrepreneur-info">
            <h3>
              <i class="bi bi-person-badge"></i> Emprendedor
            </h3>
            <p><strong>{{ product.entrepreneur.user?.name || 'Nombre no disponible' }}</strong></p>
            <p v-if="product.entrepreneur.user?.email">
              <i class="bi bi-envelope-fill"></i> {{ product.entrepreneur.user.email }}
            </p>
            <p v-if="product.entrepreneur.phone">
              <i class="bi bi-telephone-fill"></i> {{ product.entrepreneur.phone }}
            </p>
          </div>

          <!-- Reserva (misma funcionalidad) -->
          <div class="reserve-section">
            <div v-if="!isAuthenticated" class="auth-message">
              <i class="bi bi-info-circle"></i>
              <span>Debes <router-link to="/login">iniciar sesión</router-link> para reservar</span>
            </div>

            <div class="reserve-actions">
              <div class="quantity-selector">
                <button 
                  class="quantity-btn"
                  @click="decreaseQuantity"
                  :disabled="quantity <= 1"
                >
                  <i class="bi bi-dash"></i>
                </button>
                <input 
                  type="number" 
                  v-model.number="quantity" 
                  min="1" 
                  class="quantity-input"
                />
                <button 
                  class="quantity-btn"
                  @click="increaseQuantity"
                  :disabled="quantity >= product.stock"
                >
                  <i class="bi bi-plus"></i>
                </button>
              </div>

              <button 
                class="reserve-btn"
                @click="goToPayment"
                :disabled="product.stock <= 0 || !isAuthenticated"
              >
                <i class="bi bi-cart-plus"></i> Reservar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Mantenemos exactamente el mismo script original sin cambios
import api from '@/services/axios'

export default {
  data() {
    return {
      product: null,
      loading: true,
      isAuthenticated: false,
      quantity: 1
    }
  },
  mounted() {
    this.fetchProductDetail()
    this.checkAuthentication()
  },
  methods: {
    async fetchProductDetail() {
      try {
        const productId = this.$route.params.id
        const res = await api.get(`/products/${productId}`)
        this.product = res.data

        if (!this.product.entrepreneur && this.product.entrepreneur_id) {
          const entrepreneurRes = await api.get(`/entrepreneurs/${this.product.entrepreneur_id}`)
          this.product.entrepreneur = entrepreneurRes.data
        }

      } catch (err) {
        console.error('Error al cargar producto:', err)
        alert('No se pudo cargar el producto.')
      } finally {
        this.loading = false
      }
    },
    checkAuthentication() {
      this.isAuthenticated = !!localStorage.getItem('auth_token')
    },
    increaseQuantity() {
      if (this.quantity < this.product.stock) {
        this.quantity++
      }
    },
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--
      }
    },
    async goToPayment() {
      if (!this.isAuthenticated) {
        alert('Debes estar registrado para reservar.')
        return this.$router.push('/register')
      }

      try {
        const res = await api.post('/reservations', {
          product_id: this.product.id,
          quantity: this.quantity,
          reservation_date: new Date().toISOString().slice(0, 19).replace('T', ' ')

        })

        this.$router.push(`/pago/${res.data.id}`)
      } catch (err) {
        console.error('Error al crear reserva:', err)
        alert('No se pudo crear la reserva. Intenta nuevamente.')
      }
    }
  }
}
</script>

<style scoped>
/* Estilos mejorados manteniendo la estructura original */
.product-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.product-card {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

@media (min-width: 992px) {
  .product-card {
    grid-template-columns: 1fr 1fr;
  }
}

.product-gallery {
  position: relative;
}

.main-image {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 12px 12px 0 0;
}

@media (min-width: 992px) {
  .main-image {
    border-radius: 12px 0 0 12px;
  }
}

.product-info {
  padding: 1.5rem;
}

.product-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.price {
  font-size: 1.8rem;
  font-weight: 700;
  color: #3a41a8;
}

.stock {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: #64748b;
}

.stock.low-stock {
  color: #dc2626;
}

.product-description,
.place-info,
.entrepreneur-info {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.product-description h3,
.place-info h3,
.entrepreneur-info h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.product-description p {
  color: #475569;
  line-height: 1.7;
}

.view-place-link {
  display: inline-block;
  margin-top: 0.5rem;
  color: #3a41a8;
  font-weight: 500;
  text-decoration: none;
}

.view-place-link:hover {
  text-decoration: underline;
}

.entrepreneur-info p {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #475569;
}

.auth-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  color: #475569;
}

.auth-message a {
  color: #3a41a8;
  font-weight: 500;
  text-decoration: none;
}

.auth-message a:hover {
  text-decoration: underline;
}

.reserve-actions {
  display: flex;
  gap: 1rem;
}

.quantity-selector {
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.quantity-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quantity-btn:hover {
  background: #e2e8f0;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-input {
  width: 50px;
  text-align: center;
  border: none;
  border-left: 1px solid #e2e8f0;
  border-right: 1px solid #e2e8f0;
  padding: 0.375rem;
  -moz-appearance: textfield;
}

.quantity-input::-webkit-outer-spin-button,
.quantity-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.reserve-btn {
  flex: 1;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0 1.5rem;
  color: white;
  background: linear-gradient(90deg, #3a41a8, #6366f1);
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reserve-btn:hover {
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  transform: translateY(-2px);
}

.reserve-btn:disabled {
  background: #cbd5e1;
  transform: none;
  cursor: not-allowed;
}

/* Spinner original */
.spinner-border {
  width: 3rem;
  height: 3rem;
  border-width: 0.4rem;
  color: #3a41a8;
}
</style>