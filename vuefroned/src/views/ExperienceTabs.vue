<template>
  <section class="experiences-section">
    <div class="container">
      <!-- Encabezado modernizado -->
      <div class="section-header">
        <h2 class="section-title">
          <span class="title-line" 
                data-aos="fade-up" 
                data-aos-delay="50"
                data-aos-easing="ease-out-cubic">
            Cada experiencia tiene
          </span>
          <span class="highlight-wrapper" 
                data-aos="fade-up" 
                data-aos-delay="150"
                data-aos-easing="ease-out-back">
            <span class="highlight">¡Encuéntrala!</span>
          </span>
        </h2>
        <p class="section-subtitle" 
           data-aos="fade-up" 
           data-aos-delay="250"
           data-aos-easing="ease-out-cubic">
          Descubre las maravillas que tenemos para ti
        </p>
      </div>

      <!-- Filtro moderno -->
      <div class="category-filter-wrapper">
        <div class="category-filter" 
             data-aos="fade-up" 
             data-aos-delay="350"
             data-aos-easing="ease-out-cubic">
          <div class="scroll-container">
            <button
              v-for="(cat, index) in categories"
              :key="cat"
              class="category-btn"
              :class="{ active: active === cat }"
              @click="active = cat"
              data-aos="fade-up"
              :data-aos-delay="350 + (index * 50)"
              :data-aos-easing="ease-out-back"
            >
              <i :class="icons[cat]"></i>
              <span>{{ capitalize(cat) }}</span>
              <div class="active-indicator"></div>
            </button>
          </div>
        </div>
      </div>

      <!-- Grid optimizado -->
      <div class="experiences-grid">
        <div
          class="experience-item"
          v-for="(exp, index) in filteredExperiences"
          :key="exp.id"
          data-aos="fade-up"
          :data-aos-delay="450 + (index * 50)"
          data-aos-easing="ease-out-cubic"
        >
          <div class="experience-card">
            <div class="card-image-wrapper">
              <img
                v-if="exp.image_url"
                :src="exp.image_url"
                class="card-image"
                :alt="exp.title"
                loading="lazy"
                width="400"
                height="250"
              />
              <div class="category-badge">{{ capitalize(exp.category) }}</div>
              <div class="image-overlay"></div>
            </div>
            <div class="card-content">
              <div class="card-icon">
                <i :class="exp.icon"></i>
              </div>
              <h3 class="card-title">{{ exp.title }}</h3>
              <div class="card-text" v-html="exp.content"></div>
              <button class="discover-btn">
                <span>Ver experiencia</span>
                <i class="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado vacío mejorado -->
      <div 
        v-if="filteredExperiences.length === 0" 
        class="no-results"
        data-aos="fade-up"
        data-aos-delay="350"
      >
        <div class="no-results-content">
          <i class="bi bi-compass"></i>
          <h3>Explora más allá</h3>
          <p>No encontramos experiencias en esta categoría</p>
          <button class="reset-filter" @click="active = 'histórico'">
            Mostrar todas
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/axios'

const experiences = ref([])
const active = ref('histórico')

// Íconos modernizados
const icons = {
  'histórico': 'bi bi-building',
  'aventura': 'bi bi-compass',
  'naturaleza': 'bi bi-tree',
  'gastronomía': 'bi bi-egg-fried',
  'vivencial': 'bi bi-people',
  'entretenimiento': 'bi bi-joystick',
  'exclusivo': 'bi bi-stars'
}

const categories = Object.keys(icons)
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

// Filtro computado optimizado
const filteredExperiences = computed(() => 
  experiences.value.filter((e) => e.category === active.value)
)

