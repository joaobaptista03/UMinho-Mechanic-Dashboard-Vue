<template>
    <header>
        <p class="title"><a @click="this.$router.push({name: 'loggedHome'})">E.S.Ideal</a></p>
        <div class="navbar">
            <p><a @click="this.$router.push({ name: 'servicosAtribuidos' })" class="navlink">Serviços Atribuídos</a></p>
            <div class="profile-container">
                <img src="../assets/profilepic.png" id="nav-img" @click="this.showUserProfileOverlay = !this.showUserProfileOverlay" />
            </div>
        </div>
    </header>
    
    <UserProfileOverlay :show="showUserProfileOverlay" @close="toggleOverlay"></UserProfileOverlay>
    <div class="title">
        <h2>Serviço: <span id="servico-id">{{servico.definition.descr}}</span></h2>
    </div>
    <div class="utilizador_veiculo_wrapper">
            <div class="utilizador">
                <img src="../assets/client.png" id="client-img" />
                <p><b>{{this.client.nome}}</b></p>
                <p>{{this.client.telefone}}</p>
                <p>{{this.client.email}}</p>
            </div>
            <div class="vhc_wrapper">
                <div class="vhc_title">
                    <h2>Veículo <b><span style="color: #FF9D73">{{servico.vehicleId}}</span></b></h2>
                </div>
                <div class="veiculo">
                    <div class="vhc_part1">
                        <p><b>Marca: </b>{{this.vehicle.marca}}</p>
                        <p><b>Modelo: </b>{{this.vehicle.modelo}}</p>
                        <p><b>Combustível: </b>{{ this.vehicle['vehicle-typeId'] }}</p>
                    </div>
                    <div class="vhc_part2">
                        <p><b>Cilindrada: </b>{{this.vehicle.cilindrada}}</p>
                        <p><b>Potência: </b>{{this.vehicle.potencia}}</p>
                        <p><b>Kilometragem: </b>{{this.vehicle.kms}}</p>
                    </div>
                </div>
            </div>
    </div>
    <div class="servicoWrapper">
        
        <div class="servico">
            <div class="parte1">
                <p><b>Estado: </b>{{ formatEstado(servico.estado) }}</p>
                <p><b>Agendamento: </b>{{ formatAgendamento(servico.agendamento)}}</p>
                <div v-if="servico.data.ano != 9999" >
                        <p><b>Data de início: </b>{{servico.data.dia}}/{{servico.data.mes}}/{{servico.data.ano}}    {{servico.data.hora}}:{{servico.data.minutos === 0 ? '00' : servico.data.minutos}}</p></div>
                        <p><b>Tempo estimado: </b>{{servico.definition.duracao === 0 ? '00' : servico.definition.duracao}} minutos</p>
                        <p><b>Data estimada de fim: </b>{{ calculateEstimatedEndDate(servico.data, servico.definition.duracao) }}</p>
                <p><b>Descrição: </b>{{servico.descricao}}</p>
                <p><b>Observações: </b>{{servico.observacoes}}</p>
            </div>
            <div class="container-buttons">
                <button class="button-voltar" @click="this.$router.push({ name: 'servicosAtribuidos' })">Voltar</button>
                <div class="button-divider">
                    <button class="button-cancelar" @click="cancelarServico">Cancelar Servico</button>
                    <button class="button-adiar" @click="adiarServico">Adiar Serviço</button>
                    <button v-if="servico.estado === 'porRealizar' || servico.estado === 'parado'" class="button-concluir" @click="comecarServico"> {{ servico.estado === 'porRealizar' ? 'Começar Serviço' : 'Retomar Serviço' }} </button>    
                    <button v-if="servico.estado === 'emExecucao'" class="button-suspender" @click="suspenderServico">Suspender Serviço</button>                
                    <button v-if="servico.estado === 'emExecucao'" class="button-concluir" @click="concluirServico">Concluir Serviço</button>
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

    },
    methods: {
        formatEstado(estado) {
            if (estado === 'porRealizar') {
                return 'Por Realizar';
            } else if (estado === 'parado') {
                return 'Suspenso';
            } else if (estado === 'realizado') {
                return 'Realizado';
            } else if (estado === 'emExecucao') {
                return 'Em Execução';
            } else {
                return estado;
            }
        },
        formatAgendamento(agendamento) {
            if (agendamento === 'filaDeEspera') {
                return 'Fila de Espera';
            } else if (agendamento === 'programado') {
                return 'Programado';
            } else {
                return agendamento;
            }
        },
        toggleOverlay() {
            this.showUserProfileOverlay = !this.showUserProfileOverlay;
        },
        calculateEstimatedEndDate(startDate, duration) {
        const start = new Date(startDate.ano, startDate.mes - 1, startDate.dia, startDate.hora, startDate.minutos);

        const end = new Date(start.getTime() + duration * 60000); 

        const formattedEndDate = `${end.getDate()}/${end.getMonth() + 1}/${end.getFullYear()} ${end.getHours()}:${end.getMinutes().toString().padStart(2, '0')}`;
        return formattedEndDate;
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
        },
        comecarServico() {
            const payload1 = {
                estado: "emExecucao",
            };

            fetch('http://localhost:3000/services/' + this.servico.id, {
                method: 'PATCH',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload1)
            }).then(() => {
                console.log("Observação atualizada na base de dados com sucesso.")
            })
            .catch((error) => {
                console.log("Error " + error)
            }).finally(() => {
                this.$router.push({ name: 'comecarServico'})
            })
        },
        suspenderServico(){
            const payload1 = {
                estado: "parado",
            };

            fetch('http://localhost:3000/services/' + this.servico.id, {
                method: 'PATCH',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload1)
            }).then(() => {
                console.log("Observação atualizada na base de dados com sucesso.")
            })
            .catch((error) => {
                console.log("Error " + error)
            }).finally(() => {
                this.$router.push({ name: 'servicoSuspendido'})
            })
        },
        cancelarServico() {
            this.$router.push({ name: 'confirmarCancelamento' });
        }
    }
};
</script>

