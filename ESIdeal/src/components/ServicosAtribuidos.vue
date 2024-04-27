<template>
    <header>
        <p class="title"><a @click="this.$router.push({name: 'loggedHome'})">E.S.Ideal</a></p>
        <div class="navbar">
            <p><a @click="this.$router.push({ name: 'servicosAtribuidos' })" class="navlink">Serviços Atribuídos</a></p>
            <div class="profile-container">
                <img src="../assets/profilepic.png" id="nav-img" @click="this.showUserProfileOverlay = !this.showUserProfileOverlay"/>
            </div>
        </div>
    </header>
    
    <UserProfileOverlay :show="showUserProfileOverlay" @close="toggleOverlay"></UserProfileOverlay>

        <div class="filters-container">
            <div class="ordenar">
                <div class="ordenar-container">
                    <button @click="toggleOptions" class="expand-button"><b>Ordenar por:</b></button>
                    <div class="arrow-box" @click="invertOrder()">
                        <div class="arrow-down" v-if="filterDescendent"></div>
                        <div class="arrow-up" v-if="!filterDescendent"></div>
                    </div>
                    <div class="options" v-show="showOptions">
                        <button @click="updateQuery('dataInicio')" class="option-button">Data de serviço</button>
                        <button @click="updateQuery('dataPrevista')" class="option-button">Data final prevista</button>
                        <button @click="updateQuery('tempo')" class="option-button">Tempo estimado</button>
                </div>
                
    
                </div>
                <div class="search-container">
                    <input type="text" v-model="searchInput" class="search-bar" v-if="searchBarVisible">
                        <button class="estado-dropdown" @click="toggleEstadoDropdown" :class="{ active: estadoDropdownVisible }">
                            Estado <span class="arrow">&#8963;</span>
                        <div class="dropdown-content" v-show="estadoDropdownVisible" @click.stop="">
                            <label>
                                <input type="checkbox" v-model="filterStates.emExecucao" @click="applyEstadoFilter('emExecucao')"> Em Execução
                            </label>
                            <label>
                                <input type="checkbox" v-model="filterStates.realizado" @click="applyEstadoFilter('realizado')"> Realizado
                            </label>
                            <label>
                                <input type="checkbox" v-model="filterStates.porRealizar" @click="applyEstadoFilter('porRealizar')"> Por Realizar
                            </label>
                            <label>
                                <input type="checkbox" v-model="filterStates.parado" @click="applyEstadoFilter('parado')"> Parado
                            </label>
                        </div>
                    </button>
                    <div class="search-button" @click="showSearchBar"><img src="../assets/search.svg" style="width: 20px;"></div>
                </div>
            </div>
        </div>
    <div class="servicosAtribuidos" v-for="servico in servicosAtribuidos[page - 1]">
        <div class="servico" v-if="shouldShowServico(servico)">
            <a @click="handleServicoClick(servico)">
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
                            <p>{{nomeMes(servico.data.mes)}}</p>
                        </div>
                        <div class="hora">
                            <img src="../assets/clock.png" alt="relogio">
                            <p> {{servico.data.hora}}:{{servico.data.minutos === 0 ? '00' : servico.data.minutos}} </p>
                        </div>
                    </div>
                    <div class="espera" v-if="servico.data.ano == 9999" >
                        <div class="emespera">
                            <img src="../assets/espera.png" alt="espera">
                            <p>Espera</p>
                        </div>
                    </div>
                    <p class="tempo-estimado"><b>Tempo estimado: </b>{{servico.definition.duracao === 0 ? '00' : servico.definition.duracao}} minutos </p>
                    <p class="estado" :class="{ 'dark': servico.estado === 'realizado', 'dark': servico.estado === 'Realizado','green': servico.estado === 'porRealizar', 'green': servico.estado === 'PorRealizar', 'red': servico.estado === 'parado', 'red': servico.estado === 'Parado', 'light-green': servico.estado === 'emExecucao', 'light-green': servico.estado === 'EmExecucao' }">{{ formatEstado(servico.estado) }}</p>
                </div>
            </a>
        </div>
    </div>

    <div class="pagination">
        <button class="previous" v-if="this.page != 1" @click="changePage(-1)" :disabled="this.page == 1">
            <img src="../assets/paganterior.png" alt="Previous" class="button-icon">
        </button>
        <span>Página {{this.page}}</span>
        <button class="next" v-if="this.page != this.servicosAtribuidos.length" @click="changePage(1)" :disabled="this.page == this.servicosAtribuidos.length">
            <img src="../assets/pagseguinte.png" alt="Previous" class="button-icon">
        </button>
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
            searchBarVisible: false,
            searchInput: '',
            username: null,
            allServicos: [],
            servicosAtribuidos: [[]],
            showUserProfileOverlay: false,
            showOptions: false,
            page: 1,
            
            /* Estado do filtro */
            filterDescendent: true,

            /* Estado dos filtros de estado */
            showConcluidos: false,
            showPorRealizar: true,
            showParado: true,
            showEmExecucao: true,
            filterStates: {
                realizado: false,
                porRealizar: true,
                parado: true,
                emExecucao: true
            },
            estadoDropdownVisible: false         
        }
    },
    async created() {
        const userStore = useUserStore();
        this.username = userStore.getUser();
        if (!this.username) this.$router.push({ name: 'home' });

        console.log(this.username)
        
        try {
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
                this.allServicos.push(servicosAtribuidosTemp[i]);
                if (this.allServicos[i].estado !== 'Realizado') {
                    if (this.servicosAtribuidos[this.servicosAtribuidos.length - 1].length < 4)
                        this.servicosAtribuidos[this.servicosAtribuidos.length - 1].push(servicosAtribuidosTemp[i]);
                    else
                        this.servicosAtribuidos.push([servicosAtribuidosTemp[i]]);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    },
    methods: {
        toggleEstadoDropdown() {
            console.log('Toggling estado dropdown');
            this.estadoDropdownVisible = !this.estadoDropdownVisible;
        },
        applyEstadoFilter(estado) {
            this.page = 1;
            if (estado === 'realizado') {
               this.filterServicosConcluidos();
            }
            else if (estado === 'porRealizar') {
                this.filterServicosPorRealizar();
            }
            else if (estado === 'parado') {
                this.filterServicosParado();
            } else if (estado === 'emExecucao') {
                this.filterServicosEmExecucao();
            } else {
                console.error('Estado Inválido:', estado);
            }
            this.filterDescendent = true;
            this.orderServicos('dataInicio');
        },
        updateQuery(orderBy) {
            const query = { ...this.$route.query };

            if (query.orderBy !== orderBy) { // Se o user clica duas vezes no mesmo botão, inverte a ordem
                this.filterDescendent = true;
                query.orderBy = orderBy;
                query.orderDir = 'asc';
                this.orderServicos(orderBy);
            }

            // Replace the current route's query with the updated one
            this.$router.replace({ query });
        },
        filterServicosEmExecucao() {
            console.log('Filtering services in progress');
            if (this.showEmExecucao) {
                const services = this.servicosAtribuidos.flat().filter(servico => (servico.estado !== 'emExecucao' || servico.estado !== 'EmExecucao'));

                this.servicosAtribuidos = [[]]
                for (let i = 0; i < services.length; i++) {
                    if (this.servicosAtribuidos[this.servicosAtribuidos.length - 1].length < 4)
                        this.servicosAtribuidos[this.servicosAtribuidos.length - 1].push(services[i]);
                    else
                        this.servicosAtribuidos.push([services[i]]);
                }
            } else {
                const services = this.allServicos.filter(servico => (servico.estado === 'emExecucao' || servico.estado === 'EmExecucao'));
                
                for (let i = 0; i < services.length; i++) {
                    if (this.servicosAtribuidos[this.servicosAtribuidos.length - 1].length < 4)
                        this.servicosAtribuidos[this.servicosAtribuidos.length - 1].push(services[i]);
                    else
                        this.servicosAtribuidos.push([services[i]]);
                }
            }
            this.showEmExecucao = !this.showEmExecucao;
        },
        filterServicosConcluidos() {
            console.log('Filtering completed services');
            if (this.showConcluidos) {
                const services = this.servicosAtribuidos.flat().filter(servico => (servico.estado !== 'realizado' || servico.estado !== 'Realizado'));

                this.servicosAtribuidos = [[]]
                for (let i = 0; i < services.length; i++) {
                    if (this.servicosAtribuidos[this.servicosAtribuidos.length - 1].length < 4)
                        this.servicosAtribuidos[this.servicosAtribuidos.length - 1].push(services[i]);
                    else
                        this.servicosAtribuidos.push([services[i]]);
                }
            } else {
                const services = this.allServicos.filter(servico => (servico.estado === 'realizado' || servico.estado === 'Realizado'));
                
                for (let i = 0; i < services.length; i++) {
                    if (this.servicosAtribuidos[this.servicosAtribuidos.length - 1].length < 4)
                        this.servicosAtribuidos[this.servicosAtribuidos.length - 1].push(services[i]);
                    else
                        this.servicosAtribuidos.push([services[i]]);
                }
            }
            this.showConcluidos = !this.showConcluidos;
        },
        filterServicosPorRealizar() {
            console.log('Filtering services with estado set to porRealizar');
            if (this.showPorRealizar) {
                const services = this.servicosAtribuidos.flat().filter(servico => (servico.estado !== 'por Realizar' || servico.estado !== 'Por Realizar'));

                this.servicosAtribuidos = [[]]
                for (let i = 0; i < services.length; i++) {
                    if (this.servicosAtribuidos[this.servicosAtribuidos.length - 1].length < 4)
                        this.servicosAtribuidos[this.servicosAtribuidos.length - 1].push(services[i]);
                    else
                        this.servicosAtribuidos.push([services[i]]);
                }
            } else {
                const services = this.allServicos.filter(servico => (servico.estado === 'por Realizar' || servico.estado === 'Por Realizar'));
                
                for (let i = 0; i < services.length; i++) {
                    if (this.servicosAtribuidos[this.servicosAtribuidos.length - 1].length < 4)
                        this.servicosAtribuidos[this.servicosAtribuidos.length - 1].push(services[i]);
                    else
                        this.servicosAtribuidos.push([services[i]]);
                }
            }
            this.showPorRealizar = !this.showPorRealizar;
        },
        filterServicosParado() {
            console.log('Filtering services with estado set to parado');
            if (this.showParado) {
                const services = this.servicosAtribuidos.flat().filter(servico => (servico.estado !== 'parado' || servico.estado !== 'Parado'));

                this.servicosAtribuidos = [[]]
                for (let i = 0; i < services.length; i++) {
                    if (this.servicosAtribuidos[this.servicosAtribuidos.length - 1].length < 4)
                        this.servicosAtribuidos[this.servicosAtribuidos.length - 1].push(services[i]);
                    else
                        this.servicosAtribuidos.push([services[i]]);
                }
            } else {
                const services = this.allServicos.filter(servico => (servico.estado === 'parado' || servico.estado === 'Parado'));
                
                for (let i = 0; i < services.length; i++) {
                    if (this.servicosAtribuidos[this.servicosAtribuidos.length - 1].length < 4)
                        this.servicosAtribuidos[this.servicosAtribuidos.length - 1].push(services[i]);
                    else
                        this.servicosAtribuidos.push([services[i]]);
                }
            }
            this.showParado = !this.showParado;
        },
        orderServicos(mode) {
            console.log("Ordering by: " + mode);
            this.page = 1;
            this.showOptions = false;
            const servicos = this.servicosAtribuidos.flat();

            servicos.sort((a, b) => {
                let result = 0;
                if (mode === 'dataInicio') {
                    result = new Date(a.data.ano, a.data.mes - 1, a.data.dia, a.data.hora, a.data.minutos) - new Date(b.data.ano, b.data.mes - 1, b.data.dia, b.data.hora, b.data.minutos);
                } else if (mode === 'dataPrevista') {
                    const duracao = a.definition.duracao;
                    const dataInicio = new Date(a.data.ano, a.data.mes - 1, a.data.dia, a.data.hora, a.data.minutos);
                    const dataPrevista = new Date(dataInicio.getTime() + duracao * 60000);

                    const duracao2 = b.definition.duracao;
                    const dataInicio2 = new Date(b.data.ano, b.data.mes - 1, b.data.dia, b.data.hora, b.data.minutos);
                    const dataPrevista2 = new Date(dataInicio2.getTime() + duracao2 * 60000);

                    result = dataPrevista - dataPrevista2;
                } else if (mode === 'tempo') {
                    result = a.definition.duracao - b.definition.duracao;
                }
                return this.filterDescendent ? result : -result;  
            });

            // Update servicosAtribuidos with sorted data
            this.servicosAtribuidos = [[]];
            for (let i = 0; i < servicos.length; i++) {
                if (this.servicosAtribuidos[this.servicosAtribuidos.length - 1].length < 4)
                    this.servicosAtribuidos[this.servicosAtribuidos.length - 1].push(servicos[i]);
                else
                    this.servicosAtribuidos.push([servicos[i]]);
                }
        },
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
        toggleOptions() {
            this.showOptions = !this.showOptions;
        },
        changePage(p) {
            this.page += p;
        },
        nomeMes(mes) {
            const data = new Date(2024, mes - 1); 
            let mesExtenso = data.toLocaleString('pt-PT', { month: 'long' });
            return mesExtenso.charAt(0).toUpperCase() + mesExtenso.slice(1, 3).toLowerCase();
        },
        toggleOverlay() {
            this.showUserProfileOverlay = !this.showUserProfileOverlay;
        },
        handleServicoClick(servico) {
            console.log(servico);
            const servicoStore = useServicoStore();
            servicoStore.setServico(servico);
            this.$router.push({ name: 'servico'})
        },
        showSearchBar() {
            this.searchInput = '';
            this.searchBarVisible = !this.searchBarVisible;
        },
        shouldShowServico(servico) {
            if (!this.searchBarVisible) {
                return true;
            }

            const searchTerm = this.searchInput.toLowerCase();

            if (servico.definition.descr.toLowerCase().includes(searchTerm)) {
                return true;
            }

            return false;
        },
        invertOrder() {
            const services = this.servicosAtribuidos.flat().reverse();

            this.servicosAtribuidos = [[]];
            for (let i = 0; i < services.length; i++) {
                if (this.servicosAtribuidos[this.servicosAtribuidos.length - 1].length < 4)
                    this.servicosAtribuidos[this.servicosAtribuidos.length - 1].push(services[i]);
                else
                    this.servicosAtribuidos.push([services[i]]);
            }
            this.filterDescendent = !this.filterDescendent;
        }
    }
};
</script>

<style scoped>

.title a {
    cursor: pointer; 
}


.navbar a.navlink {
    position: relative;
    text-decoration: none;
    color: white;
    cursor: pointer;
}

.navbar a.navlink::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -5px;
    width: 0;
    height: 2px;
    background-color: #FF7F48;
    transition: width 0.3s ease-in-out, left 0.3s ease-in-out;
    width:100%;
    left:0;
}

