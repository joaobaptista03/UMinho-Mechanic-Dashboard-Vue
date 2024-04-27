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
    
    <UserProfileOverlay :show="showUserProfileOverlay" ></UserProfileOverlay>

    <div class="container">
        <div class="titulo">
            <div class="titulo"><p style="font-size: 45px;">Serviço:</p><p style="color:#FF9D73; font-size: 45px; margin-left: 8px;">{{ this.id }}</p></div>
        </div>
        <div class="box-adiamento">
            <span style="margin-bottom: 10px; font-size: 50px;">Motivos para adiamento</span>
            <textarea type="text" v-model="motivo" class="text-box"></textarea>

            <span style="margin-bottom: 10px;font-size: 40px; margin-top: 52px;">Nova data Prevista</span>
            <input type="date" v-model="novadata" class="data-box"></input>
            <span v-if="dataInvalida" style="color: #C73030; font-size: 22px; margin-top: 9px;">A data selecionada não é válida.</span>
            <span v-if="dataInvalida" style="color: #C73030; font-size: 22px;">Nota: Esta deve ser posterior a {{ this.dataAntigaString }}</span>

            <div class="container-buttons">
                <button class="button-voltar" @click="changeToServicePage">Voltar</button>
                <button class="button-concluir" @click="delayService">Adiar Serviço</button>
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
    name: 'AdiarServico',
    data() {
        return {
            id: null,
            worker: null,
            servico: null,
            motivo: '',
            novadata: '',
            dataAntiga: '',
            dataAntigaString: '',
            dataInvalida: false,
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

            // Verifica se o funcionário tem aquele serviço atribuído
            if (!this.worker.servicos_atribuidos.includes(this.id)) {
                this.$router.push({ name: 'home' });
            }

            this.motivo = this.servico.adiamento;

            // Atualizar a variável novadata com a data em que era suposto terminar o serviço
            if (this.servico.data.dia < 10 && this.servico.data.mes < 10) {
                this.novadata = '' + this.servico.data.ano + '-0' + this.servico.data.mes + '-0' + this.servico.data.dia;
                this.dataAntigaString = '0' + this.servico.data.dia + '/0' + this.servico.data.mes + '/' + this.servico.data.ano;
                this.dataAntiga = this.novadata;
            } else if (this.servico.data.dia < 10) {
                this.novadata = '' + this.servico.data.ano + '-' + this.servico.data.mes + '-0' + this.servico.data.dia;
                this.dataAntigaString = '0' + this.servico.data.dia + '/' + this.servico.data.mes + '/' + this.servico.data.ano;
                this.dataAntiga = this.novadata;
            } else  if (this.servico.data.mes < 10) {
                this.novadata = '' + this.servico.data.ano + '-0' + this.servico.data.mes + '-' + this.servico.data.dia;
                this.dataAntigaString = '' + this.servico.data.dia + '/0' + this.servico.data.mes + '/' + this.servico.data.ano;
                this.dataAntiga = this.novadata;
            } else {
                this.novadata = '' + this.servico.data.ano + '-' + this.servico.data.mes + '-' + this.servico.data.dia;
                this.dataAntigaString = '' + this.servico.data.dia + '/' + this.servico.data.mes + '/' + this.servico.data.ano;
                this.dataAntiga = this.novadata;
            }
        })
        .catch(error => console.log(error));
    },
    methods: {
        delayService() {
            console.log("Motivo do Mecânico: " + this.motivo);
            console.log("Nova data: " + this.novadata);

            const [year, month, day] = this.novadata.split('-');
            // Verifica se a data é válida
            const date1 = new Date(this.dataAntiga);
            const date2 = new Date(this.novadata);
            if (date1>=date2) {
                console.log("Data inválida. Esta deve ser posterior à data estabelecida anteriormente.");
                this.dataInvalida = true;
                return;
            }
            this.dataInvalida = false;

            // Constroí o payload com o campo que vai ser atualizado
            const payload = {
                adiamento: this.motivo,
                data: {
                    dia: day,
                    mes: month,
                    ano: year,
                    hora: this.servico.data.hora,
                    minutos: this.servico.data.minutos
                }
            };

            // Atualizar a observação do serviço na base de dados
            fetch('http://localhost:3000/services/' + this.id, {
                method: 'PATCH',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }).then(() => {
                console.log("Servico atualizado na base de dados com sucesso.")
            })
            .catch((error) => {
                console.log("Error " + error)
            }).finally(() => {
                this.$router.push({ name: 'servicoAdiado', params: { id: this.id } })
            })
        },
        changeToServicePage() {
            this.$router.push({ name: 'servico'})
        }
    }
};
</script>

<style scoped>

.box-adiamento{
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
    height: 147px;
    border: 2px solid black;
    text-align: center;
    line-height: 40px;
    font-size: 35px;
    font-weight: lighter;
    resize: none;
    margin-top: 40px;
}

.data-box{
    border-radius: 50px;
    width: 564px;
    height: 89px;
    border: 2px solid black;
    text-align: center;
    line-height: 40px;
    font-size: 35px;
    font-weight: lighter;
    resize: none;
    margin-top: 56px;
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
    margin-top: 102px;
}

</style>