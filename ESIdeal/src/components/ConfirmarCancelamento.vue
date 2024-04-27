<template>
    <header>
        <p class="title"><a @click="this.$router.push({name: 'loggedHome'})">E.S.Ideal</a></p>
        <div class="navbar">
            <p><a @click="this.$router.push({ name: 'servicoCancelado' })" class="navlink">Serviços Atribuídos</a></p>
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
            <div class="text">
                <p id="title"><b>Tem a Certeza que pretende cancelar o serviço?</b></p>
                <p id="subtitle">O serviço será eliminado da base de dados do sistema</p>
            </div>
            <div class="button-divider">
                <button class="button-voltar" @click="changeToServicePage">Voltar a Serviços</button>
                <button class="button-cancelar" @click="cancelService">Cancelar Serviço</button>
            </div>
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
    name: 'ComcarServico',
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
        cancelService() {
            fetch('http://localhost:3000/workers?nome_utilizador=' + this.username)
                .then(response => response.json())
                .then(workerData => {
                    // Assuming the worker data is an array and we are interested in the first worker
                    const worker = workerData[0];
                    if (!worker) throw new Error('Worker not found');

                    // Remove the service with the matching ID from servicos_atribuidos
                    const updatedServicosAtribuidos = worker.servicos_atribuidos.filter(servicoId => servicoId !== this.servico.id);

                    // Update the worker's servicos_atribuidos in the database
                    return fetch('http://localhost:3000/workers/' + worker.id, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            servicos_atribuidos: updatedServicosAtribuidos
                        })
                    });
                })
                .then(() => {
                    console.log("Serviço removido da lista de serviços atribuídos do funcionário.");
                    
                    // Now that the service is removed from the worker's list, delete the service itself
                    return fetch('http://localhost:3000/services/' + this.servico.id, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                })
                .then(() => {
                    console.log("Serviço excluído com sucesso.");
                    this.$router.push({ name: 'servicoCancelado' });
                })
                .catch((error) => {
                    console.error("Erro ao cancelar serviço:", error);
                });
        },
        changeToServicePage() {
            this.$router.push({ name: 'servicosAtribuidos'})
        },
        
    }
};
</script>

<style scoped>

.button-divider {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;

}

.text {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.button-cancelar{
    width: 219px;
    height: 88px;
    border-radius: 50px;
    border: none;
    background-color: #C73030;
    color: white;
    font-size: 20px;
    margin-right: 5%;
    margin-top: 2%;
    transition: all 0.05s ease;
}

.button-cancelar:hover{
  transform: scale(0.98); 
  box-shadow: inset -4px 4px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}

.box{
    display: flex;
    flex-direction: column;
    background-color: #EDEDED;
    border-radius: 50px;
    margin-bottom: 2%;
    width: 45%;
    padding-top: 47px;
    padding-bottom: 21px;
    font-size: 50px;
    justify-content: center;
    align-items: center;
    margin-top: 165px;
}

#title{
    font-size: 30px;
    margin-bottom: 1%;

}

#subtitle{
    font-size: 20px;
    margin-bottom: 50px;
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
    margin-left: 5%;
    margin-top: 2%;
    transition: all 0.05s ease;
}

.button-voltar:hover{
  transform: scale(0.98); 
  box-shadow: inset -4px 4px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}

</style>