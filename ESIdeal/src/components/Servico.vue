<template>
    <header>
        <p class="title"><a @click="this.$router.push({name: 'home'})">E.S.Ideal"</a></p>
        <div class="navbar">
            <p><a @click="this.$router.push({ name: 'servicosAtribuidos' })" class="navlink">Serviços Atribuídos</a></p>
            <div class="profile-container">
                <img src="../assets/profilepic.png" id="nav-img" @click="this.showUserProfileOverlay = !this.showUserProfileOverlay" />
            </div>
        </div>
    </header>
    
    <UserProfileOverlay :show="showUserProfileOverlay" @close="toggleOverlay"></UserProfileOverlay>
    
    <div class="servicoWrapper">
        <div class="title">
                <h2>Serviço: <span id="servico-id">{{servico.id}}</span></h2>
        </div>
        <div class="servico">
            
            <div class="parte1">
                <p><b>Nome do Cliente: </b>{{this.client.nome}}</p>
                <p><b>Matrícula: </b>{{servico.vehicleId}}</p>
            </div>
            <div class="parte2">
                <p><b>Contacto: </b>{{this.client.telefone}}</p>
                <p><b>Serviço: </b>{{}}</p>
            </div>
            <div class="parte3">
                <p><b>Estado: </b>{{servico.estado}}</p>
                <p><b>Agendamento: </b>{{servico.agendamento}}</p>
                <div class="datahora" v-if="servico.data.ano != 9999" >
                    <div class="data">
                        <p class="dia"><b>{{servico.data.dia}}</b></p>
                        <p>{{nomeMes(servico.data.mes)}}</p>
                    </div>
                    <div class="hora">
                        <img src="../assets/clock.png" alt="relogio">
                        <p> {{servico.data.hora}}:{{servico.data.minutos}} </p>
                    </div>
                </div>
                <p><b>Descrição: </b>{{servico.descricao}}</p>
                <p><b>Observações: </b>{{servico.observacoes}}</p>
            </div>
        </div>
    </div>

</template>

<script>
import UserProfileOverlay from './UserProfileOverlay.vue';
import { useUserStore } from '../stores';
import { useServicoStore } from '../stores';

export default {
    components: {
        UserProfileOverlay
    },
    name: 'ServicosAtribuidos',
    data() {
        return {
            servico: null,
            servico_definicao: null,
            username: null,
            showUserProfileOverlay: false,
            vehicle: null,
            client: null
        }
    },
    async created() {
        const userStore = useUserStore();
        this.username = userStore.getUser();
        if (!this.username) this.$router.push({ name: 'home' });

        console.log(this.username)

        const servicoStore = useServicoStore();
        this.servico = servicoStore.getServico();
        
        const response = await fetch('http://localhost:3000/workers?nome_utilizador=' + this.username);
        if (!response.ok) throw new Error('Failed to fetch');
        const servicos = (await response.json())[0].servicos_atribuidos;
        const servicosAtribuidosTemp = [];

        const response2 = await fetch('http://localhost:3000/vehicles?id=' + this.servico.vehicleId);
        if (!response2.ok) throw new Error('Failed to fetch');
        this.vehicle = (await response2.json())[0];
        console.log(this.vehicle);

        const response3 = await fetch('http://localhost:3000/clients?id=' + this.vehicle.clientId);
        if (!response3.ok) throw new Error('Failed to fetch');
        this.client = (await response3.json())[0];
        console.log(this.client);

    },
    watch: {
    },
    methods: {
        toggleOverlay() {
            this.showUserProfileOverlay = !this.showUserProfileOverlay;
        }
    }
};
</script>

<style scoped>

.servicoWrapper{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'open sans', sans-serif;
}

.title{
    display: flex;
    justify-content: center;
}

.title a {
    cursor: pointer; 
}

.title h2 {
    font-family: 'Open Sans', sans-serif;
    font-size: 35px;
    margin: 35px 0px;
}

#servico-id {
    color: #FF9D73;
}

.servicosAtribuidos {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'open sans', sans-serif;
}

.servico {
    display: flex;
    flex-direction: column;    
    background-color: #EDEDED;
    border-radius: 30px;
    margin-bottom: 2%;
    width: 70%;
}

.servico p{
    cursor:default;
}

.parte1{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 1%;
    width: 100%;
}

.processo{
    background-color: #FF7F48;
    border-radius: 10px;
    width: fit-content;
    height: fit-content;
}

.processo p{
    margin: 6px 50px;
}

.parte2{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 1%;
    width: 100%;
}

.parte3 {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.datahora{
    display: flex;
    width: 30%;
    justify-content: space-between;
    align-items: start;
    height: 60%;
}

.data{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #FF7F48;
    border-radius: 5px;
    padding: 5px 13.7px;
}

.data p{
    margin: 0;
}

.dia{
    font-size: 20px;
}

.hora{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #FF7F48;
    border-radius: 5px;
    padding: 6.5px 7.8px;
}

.hora p{
    margin: 0;
}

.hora img{
    width: 20px;
    height: 20px;
}

.espera{
    display: flex;
    width: 30%;
    justify-content: end;
    align-items: start;
    height: 60%;
}

.emespera{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #FF7F48;
    border-radius: 5px;
    padding: 6.5px 2.3px;
}

.emespera p{
    margin: 0;
}

.emespera img{
    width: 20px;
    height: 20px;
}

.descricao{
    margin: 2% 0px;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
}

.pagination span {
    font-size: 17px;
}

.pagination button {
    background-color: #ffffff;
    border: none;
    border-radius: 10px;
    padding: 10px 20px;
    cursor: pointer;
    outline: none;
    transition: background-color 0.3s;
}

/*-------------------- Botão para ordenar, ainda tem de ser melhorado ----------------------------------------*/ 
.ordenar {
    position: relative;
    margin: 20px 0;
}

.expand-button {
    background-color: #FF7F48;
    color: rgb(0, 0, 0);
    border: none;
    border-radius: 20px;
    padding: 10px 20px;
    cursor: pointer;
    outline: none;
    transition: background-color 0.3s;
    font-size: 17px;
}


.expand-button:hover {
    background-color: #e76e3c; 
}


.options {
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 10;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    overflow: hidden;
    transition: all 0.3s ease;
}

.options.show {
    display: flex;
}

.option-button {
    padding: 10px 20px;
    border: none;
    background: none;
    text-align: left;
    width: 100%;
    cursor: pointer;
    transition: background-color 0.3s;
}

.option-button:hover {
    background-color: #f2f2f2;
}

</style>