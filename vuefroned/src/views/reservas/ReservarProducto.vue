<template>
  <div class="explore-container">
    <!-- Hero Section -->
    <div class="explore-hero bg-gradient-tourism text-white py-5 mb-5">
      <div class="container text-center">
        <h1 class="mb-3">
          <i class="bi bi-compass me-2"></i>
          Explora y Reserva Productos Turísticos
        </h1>
        <p class="lead mb-0">Descubre experiencias únicas en los mejores destinos</p>
      </div>
    </div>

    <div class="container">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-grow text-primary" style="width: 3rem; height: 3rem;" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-3 text-muted">Buscando las mejores experiencias para ti...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="products.length === 0" class="empty-state text-center py-5">
        <i class="bi bi-binoculars text-muted" style="font-size: 3rem;"></i>
        <h4 class="mt-3">No hay productos disponibles</h4>
        <p class="text-muted">Actualmente no tenemos experiencias disponibles, pero pronto agregaremos nuevas opciones</p>
        <button class="btn btn-primary mt-3" @click="refreshProducts">
          <i class="bi bi-arrow-repeat me-1"></i> Intentar nuevamente
        </button>
      </div>

      <!-- Products Grid -->
      <div v-else class="row g-4">
        <div 
          class="col-md-4" 
          v-for="(product, index) in products" 
          :key="product.id"
          v-animate-on-scroll="{animation: 'fadeInUp', delay: index * 100}"
        >
          <div class="product-card card border-0 shadow-sm h-100">
            <div class="product-image-container">
              <img 
                :src="product.main_image || 'https://via.placeholder.com/300x200?text=Turismo'" 
                class="product-image" 
                :alt="product.name"
              >
              <div class="product-badge">
                <span class="badge bg-primary">{{ product.type || 'General' }}</span>
              </div>
              <div class="product-overlay">
                <button class="btn btn-sm btn-light rounded-pill" @click="quickView(product)">
                  <i class="bi bi-eye-fill me-1"></i> Vista rápida
                </button>
              </div>
            </div>
            <div class="card-body">
              <h5 class="card-title">{{ product.name }}</h5>
              <p class="card-text text-muted">{{ product.description?.slice(0, 100) }}...</p>
              
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="rating">
                  <i class="bi bi-star-fill text-warning"></i>
                  <i class="bi bi-star-fill text-warning"></i>
                  <i class="bi bi-star-fill text-warning"></i>
                  <i class="bi bi-star-fill text-warning"></i>
                  <i class="bi bi-star text-warning"></i>
                  <small class="text-muted ms-1">({{ product.reviews || 0 }})</small>
                </div>
                <div class="price">
                  <span class="text-muted small">Desde</span>
                  <strong class="text-primary h5 ms-2">
                    S/. {{ typeof product.price === 'number' ? product.price.toFixed(2) : '0.00' }}
                  </strong>
                </div>
              </div>

              <div class="d-flex justify-content-between">
                <div class="location">
                  <i class="bi bi-geo-alt text-muted me-1"></i>
                  <small class="text-muted">{{ product.location || 'Ubicación no especificada' }}</small>
                </div>
                <div class="duration">
                  <i class="bi bi-clock text-muted me-1"></i>
                  <small class="text-muted">{{ product.duration || '—' }}</small>
                </div>
              </div>
            </div>
            <div class="card-footer bg-white border-0 pt-0">
              <router-link 
                :to="`/products/${product.id}`" 
                class="btn btn-primary w-100 btn-explore"
              >
                <i class="bi bi-calendar-check me-1"></i> Reservar ahora
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

export default {
  name: 'ReservarProducto',
  data() {
    return {
      products: [],
      loading: true,
      animatedProducts: []
    }
  },
  async mounted() {
    await this.loadProducts();
  },
  methods: {
    async loadProducts() {
      try {
        this.loading = true;
        const res = await api.get('/products');
        // Asegurar que el precio sea número para evitar errores con .toFixed()
        this.products = res.data.map(p => ({
          ...p,
          price: Number(p.price) || 0,
          reviews: Math.floor(Math.random() * 50) // Ejemplo de reviews aleatorias
        }));
        
        // Inicializar animaciones
        this.animatedProducts = this.products.map((_, i) => ({
          id: i,
          animated: false
        }));
      } catch (error) {
        console.error('Error cargando productos:', error);
        this.$toast.error('No se pudieron cargar los productos.', {
          position: 'top-right',
          duration: 3000
        });
      } finally {
        this.loading = false;
      }
    },
    async refreshProducts() {
      await this.loadProducts();
    },
    quickView(product) {
      // Implementar vista rápida modal si es necesario
      this.$router.push(`/products/${product.id}`);
    },
    handleIntersection(entries, observer) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-index'));
          this.animatedProducts[index].animated = true;
          observer.unobserve(entry.target);
        }
      });
    }
  },
  directives: {
    'animate-on-scroll': {
      mounted(el, binding) {
        const options = {
          root: null,
          rootMargin: '0px',
          threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const delay = binding.value.delay || 0;
              setTimeout(() => {
                entry.target.classList.add('v-animate', binding.value.animation);
                observer.unobserve(entry.target);
              }, delay);
            }
          });
        }, options);

        observer.observe(el);
      }
    }
  }
}
</script>

<style scoped>
.explore-container {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.explore-hero {
  background: linear-gradient(135deg, #1e88e5, #0d47a1);
  position: relative;
  overflow: hidden;
}

.explore-hero::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
  background-size: cover;
  background-position: center;
  opacity: 0.15;
}

.product-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
}

.product-image-container {
  position: relative;
  overflow: hidden;
  height: 200px;
}

.product-image {
  transition: transform 0.5s ease;
  width: 100%;
  height: 100%;
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

.product-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  padding: 20px 15px 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  justify-content: center;
}

.product-card:hover .product-overlay {
  opacity: 1;
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

.empty-state {
  background-color: #f8f9fa;
  border-radius: 12px;
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

@media (max-width: 768px) {
  .explore-hero h1 {
    font-size: 1.8rem;
  }
  
  .product-card {
    margin-bottom: 1.5rem;
  }
}
</style>