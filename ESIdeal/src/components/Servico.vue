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
            <div class="container-buttons">
                <button class="button-voltar" @click="this.$router.push({ name: 'servicosAtribuidos' })">Voltar</button>
                <div class="button-divider">
                    <button class="button-adiar" @click="adiarServico">Adiar Serviço</button>
                    <button class="button-concluir" @click="concluirServico">Concluir Serviço</button>
                </div>
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
        },
        nomeMes(mes) {
            const data = new Date(2024, mes - 1); 
            let mesExtenso = data.toLocaleString('pt-PT', { month: 'long' });
            return mesExtenso.charAt(0).toUpperCase() + mesExtenso.slice(1, 3).toLowerCase();
        },
        adiarServico() {
            this.$router.push({ name: 'adiarServico' })
        },
        concluirServico() {
            this.$router.push({ name: 'observacoes' })
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


.button-voltar{
    width: 140px;
    height: 50px;
    border-radius: 50px;
    border: none;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    font-size: 20px;
    margin-left: 65px;
    transition: all 0.5s ease;
}

.button-voltar:hover{
  transform: scale(0.98); /* Scale up when hovered */
  box-shadow: inset -4px 4px 8px rgba(0, 0, 0, 0.55);
  cursor: pointer;
}

.button-adiar{
    width: 180px;
    height: 50px;
    border-radius: 50px;
    border: none;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    font-size: 20px;
    margin-right: 5%;
    transition: all 0.5s ease;
}

.button-adiar:hover{
  transform: scale(0.98); /* Scale up when hovered */
  box-shadow: inset -4px 4px 8px rgba(0, 0, 0, 0.55);
  cursor: pointer;
}

.button-concluir{
    width: 180px;
    height: 50px;
    border-radius: 50px;
    border: none;
    background-color: rgba(255, 127, 72, 0.8);
    color: white;
    font-size: 20px;
    margin-right: 65px;
    transition: all 0.05s ease;
    padding:0.5%;
}

.button-concluir:hover{
  transform: scale(0.98); 
  box-shadow: inset -4px 4px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}

.container-buttons{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding-bottom: 2%;
    padding-top: 3%;
}

.button-divider{
    display: flex;
    flex-direction: row;
    align-items: center;
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


</style>