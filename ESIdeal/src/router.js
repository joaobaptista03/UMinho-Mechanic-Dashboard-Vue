import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue';
import ServicosAtribuidos from './components/ServicosAtribuidos.vue';
import ProfilePage from './components/ProfilePage.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: "home", component: Home },
        {
            path: '/servicosAtribuidos',
            name: 'servicosAtribuidos',
            component: ServicosAtribuidos,
            props: true
        },
        {
            path: '/profilePage',
            name: 'profilePage',
            component: ProfilePage,
            props: true
        }
    ]
});

export default router;