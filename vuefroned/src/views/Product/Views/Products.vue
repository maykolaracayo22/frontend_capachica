<template>
  <section class="products-section" data-aos="fade-up" data-aos-duration="1000">
    <div class="container">
      <!-- Título animado -->
      <h2 class="section-title mb-5" data-aos="fade-down" data-aos-delay="100">
        <span class="title-wrapper">
          <span 
            v-for="(letter, index) in titleLetters" 
            :key="index"
            class="letter"
            :class="{'space': letter === ' '}"
            :data-aos="letter === ' ' ? '' : 'fade-up'"
            :data-aos-delay="100 + (index * 50)"
            :data-aos-duration="600"
            :data-aos-easing="easingFunctions[index % easingFunctions.length]"
          >
            {{ letter }}
          </span>
        </span>
        <span 
          class="title-underline" 
          data-aos="fade-left" 
          data-aos-delay="800"
          data-aos-duration="1000"
          data-aos-easing="ease-out-back"
        ></span>
      </h2>

      <!-- Loading State Moderno -->
      <div v-if="loading" class="loading-products">
        <div class="modern-loader">
          <div class="dot-pulse"></div>
        </div>
      </div>

      <!-- Lista de productos -->
      <div v-else class="row g-4">
        <div
          v-for="(product, index) in products"
          :key="product.id"
          class="col-md-4"
          :data-aos="getCardAnimation(index)"
          :data-aos-delay="getCardDelay(index)"
          data-aos-once="false"
          data-aos-anchor-placement="top-bottom"
        >
          <div 
            class="product-card h-100"
            @click="goToProductDetail(product.id)"
          >
            <div class="product-image-container" data-aos="zoom-in" :data-aos-delay="getCardDelay(index) + 200">
              <img 
                :src="product.main_image || placeholderImage" 
                class="product-image" 
                :alt="product.name" 
                loading="lazy"
                @load="handleImageLoad"
              />
              <div class="price-badge" data-aos="zoom-in" :data-aos-delay="getCardDelay(index) + 250">
                S/ {{ product.price }}
              </div>
              <div class="product-overlay"></div>
              <div class="product-tags">
                <span v-if="product.is_featured" class="tag featured">Destacado</span>
                <span v-if="product.stock < 5" class="tag low-stock">Últimas unidades</span>
              </div>
            </div>
            <div class="product-content">
              <h3 
                class="product-name" 
                data-aos="fade-up" 
                :data-aos-delay="getCardDelay(index) + 300"
              >
                {{ product.name }}
              </h3>
              <p 
                class="product-description" 
                data-aos="fade-up" 
                :data-aos-delay="getCardDelay(index) + 350"
              >
                {{ product.short_description || truncateDescription(product.description) }}
              </p>
              
              <div class="product-meta">
                <div v-if="product.place" class="location" data-aos="fade-up" :data-aos-delay="getCardDelay(index) + 400">
                  <i class="bi bi-geo-alt-fill"></i> {{ product.place.name }}
                </div>
                <div class="stock" data-aos="fade-up" :data-aos-delay="getCardDelay(index) + 450">
                  <i class="bi bi-box-seam"></i> {{ product.stock }} disponibles
                </div>
              </div>

              <div class="product-actions" data-aos="fade-up" :data-aos-delay="getCardDelay(index) + 500">
                <div class="quantity-selector">
                  <button 
                    class="quantity-btn"
                    @click.stop="decreaseQuantity(product)"
                    :disabled="product.quantity <= 1"
                  >
                    <i class="bi bi-dash"></i>
                  </button>
                  <input 
                    type="number" 
                    v-model.number="product.quantity" 
                    min="1" 
                    :max="product.stock"
                    class="quantity-input"
                    @click.stop
                  />
                  <button 
                    class="quantity-btn"
                    @click.stop="increaseQuantity(product)"
                    :disabled="product.quantity >= product.stock"
                  >
                    <i class="bi bi-plus"></i>
                  </button>
                </div>
                <button
                  class="reserve-btn"
                  @click.stop="reserveProduct(product)"
                >
                  <span>Reservar</span>
                  <i class="bi bi-cart-plus"></i>
                </button>
              </div>
            </div>
            <div class="shine"></div>
          </div>
        </div>
      </div>

      <!-- Estado vacío mejorado -->
      <div 
        v-if="products.length === 0 && !loading" 
        class="no-products text-center py-5"
        data-aos="zoom-in"
      >
        <div class="empty-state-icon">
          <i class="bi bi-box-seam"></i>
        </div>
        <h3 class="mt-4">Próximamente más productos</h3>
        <p class="text-muted">Estamos preparando artículos increíbles para ti</p>
        <router-link 
          to="/contact" 
          class="btn btn-outline-primary mt-3"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          ¿Buscas algo específico? Contáctanos
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/axios'
import AOS from 'aos'
import 'aos/dist/aos.css'

