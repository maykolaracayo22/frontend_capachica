<template>
  <section class="tours-section" data-aos="fade-up" data-aos-duration="1000">
    <div class="container">
      <!-- Título con animación de letras -->
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

      <div class="row g-4">
        <div
          v-for="(tour, index) in tours"
          :key="tour.id"
          class="col-md-4"
          :data-aos="getCardAnimation(index)"
          :data-aos-delay="getCardDelay(index)"
          data-aos-once="false"
          data-aos-anchor-placement="top-bottom"
        >
          <div class="tour-card h-100">
            <div class="tour-image-container" data-aos="zoom-in" :data-aos-delay="getCardDelay(index) + 200">
              <img 
                :src="tour.image" 
                class="tour-image" 
                :alt="tour.name" 
                loading="lazy"
                @load="handleImageLoad"
              />
              <div class="price-badge" data-aos="zoom-in" :data-aos-delay="getCardDelay(index) + 250">
                S/ {{ tour.price }}
              </div>
              <div class="tour-overlay"></div>
            </div>
            <div class="tour-content">
              <h3 
                class="tour-name" 
                data-aos="fade-up" 
                :data-aos-delay="getCardDelay(index) + 300"
              >
                {{ tour.name }}
              </h3>
              <p 
                class="tour-description" 
                data-aos="fade-up" 
                :data-aos-delay="getCardDelay(index) + 350"
              >
                {{ tour.description }}
              </p>
              <router-link
                :to="`/tours/${tour.id}`"
                class="tour-button"
                data-aos="fade-up"
                :data-aos-delay="getCardDelay(index) + 400"
                data-aos-anchor-placement="top-bottom"
              >
                <span>Descubrir Tour</span>
                <i class="bi bi-arrow-right"></i>
              </router-link>
            </div>
            <div class="shine"></div>
          </div>
        </div>
      </div>

      <!-- Estado vacío -->
      <div 
        v-if="tours.length === 0 && !isLoading" 
        class="no-tours text-center py-5"
        data-aos="zoom-in"
      >
        <i class="bi bi-compass text-muted" style="font-size: 3rem;"></i>
        <h3 class="mt-3">Próximamente más tours</h3>
        <p class="text-muted">Estamos preparando experiencias increíbles para ti</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/axios'
import AOS from 'aos'
import 'aos/dist/aos.css'

const tours = ref([])
const isLoading = ref(true)
const titleLetters = 'Tours Disponibles'.split('')
const easingFunctions = [
  'ease-out-sine',
  'ease-out-quad',
  'ease-out-cubic',
  'ease-out-quart',
  'ease-out-back'
]

const getCardAnimation = (index) => {
  const animations = ['fade-up', 'fade-right', 'fade-left']
  return animations[index % animations.length]
}

const getCardDelay = (index) => {
  return (index % 3) * 100 + 200
}

const handleImageLoad = () => {
  AOS.refresh()
}

