<template>
  <div class="travel-app">
    <!-- Hero Section Ultra Moderna (Conservando tu diseño) -->
    <section 
      class="hero-section"
      :style="heroStyle"
      aria-label="Sección de bienvenida"
      data-aos="fade"
      data-aos-duration="1000"
    >
      <div class="hero-overlay"></div>
      
      <div class="container h-100">
        <div class="row h-100 align-items-center">
          <div class="col-lg-8 col-md-10">
            <div class="hero-content" 
                 data-aos="fade-up" 
                 data-aos-delay="200"
                 data-aos-anchor-placement="top-bottom"
                 data-aos-easing="ease-out-cubic">
              
              <h1 v-if="homeData.title_text" class="hero-title" :style="titleStyle">
                {{ homeData.title_text }}
              </h1>
              
              <p v-if="homeData.description" 
                 class="hero-subtitle"
                 :style="descriptionStyle"
                 data-aos="fade-up"
                 data-aos-delay="500"
                 data-aos-easing="ease-out-quint">
                {{ homeData.description }}
              </p>
              
              <div class="hero-actions" 
                   data-aos="fade-up" 
                   data-aos-delay="700"
                   data-aos-anchor-placement="top-bottom">
                <router-link 
                  to="/tours" 
                  class="btn btn-explore"
                  data-aos="zoom-in"
                  data-aos-delay="800">
                  <i class="bi bi-compass me-2"></i> Explorar Tours
                </router-link>
                
                <router-link 
                  to="/contact" 
                  class="btn btn-contact"
                  data-aos="zoom-in"
                  data-aos-delay="900">
                  <i class="bi bi-chat-right-text me-2"></i> Contacto
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="scroll-indicator" 
           data-aos="fade-up" 
           data-aos-delay="1100"
           data-aos-anchor-placement="top-bottom">
        <div class="chevron"></div>
        <div class="chevron"></div>
        <div class="chevron"></div>
      </div>
    </section>

    <!-- Loading State Moderno (Tu versión mejor) -->
    <div v-if="isLoading" class="loading-screen" data-aos="fade">
      <div class="modern-loader">
        <div class="dot-pulse"></div>
      </div>
    </div>

    <!-- Secciones del sitio (Actualizadas con nuevas funcionalidades) -->
    <main v-else class="content-wrapper">
      <AboutSection 
        :data="aboutData" 
        data-aos="fade-up"
        data-aos-offset="100"
        data-aos-easing="ease-out-cubic"/>
      
      <ExperienceTabs 
        data-aos="fade-up"
        data-aos-offset="100"
        data-aos-delay="100"
        data-aos-easing="ease-out-cubic"/>
      
      <PlacesSection 
        :places="places"
        data-aos="fade-up"
        data-aos-offset="100"
        data-aos-delay="150"
        data-aos-easing="ease-out-cubic"/>

        <!-- paqeutes -->
         <section class="py-5 text-center">
  <div class="container">
    <h2 class="mb-4">🌎 Descubre nuestros Paquetes Turísticos</h2>
    <router-link to="/paquetes" class="btn btn-primary btn-lg">
      <i class="bi bi-box2-heart me-2"></i> Ver Paquetes
    </router-link>
  </div>
</section>

<!-- Paquetes personalizados -->
<section v-if="userRole === 'cliente'" class="py-5 text-center bg-light">
  <div class="container">
    <h2 class="mb-3">🎯 Personaliza tu experiencia</h2>
    <router-link to="/mis-paquetes" class="btn btn-outline-primary me-2">
      <i class="bi bi-person-lines-fill me-1"></i> Mis Paquetes
    </router-link>
    <router-link to="/mis-paquetes/crear" class="btn btn-primary">
      <i class="bi bi-plus-circle me-1"></i> Crear nuevo
    </router-link>
  </div>
