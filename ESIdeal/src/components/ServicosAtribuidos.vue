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
            servicosAtribuidos: [[]],
            showUserProfileOverlay: false
        }
    },
    async mounted() {
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

        this.orderServicos('dataInicio');
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