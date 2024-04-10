<template>

    <nav class="navbar">
        <p>E.S.Ideal</p>   
        <div class = "loginbutton">
            <LoginButton @login-clicked="showLoginModal = true"></LoginButton>
            <LoginModal
                :show="showLoginModal"
                @close="showLoginModal = false"
                @login-success="handleLoginSuccess"
            ></LoginModal>
        </div>
    </nav>

    <main>
        <div class="homeimage">
                <img src="../assets/home_pic.png" alt="ESIdeal">
        </div>
        
        <div class="tarefas">
            <div class="container">
                <img src="../assets/servicosatribuidos.png" alt="icone1">
                <p>Ver os seus serviços atribuídos</p>
            </div>
            <div class="container">
                <img src="../assets/servicosexecucao.png" alt="icone2">
                <p>Selecionar serviços para execução</p>
            </div>
            <div class="container">
                <img src="../assets/realizacaoservicos.png" alt="icone3">
                <p>Assinalar realização de serviços</p>
            </div>
        </div>

    </main>
</template>

<script>
import LoginButton from './LoginButton.vue';
import LoginModal from './LoginModal.vue';

export default {
    components: {
        LoginButton,
        LoginModal
    },
    data() {
        return {
            showLoginModal: false
        };
    },
    methods: {
        handleLoginSuccess(username) {
            this.$emit('login-success', username);
        }
    }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inspiration&display=swap');
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ffffff;
}

.navbar p {
    font-size: 40px;
    color: #FF9D73;
    font-family: 'Inspiration', cursive;
    padding-left: 5%;
    margin: 15px;
}

.loginbutton {
    padding-right: 5%;
}

.homeimage {
    display: flex;
    justify-content: center;
    align-items: center;
}

.homeimage img {
    width: 100%;
    height: auto;
}

.tarefas {
    display: flex;
    justify-content: space-around;
    background: rgba(0, 0, 0, 0);
    margin-top: -8%;
}

.container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #EDEDED;
    border-radius: 20px;
    padding-top: 20px;
    width: 250px;
}

.container p {
    font-size: 25px;
    text-align: center;
    max-width: 50%;
}



</style>