.servicosAtribuidos {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'open sans', sans-serif;
}

.servico a{
    display:flex;
    align-items: center;
    width: 100%;
    cursor: pointer;
}

.servico {
    display: flex;
    background-color: #EDEDED;
    border-radius: 30px;
    margin-bottom: 2%;
    width: 55%;
}

.servico p{
    cursor:default;
}

.parte1{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 2%;
    width: 50%;
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
    flex-direction: column;
    justify-content: end;
    align-items: end;;
    width: 45%;
}


.datahora{
    margin-top: 3%;
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
    margin-top: 3%;
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
    margin-top: 5%;
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

.estado {
    background-color: #FF7F48; /*default*/
    border-radius: 5px;
    padding: 5px;
}

.green {
    background-color: #007958;
    color:white;
}

.light-green {
    background-color: #ACDF87;
    color: black;
}

.dark {
    background-color: #112A12; 
    color: white;
}

.red {
    background-color: #f94449; 
    
}


/*-------------------- Botão para ordenar, ainda tem de ser melhorado ----------------------------------------*/ 
.ordenar {
    width: 55%;
    position: relative;
    display:flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
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

.filter-button {
    background-color: #FF7F48;
    color: rgb(0, 0, 0);
    border: none;
    border-radius: 20px;
    padding: 10px 20px;
    cursor: pointer;
    margin-left: 10px;
    margin-right: 10px;
}


.expand-button:hover {
    background-color: #e76e3c; 
}


.options {
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 999;
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

.filters-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.search-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    width: 75%;
}

.search-button {
    background-color: #EDEDED;
    padding: 5px;
    border-radius: 5px;
}

.search-bar {
    border-radius: 5px;
    width: 475px;
    height: 25px;
    background-color: #EDEDED;
    font-size: 16px;
}

/* Dropdown */

.estado-dropdown {
    background-color: #FF7F48;
    color: rgb(0, 0, 0);
    border: none;
    border-radius: 20px;
    padding: 10px 20px;
    cursor: pointer;
    outline: none;
    transition: background-color 0.3s;
    font-size: 17px;
    position: relative; /* Added position relative */
    margin-left: 10px;
    margin-right: 10px;
}

.estado-dropdown:hover {
    background-color: #e76e3c;
}

.arrow {
    margin-left: 5px;
}

.dropdown-content {
    display: none;
    position: absolute;
    top: 100%; /* Position dropdown below the button */
    left: 0;
    background-color: #fff;
    min-width: 160px;
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
    z-index: 1;
}

.dropdown-content label {
    display: flex;
    padding: 8px 12px;
}

.dropdown-content input[type="checkbox"] {
    margin-right: 8px;
}

.dropdown-content label:hover {
    background-color: #f0f0f0;
}

/* Show dropdown content when estadoDropdownVisible is true */
.estado-dropdown.active .dropdown-content {
    display: block;
}

.ordenar-container{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.arrow-up {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 8px solid #000;
}

.arrow-down {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 8px solid #000;
}

.arrow-box{
    background-color: #FF7F48;
    width: 50px;
    height: 40px;
    margin-left: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 15px;
}



</style>