<template>
  <div class="container py-5">
    <h2 class="section-title mb-5" data-aos="fade-up">Destinos Turísticos</h2>
    <div class="row g-4">
      <div 
        v-for="(place, index) in places" 
        :key="place.id" 
        class="col-md-4"
        :data-aos="index % 2 === 0 ? 'fade-right' : 'fade-left'"
        :data-aos-delay="(index % 3) * 100"
      >
        <div class="place-card h-100">
          <div class="place-image-container">
            <img
              v-if="place.image_url"
              :src="place.image_url"
              class="place-image"
              :alt="'Imagen de ' + place.name"
              data-aos="zoom-in"
              data-aos-delay="300"
            />
          </div>
          <div class="place-content">
            <h3 class="place-title">{{ place.name }}</h3>
            <p class="place-excerpt">{{ place.excerpt }}</p>
            <router-link
              :to="`/places/${place.id}`"
              class="discover-link"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <span>Explorar destino</span>
              <i class="bi bi-arrow-right"></i>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/axios'

const places = ref([])

const fetchPlaces = async () => {
  try {
    const { data } = await api.get('/places')
    places.value = data
  } catch (e) {
    console.error('Error al cargar destinos:', e)
  }
}

onMounted(fetchPlaces)
</script>

<style scoped>
.section-title {
  font-family: 'Georgia', serif;
  font-size: 2rem;
  color: #2c3e50;
  font-weight: 700;
  position: relative;
  padding-bottom: 0.5rem;
  text-align: center;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background-color: #fca311;
}

.place-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.place-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
}

.place-image-container {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.place-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.place-card:hover .place-image {
  transform: scale(1.05);
}

.place-content {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.place-title {
  font-family: 'Georgia', serif;
  color: #2c3e50;
  font-size: 1.3rem;
  margin-bottom: 0.75rem;
  font-weight: 700;
}

.place-excerpt {
  font-family: 'Georgia', serif;
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.discover-link {
  display: inline-flex;
  align-items: center;
  color: #3182ce;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  align-self: flex-start;
  margin-top: auto;
}

.discover-link:hover {
  color: #2c5282;
}

.discover-link i {
  margin-left: 0.5rem;
  transition: transform 0.3s ease;
}

.discover-link:hover i {
  transform: translateX(3px);
}

@media (max-width: 767.98px) {
  .section-title {
    font-size: 1.75rem;
  }
  
  .place-image-container {
    height: 180px;
  }
  
  .place-content {
    padding: 1.25rem;
  }
  
  .place-title {
    font-size: 1.2rem;
  }
  
  [data-aos] {
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>