<template>
  <section class="contact-section py-5" data-aos="fade-up">
    <div class="container">
      <h2 class="section-title text-center mb-5" data-aos="fade-down" data-aos-delay="100">Contáctanos</h2>
      
      <div class="contact-container">
        <div class="contact-info">
          <div 
            class="contact-item" 
            v-for="(item, index) in contactItems" 
            :key="index"
            :data-aos="index % 2 === 0 ? 'fade-right' : 'fade-left'"
            :data-aos-delay="150 + (index * 100)"
          >
            <i :class="`bi ${item.icon} contact-icon`"></i>
            <div>
              <h3 class="contact-label">{{ item.label }}</h3>
              <p class="contact-text">
                <a 
                  :href="item.href" 
                  :target="item.target || null"
                  class="contact-link"
                >
                  {{ item.text }}
                </a>
              </p>
            </div>
          </div>
        </div>
        
        <div 
          class="contact-map" 
          v-if="contact.google_maps_embed"
          data-aos="zoom-in"
          data-aos-delay="300"
        >
          <div class="map-container" v-html="contact.google_maps_embed"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/axios'
import AOS from 'aos'
import 'aos/dist/aos.css'

const contact = ref({
  address: '',
  phone: '',
  email: '',
  facebook: '',
  instagram: '',
  google_maps_embed: ''
})

const contactItems = computed(() => [
  {
    icon: 'bi-geo-alt-fill',
    label: 'Dirección',
    text: contact.value.address,
    href: `https://maps.google.com/?q=${encodeURIComponent(contact.value.address)}`,
    target: '_blank'
  },
  {
    icon: 'bi-telephone-fill',
    label: 'Teléfono',
    text: contact.value.phone,
    href: `tel:${contact.value.phone}`
  },
  {
    icon: 'bi-envelope-fill',
    label: 'Email',
    text: contact.value.email,
    href: `mailto:${contact.value.email}`
  },
  ...(contact.value.facebook ? [{
    icon: 'bi-facebook',
    label: 'Facebook',
    text: 'Visitar página',
    href: contact.value.facebook,
    target: '_blank'
  }] : []),
  ...(contact.value.instagram ? [{
    icon: 'bi-instagram',
    label: 'Instagram',
    text: `@${extractInstagramUser(contact.value.instagram)}`,
    href: contact.value.instagram,
    target: '_blank'
  }] : [])
])

const extractInstagramUser = (url) => {
  try {
    const parsed = new URL(url)
    return parsed.pathname.replace(/\//g, '')
  } catch {
    return url
  }
}

const fetchContact = async () => {
  try {
    const { data } = await api.get('/contact')
    contact.value = data
  } catch (e) {
    console.error('Error al cargar Contacto:', e)
  }
}

onMounted(() => {
  fetchContact()
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic'
  })
})
</script>

<style scoped>
.contact-section {
  padding: 6rem 0;
  position: relative;
  overflow: hidden;
  width: 100%;
  background-image: url('https://portal.andina.pe/EDPfotografia2/Thumbnail/2008/10/06/000074610W.jpg'); /* reemplaza con tu URL */

}

.section-title {
  font-family: 'Georgia', serif;
  font-size: 2.2rem;
  color: #eda414;
  font-weight: 700;
  position: relative;
  padding-bottom: 0.5rem;
  opacity: 0;
  transform: translateY(-20px);
}

[data-aos="fade-down"].aos-animate .section-title {
  opacity: 1;
  transform: translateY(0);
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #fca311, #e85b04);
  transition: transform 0.8s ease;
  transform-origin: center;
}

[data-aos="fade-down"].aos-animate .section-title::after {
  transform: translateX(-50%) scaleX(1);
}

.contact-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.contact-info {
  display: grid;
  gap: 1.5rem;
}

.contact-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.664);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  opacity: 0;
  transform: translateX(20px);
}

[data-aos^="fade-"].aos-animate .contact-item {
  opacity: 1;
  transform: translateX(0);
}

.contact-item:hover {
  transform: translateY(-5px) scale(1.02) !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  background: white;
}

.contact-icon {
  font-size: 1.5rem;
  color: #fca311;
  margin-top: 0.25rem;
  transition: transform 0.3s ease;
}

.contact-item:hover .contact-icon {
  transform: scale(1.2);
}

.contact-label {
  font-family: 'Georgia', serif;
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.contact-text {
  font-family: 'Georgia', serif;
  color: #4a5568;
  line-height: 1.6;
}

.contact-link {
  color: #3182ce;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
}

.contact-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: currentColor;
  transition: width 0.3s ease;
}

.contact-link:hover {
  color: #2c5282;
}

.contact-link:hover::after {
  width: 100%;
}

.contact-map {
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transform: scale(0.95);
  opacity: 0;
  transition: all 0.6s ease;
}

[data-aos="zoom-in"].aos-animate .contact-map {
  transform: scale(1);
  opacity: 1;
}

.map-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
  border-radius: 12px;
  overflow: hidden;
}

@media (max-width: 991.98px) {
  .contact-container {
    grid-template-columns: 1fr;
  }
  
  .map-container {
    min-height: 350px;
  }
}

@media (max-width: 575.98px) {
  .section-title {
    font-size: 1.8rem;
  }
  
  .contact-item {
    padding: 1.25rem;
  }
}
</style>