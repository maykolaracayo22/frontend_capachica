<template>
  <section class="testimonios-section">
    <div class="container">
      <h2 class="section-title"><i class="bi bi-chat-quote"></i> Testimonios</h2>
      <div v-if="!testimonios.length" class="text-center text-muted">No hay testimonios aún.</div>
      <div class="row">
        <div
          v-for="t in testimonios"
          :key="t.id"
          class="col-md-6 col-lg-4 mb-4"
        >
          <div class="testimonial-card d-flex">
            <div class="avatar me-3">
              <i class="bi bi-person-circle"></i>
            </div>
            <div class="content">
              <small class="text-muted d-block mb-1">{{ t.fecha }}</small>
              <div class="stars mb-1">
                <i
                  v-for="n in 5"
                  :key="n"
                  :class="n <= t.estrellas
                    ? 'bi-star-fill text-warning'
                    : 'bi-star text-muted'"
                ></i>
              </div>
              <p class="comentario mb-1">{{ t.comentario }}</p>
              <p></p>
              <footer class="blockquote-footer">{{ t.nombre }}</footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/axios'

const testimonios = ref([])

async function fetchTestimonials() {
  try {
    const { data } = await api.get('/testimonios')
    testimonios.value = data
  } catch (e) {
    console.error('Error al cargar testimonios:', e)
  }
}

onMounted(fetchTestimonials)
</script>

<style scoped>
.testimonios-section {
  padding: 4rem 0;
  background-color: #dddee0a0;
}

.section-title {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  color: #212529;
}

.testimonial-card {
  background: #fff;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: flex-start;
  transition: transform 0.2s ease-in-out;
}

.testimonial-card:hover {
  transform: translateY(-6px);
}

.avatar {
  font-size: 3rem;
  color: #6c757d;
  flex-shrink: 0;
}

.content {
  flex-grow: 1;
}

.stars i {
  font-size: 1.1rem;
}

.comentario {
  font-size: 0.95rem;
  color: #333;
  margin-bottom: 1rem; /* Aumentamos el espaciado */
  line-height: 1.6;     /* Más espacio entre líneas dentro del comentario */
}

.nombre {
  font-weight: 600;     /* Que destaque un poco más */
  font-size: 0.9rem;
  color: #666;
}


</style>
