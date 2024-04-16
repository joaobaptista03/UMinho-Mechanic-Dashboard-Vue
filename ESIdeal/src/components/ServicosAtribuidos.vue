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
        <div class="ordenar">
            <button @click="toggleOptions" class="expand-button">Ordenar por</button>
            <div class="options" v-show="showOptions">
                <button @click="orderServicos('dataInicio')" class="option-button">Data de serviço</button>
                <button @click="orderServicos('dataPrevista')" class="option-button">Data final prevista</button>
            </div>
        </div>

        <div class ="servico" v-for="servico in servicosAtribuidos[page - 1]">
                <div class="parte1">
                    <p><b>ID: </b>{{servico.id}}</p>
                    <p><b>Matrícula: </b>{{servico.vehicleId}}</p>
                    <div class="processo">
                        <p><b>Serviço: {{servico.definition.descr}}</b></p>
                    </div>
                </div>
                <div class="parte2">
                    <div class="datahora" v-if="servico.data.ano != 9999" >
                        <div class="data">
                            <p class="dia"><b>{{servico.data.dia}}</b></p>
                            <p>{{servico.data.mes}}</p>
                        </div>
                        <div class="hora">
                            <img src="../assets/clock.png" alt="relogio">
                            <p> {{servico.data.hora}}:{{servico.data.minutos}} </p>
                        </div>
                    </div>
                    <p class="descricao"><b>Descrição: </b>{{servico.descricao}}</p>
                </div>
        </div>
    </div>


</template>

<script>
import UserProfileOverlay from './UserProfileOverlay.vue';
import { useUserStore } from '../stores';

export default {
    components: {
        UserProfileOverlay
    },
    name: 'ServicosAtribuidos',
    data() {
        return {
            username: null,
            servicosAtribuidos: [[]],
            showUserProfileOverlay: false,
            showOptions: false,
            page: 1
        }
    },
    async mounted() {
        const userStore = useUserStore();
        this.username = userStore.getUser();
        if (!this.username) this.$router.push({ name: 'home' });
        
        const response = await fetch('http://localhost:3000/workers?nome_utilizador=' + this.username);
        if (!response.ok) throw new Error('Failed to fetch');
        const servicos = (await response.json())[0].servicos_atribuidos;
        const servicosAtribuidosTemp = [];

        for (let i = 0; i < servicos.length; i++) {
            const response = await fetch('http://localhost:3000/services?id=' + servicos[i]);
            if (!response.ok) throw new Error('Failed to fetch');
            const servico = (await response.json())[0];

            const defId = servico['service-definitionId'];
            const response2 = await fetch('http://localhost:3000/service-definitions?id=' + defId);
            if (!response2.ok) throw new Error('Failed to fetch');
            const def = (await response2.json())[0];

            servico['definition'] = def;
            delete servico['service-definitionId'];

            servicosAtribuidosTemp.push(servico);
        }

        for (let i = 0; i < servicosAtribuidosTemp.length; i++) {
            if (servicosAtribuidosTemp[i].estado == 'realizado') continue;
            if (this.servicosAtribuidos[this.servicosAtribuidos.length - 1].length < 3)
                this.servicosAtribuidos[this.servicosAtribuidos.length - 1].push(servicosAtribuidosTemp[i]);
            else
                this.servicosAtribuidos.push([servicosAtribuidosTemp[i]]);
        }

        const page = this.$route.query.p;
        if (page && page > 0 && page <= this.servicosAtribuidos.length) this.page = page;

        const orderBy = this.$route.query.orderBy;
        if (orderBy && orderBy == 'dataPrevista') this.orderServicos('dataPrevista');
        else this.orderServicos('dataInicio');

        console.log(this.servicosAtribuidos);
    },
    methods: {
        orderServicos(mode) {
            const allServicos = this.servicosAtribuidos.flat();

            allServicos.sort((a, b) => {
                if (mode == 'dataInicio') {
                    return new Date(a.data.ano, a.data.mes - 1, a.data.dia, a.data.hora, a.data.minutos) - new Date(b.data.ano, b.data.mes - 1, b.data.dia, b.data.hora, b.data.minutos);
                }
                else if (mode == 'dataPrevista') {
                    const duracao = a.definition.duracao;
                    const dataInicio = new Date(a.data.ano, a.data.mes - 1, a.data.dia, a.data.hora, a.data.minutos);
                    const dataPrevista = new Date(dataInicio.getTime() + duracao * 60000);

                    const duracao2 = b.definition.duracao;
                    const dataInicio2 = new Date(b.data.ano, b.data.mes - 1, b.data.dia, b.data.hora, b.data.minutos);
                    const dataPrevista2 = new Date(dataInicio2.getTime() + duracao2 * 60000);

                    return dataPrevista - dataPrevista2;
                }
            });

            this.servicosAtribuidos = [[]];
            for (let i = 0; i < allServicos.length; i++) {
                if (this.servicosAtribuidos[this.servicosAtribuidos.length - 1].length < 3)
                    this.servicosAtribuidos[this.servicosAtribuidos.length - 1].push(allServicos[i]);
                else
                    this.servicosAtribuidos.push([allServicos[i]]);
            }
        },
        toggleOptions() {
            this.showOptions = !this.showOptions;
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

.servico{
    display: flex;
    background-color: #EDEDED;
    border-radius: 30px;
    margin-bottom: 3%;
    width: 55%;
}

.parte1{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 1%;
    width: 50%;
}

.processo{
}

.processo p{
    margin: 5% 20px;
}

.parte2{
    display: flex;
    flex-direction: column;
    justify-content: end;
    align-items: end;
    margin-bottom: 1%;
    width: 45%;
}

.descricao{
    margin: 2% 0px;
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
    padding: 5px 16px;
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
    justify-content: space-around;
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

.processo{
    background-color: #FF7F48;
    border-radius: 20px;
    width: fit-content;
}


.ordenar {
    position: relative;
    margin: 20px 0;
}

.expand-button {
    background-color: #FF7F48;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 10px 20px;
    cursor: pointer;
    outline: none;
    transition: background-color 0.3s;
}

.expand-button:hover {
    background-color: #e76e3c; 
}

.options {
    display: none;
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