<style scoped>

.utilizador_veiculo_wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 2%;
}

.utilizador {
    border-radius: 30px;
    padding: 2%;
    background-color: #F5F5F5;
    width: 20%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 15%;
}

.utilizador img {
    margin-bottom: 20px; 
    width: 100px;
    height: 100px;
}

.utilizador p {
    margin: 5px 0; 
}

.vhc_wrapper {
    display:flex;
    border-radius: 30px;
    background-color: #F5F5F5;
    width:40%;
    display: flex;
    flex-direction: column;
    margin-right: 15%;
}

.veiculo {
    margin-top: 3.5%;
    display:flex;
    border-radius: 30px;
    display: flex;
    flex-direction: row;
    align-items: end;
    justify-content: space-between;
}

.vhc_part1 {
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    margin-left: 14%;
}

.vhc_part2 {
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    margin-right: 14%;
}

.vhc_title {
    display: flex;
    justify-content: center;
    margin-top: 2%;
    font-size: 20px;
    font-family: 'Open Sans', sans-serif;

}

.veiculo p {
    margin: 10px 0; 
}

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
    background-color: #F5F5F5;
    border-radius: 30px;
    margin-bottom: 2%;
    width: 70%;
}

.servico p{
    cursor:default;
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


.parte1 {
    margin-top: 3%;
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
    margin-left: 3%;
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
    margin-right: 2%;
    transition: all 0.5s ease;
}

.button-adiar:hover{
  transform: scale(0.98); /* Scale up when hovered */
  box-shadow: inset -4px 4px 8px rgba(0, 0, 0, 0.55);
  cursor: pointer;
}

.button-cancelar{ 
    width: 180px;
    height: 50px;
    border-radius: 50px;
    border: none;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    font-size: 20px;
    margin-right: 2%;
    transition: all 0.5s ease;
}

.button-cancelar:hover{
  transform: scale(0.98); /* Scale up when hovered */
  box-shadow: inset -4px 4px 8px rgba(0, 0, 0, 0.55);
  cursor: pointer;
}

.button-suspender {
    width: 220px;
    height: 50px;
    border-radius: 50px;
    border: none;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    font-size: 20px;
    margin-right: 2%;
    transition: all 0.5s ease;
}

.button-suspender:hover{
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
    padding-top: 4%;
}

.button-divider{
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 3%;
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