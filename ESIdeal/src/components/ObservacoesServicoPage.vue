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
        <div class="box-observacoes">
            <span style="margin-bottom: 10px;">Observações para serviços futuros</span>
            <span style="margin-bottom: 47px; font-weight: lighter;">(Opcional)</span>

            <textarea type="text" v-model="textAreaValue" class="text-box">Enter text here</textarea>

            <div>
                <button class="button-voltar">Voltar</button>
                <button class="button-concluir">Concluir Serviço</button>
            </div>
        </div>
    </div>
    

</template>

<script>
import UserProfileOverlay from './UserProfileOverlay.vue';
import { useUserStore } from '../stores';

export default {
    data() {
        return {
            textAreaValue: ''
        };
    },
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
        if (!this.username) {
            console.log("User não logado! Redirecionando para a página de login...")
            this.$router.push({ name: 'home' });
        }

        // Vai buscar o funcionário
        const response1 = await fetch('http://localhost:3000/workers?nome_utilizador=' + this.username);
        if (!response1.ok) throw new Error('Failed to fetch');
        this.worker = (await response1.json())[0];

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

<style scoped>

.box-observacoes{
    display: flex;
    flex-direction: column;
    background-color: #EDEDED;
    border-radius: 30px;
    margin-bottom: 2%;
    width: 80%;
    padding-top: 47px;
    padding-bottom: 21px;
    font-size: 50px;
    justify-content: center;
    align-items: center;
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

.text-box{
    border-radius: 50px;
    width: 1166px;
    height: 339px;
    border: 2px solid black;
    text-align: center;
    line-height: 40px;
    font-size: 35px;
    font-weight: lighter;
    resize: none;
}

</style>