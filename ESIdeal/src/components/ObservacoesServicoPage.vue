<template>
    <header>
        <p>E.S.Ideal</p>
        <div class="navbar">
            <p><a @click="this.$router.push({ name: 'servicosAtribuidos' })" class="navlink">Serviços Atribuídos</a></p>
            <div class="profile-container">
                <img src="../assets/profilepic.png" id="nav-img" @click="this.showUserProfileOverlay = !this.showUserProfileOverlay" />
            </div>
        </div>
    </header>
    
    <UserProfileOverlay :show="showUserProfileOverlay" ></UserProfileOverlay>

    <div>
        
    </div>

</template>

<script>
import UserProfileOverlay from './UserProfileOverlay.vue';
import { useUserStore } from '../stores';

export default {
    components: {
        UserProfileOverlay
    },
    props: ['id'],
    name: 'ObservacoesServicoPage',
    data() {
        return {
            servico: null,
            showUserProfileOverlay: false
        }
    },
    async mounted() {

        // Verifica se o user está autenticado
        const userStore = useUserStore();
        this.username = userStore.getUser();
        if (!this.username) this.$router.push({ name: 'home' });

        // Vai buscar o funcionário
        const response1 = await fetch('http://localhost:3000/workers?nome_utilizador=' + this.username);
        if (!response1.ok) throw new Error('Failed to fetch');
        this.worker = (await response.json())[0];

        // Verifica se o funcionário tem aquele serviço atribuído
        if (!this.worker.servicos_atribuidos.includes(element)) {
            this.$router.push({ name: 'home' });
        }

        // Vai buscar a informação do serviço
        const response2 = await fetch('http://localhost:3000/services?id=' + this.id);
        if (!response2.ok) throw new Error('Failed to fetch');
        this.servico = (await response2.json())[0];
        
    },
    methods: {
        
    }
};
</script>