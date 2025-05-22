<template>
  <div class="register-container">
    <div class="background-overlay"></div>
    <div class="register-content" data-aos="fade-up">
      <div class="register-card">
        <div class="card-header">
          <div class="logo-container">
            <i class="bi bi-compass"></i>
            <h1>Capachica</h1>
          </div>
          <h2>Crear Cuenta</h2>
          <p class="welcome-text">Únete a nuestra comunidad de viajeros</p>
        </div>
        <!-- Formulario actualizado -->
        <div class="register">
          <h2>Registrar nuevo usuario</h2>
          <form @submit.prevent="onRegister">
            <div class="form-group" v-for="field in formFields" :key="field.id">
              <label :for="field.id">{{ field.label }}</label>
              <div v-if="field.type === 'select'" class="select-wrapper">
                <i :class="field.icon"></i>
                <select :id="field.id" v-model="form[field.model]" :required="field.required">
                  <option v-for="opt in field.options" :key="opt.value" :value="opt.value">{{ opt.text }}</option>
                </select>
              </div>
              <div v-else class="input-group">
                <i :class="field.icon"></i>
                <input
                  :type="field.type"
                  :id="field.id"
                  v-model="form[field.model]"
                  :placeholder="field.placeholder"
                  :required="field.required"
                />
              </div>
            </div>
            <button type="submit" class="register-btn" :disabled="loading">
              <span v-if="!loading">Registrar</span>
              <div v-else class="spinner"></div>
            </button>
            <p v-if="errorMessage" class="error-message"><i class="bi bi-exclamation-circle"></i> {{ errorMessage }}</p>
          </form>
        </div>
        <div class="divider"><span>¿Ya tienes cuenta?</span></div>
        <router-link to="/login" class="login-link">Iniciar Sesión</router-link>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import api from '@/services/axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const errorMessage = ref('')

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  phone: '',
  document_id: '',
  birth_date: '',
  address: '',
  profile_image: '',
  location: '',
  role: 'cliente'
})

const formFields = [
  { id: 'name', label: 'Nombre Completo', model: 'name', type: 'text', placeholder: 'Ingrese su nombre completo', icon: 'bi bi-person', required: true },
  { id: 'email', label: 'Correo Electrónico', model: 'email', type: 'email', placeholder: 'tucorreo@ejemplo.com', icon: 'bi bi-envelope', required: true },
  { id: 'password', label: 'Contraseña', model: 'password', type: 'password', placeholder: '••••••••', icon: 'bi bi-lock', required: true },
  { id: 'password_confirmation', label: 'Confirmar Contraseña', model: 'password_confirmation', type: 'password', placeholder: '••••••••', icon: 'bi bi-lock', required: true },
  { id: 'phone', label: 'Teléfono', model: 'phone', type: 'tel', placeholder: '+51 987654321', icon: 'bi bi-telephone', required: false },
  { id: 'document_id', label: 'DNI / Documento', model: 'document_id', type: 'text', placeholder: '12345678', icon: 'bi bi-credit-card-2-front', required: false },
  { id: 'birth_date', label: 'Fecha de nacimiento', model: 'birth_date', type: 'date', placeholder: '', icon: 'bi bi-calendar-date', required: false },
  { id: 'address', label: 'Dirección', model: 'address', type: 'text', placeholder: 'Jr. Los Pinos 123, Puno', icon: 'bi bi-geo-alt', required: false },
  { id: 'profile_image', label: 'Foto de perfil (URL)', model: 'profile_image', type: 'url', placeholder: 'https://...', icon: 'bi bi-image', required: false },
  { id: 'location', label: 'Ubicación', model: 'location', type: 'text', placeholder: 'Ciudad, país (Ej. Puno, Perú)', icon: 'bi bi-geo', required: false },
  { id: 'role', label: 'Rol', model: 'role', type: 'select', icon: 'bi bi-person-badge', required: true,
    options: [
      { value: 'cliente', text: 'Cliente' },
      { value: 'emprendedor', text: 'Emprendedor' },
      { value: 'super-admin', text: 'Super Admin' }
    ]
  }
]