const router = useRouter()
const products = ref([])
const loading = ref(true)
const placeholderImage = 'https://via.placeholder.com/400x300?text=Producto+No+Disponible'

// Configuración de animaciones
const titleLetters = 'Productos Disponibles'.split('')
const easingFunctions = [
  'ease-out-sine',
  'ease-out-quad',
  'ease-out-cubic',
  'ease-out-quart',
  'ease-out-back'
]

// Inicializar productos con cantidad por defecto
const initializeProducts = (productsData) => {
  return productsData.map(product => ({
    ...product,
    quantity: 1
  }))
}

// Animaciones dinámicas para las cards
const getCardAnimation = (index) => {
  const animations = ['fade-up', 'fade-right', 'fade-left']
  return animations[index % animations.length]
}

// Retrasos escalonados para animaciones
const getCardDelay = (index) => {
  return (index % 3) * 100 + 200
}

const handleImageLoad = () => {
  AOS.refresh() // Recalcula animaciones cuando cargan imágenes
}

const truncateDescription = (description) => {
  if (!description) return 'Descripción no disponible'
  return description.length > 100 
    ? `${description.substring(0, 100)}...` 
    : description
}

const goToProductDetail = (productId) => {
  router.push(`/products/${productId}`)
}

const increaseQuantity = (product) => {
  if (product.quantity < product.stock) {
    product.quantity++
  }
}

const decreaseQuantity = (product) => {
  if (product.quantity > 1) {
    product.quantity--
  }
}

const reserveProduct = async (product) => {
  const token = localStorage.getItem('auth_token')
  if (!token) {
    alert('Debes iniciar sesión para realizar reservas')
    return router.push('/login')
  }

  if (product.quantity > product.stock) {
    alert(`No hay suficiente stock. Solo quedan ${product.stock} unidades.`)
    product.quantity = product.stock
    return
  }

  try {
    loading.value = true
    const response = await api.post('/reservations', {
      product_id: product.id,
      quantity: product.quantity,
      reservation_date: new Date().toISOString().slice(0, 19).replace('T', ' ')

    })

    // Mostrar notificación bonita en lugar de alert
    showNotification('success', 'Reserva exitosa', 'Tu reserva se ha realizado correctamente')
    
    // Redirigir al proceso de pago
    router.push(`/pago/${response.data.id}`)
    
    // Resetear cantidad
    product.quantity = 1
  } catch (error) {
    console.error("Error reservando producto:", error)
    showNotification('error', 'Error en reserva', error.response?.data?.message || 'Ocurrió un error al realizar la reserva')
  } finally {
    loading.value = false
  }
}

const showNotification = (type, title, message) => {
  // Aquí podrías integrar con tu sistema de notificaciones
  // Por ahora usamos alert como fallback
  alert(`${title}: ${message}`)
}

const fetchProducts = async () => {
  try {
    const { data } = await api.get('/products?limit=6&sort=-createdAt')
    products.value = initializeProducts(data)
  } catch (error) {
    console.error("Error fetching products:", error)
    showNotification('error', 'Error', 'No se pudieron cargar los productos')
    products.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProducts()
  AOS.init({
    duration: 800,
    easing: 'ease-out-quart',
    once: false,
    mirror: true,
    offset: 120,
    anchorPlacement: 'top-bottom',
    disable: window.innerWidth < 768
  })
})
</script>

<style scoped>
.products-section {
  padding: 6rem 0;
  position: relative;
  overflow: hidden;
  width: 100%;
  background-color : rgba(234, 228, 228, 0.445); /* reemplaza con tu URL */

}

.container {
  position: relative;
  z-index: 1;
}

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 3rem;
  position: relative;
  line-height: 1.2;
  text-align: center;
}

