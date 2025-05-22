<template>
  <div class="testimonial-form-section py-5">
    <div class="container">
      <h2 class="section-title text-center mb-5">Déjanos tu testimonio</h2>
      <form @submit.prevent="submitTestimonial" class="testimonial-form">
        <div class="form-group">
          <label class="form-label">Nombre</label>
          <div class="input-wrapper">
            <i class="bi bi-person-fill input-icon"></i>
            <input 
              v-model="form.name" 
              type="text" 
              class="form-control" 
              placeholder="Tu nombre completo" 
              required 
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Calificación</label>
          <div class="rating-stars">
            <i
              v-for="star in 5"
              :key="star"
              @click="form.rating = star"
              @mouseover="hoverRating = star"
              @mouseleave="hoverRating = null"
              class="bi"
              :class="[
                star <= (hoverRating || form.rating) ? 'bi-star-fill' : 'bi-star',
                star <= (hoverRating || form.rating) ? 'text-warning' : 'text-muted'
              ]"
            ></i>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Testimonio</label>
          <div class="input-wrapper">
            <i class="bi bi-chat-left-text-fill input-icon"></i>
            <textarea
              v-model="form.comment"
              rows="5"
              class="form-control"
              placeholder="Comparte tu experiencia con nosotros..."
              required
            ></textarea>
          </div>
        </div>

        <button class="submit-button" :disabled="isSubmitting">
          <span v-if="!isSubmitting">
            <i class="bi bi-send-fill me-2"></i> Enviar Testimonio
          </span>
          <span v-else>
            <i class="bi bi-arrow-repeat me-2"></i> Enviando...
          </span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/services/axios'

const form = ref({
  name: '',
  rating: 5,
  comment: ''
})
const hoverRating = ref(null)
const isSubmitting = ref(false)

const submitTestimonial = async () => {
  if (!form.value.name || !form.value.comment) return

  isSubmitting.value = true
  try {
    await api.post('/testimonios', {
      nombre: form.value.name,
      estrellas: form.value.rating,
      comentario: form.value.comment
    })
    alert('¡Gracias por tu testimonio!')
    form.value = { name: '', rating: 5, comment: '' }
  } catch (e) {
    console.error('Error al enviar testimonio:', e)
    alert('Ocurrió un error al enviar tu testimonio.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.testimonial-form-section {
  padding: 6rem 0;
  position: relative;
  overflow: hidden;
  width: 100%;
  background-image: url('https://wallpapers.com/images/hd/blank-white-vertical-grains-mcf32g28ary3jdej.jpg'); /* reemplaza con tu URL */

}

.section-title {
  font-family: 'Georgia', serif;
  font-size: 2rem;
  color: #2c3e50;
  font-weight: 700;
  position: relative;
  padding-bottom: 0.5rem;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #fca311, #e85b04);
  border-radius: 2px;
}

.testimonial-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.testimonial-form:hover {
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-family: 'Georgia', serif;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #718096;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.form-control {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-family: 'Georgia', serif;
  transition: all 0.3s ease;
  background-color: #f8fafc;
}

.form-control:focus {
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.2);
  background-color: white;
}

.form-control:focus + .input-icon {
  color: #3182ce;
  transform: translateY(-50%) scale(1.1);
}

textarea.form-control {
  min-height: 150px;
  resize: vertical;
}

.rating-stars {
  font-size: 1.8rem;
  letter-spacing: 0.5rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
}

.rating-stars i {
  transition: all 0.2s ease;
  margin: 0 0.15rem;
}

.rating-stars i:hover {
  transform: scale(1.3);
}

.text-warning {
  color: #f59e0b;
  text-shadow: 0 2px 5px rgba(245, 158, 11, 0.3);
}

.text-muted {
  color: #e2e8f0;
}

.submit-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.85rem 1.5rem;
  background: linear-gradient(to right, #3182ce, #4f93e6);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-family: 'Georgia', serif;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.submit-button:hover:not(:disabled) {
  background: linear-gradient(to right, #2c5282, #3a7bd5);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.submit-button:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.submit-button i {
  transition: all 0.3s ease;
}

.submit-button:not(:disabled):hover i {
  transform: translateX(3px);
}

.bi-arrow-repeat {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 767.98px) {
  .section-title {
    font-size: 1.75rem;
  }
  
  .testimonial-form {
    padding: 1.5rem;
  }
  
  .rating-stars {
    font-size: 1.5rem;
    letter-spacing: 0.3rem;
  }
}

@media (max-width: 575.98px) {
  .section-title {
    font-size: 1.6rem;
  }
  
  .form-control {
    padding: 0.7rem 0.9rem 0.7rem 2.3rem;
  }
  
  .input-icon {
    font-size: 1.1rem;
  }
}
</style>