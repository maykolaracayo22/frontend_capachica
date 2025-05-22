<template>
  <section class="py-5 fade-in">
    <div class="container" v-if="about">
      <div class="row align-items-start">
        <!-- Columna izquierda (Texto) -->
        <div class="col-md-6 mb-4 mb-md-0">
          <h2 class="story-title mb-4">{{ about.title }}</h2>
          
          <div class="story-content" :class="{ 'text-collapse': !showFullContent }" v-html="about.content"></div>
          
          <button 
            @click="showFullContent = !showFullContent" 
            class="btn-more mt-3"
            :class="{ 'active': showFullContent }"
          >
            <span class="btn-text">{{ showFullContent ? 'Ver menos' : 'Ver más' }}</span>
            <span class="btn-icon">
              <i :class="showFullContent ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
            </span>
          </button>
        </div>

        <!-- Columna derecha (Imagen) -->
        <div class="col-md-6">
          <img v-if="imageUrl" :src="imageUrl" alt="Historia de Capachica" class="story-image" />
        </div>
      </div>
    </div>

    <!-- Cargando -->
    <div v-else class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Cargando...</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/services/axios'

const about = ref(null)
const showFullContent = ref(false)

const imageUrl = computed(() => {
  if (!about.value?.image) return ''
  if (/^https?:\/\//.test(about.value.image)) return about.value.image
  const base = import.meta.env.VITE_API_URL || 'http://localhost:8000'
  return `${base}/storage/${about.value.image}`
})

async function fetchAbout() {
  try {
    const { data } = await api.get('/abouts/active')
    about.value = data
  } catch (e) {
    console.error('Error al cargar sección activa de About:', e)
  }
}

onMounted(fetchAbout)
</script>

<style scoped>
/* Animación de entrada */
.fade-in {
  opacity: 0;
  animation: fadeIn 0.6s ease-out forwards;
}
@keyframes fadeIn {
  to { opacity: 1; }
}

/* Tipografía especial para la historia */
.story-title {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-weight: 700;
  font-size: 2rem;
  color: #2c3e50;
  letter-spacing: 0.5px;
}

.story-content {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: 1.1rem;
  line-height: 1.8;
  color: #4a5568;
  text-align: justify;
}

/* Botón mejorado */
.btn-more {
  display: inline-flex;
  align-items: center;
  background-color: transparent;
  border: none;
  color: #3182ce;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-more:hover {
  color: #2c5282;
  background-color: rgba(49, 130, 206, 0.1);
}

.btn-more.active {
  color: #2c5282;
}

.btn-text {
  margin-right: 0.5rem;
}

.btn-icon {
  display: inline-flex;
  transition: transform 0.3s ease;
}

.btn-more.active .btn-icon {
  transform: rotate(180deg);
}

/* Colapso de texto */
.text-collapse {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Estilo de imagen */
.story-image {
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: cover;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.story-image:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

/* Responsive */
@media (max-width: 767.98px) {
  .story-title {
    font-size: 1.75rem;
  }
  
  .story-content {
    font-size: 1rem;
  }
  
  .story-image {
    max-height: 350px;
    margin-top: 1.5rem;
  }
}
</style>