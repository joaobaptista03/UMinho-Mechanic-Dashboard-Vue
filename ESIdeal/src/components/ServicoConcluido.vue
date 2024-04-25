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

    <div class="container">
        <div class="titulo">
            <div class="titulo"><p style="font-size: 45px;">Serviço:</p><p style="color:#FF9D73; font-size: 45px; margin-left: 8px;">{{ this.id }}</p></div>
        </div>
        <div class="box">
            <span style="margin-bottom: 10px;">Serviço Concluído</span>
            <button class="button-voltar" @click="changeToServicePage">Voltar a Serviços</button>
        </div>
    </div>

</template>

<script>
import UserProfileOverlay from './UserProfileOverlay.vue';
import { useUserStore, useServicoStore } from '../stores';

export default {
    components: {
        UserProfileOverlay
    },
    name: 'ServicoConcluido',
    data() {
        return {
            id: null,
            worker: null,
            servico: null,
            showUserProfileOverlay: false
        }
    },
    async mounted() {

        // Verifica se o user está autenticado
        const userStore = useUserStore();
        this.username = userStore.getUser();
        if (!this.username) {
            console.log("User não logado! Redirecionando para a página de login...")
            this.$router.push({ name: 'home' });
        }

        // Vai buscar o funcionário
        fetch('http://localhost:3000/workers?nome_utilizador=' + this.username)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to fetch');
            }
        })
        .then((data) => {
            this.worker = data[0];

            const servicoStore = useServicoStore();
            this.servico = servicoStore.getServico();
            this.id = this.servico.id;
        })
        .catch(error => console.log(error));
    },
    methods: {
        changeToServicePage() {
            this.$router.push({ name: 'servicosAtribuidos'})
        }
    }
};
</script>

<style scoped>

.box{
    display: flex;
    flex-direction: column;
    background-color: #EDEDED;
    border-radius: 50px;
    margin-bottom: 2%;
    width: 40%;
    padding-top: 47px;
    padding-bottom: 21px;
    font-size: 50px;
    justify-content: center;
    align-items: center;
    margin-top: 165px;
}

.container{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'open sans', sans-serif;
}

.titulo{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.button-voltar{
    width: 219px;
    height: 88px;
    border-radius: 50px;
    border: none;
    background-color: rgba(255, 127, 72, 0.8);
    color: white;
    font-size: 20px;
    margin-top: 75px;
    transition: all 0.05s ease;
}

.button-voltar:hover{
  transform: scale(0.98); 
  box-shadow: inset -4px 4px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}

</style>