onMounted(async () => {
  try {
    const { data } = await api.get('/experiences')
    experiences.value = data
    
    // Precarga de imágenes para mejores animaciones
    if (typeof window !== 'undefined') {
      const images = experiences.value.map(exp => {
        const img = new Image()
        img.src = exp.image_url
        return img
      })
    }
  } catch (e) {
    console.error('Error al cargar experiencias:', e)
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&display=swap');

.experiences-section {
  padding: 5rem 0;
  background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
  position: relative;
}

.container {
  position: relative;
  z-index: 1;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Encabezado moderno */
.section-header {
  margin-bottom: 3.5rem;
  text-align: center;
}

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.2rem;
  line-height: 1.2;
}

.title-line {
  display: block;
  margin-bottom: 0.4rem;
}

.highlight-wrapper {
  display: inline-block;
  position: relative;
}

.highlight {
  color: #3b82f6;
  position: relative;
  z-index: 1;
  font-weight: 800;
}

.highlight-wrapper::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30%;
  background-color: rgba(59, 130, 246, 0.15);
  z-index: 0;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.aos-animate .highlight-wrapper::after {
  transform: scaleX(1);
}

.section-subtitle {
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #64748b;
  font-size: clamp(0.95rem, 1.8vw, 1.1rem);
  max-width: 580px;
  margin: 0 auto;
  font-weight: 500;
  line-height: 1.6;
}

/* Filtro modernizado */
.category-filter-wrapper {
  margin-bottom: 2.5rem;
  position: relative;
}

.category-filter {
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 0.5rem;
}

.category-filter::-webkit-scrollbar {
  display: none;
}

.scroll-container {
  display: flex;
  gap: 0.75rem;
  padding: 0.25rem;
}

.category-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 1.5rem;
  background: white;
  border: none;
  border-radius: 2rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  color: #475569;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  flex-shrink: 0;
}

.category-btn i {
  font-size: 1.1rem;
  transition: transform 0.3s ease;
}

.category-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.category-btn:hover i {
  transform: scale(1.15);
}

.category-btn.active {
  background: #1e293b;
  color: white;
  box-shadow: 0 4px 16px rgba(30, 41, 59, 0.2);
}

.active-indicator {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background-color: #3b82f6;
  border-radius: 2px;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.category-btn.active .active-indicator {
  width: 60%;
}

/* Grid optimizado */
.experiences-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
  gap: 1.75rem;
}

.experience-item {
  perspective: 1000px;
}

.experience-card {
  background: white;
  border-radius: 1.25rem;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  will-change: transform, box-shadow;
}

.experience-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.card-image-wrapper {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

.experience-card:hover .card-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%);
}

.category-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(59, 130, 246, 0.95);
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 2rem;
  font-size: 0.8rem;
  font-weight: 700;
  font-family: 'Plus Jakarta Sans', sans-serif;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  z-index: 1;
}

.card-content {
  padding: 1.75rem;
  position: relative;
}

.card-icon {
  position: absolute;
  top: -1.75rem;
  left: 1.75rem;
  width: 3.5rem;
  height: 3.5rem;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  color: #3b82f6;
  font-size: 1.4rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
}

.experience-card:hover .card-icon {
  transform: translateY(-5px) rotate(8deg);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.card-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.35rem;
  color: #1e293b;
  margin-top: 0.5rem;
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.card-text {
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #475569;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.discover-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.5rem;
  background: transparent;
  border: 2px solid #3b82f6;
  border-radius: 2rem;
  color: #3b82f6;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.discover-btn i {
  transition: transform 0.3s ease;
}

.discover-btn:hover {
  background: #3b82f6;
  color: white;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);
}

.discover-btn:hover i {
  transform: translateX(4px);
}

/* Estado vacío mejorado */
.no-results {
  text-align: center;
  padding: 3rem 0;
}

.no-results-content {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.no-results i {
  font-size: 3rem;
  color: #e2e8f0;
  margin-bottom: 1.25rem;
  display: inline-block;
}

.no-results h3 {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  color: #1e293b;
  margin-bottom: 0.75rem;
}

.no-results p {
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #64748b;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.reset-filter {
  background: #3b82f6;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 2rem;
  color: white;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.reset-filter:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .experiences-section {
    padding: 4rem 0;
  }
  
  .section-header {
    margin-bottom: 3rem;
  }
  
  .card-icon {
    width: 3rem;
    height: 3rem;
    font-size: 1.2rem;
  }
}

@media (max-width: 768px) {
  .experiences-section {
    padding: 3.5rem 0;
  }
  
  .category-btn {
    padding: 0.7rem 1.25rem;
    font-size: 0.9rem;
  }
  
  .card-image-wrapper {
    height: 200px;
  }
  
  .card-content {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }
  
  .experiences-section {
    padding: 3rem 0;
  }
  
  .section-title {
    font-size: 1.6rem;
  }
  
  .experiences-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .category-btn {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
  }
  
  .card-icon {
    width: 2.75rem;
    height: 2.75rem;
    font-size: 1.1rem;
  }
}
</style>