</section>

      <!-- Nueva Sección de Productos -->
      <section class="py-5" 
               data-aos="fade-up"
               data-aos-offset="100"
               data-aos-delay="250"
               data-aos-easing="ease-out-cubic">
        <div class="container">
          <Products :products="products" />
        </div>
      </section>
      
      <ToursSection 
        :tours="tours"
        data-aos="fade-up"
        data-aos-offset="100"
        data-aos-delay="200"
        data-aos-easing="ease-out-cubic"/>
      
      
      
      <GallerySection 
        :images="gallery"
        data-aos="fade-up"
        data-aos-offset="100"
        data-aos-delay="300"
        data-aos-easing="ease-out-cubic"/>
      
      <ContactSection 
        :contact="contact"
        data-aos="fade-up"
        data-aos-offset="100"
        data-aos-delay="350"
        data-aos-easing="ease-out-cubic"/>
      
      <TestimoniosSection 
        data-aos="fade-up"
        data-aos-offset="100"
        data-aos-delay="400"
        data-aos-easing="ease-out-cubic"/>
      
      <TestimonioForm 
        data-aos="fade-up"
        data-aos-offset="100"
        data-aos-delay="450"
        data-aos-easing="ease-out-cubic"/>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/services/axios'
import AOS from 'aos'
import 'aos/dist/aos.css'

// Componentes (Añadido Products)
import AboutSection from '@/views/AboutSection.vue'
import ExperienceTabs from '@/views/ExperienceTabs.vue'
import PlacesSection from '@/views/PlacesSection.vue'
import ToursSection from '@/views/ToursSection.vue'
import GallerySection from '@/views/GallerySection.vue'
import ContactSection from '@/views/ContactSection.vue'
import TestimoniosSection from '@/views/TestimoniosSection.vue'
import TestimonioForm from '@/views/TestimonioForm.vue'
import Products from '@/views/Product/Views/Products.vue' // ✅ Nueva importación

// Datos reactivos (Añadido products)
const homeData = ref({ title_text: '', description: '', title_color: '#fff', title_size: '4rem', image_urls: [], background_color: '#0f172a' })
const aboutData = ref({})
const tours = ref([])
const gallery = ref([])
const contact = ref({})
const places = ref([])
const products = ref([]) // ✅ Nuevo array para productos
const isLoading = ref(true)
const currentHeroIndex = ref(0)
const userRole = localStorage.getItem('user_roles') || ''

