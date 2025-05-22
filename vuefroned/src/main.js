import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'; // Importa el store
import 'leaflet/dist/leaflet.css'

// Importa Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'
// Importar Bootstrap JS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'

createApp(App)
.use(store)
.use(router)
.mount('#app');
