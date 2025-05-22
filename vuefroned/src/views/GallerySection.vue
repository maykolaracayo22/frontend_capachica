<template>
  <section class="pro-gallery-section">
    <!-- Encabezado minimalista -->
    <div class="gallery-header" data-aos="fade-down" data-aos-duration="800">
      <h2 class="section-title">
        <span class="title-line">Galería</span>
        <span class="title-highlight">Visual</span>
      </h2>
      <p class="section-subtitle" data-aos="fade-up" data-aos-delay="200">Capturas profesionales de nuestras experiencias</p>
    </div>

    <!-- Grid de galería compacto -->
    <div v-if="gallery.length" class="compact-gallery-grid">
      <div 
        v-for="(item, index) in gallery" 
        :key="item.id"
        class="gallery-item"
        :data-aos="getAnimation(index)"
        :data-aos-delay="index * 50"
        data-aos-duration="600"
        @click="openLightbox(index)"
      >
        <div class="image-wrapper">
          <img 
            :src="item.image_url" 
            :alt="item.caption || 'Imagen profesional'" 
            loading="lazy"
            class="gallery-image"
          />
          <div class="image-overlay">
            <div class="overlay-content">
              <i class="bi bi-zoom-in"></i>
            </div>
          </div>
        </div>
        <p v-if="item.caption" class="image-caption">{{ item.caption }}</p>
      </div>
    </div>

    <!-- Lightbox -->
    <div v-if="lightboxVisible" class="pro-lightbox" @click.self="closeLightbox">
      <button class="close-btn" @click="closeLightbox">
        <i class="bi bi-x-lg"></i>
      </button>
      <button class="nav-btn prev-btn" @click.stop="prevImage">
        <i class="bi bi-chevron-left"></i>
      </button>
      <div class="lightbox-content">
        <img 
          :src="gallery[lightboxIndex].image_url" 
          :alt="gallery[lightboxIndex].caption || 'Imagen ampliada'"
          class="lightbox-image"
        />
        <p v-if="gallery[lightboxIndex].caption" class="lightbox-caption">
          {{ gallery[lightboxIndex].caption }}
        </p>
      </div>
      <button class="nav-btn next-btn" @click.stop="nextImage">
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>

    <!-- Estado vacío -->
    <div v-if="!gallery.length" class="empty-state" data-aos="fade">
      <div class="empty-content">
        <i class="bi bi-camera2"></i>
        <h3>Galería en producción</h3>
        <p>Estamos preparando contenido profesional para usted</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/axios'
import AOS from 'aos'
import 'aos/dist/aos.css'

const gallery = ref([])
const lightboxVisible = ref(false)
const lightboxIndex = ref(0)

// Configuración de animaciones profesionales
const animations = [
  'fade-up', 'fade-down', 'zoom-in', 
  'zoom-out', 'flip-left', 'flip-right'
]

const getAnimation = (index) => {
  return animations[index % animations.length]
}

const openLightbox = (index) => {
  lightboxIndex.value = index
  lightboxVisible.value = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightboxVisible.value = false
  document.body.style.overflow = ''
}

const prevImage = () => {
  lightboxIndex.value = (lightboxIndex.value - 1 + gallery.value.length) % gallery.value.length
}

const nextImage = () => {
  lightboxIndex.value = (lightboxIndex.value + 1) % gallery.value.length
}

const fetchGallery = async () => {
  try {
    const { data } = await api.get('/gallery')
    gallery.value = data
  } catch (e) {
    console.error('Error al cargar galería:', e)
  }
}

onMounted(() => {
  fetchGallery()
  
  AOS.init({
    duration: 800,
    easing: 'ease-in-out-quart',
    once: true,
    mirror: false,
    offset: 120,
    anchorPlacement: 'top-bottom'
  })
})
</script>

<style scoped>
.pro-gallery-section {
  padding: 3rem 0;
  background-color: #fafafa;
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
}

.gallery-header {
  text-align: center;
  margin-bottom: 2.5rem;
  padding: 0 1.5rem;
}

.section-title {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-weight: 600;
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  color: #222;
  margin-bottom: 0.8rem;
  line-height: 1.3;
}

.title-highlight {
  color: #000;
  position: relative;
}

.title-highlight::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, rgba(0,0,0,0.1), transparent);
  z-index: -1;
}

.section-subtitle {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-weight: 400;
  color: #666;
  font-size: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

/* Grid compacto */
.compact-gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.2rem;
  padding: 0 1.5rem;
}

.gallery-item {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
  overflow: hidden;
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
}

.overlay-content i {
  color: white;
  font-size: 1.5rem;
  opacity: 0.8;
  transition: all 0.3s ease;
}

.image-caption {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-size: 0.85rem;
  color: #444;
  padding: 0.8rem;
  margin: 0;
  line-height: 1.4;
}

.gallery-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
}

.gallery-item:hover .image-overlay {
  opacity: 1;
}

.gallery-item:hover .overlay-content i {
  opacity: 1;
  transform: scale(1.1);
}

.gallery-item:hover .gallery-image {
  transform: scale(1.03);
}

/* Lightbox profesional */
.pro-lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.close-btn:hover {
  opacity: 1;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.prev-btn {
  left: 1.5rem;
}

.next-btn {
  right: 1.5rem;
}

.lightbox-content {
  max-width: 85%;
  max-height: 85vh;
  text-align: center;
}

.lightbox-image {
  max-height: 75vh;
  max-width: 100%;
  object-fit: contain;
}

.lightbox-caption {
  color: white;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  margin-top: 1rem;
  font-size: 0.95rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Estado vacío profesional */
.empty-state {
  text-align: center;
  padding: 3rem 0;
}

.empty-content i {
  font-size: 2.5rem;
  color: #ddd;
  margin-bottom: 1rem;
}

.empty-content h3 {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.empty-content p {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #777;
  max-width: 500px;
  margin: 0 auto;
  font-size: 0.95rem;
}

/* Responsive Design */
@media (max-width: 992px) {
  .compact-gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .pro-gallery-section {
    padding: 2rem 0;
  }
  
  .compact-gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    padding: 0 1rem;
  }
  
  .image-caption {
    padding: 0.6rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 576px) {
  .compact-gallery-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .lightbox-content {
    max-width: 95%;
  }
  
  .nav-btn {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
  
  .close-btn {
    top: 1rem;
    right: 1rem;
  }
}
</style>