// Computed properties (Mejoradas con transiciones)
const heroStyle = computed(() => {
  const imgs = homeData.value.image_urls || []
  if (imgs.length) {
    return {
      backgroundImage: `linear-gradient(to right, rgba(12,36,56,0.4), rgba(12,36,56,0.1)), url(${imgs[currentHeroIndex.value]})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      transition: 'background-image 1s ease-in-out' // ✅ Nueva transición
    }
  }
  return {
    backgroundColor: homeData.value.background_color,
    minHeight: '100vh'
  }
})

// Resto de computed properties (conservando tu estilo original)
const titleStyle = computed(() => {
  const size = homeData.value.title_size
  return {
    color: homeData.value.title_color,
    fontSize: typeof size === 'number' ? `${size}px` : size,
    fontFamily: `'Playfair Display', serif`, // ✅ Mejora tipográfica
    textShadow: '3px 3px 8px rgba(0, 0, 0, 0.6)' // ✅ Nuevo efecto
  }
})

const descriptionStyle = computed(() => ({
  maxWidth: '600px',
  margin: '0 auto 2rem',
  fontSize: '1.1rem',
  lineHeight: '1.6',
  color: '#f0f0f0',
  fontFamily: `'Poppins', sans-serif`, // ✅ Mejora tipográfica
  textShadow: '1px 1px 4px rgba(0, 0, 0, 0.4)' // ✅ Nuevo efecto
}))

onMounted(async () => {
  // Inicializar AOS (config actualizada)
  AOS.init({ 
    duration: 800, 
    easing: 'ease-out-cubic', 
    once: true, 
    offset: 80,
    anchorPlacement: 'top-bottom' // ✅ Nueva configuración
  })

  // Cargar datos (incluyendo productos)
  try {
    const [
      homeRes, 
      aboutRes, 
      toursRes, 
      galleryRes, 
      contactRes, 
      placesRes,
      productsRes // ✅ Nueva petición
    ] = await Promise.all([
      api.get('/homepage-setting/active'), // ✅ Endpoint actualizado
      api.get('/about'), 
      api.get('/tours'), 
      api.get('/gallery'), 
      api.get('/contact'), 
      api.get('/places'),
      api.get('/products') // ✅ Nueva petición
    ])
    
    homeData.value = { ...homeData.value, ...homeRes.data }
    aboutData.value = aboutRes.data
    tours.value = toursRes.data
    gallery.value = galleryRes.data
    contact.value = contactRes.data
    places.value = placesRes.data
    products.value = productsRes.data // ✅ Asignación de datos
    
    if (!places.value.length) {
      console.warn('⚠️ No se cargaron destinos turísticos.')
    }
  } catch (e) {
    console.error('Error loading data:', e)
  } finally {
    isLoading.value = false
  }

  // Carrusel de hero (optimizado)
  if (homeData.value.image_urls?.length > 1) {
    setInterval(() => {
      currentHeroIndex.value = (currentHeroIndex.value + 1) % homeData.value.image_urls.length
    }, 7000)
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.travel-app {
  overflow-x: hidden;
  scroll-behavior: smooth;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

/* Hero Section Ultra Moderna */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 80px;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(22, 37, 71, 0.474) 0%, rgba(15, 23, 42, 0.249) 100%);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  padding: 2.4rem;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  max-width: 700px;
}

.hero-title {
  font-weight: 800;
  font-size: 2.4rem;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  letter-spacing: -0.5px;
}

.title-wrapper {
  display: inline-block;
}

.letter {
  display: inline-block;
  opacity: 0;
  transform: translateY(15px);
  transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.letter.space {
  width: 0.4em;
}

.aos-animate .letter {
  opacity: 1;
  transform: translateY(0);
}

.hero-subtitle {
  font-size: 1.1rem;
  line-height: 1.7;
  margin-bottom: 2rem;
  opacity: 0.9;
  max-width: 600px;
  font-weight: 400;
}

.hero-actions {
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.btn-explore {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  padding: 0.8rem 1.75rem;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 8px;
  color: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
}

.btn-explore:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
}

.btn-contact {
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 0.8rem 1.75rem;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 8px;
  color: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(5px);
}

.btn-contact:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-3px);
  border-color: rgba(255, 255, 255, 0.5);
}

/* Scroll Indicator Moderno */
.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chevron {
  width: 12px;
  height: 12px;
  border-right: 2px solid white;
  border-bottom: 2px solid white;
  transform: rotate(45deg);
  margin: -4px 0;
  opacity: 0;
  animation: chevron-animation 2s infinite;
}

.chevron:nth-child(1) {
  animation-delay: 0s;
}
.chevron:nth-child(2) {
  animation-delay: 0.2s;
}
.chevron:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes chevron-animation {
  0% {
    opacity: 0;
    transform: rotate(45deg) translateY(10px);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: rotate(45deg) translateY(-10px);
  }
}

/* Loading State Moderno */
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #0f172a;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
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

/* Content Sections */
.content-wrapper {
  padding: 4rem 0;
}

/* Responsive Design */
@media (max-width: 1199.98px) {
  .hero-content {
    padding: 2rem;
  }
}

@media (max-width: 991.98px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
}

@media (max-width: 767.98px) {
  .hero-section {
    padding-top: 70px;
  }
  
  .hero-content {
    padding: 1.75rem;
    backdrop-filter: blur(8px);
  }
  
  .hero-title {
    font-size: 1.8rem;
  }
  
  .hero-actions {
    flex-direction: column;
    gap: 1rem;
  }
  
  .btn-explore, .btn-contact {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 575.98px) {
  .hero-content {
    padding: 1.5rem;
  }
  
  .hero-title {
    font-size: 1.6rem;
    margin-bottom: 1.2rem;
  }
  
  .content-wrapper {
    padding: 3rem 0;
  }
}
</style> 