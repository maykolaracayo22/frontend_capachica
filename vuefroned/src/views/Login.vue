<template>
  <div class="login-container">
    <div class="background-overlay"></div>
    <div class="login-content" data-aos="fade-up">
      <div class="login-card">
        <div class="card-header">
          <div class="logo-container">
            <img src="@/assets/logoca2.png" alt="Logo" class="navbar-logo" />
            <h1>Capachica</h1>
          </div>
          <h2>Iniciar Sesión</h2>
          <p class="welcome-text">Bienvenido de vuelta a tu aventura</p>
        </div>
        
        <form @submit.prevent="onLogin" class="login-form">
          <div class="form-group">
            <label for="email">Correo electrónico</label>
            <div class="input-group">
              <i class="bi bi-envelope"></i>
              <input
                type="email"
                id="email"
                v-model="email"
                placeholder="tucorreo@ejemplo.com"
                :class="{ 'error-input': errorMessage }"
                required
              />
            </div>
          </div>
          
          <div class="form-group">
            <label for="password">Contraseña</label>
            <div class="input-group">
              <i class="bi bi-lock"></i>
              <input
                type="password"
                id="password"
                v-model="password"
                placeholder="••••••••"
                :class="{ 'error-input': errorMessage }"
                required
              />
              <i class="bi bi-eye toggle-password d-flex justify-content-end" @click="togglePasswordVisibility"></i>
            </div>
          </div>
          
          <div class="form-options">
            <div class="remember-me">
              <input type="checkbox" id="remember" v-model="rememberMe">
              <label for="remember">Recordarme</label>
            </div>
            <router-link to="/forgot-password" class="forgot-password">¿Olvidaste tu contraseña?</router-link>
          </div>
          
          <button type="submit" class="login-btn" :disabled="loading">
            <span v-if="!loading">Iniciar sesión</span>
            <div v-else class="spinner"></div>
          </button>
          
          <div v-if="errorMessage" class="error-message">
            <i class="bi bi-exclamation-circle"></i>
            <span>{{ errorMessage }}</span>
          </div>
        </form>
        
        <div class="divider">
          <span>o</span>
        </div>
        
        <div class="social-login">
          <button class="social-btn google">
            <i class="bi bi-google"></i>
            Continuar con Google
          </button>
          <button class="social-btn facebook">
            <i class="bi bi-facebook"></i>
            Continuar con Facebook
          </button>
        </div>
        
        <p class="register-link">
          ¿No tienes una cuenta? <router-link to="/register">Regístrate aquí</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/axios'
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      loading: false
    }
  },
  methods: {
    ...mapActions(['login']),
    async onLogin() {
      this.errorMessage = ''
      this.loading = true
      try {
        // Limpiar sesión previa
        localStorage.clear()
        delete api.defaults.headers.common['Authorization']

        await api.get('/sanctum/csrf-cookie', { withCredentials: true })

        const res = await api.post('/login', {
          email: this.email,
          password: this.password
        }, { withCredentials: true })
        await api.get('/sanctum/csrf-cookie', { withCredentials: true });
        const { user, token, roles, entrepreneur_id } = res.data

        // Guardar token y configuración global
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user_roles', JSON.stringify(roles))
        if (entrepreneur_id) localStorage.setItem('entrepreneur_id', entrepreneur_id)
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`

        this.login({ ...user, roles, entrepreneur_id })

        // Redirección
        if (roles.includes('emprendedor')) {
          this.$router.push({ name: 'EntrepreneurDashboard' })
        } else if (roles.includes('cliente')) {
          this.$router.push({ name: 'DashboardCliente' })
        } else {
          this.$router.push('/dashboard')
        }

      } catch (err) {
        if (err.response?.status === 422 || err.response?.status === 401) {
          this.errorMessage = 'Correo o contraseña incorrectos'
        } else {
          this.errorMessage = 'Error de conexión. Intenta nuevamente.'
        }
        console.error('Login error:', err)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('https://blog.redbus.pe/wp-content/uploads/2020/02/gal-sillustani-complejo-arqueologico1.jpg') no-repeat center center;
  background-size: cover;
  position: relative;
  padding: 4.5rem;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(189, 183, 183, 0.47);
  backdrop-filter: blur(3px);
  z-index: 0;
}

.login-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 480px;
}

.login-card {
  background: rgba(183, 181, 181, 0.327);
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
  margin-top: 0px;
}

.logo-container i {
  font-size: 2rem;
  color: #56ab2f;
}
.logo-container img {
  width: 70px;
  height: auto;
  font-size: 1rem;  /* Aumento del tamaño de la fuente */

}
.logo-container h1 {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 1.9rem;
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
  color: #252832;
  font-size: 0.95rem;
  margin: 0;
}

.login-form {
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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
  font-size: 0.9rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.remember-me input {
  accent-color: #56ab2f;
}

.forgot-password {
  color: #56ab2f;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.forgot-password:hover {
  color: #4299e1;
  text-decoration: underline;
}

.login-btn {
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

.login-btn:hover {
  background: linear-gradient(135deg, #429922 0%, #8ecf4f 100%);
  box-shadow: 0 4px 15px rgba(86, 171, 47, 0.3);
  transform: translateY(-2px);
}

.login-btn:disabled {
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
  color: #a0aec0;
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

.social-login {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.875rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background-color: white;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.social-btn:hover {
  background-color: #f8fafc;
  transform: translateY(-1px);
}

.social-btn i {
  font-size: 1.2rem;
}

.social-btn.google {
  color: #4a5568;
}

.social-btn.google:hover {
  border-color: #e53e3e;
}

.social-btn.facebook {
  color: #4a5568;
}

.social-btn.facebook:hover {
  border-color: #3182ce;
}

.register-link {
  text-align: center;
  font-size: 0.95rem;
  color: #000000;
}

.register-link a {
  color: #2d6812;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
}

.register-link a:hover {
  color: #4299e1;
  text-decoration: underline;
}

@media (max-width: 576px) {
  .login-container {
    padding: 1rem;
  }
  
  .login-card {
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