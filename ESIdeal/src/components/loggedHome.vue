<template>

    <header>
        <p class="title"><a @click="this.$router.push({name: 'home'})">E.S.Ideal</a></p>
        <div class="navbar">
            <p><a @click="this.$router.push({name: 'servicosAtribuidos' })" class="navlink">Serviços Atribuídos</a></p>
            <div class="profile-container">
                <a id="nav-img" @click="this.showUserProfileOverlay = !this.showUserProfileOverlay">
                    <img src="../assets/profilepic.png"/>
                </a>  
            </div>
        </div>
    </header>

    <UserProfileOverlay :show="showUserProfileOverlay" @close="toggleOverlay" ></UserProfileOverlay>


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
import UserProfileOverlay from './UserProfileOverlay.vue';

export default {
    components: {
        UserProfileOverlay
    },
    data() {
        return {
            showUserProfileOverlay: false
        };
    },
    methods: {
        toggleOverlay() {
            this.showUserProfileOverlay = false;
        }
    }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inspiration&display=swap');

header {
    background-color: black;
}

.navbar{
    background-color: black;
}

.navbar a.navlink {
    position: relative;
    text-decoration: none;
    color: white;
    font-family: 'open sans', sans-serif;
    font-size: 17px;
    cursor: pointer;
}

header p {
    font-size: 40px;
    color: #FF9D73;
    font-family: 'Inspiration', cursive;
    margin: 15px;
    padding-left: 2%;
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