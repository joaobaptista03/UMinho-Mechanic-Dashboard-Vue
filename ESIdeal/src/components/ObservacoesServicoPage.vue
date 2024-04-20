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

            <textarea type="text" v-model="textAreaValue" class="text-box"></textarea>

            <div class="container-buttons">
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

            // Verifica se o funcionário tem aquele serviço atribuído
            if (!this.worker.servicos_atribuidos.includes(this.id)) {
                this.$router.push({ name: 'home' });
            }

            // Vai buscar a informação do serviço
            fetch('http://localhost:3000/services/' + this.id)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch');
                }
            })
            .then((data) => {
                this.servico = data;
                console.log(this.textAreaValue);
                this.textAreaValue = this.servico.observacoes;
            })
            .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
    },
    methods: {
        updateObservation() {
            console.log("Observção do Mecânico: " + this.textAreaValue)

            // Atualizar a observação do serviço na base de dados
        },
        changeToServicePage() {
            // Fazer depois de saber o link para a página de um serviço
        }
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

.button-voltar{
    width: 180px;
    height: 80px;
    border-radius: 50px;
    border: none;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    font-size: 25px;
    margin-left: 65px;
}

.button-concluir{
    width: 272px;
    height: 80px;
    border-radius: 50px;
    border: none;
    background-color: rgba(255, 127, 72, 0.8);
    color: white;
    font-size: 25px;
    margin-right: 65px;
}

.container-buttons{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-top: 110px;
}

</style>