<template>
  <div class="d-flex justify-content-center">
    <div class="tour-form-container col-12 col-md-8 col-lg-6">
      <router-link
        to="/admin/dashboard-empreneur"
        class="btn btn-outline-secondary rounded-pill mb-3 d-inline-flex align-items-center"
      >
        <i class="bi bi-arrow-left me-2"></i>
        Volver
      </router-link>

      <div class="card shadow-lg border-0">
        <div class="card-header bg-gradient-primary text-white p-4">
          <h3 class="h4 mb-0">
            <i class="bi bi-people me-2"></i>
            {{ association.id ? 'Editar Asociación' : 'Nueva Asociación Turística' }}
          </h3>
          <p class="mb-0 small mt-1 opacity-85">Gestión de grupos asociados</p>
        </div>

        <div class="card-body p-4">
          <div v-if="successMessage" class="alert alert-success mb-3" role="alert">
            {{ successMessage }}
          </div>
          <form @submit.prevent="submitForm" class="needs-validation" novalidate>
            <div class="mb-3">
              <label for="name" class="form-label text-primary">Nombre de la Asociación</label>
              <input
                v-model="form.name"
                type="text"
                class="form-control form-control-lg"
                placeholder="Ej: Asociación de Guías Turísticos del Cusco"
                required
              >
              <div class="invalid-feedback">Por favor ingrese un nombre</div>
            </div>

            <div class="mb-3">
              <label for="region" class="form-label text-primary">Región</label>
              <input
                v-model="form.region"
                type="text"
                class="form-control"
                placeholder="Ej: Cusco, Arequipa, Puno"
              >
            </div>

            <div class="mb-4">
              <label for="description" class="form-label text-primary">Descripción</label>
              <textarea
                v-model="form.description"
                class="form-control"
                rows="4"
                placeholder="Describa los servicios y actividades principales..."
              ></textarea>
            </div>

            <button
              type="submit"
              class="btn btn-primary w-100 btn-gradient-tourism"
            >
              <i class="bi bi-save me-2"></i>
              {{ association.id ? 'Actualizar Asociación' : 'Registrar Asociación' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/axios';

export default {
  props: { association: { type: Object, default: () => ({}) } },
  data() {
    return {
      form: { ...this.association },
      successMessage: '', // Variable para el mensaje de éxito
    };
  },
  methods: {
    async submitForm() {
      try {
        if (this.association.id) {
          await api.put(`/associations/${this.association.id}`, this.form);
          this.successMessage = 'Asociación actualizada exitosamente.';
        } else {
          await api.post('/associations', this.form);
          this.successMessage = 'Asociación registrada exitosamente.';
          // Opcional: Resetear el formulario después de la creación
          this.form = {};
        }
        // Opcional: Desaparecer el mensaje después de unos segundos
        setTimeout(() => {
          this.successMessage = '';
          this.$emit('saved'); // Emitir el evento 'saved' después de mostrar el mensaje
        }, 3000);
      } catch (error) {
        console.error('Error al guardar la asociación:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    },
  },
};
</script>

<style scoped>
.d-flex.justify-content-center {
  padding: 2rem 0;
  min-height: 100vh;
  align-items: center;
}

.tour-form-container {
  max-width: 800px;
  width: 90%;
  margin: 0 auto;
}

.card {
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 2rem;
}

.card-header {
  background: linear-gradient(135deg, #2c5282, #3182ce);
  border-radius: 15px 15px 0 0 !important;
  padding: 1.5rem 2rem;
}

.card-header h3 {
  margin-bottom: 0.5rem;
}

.card-header p {
  margin-top: 0.25rem;
  font-size: 0.9rem;
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #2c5282, #3182ce);
}

.card-body {
  padding: 2rem;
}

.mb-3 {
  margin-bottom: 1.5rem !important;
}

.mb-4 {
  margin-bottom: 2rem !important;
}

.form-label {
  font-weight: 500;
  color: #2c5282;
  margin-bottom: 0.5rem;
  display: block;
}

.form-control {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  padding: 1rem 1.25rem;
  transition: border-color 0.3s ease;
  font-size: 1rem;
}

.form-control:focus {
  border-color: #3182ce;
  box-shadow: 0 0 0 0.2rem rgba(49, 130, 206, 0.25);
}

textarea.form-control {
  min-height: 100px;
}

.btn-gradient-tourism {
  background: linear-gradient(135deg, #2c5282, #3182ce);
  border: none;
  padding: 1rem 2rem;
  font-weight: 500;
  transition: all 0.3s ease;
  border-radius: 8px;
  font-size: 1.1rem;
}

.btn-gradient-tourism:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(44, 82, 130, 0.3);
}

.invalid-feedback {
  font-size: 0.875em;
  margin-top: 0.25rem;
}

/* Estilos para el botón de regreso */
.btn-outline-secondary.rounded-pill {
  border-radius: 25px; /* Hace el botón más redondeado */
  border-color: #6c757d; /* Color de borde estándar de botón secundario */
  color: #6c757d; /* Color de texto estándar de botón secundario */
}

.btn-outline-secondary.rounded-pill:hover {
  background-color: #6c757d;
  color: white;
}

/* Estilos para el mensaje de éxito */
.alert-success {
  background-color: #d4edda;
  border-color: #c3e6cb;
  color: #155724;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border-radius: 0.25rem;
}
</style>