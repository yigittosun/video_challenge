import './assets/main.css'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { initializeApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app' 

import App from './App.vue'
import router from './router'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const firebaseConfig = {
    apiKey: 'AIzaSyCl7FNiohbqZBos373K-2vCx25Jv3Lx8mM',
    authDomain: 'video-challenge-dde63.firebaseapp.com',
    projectId: 'video-challenge-dde63',
    storageBucket: 'video-challenge-dde63.appspot.com',
    messagingSenderId: '1016243725957',
    appId: '1:1016243725957:web:95597dbaafbc563669abec',
    measurementId: 'G-816VRW4DZ9'
}

const firebaseApp = initializeApp(firebaseConfig);

const app = createApp(App)

app.use(VueSweetalert2);
app.use(createPinia())
app.use(router)
app.provide<FirebaseApp>('firebaseApp', firebaseApp);

app.mount('#app')