const fetchTours = async () => {
  try {
    const { data } = await api.get('/tours')
    tours.value = data
  } catch (error) {
    console.error('Error al obtener los tours:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchTours()
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
.tours-section {
  padding: 6rem 0;
  position: relative;
  overflow: hidden;
  width: 100%;
  background-image: url('https://www.titicacaintiwasi.com/medias/slide/big/4/photo-5134247104875703188-w.jpg'); /* reemplaza con tu URL */

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
  background: linear-gradient(90deg, #E07A5F, #81B29A);
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

/* Tarjeta base */
.tour-card {
  position: relative;
  background: #FFFFFF;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1),
              box-shadow 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  flex-direction: column;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  opacity: 0;
  will-change: transform, opacity, box-shadow;
}

.aos-animate .tour-card {
  opacity: 1;
}

/* Hover 3D */
.tour-card:hover {
  transform: perspective(1000px)
               rotateX(2deg)
               rotateY(-2deg)
               translateY(-10px)
               scale(1.02);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

/* Shine */
.shine {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
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

.tour-card:hover .shine {
  transform: translateX(200%) skewX(-20deg);
}

/* Imagen */
.tour-image-container {
  position: relative;
  height: 250px;
  overflow: hidden;
  border-radius: 16px 16px 0 0;
}

.tour-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.tour-card:hover .tour-image {
  transform: scale(1.1);
}

/* Overlay naranja ascendente */
.tour-card::before {
  content: '';
  position: absolute;
  bottom: 0; left: 0;
  width: 100%; height: 0%;
  background: linear-gradient(
    to top,
    rgba(218, 187, 179, 0.696) 0%,
    rgba(222, 149, 129, 0.393) 40%,
    rgba(224, 181, 169, 0) 70%,
    transparent 100%
  );
  z-index: 1;
  transition: height 0.6s ease-in-out;
}

.tour-card:hover::before {
  height: 100%;
}

/* Contenido */
.tour-content {
  padding: 1.75rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
  position: relative;
  z-index: 2;
  transition: background 0.6s ease-in-out;
  border-radius: 0 0 16px 16px;
}

.tour-card:hover .tour-content {
  background: transparent;
}

.tour-name {
  font-family: 'Playfair Display', serif;
  color: #2E2E2E;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
  transition: color 0.4s ease;
}

.tour-card:hover .tour-name {
  color: #E07A5F;
}

/* ===================== DESCRIPCIÓN CON SCROLL ===================== */
.tour-description {
  font-family: 'Montserrat', sans-serif;
  color: #555555;
  line-height: 1.7;
  flex-grow: 1;
  margin-bottom: 1.5rem;

  /* Scroll interno */
  max-height: 9rem;            /* aprox. 3 líneas de texto */
  overflow-y: auto;
  padding-right: 0.5rem;
}

/* Scrollbar styling opcional */
.tour-description::-webkit-scrollbar {
  width: 6px;
}
.tour-description::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.2);
  border-radius: 3px;
}

.price-badge {
  position: absolute;
  top: 1.25rem; right: 1.25rem;
  background: rgba(224, 122, 95, 0.95);
  color: #FFFFFF;
  padding: 0.5rem 1.25rem;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 700;
  font-family: 'Montserrat', sans-serif;
  box-shadow: 0 4px 15px rgba(224, 122, 95, 0.3);
  z-index: 2;
  transition: transform 0.4s ease, background 0.4s ease;
}

.tour-card:hover .price-badge {
  transform: scale(1.1);
  background: #E85B04;
}

.tour-button {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: #FFFFFF;
  background: linear-gradient(90deg, #81B29A, #F2CC8F);
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.4s ease,
              box-shadow 0.4s ease,
              background 0.4s ease;
  align-self: flex-start;
  box-shadow: 0 4px 15px rgba(33, 77, 68, 0.2);
  position: relative;
  z-index: 2;
}

.tour-button::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.6s ease;
}

.tour-button:hover {
  background: linear-gradient(90deg, #E07A5F, #F2CC8F);
  transform: translateX(8px) scale(1.05);
  box-shadow: 0 10px 25px rgba(224, 122, 95, 0.5);
}

.tour-button:hover::before {
  left: 100%;
}

.tour-button i {
  margin-left: 0.5rem;
  transition: transform 0.4s ease;
}

.tour-button:hover i {
  transform: translateX(5px) rotate(10deg);
}

/* Empty state */
.no-tours {
  padding: 3rem;
  background: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
}

/* Responsive */
@media (max-width: 1199.98px) {
  .section-title { font-size: 2.2rem; }
  .tour-image-container { height: 220px; }
}
@media (max-width: 991.98px) {
  .section-title { font-size: 2rem; margin-bottom: 2.5rem; }
  .tours-section { padding: 4rem 0; }
}
@media (max-width: 767.98px) {
  .section-title { font-size: 1.8rem; }
  .letter { display: inline; }
  .tour-content { padding: 1.5rem; }
  .tour-name { font-size: 1.3rem; }
}
@media (max-width: 575.98px) {
  .section-title { font-size: 1.6rem; padding-bottom: 1rem; }
  .title-underline { height: 3px; width: 80px; }
  .tours-section { padding: 3rem 0; }
}
</style>
