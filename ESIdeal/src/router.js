import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue';
import ServicosAtribuidos from './components/ServicosAtribuidos.vue';
import ProfilePage from './components/ProfilePage.vue';
import ObservacoesServicoPage from './components/ObservacoesServicoPage.vue';
import ServicoConcluido from './components/ServicoConcluido.vue';
import AdiarServico from './components/AdiarServico.vue';
import ServicoAdiado from './components/ServicoAdiado.vue';
import Servico from './components/Servico.vue'
import ComecarServico from './components/ComecarServico.vue'
import ServicoCancelado from './components/ServicoCancelado.vue'
import loggedHome from './components/loggedHome.vue'
import ServicoSuspendido from './components/ServicoSuspendido.vue'
import ConfirmarCancelamento from './components/ConfirmarCancelamento.vue'


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
        },
       {
            path: '/servico',
            name: 'servico',
            component: Servico,
            props: true
       },
       {    
            path: '/loggedHome',
            name: 'loggedHome',
            component: loggedHome,
            props: true
       },
        { path: '/servicosAtribuidos/observacoes', name: "observacoes", component: ObservacoesServicoPage},
        { path: '/servicosAtribuidos/servicoConcluido', name: "servicoConcluido", component: ServicoConcluido},
        { path: '/servicosAtribuidos/adiarServico', name: "adiarServico", component: AdiarServico},
        { path: '/servicosAtribuidos/servicoAdiado', name: "servicoAdiado", component: ServicoAdiado},
        { path: '/servicosAtribuidos/comecarServico', name: "comecarServico", component: ComecarServico},
        { path: '/servicosAtribuidos/servicoCancelado', name: "servicoCancelado", component: ServicoCancelado},
        { path: '/servicosAtribuidos/servicoSuspendido', name: "servicoSuspendido", component: ServicoSuspendido},
        { path: '/servicosAtribuidos/confirmarCancelamento', name: "confirmarCancelamento", component: ConfirmarCancelamento }
    ]
});

export default router;