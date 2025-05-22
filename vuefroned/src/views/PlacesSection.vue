<template>
  <section class="places-bg">
    <div class="container py-5">
      <!-- Título con animación de letras -->
      <h2 class="section-title mb-5" data-aos="fade-down" data-aos-delay="100">
        <span class="title-wrapper">
          <span 
            v-for="(letter, idx) in 'Destinos Turísticos'.split('')" 
            :key="idx"
            class="letter"
            :data-aos="letter === ' ' ? '' : 'fade-up'"
            :data-aos-delay="100 + idx * 50"
          >
            {{ letter }}
          </span>
        </span>
        <span class="title-underline" data-aos="fade-left" data-aos-delay="800"></span>
      </h2>

      <div class="row g-4">
        <div
          v-for="(p, idx) in places"
          :key="p.id"
          class="col-md-4"
          :data-aos="idx % 2 === 0 ? 'fade-right' : 'fade-left'"
          :data-aos-delay="idx % 3 * 100"
        >
          <div class="place-card h-100">
            <div class="place-image-container" data-aos="zoom-in" data-aos-delay="300">
              <img
                :src="p.image_url"
                class="place-image"
                :alt="p.name"
                loading="lazy"
              />
              <div class="shine"></div>
            </div>
            <div class="place-content">
              <h3 class="place-title" data-aos="fade-up" data-aos-delay="400">
                {{ p.name }}
              </h3>
              <p class="place-excerpt" data-aos="fade-up" data-aos-delay="450">
                {{ p.excerpt }}
              </p>
              <router-link
                :to="`/places/${p.id}`"
                class="discover-link"
                data-aos="fade-up"
                data-aos-delay="500"
              >
                Explorar lugar <i class="bi bi-arrow-right"></i>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { defineProps, onMounted } from 'vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

const props = defineProps({ places: Array })

onMounted(() => {
  AOS.init({
    duration: 800,
    easing: 'ease-in-out-quart',
    once: false,
    mirror: true,
    offset: 120,
    anchorPlacement: 'top-bottom',
    disable: window.innerWidth < 768
  })
  
  // refrescar AOS tras cargar imágenes
  document.querySelectorAll('.place-image').forEach(img => {
    img.onload = () => AOS.refresh()
  })
})
</script>

<style scoped>
/* Fondo full-width */
.places-bg {
  width: 100%;
  background-image: url('https://images.unsplash.com/photo-1582140610424-a33e152c9a31?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Q2FwYWNoaWNhJTJDJTIwUGVydXxlbnwwfHwwfHx8MA%3D%3D'); /* reemplaza con tu URL */
}

/* Sección interna centrada */
.container {
  position: relative;
  z-index: 1;
}

/* Título animado */
.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #2E2E2E;
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
}

.title-underline {
  position: absolute;
  bottom: -0.5rem;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #E07A5F, #81B29A);
  border-radius: 2px;
  transform-origin: center;
  transition: transform 0.6s ease;
}

.aos-animate .title-underline {
  transform: translateX(-50%) scaleX(1);
}

.letter {
  display: inline-block;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.4s ease;
}

.aos-animate .letter {
  opacity: 1;
  transform: translateY(0);
  color: #E07A5F;
}

/* Card base */
.place-card {
  position: relative;
  background: #FFFFFF;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}

.place-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.10);
}

/* Shine */
.shine {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: linear-gradient(
    135deg,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.7) 50%,
    rgba(255,255,255,0) 100%
  );
  transform: translateX(-100%) skewX(-20deg);
  transition: transform 0.8s ease;
  pointer-events: none;
  z-index: 1;
}

.place-card:hover .shine {
  transform: translateX(200%) skewX(-20deg);
}

/* Imagen */
.place-image-container {
  position: relative;
  height: 240px;
  overflow: hidden;
}

.place-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.place-card:hover .place-image {
  transform: scale(1.05);
}

/* Overlay naranja ascendente */
.place-card::before {
  content: '';
  position: absolute;
  bottom: 0; left: 0;
  width: 100%; height: 0%;
  background: linear-gradient(
    to top,
    rgba(226, 139, 115, 0.888) 0%,
    rgba(239, 58, 9, 0.353) 50%,
    rgba(224, 181, 169, 0) 70%,
    transparent 100%
  );
  z-index: 1;
  transition: height 0.6s ease-in-out;
}

.place-card:hover::before {
  height: 100%;
}

/* Contenido */
.place-content {
  padding: 1.75rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* <--- Agrega esto */
  background: rgba(217, 209, 203, 0.248);
  position: relative;
  z-index: 2;
  transition: background 0.5s ease-in-out;
}


.place-card:hover .place-content {
  background: transparent;
}

.place-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  color: #2E2E2E;
  margin-bottom: 0.75rem;
  font-weight: 700;
  transition: color 0.4s ease;
}

.place-excerpt {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.95rem;
  color: #555555;
  line-height: 1.6;
  flex-grow: 1;
  margin-bottom: 1rem;
  transition: color 0.4s ease;

  max-height: 10rem; /* ~3 líneas */
  overflow-y: auto;
  padding-right: 0.5rem;
}

.place-excerpt::-webkit-scrollbar {
  width: 6px;
}
.place-excerpt::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.15);
  border-radius: 3px;
}

/* Texto en hover */
.place-card:hover .place-title,
.place-card:hover .place-excerpt {
  color: #FFFFFF !important;
}

/* Botón estático */
.discover-link {
  display: inline-flex;
  align-items: center;
  padding: 0.6rem 1.2rem;
  font-weight: 600;
  color: #FFFFFF;
  background: linear-gradient(90deg, #81B29A, #F2CC8F);
  border-radius: 50px;
  text-decoration: none;
  transition: background 0.3s ease, box-shadow 0.3s ease;
  /* Removido align-self y position */
  margin-top: 1rem;
  box-shadow: 0 3px 12px rgba(33,77,68,0.15);
}

.discover-link i {
  margin-left: 0.4rem;
  transition: transform 0.3s ease;
}

.discover-link:hover {
  background: linear-gradient(90deg, #E07A5F, #F2CC8F);
  box-shadow: 0 6px 20px rgba(224,122,95,0.25);
}

.discover-link:hover i {
  transform: translateX(4px) rotate(10deg);
}

/* Responsive */
@media (max-width: 991.98px) {
  .section-title { font-size: 2.2rem; }
  .place-image-container { height: 200px; }
}
@media (max-width: 767.98px) {
  .section-title { font-size: 1.8rem; }
  .place-content { padding: 1.25rem; }
  .place-title { font-size: 1.3rem; }
}
@media (max-width: 575.98px) {
  .section-title { font-size: 1.6rem; }
}
</style>
