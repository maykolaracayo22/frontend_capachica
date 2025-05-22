<template>
  <section class="place-detail-page">
    <!-- Hero Header -->
    <div
      v-if="place"
      class="place-hero"
      :style="{ backgroundImage: `url(${place.image_url})` }"
    >
      <div class="container">
        <div class="hero-content" data-aos="fade-up">
          <h1 class="hero-title">{{ place.name }}</h1>
          <div class="hero-badges">
            <span class="badge bg-primary-subtle text-primary">
              <i class="bi bi-geo-alt-fill"></i> Destino Turístico
            </span>
            <span
              v-if="place.stats?.dificultad"
              class="badge"
              :class="getDifficultyClass(place.stats.dificultad)"
            >
              <i class="bi bi-speedometer2"></i>
              {{ place.stats.dificultad }}
            </span>
          </div>
        </div>
      </div>
      <div class="overlay"></div>
    </div>

    <!-- Main Content -->
    <div class="container content-container">
      <div v-if="place" class="row g-4">
        <!-- Info Column -->
        <div class="col-lg-8" data-aos="fade-up">
          <!-- Descripción -->
          <div class="content-card mb-4">
            <div class="card-header d-flex align-items-center">
              <i class="bi bi-info-circle-fill text-primary me-2"></i>
              <h2 class="section-title mb-0">Sobre este destino</h2>
            </div>
            <div class="card-body">
              <p class="description">{{ place.excerpt }}</p>
            </div>
          </div>

          <!-- Actividades -->
          <div class="content-card mb-4" data-aos="fade-up" data-aos-delay="100">
            <div class="card-header d-flex align-items-center">
              <i class="bi bi-calendar2-check text-primary me-2"></i>
              <h2 class="section-title mb-0">Actividades</h2>
            </div>
            <div class="card-body">
              <div class="activities-list">
                <div
                  v-for="(act, idx) in place.activities || []"
                  :key="idx"
                  class="activity-item"
                  data-aos="fade-right"
                  :data-aos-delay="idx * 50 + 100"
                >
                  <div class="activity-icon">
                    <i class="bi" :class="getActivityIcon(act)"></i>
                  </div>
                  <div class="activity-text">{{ act }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Mapa -->
          <div
            v-if="hasValidCoordinates"
            class="content-card mb-4"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div class="card-header d-flex align-items-center">
              <i class="bi bi-map-fill text-primary me-2"></i>
              <h2 class="section-title mb-0">Ubicación</h2>
            </div>
            <div class="card-body p-0">
              <div id="map" class="map-container"></div>
            </div>
          </div>
        </div>

        <!-- Sidebar Column -->
        <div class="col-lg-4">
          <!-- Detalles -->
          <div class="content-card mb-4 sticky-top sticky-sidebar" data-aos="fade-left">
            <div class="card-header d-flex align-items-center">
              <i class="bi bi-clipboard-data-fill text-primary me-2"></i>
              <h2 class="section-title mb-0">Detalles</h2>
            </div>
            <div class="card-body">
              <ul class="stats-list">
                <li
                  v-for="(value, key) in place.stats || {}"
                  :key="key"
                  class="stats-item"
                  data-aos="fade-up"
                  :data-aos-delay="50"
                >
                  <div class="stats-icon">
                    <i class="bi" :class="getStatsIcon(key)"></i>
                  </div>
                  <div class="stats-content">
                    <div class="stats-label">{{ capitalize(key) }}</div>
                    <div class="stats-value">{{ value }}</div>
                  </div>
                </li>
              </ul>

              <div class="mt-4 text-center" data-aos="fade-up" data-aos-delay="300">
                <router-link to="/places" class="btn btn-primary btn-lg">
                  <i class="bi bi-arrow-left me-2"></i>Volver a destinos
                </router-link>
              </div>
            </div>
          </div>

          <!-- Recomendaciones -->
          <div class="content-card" data-aos="fade-left" data-aos-delay="100">
            <div class="card-header d-flex align-items-center">
              <i class="bi bi-bookmark-star-fill text-primary me-2"></i>
              <h2 class="section-title mb-0">Recomendaciones</h2>
            </div>
            <div class="card-body">
              <div class="tip-box">
                <i class="bi bi-lightbulb-fill tip-icon"></i>
                <p class="tip-text">
                  La mejor temporada para visitar {{ place.name }} es primavera.
                </p>
              </div>

              <div class="tip-box">
                <i class="bi bi-bag-fill tip-icon"></i>
                <p class="tip-text">
                  Lleva ropa cómoda, protector solar y suficiente agua.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loader -->
      <div v-else class="text-center py-5" data-aos="fade-in">
        <div class="spinner-grow text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-3 loading-text">
          Descubriendo este maravilloso destino...
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/axios'
import AOS from 'aos'
import 'aos/dist/aos.css'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const route = useRoute()
const place = ref(null)
const hasValidCoordinates = computed(() => {
  const lat = parseFloat(place.value?.latitude)
  const lng = parseFloat(place.value?.longitude)
  return !isNaN(lat) && !isNaN(lng)
})

async function fetchPlace() {
  try {
    const { data } = await api.get(`/places/${route.params.id}`)
    place.value = data
    // Esperamos a que el DOM renderice el #map
    if (hasValidCoordinates.value) {
      await nextTick()
      const mapEl = document.getElementById('map')
      if (mapEl) {
        const map = L.map('map').setView(
          [data.latitude, data.longitude],
          13
        )
        L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          { attribution: '© OpenStreetMap contributors' }
        ).addTo(map)
        L.marker([data.latitude, data.longitude])
          .addTo(map)
          .bindPopup(data.name)
          .openPopup()
      }
    }
  } catch (e) {
    console.error('Error al cargar destino:', e)
  }
}