.title-underline {
  position: absolute;
  bottom: -0.8rem;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 120px;
  height: 4px;
  background: linear-gradient(90deg, #3a41a8, #6366f1);
  border-radius: 2px;
  transform-origin: center;
  transition: transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.aos-animate .title-underline {
  transform: translateX(-50%) scaleX(1);
}

.title-wrapper {
  display: inline-block;
}

.letter {
  display: inline-block;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  transform-origin: center bottom;
  opacity: 0;
  will-change: transform, opacity;
}

.letter.space {
  width: 0.5em;
}

.aos-animate .letter {
  opacity: 1;
  transform: translateY(0);
  color: inherit;
}

/* Loading State Moderno */
.loading-products {
  min-height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modern-loader {
  display: flex;
  justify-content: center;
  align-items: center;
}

.dot-pulse {
  position: relative;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #6366f1;
  color: #6366f1;
  animation: dot-pulse 1.5s infinite linear;
  animation-delay: 0.25s;
}

.dot-pulse::before, .dot-pulse::after {
  content: '';
  display: inline-block;
  position: absolute;
  top: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #6366f1;
  color: #6366f1;
}

.dot-pulse::before {
  left: -20px;
  animation: dot-pulse 1.5s infinite linear;
  animation-delay: 0s;
}

.dot-pulse::after {
  left: 20px;
  animation: dot-pulse 1.5s infinite linear;
  animation-delay: 0.5s;
}

@keyframes dot-pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
}

/* Product Card Styles */
.product-card {
  position: relative;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  flex-direction: column;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  opacity: 0;
  will-change: transform, opacity, box-shadow;
  cursor: pointer;
}

.aos-animate .product-card {
  opacity: 1;
}

.product-card:hover {
  transform: perspective(1000px) rotateX(2deg) rotateY(-2deg) translateY(-10px) scale(1.02);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

/* Efecto shine mejorado */
.shine {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.8) 50%,
    rgba(255,255,255,0) 100%
  );
  transform: translateX(-100%) skewX(-20deg);
  transition: transform 0.8s ease;
  pointer-events: none;
  z-index: 1;
}

.product-card:hover .shine {
  transform: translateX(200%) skewX(-20deg);
}

.product-image-container {
  position: relative;
  height: 250px;
  overflow: hidden;
  border-radius: 16px 16px 0 0;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
  will-change: transform;
}

.product-card:hover .product-image {
  transform: scale(1.1);
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%);
  transition: opacity 0.5s ease;
}

.product-card:hover .product-overlay {
  opacity: 0.8;
}

.price-badge {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: rgba(252, 163, 17, 0.95);
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 700;
  font-family: 'Montserrat', sans-serif;
  box-shadow: 0 4px 15px rgba(252, 163, 17, 0.3);
  z-index: 2;
  transition: all 0.4s ease;
}

.product-card:hover .price-badge {
  transform: scale(1.1);
  background: #e85b04;
}

.product-tags {
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 2;
}

.tag {
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
}

.tag.featured {
  background: rgba(220, 38, 38, 0.9);
}

.tag.low-stock {
  background: rgba(5, 150, 105, 0.9);
}

.product-content {
  padding: 1.75rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background: white;
  position: relative;
  z-index: 2;
  border-radius: 0 0 16px 16px;
}

.product-name {
  font-family: 'Playfair Display', serif;
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
  transition: color 0.3s ease;
}

.product-card:hover .product-name {
  color: #6366f1;
}

.product-description {
  font-family: 'Montserrat', sans-serif;
  color: #4a5568;
  line-height: 1.7;
  flex-grow: 1;
  margin-bottom: 1.5rem;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: #64748b;
}

.product-meta i {
  margin-right: 0.25rem;
}

.product-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.quantity-selector {
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 50px;
  overflow: hidden;
}

.quantity-btn {
  width: 36px;
  height: 36px;
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
  width: 40px;
  text-align: center;
  border: none;
  border-left: 1px solid #e2e8f0;
  border-right: 1px solid #e2e8f0;
  padding: 0.375rem;
}

.quantity-input::-webkit-outer-spin-button,
.quantity-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.reserve-btn {
  flex-grow: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  color: white;
  background: linear-gradient(90deg, #3a41a8, #6366f1);
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 15px rgba(58, 65, 168, 0.3);
  overflow: hidden;
  position: relative;
  border: none;
  cursor: pointer;
}

.reserve-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: all 0.6s ease;
}

.reserve-btn:hover {
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  transform: translateX(8px) scale(1.05);
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.5);
}

.reserve-btn:hover::before {
  left: 100%;
}

.reserve-btn i {
  margin-left: 0.5rem;
  transition: all 0.4s ease;
}

.reserve-btn:hover i {
  transform: translateX(5px) rotate(10deg);
}

/* Empty State */
.no-products {
  padding: 3rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
}

.empty-state-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  border-radius: 50%;
}

.empty-state-icon i {
  font-size: 2.5rem;
  color: #64748b;
}

/* Responsive */
@media (max-width: 1199.98px) {
  .section-title {
    font-size: 2.2rem;
  }
  
  .product-image-container {
    height: 220px;
  }
}

@media (max-width: 991.98px) {
  .section-title {
    font-size: 2rem;
    margin-bottom: 2.5rem;
  }
  
  .products-section {
    padding: 4rem 0;
  }
}

@media (max-width: 767.98px) {
  .section-title {
    font-size: 1.8rem;
  }
  
  .letter {
    display: inline;
  }
  
  .product-content {
    padding: 1.5rem;
  }
  
  .product-name {
    font-size: 1.3rem;
  }

  .product-actions {
    flex-direction: column;
    gap: 1rem;
  }

  .quantity-selector {
    width: 100%;
  }

  .reserve-btn {
    width: 100%;
  }
}

@media (max-width: 575.98px) {
  .section-title {
    font-size: 1.6rem;
    padding-bottom: 1rem;
  }
  
  .title-underline {
    height: 3px;
    width: 80px;
  }
  
  .products-section {
    padding: 3rem 0;
  }
}
</style>