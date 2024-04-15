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

    <div class="servicosAtribuidos">
        <h1>Serviços Atribuídos</h1>
        <div v-for="servico in servicosAtribuidos" :key="servico.id">
            <div class="containerservico">
                    <h2>{{ servico.id }}</h2>
                    <p>{{ servico.vehicleId }}</p>
                    <p>{{ servico.descrição }}</p>
                    <p>{{ servico.agendamento }}</p>
                    <p v-if="servico.agendamento === 'programado'">{{ servico.data }}</p>
            </div>
        </div>
    </div>


</template>

<script>
import UserProfileOverlay from './UserProfileOverlay.vue';

export default {
    components: {
        UserProfileOverlay
    },
    name: 'ServicosAtribuidos',
    data() {
        return {
            username: localStorage.getItem('username'),
            servicosAtribuidos: [],
            showUserProfileOverlay: false
        }
    },
    async mounted() {
        const response = await fetch('http://localhost:3000/workers?nome_utilizador=' + this.username);
        if (!response.ok) throw new Error('Failed to fetch');
        const servicos = (await response.json())[0].servicos_atribuidos;

        for (let i = 0; i < servicos.length; i++) {
            const response = await fetch('http://localhost:3000/services?id=' + servicos[i]);
            if (!response.ok) throw new Error('Failed to fetch');
            const servico = (await response.json())[0];
            this.servicosAtribuidos.push(servico);
        }
    }
};
</script>

<style scoped>

.servicosAtribuidos {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}



</style>