const capitalize = (s) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : ''

const getActivityIcon = (activity) => {
  if (!activity) return 'bi-check-circle'
  const a = activity.toLowerCase()
  if (a.includes('senderismo') || a.includes('caminata'))
    return 'bi-broadcast'
  if (a.includes('natación') || a.includes('nadar'))
    return 'bi-water'
  if (a.includes('camping') || a.includes('acampar'))
    return 'bi-tree'
  if (a.includes('ciclismo') || a.includes('bicicleta'))
    return 'bi-bicycle'
  if (a.includes('fotografía')) return 'bi-camera'
  if (a.includes('pesca')) return 'bi-water'
  if (a.includes('observación') || a.includes('aves'))
    return 'bi-binoculars'
  if (a.includes('escalada')) return 'bi-ladder'
  return 'bi-check-circle'
}

const getStatsIcon = (stat) => {
  if (!stat) return 'bi-info-circle'
  const s = stat.toLowerCase()
  if (s.includes('dificultad')) return 'bi-speedometer2'
  if (s.includes('duración') || s.includes('tiempo')) return 'bi-clock'
  if (s.includes('distancia')) return 'bi-rulers'
  if (s.includes('elevación') || s.includes('altura'))
    return 'bi-graph-up-arrow'
  if (s.includes('temperatura')) return 'bi-thermometer-half'
  if (s.includes('costo') || s.includes('precio')) return 'bi-currency-dollar'
  if (s.includes('visitantes') || s.includes('popularidad'))
    return 'bi-people'
  return 'bi-info-circle'
}

const getDifficultyClass = (diff) => {
  if (!diff) return 'bg-info-subtle text-info'
  const d = diff.toLowerCase()
  if (d.includes('fácil')) return 'bg-success-subtle text-success'
  if (d.includes('media') || d.includes('moderada'))
    return 'bg-warning-subtle text-warning'
  if (d.includes('difícil') || d.includes('alta'))
    return 'bg-danger-subtle text-danger'
  return 'bg-info-subtle text-info'
}

onMounted(() => {
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false,
    offset: 50,
    anchorPlacement: 'top-bottom'
  })
  fetchPlace()
})
</script>

<style scoped>
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css');

.place-detail-page {
  font-family: 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Hero Section */
.place-hero {
  height: 60vh;
  min-height: 400px;
  max-height: 600px;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: flex-end;
  color: white;
  margin-bottom: 2rem;
}

.hero-content {
  position: relative;
  z-index: 2;
  padding: 2rem 0;
  width: 100%;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.6);
  margin-bottom: 1rem;
}

.hero-badges {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.badge {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 30px;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0.6) 100%
  );
  z-index: 1;
}

/* Content Cards */
.content-container {
  margin-top: -3rem;
  position: relative;
  z-index: 3;
}

.content-card {
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.content-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 1.25rem 1.5rem;
}

.card-body {
  padding: 1.5rem;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
}

/* Description */
.description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #444;
}

/* Activities */
.activities-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  background: #F4F9F9;
  padding: 0.7rem 1rem;
  border-radius: 10px;
  flex: 1 1 45%;
  min-width: 200px;
  transition: background 0.2s ease;
}

.activity-item:hover {
  background: #E8F6F3;
}

.activity-icon {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.activity-icon i {
  font-size: 1.2rem;
  color: #0D6EFD;
}

.activity-text {
  font-weight: 500;
}

/* Stats */
.stats-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.stats-item {
  display: flex;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #F1F1F1;
}

.stats-item:last-child {
  border-bottom: none;
}

.stats-icon {
  width: 45px;
  height: 45px;
  background: #E8F6F3;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
}

.stats-icon i {
  font-size: 1.4rem;
  color: #0D6EFD;
}

.stats-content {
  flex: 1;
}

.stats-label {
  font-size: 0.85rem;
  color: #6C757D;
  margin-bottom: 0.2rem;
}

.stats-value {
  font-weight: 600;
  font-size: 1.1rem;
  color: #212529;
}

/* Map */
.map-container,
#map {
  width: 100%;
  height: 400px;
  border-radius: 0 0 12px 12px;
}

/* Tips */
.tip-box {
  display: flex;
  align-items: flex-start;
  background: #F4F9F9;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.tip-icon {
  font-size: 1.5rem;
  color: #FFC107;
  margin-right: 1rem;
}

.tip-text {
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.5;
}

/* Buttons */
.btn {
  border-radius: 8px;
  padding: 0.6rem 1.5rem;
  font-weight: 500;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-primary {
  background-color: #0D6EFD;
  border-color: #0D6EFD;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Loader */
.loading-text {
  font-size: 1.1rem;
  font-weight: 500;
  color: #666;
}

/* Sticky sidebar */
.sticky-sidebar {
  position: sticky;
  top: 20px;
}

/* Responsive */
@media (max-width: 991.98px) {
  .hero-title { font-size: 2.5rem; }
  .sticky-sidebar { position: static; }
}
@media (max-width: 767.98px) {
  .place-hero { height: 40vh; }
  .hero-title { font-size: 2rem; }
  .activities-list { flex-direction: column; }
  .activity-item { flex: 1 1 100%; }
  [data-aos] {
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>
