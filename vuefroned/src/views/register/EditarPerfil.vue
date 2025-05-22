<template>
    <div class="container py-5">
      <h2 class="mb-4">✏️ Editar Perfil</h2>
  
      <form @submit.prevent="onSubmit" class="card shadow p-4">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Nombre</label>
            <input type="text" class="form-control" v-model="form.name" required />
          </div>
  
          <div class="col-md-6">
            <label class="form-label">Correo</label>
            <input type="email" class="form-control" v-model="form.email" disabled />
          </div>
  
          <div class="col-md-6">
            <label class="form-label">Teléfono</label>
            <input type="text" class="form-control" v-model="form.phone" />
          </div>
  
          <div class="col-md-6">
            <label class="form-label">Documento</label>
            <input type="text" class="form-control" v-model="form.document_id" />
          </div>
  
          <div class="col-md-6">
            <label class="form-label">Dirección</label>
            <input type="text" class="form-control" v-model="form.address" />
          </div>
  
          <div class="col-md-6">
            <label class="form-label">Ubicación</label>
            <input type="text" class="form-control" v-model="form.location" />
          </div>
  
          <div class="col-md-6">
            <label class="form-label">Fecha de nacimiento</label>
            <input type="date" class="form-control" v-model="form.birth_date" />
          </div>
  
          <div class="col-md-6">
            <label class="form-label">Imagen de perfil (URL)</label>
            <input type="url" class="form-control" v-model="form.profile_image" />
          </div>
        </div>
  
        <div class="mt-4 text-end">
          <button type="submit" class="btn btn-primary">
            <i class="bi bi-save me-1"></i> Guardar cambios
          </button>
        </div>
      </form>
  
      <div v-if="message" class="alert alert-success mt-3">
        {{ message }}
      </div>
    </div>
  </template>
  
  <script>
  import api from '@/services/axios'
  
  export default {
    name: 'EditarPerfil',
    data() {
      return {
        form: {
          name: '',
          email: '',
          phone: '',
          document_id: '',
          birth_date: '',
          address: '',
          profile_image: '',
          location: ''
        },
        message: ''
      }
    },
    methods: {
      async fetchUser() {
        try {
          const { data } = await api.get('/me')
          this.form = { ...this.form, ...data }
        } catch (error) {
          console.error('Error al cargar perfil:', error)
        }
      },
      async onSubmit() {
        try {
          await api.put('/me/update', this.form)
          this.message = 'Perfil actualizado correctamente'
        } catch (err) {
          console.error('Error al actualizar:', err)
          this.message = 'Ocurrió un error al actualizar el perfil.'
        }
      }
    },
    mounted() {
      this.fetchUser()
    }
  }
  </script>
  
  <style scoped>
  .container {
    max-width: 800px;
  }
  </style>
  