async function onRegister() {
  errorMessage.value = ''
  loading.value = true
  try {
    localStorage.clear()
    delete api.defaults.headers.common['Authorization']
    await api.get('/sanctum/csrf-cookie', { withCredentials: true })
    const res = await api.post('/register', { ...form }, { withCredentials: true })
    const { token, roles } = res.data
    localStorage.setItem('auth_token', token)
    localStorage.setItem('user_roles', JSON.stringify(roles))
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    if (roles.includes('cliente')) router.push({ name: 'DashboardCliente' })
    else if (roles.includes('emprendedor')) router.push({ name: 'EntrepreneurDashboard' })
    else router.push('/dashboard')
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Error al registrar el usuario'
    console.error('Register error:', error)
  } finally {
    loading.value = false
  }
}
</script>
  

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('https://www.astursperu.org/wp-content/uploads/2017/07/comunidad-ccotos-asturs-peru.jpg') no-repeat center center;
  background-size: cover;
  position: relative;
  padding: 5rem;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(212, 207, 207, 0.273);
  backdrop-filter: blur(3px);
  z-index: 0;
}

.register-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 500px;
}

.register-card {
  background: rgba(254, 254, 254, 0.388);
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.logo-container i {
  font-size: 2rem;
  color: #56ab2f;
}

.logo-container h1 {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 1.75rem;
  color: #2c3e50;
  margin: 0;
}

.card-header h2 {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.welcome-text {
  font-family: 'Poppins', sans-serif;
  color: #718096;
  font-size: 0.95rem;
  margin: 0;
}

.register-form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 0.9rem;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.input-group i {
  position: absolute;
  left: 1rem;
  color: #a0aec0;
  font-size: 1.1rem;
}

.input-group .toggle-password {
  position: absolute;
  right: 1rem;
  cursor: pointer;
  color: #a0aec0;
  transition: color 0.2s;
}

.input-group .toggle-password:hover {
  color: #718096;
}

.input-group input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.95rem;
  color: #2d3748;
  background-color: #f8fafc;
  transition: all 0.3s ease;
}

.input-group input:focus {
  outline: none;
  border-color: #56ab2f;
  box-shadow: 0 0 0 3px rgba(86, 171, 47, 0.1);
}

.error-input {
  border-color: #e53e3e !important;
}

.error-input:focus {
  box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1) !important;
}

.select-wrapper {
  position: relative;
}

.select-wrapper i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
  font-size: 1.1rem;
  z-index: 1;
}

.select-wrapper select {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.95rem;
  color: #2d3748;
  background-color: #f8fafc;
  appearance: none;
  transition: all 0.3s ease;
}

.select-wrapper select:focus {
  outline: none;
  border-color: #56ab2f;
  box-shadow: 0 0 0 3px rgba(86, 171, 47, 0.1);
}

.form-options {
  margin: 1rem 0;
  font-size: 0.9rem;
}

.terms {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.terms input {
  accent-color: #56ab2f;
}

.terms a {
  color: #56ab2f;
  text-decoration: none;
  font-weight: 500;
}

.terms a:hover {
  text-decoration: underline;
}

.register-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
}

.register-btn:hover {
  background: linear-gradient(135deg, #429922 0%, #8ecf4f 100%);
  box-shadow: 0 4px 15px rgba(86, 171, 47, 0.3);
  transform: translateY(-2px);
}

.register-btn:disabled {
  background: #a0aec0;
  transform: none;
  box-shadow: none;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #e53e3e;
  font-size: 0.9rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: rgba(229, 62, 62, 0.05);
  border-radius: 8px;
}

.error-message i {
  font-size: 1.1rem;
}

.divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: #050505;
  font-size: 0.9rem;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #e2e8f0;
}

.divider span {
  padding: 0 1rem;
}

.login-link {
  display: block;
  width: 100%;
  text-align: center;
  padding: 0.875rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background-color: white;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 0.95rem;
  color: #4a5568;
  text-decoration: none;
  transition: all 0.2s ease;
}

.login-link:hover {
  background-color: #f8fafc;
  border-color: #56ab2f;
  color: #56ab2f;
}

@media (max-width: 576px) {
  .register-container {
    padding: 1rem;
  }
  
  .register-card {
    padding: 1.75rem;
  }
  
  .logo-container h1 {
    font-size: 1.5rem;
  }
  
  .card-header h2 {
    font-size: 1.3rem;
  }
}
</style>