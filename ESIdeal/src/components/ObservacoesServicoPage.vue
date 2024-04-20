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

            <textarea type="text" v-model="observacao" class="text-box"></textarea>

            <div class="container-buttons">
                <button class="button-voltar" @click="changeToServicePage">Voltar</button>
                <button class="button-concluir" @click="updateObservation">Concluir Serviço</button>
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
            textAreaValue: 'Merda'
        };
    },
    components: {
        UserProfileOverlay
    },
    props: ['id'],
    name: 'ObservacoesServicoPage',
    data() {
        return {
            worker: null,
            servico: null,
            observacao: '',
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
                console.log("Fetched observacoes:", this.servico.observacoes);
                console.log("Before setting textAreaValue:", this.observacao);
                this.observacao = this.servico.observacoes;
                console.log("After setting textAreaValue:", this.observacao);
            })
            .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
    },
    methods: {
        updateObservation() {
            console.log("Observação do Mecânico: " + this.observacao)

            // Constroí o payload com o campo que vai ser atualizado
            const payload1 = {
                observacoes: this.observacao
            };

            // Atualizar a observação do serviço na base de dados
            fetch('http://localhost:3000/services/' + this.id, {
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
                // Redireciona para a próxima página
            })

            // Constroí o payload com o campo que vai ser atualizado
            let new_servicos = this.worker.servicos_atribuidos.filter(id => id !== this.id);

            const payload2 = {
                servicos_atribuidos: new_servicos
            };


            // Remover o serviço das lista de serviços por concluir
            fetch('http://localhost:3000/workers/' + this.worker.id, {
                method: 'PATCH',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload2)
            }).then(() => {
                console.log("Serviços atribuídos ao funcionário atualizados na base de dados com sucesso.")
            })
            .catch((error) => {
                console.log("Error " + error)
            }).finally(() => {
                this.$router.push({ name: 'servicoConcluido', params: { id: this.id } })
            })
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
    border-radius: 50px;
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
    transition: all 0.5s ease;
}

.button-voltar:hover{
  transform: scale(0.98); /* Scale up when hovered */
  box-shadow: inset -4px 4px 8px rgba(0, 0, 0, 0.55);
  cursor: pointer;
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
    transition: all 0.05s ease;
}

.button-concluir:hover{
  transform: scale(0.98); /* Scale up when hovered */
  box-shadow: inset -4px 4px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
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