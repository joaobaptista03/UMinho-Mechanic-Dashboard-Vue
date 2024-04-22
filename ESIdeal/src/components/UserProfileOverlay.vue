<template>
    <div class="overlay" v-if="show" @click.self="hideOverlay">
            <div class="overlay-content">
                <p><a @click="this.$router.push({ name: 'profilePage' })">Ver Perfil</a></p>
                <p><b><a @click="logout">Logout</a></b></p>
            </div>
    </div>
</template>

<script>
import { useUserStore } from '../stores';
export default {

    props: {
        show: Boolean
    },
    name: 'UserProfileOverlay',
    methods: {
        logout() {
            const userStore = useUserStore();
            userStore.clearUser();
            this.$router.push({ name: 'home' });
        },
        hideOverlay() {
            console.log('hideOverlay');
            this.$emit('close'); // fecha o menu em caso de clicar fora do overlay
        }
    }
};
</script>

<style scoped>
.overlay {
    position: absolute; /*Para que possamos preencher o viewport a 100% */
    right: 0;
    width: 100%;
    height: 91.8%;
    display: flex;
    justify-content: end;
    align-items: start;
    z-index: 999;
    background-color: rgba(0, 0, 0, 0.5); 
}

.overlay-content {
    background-color: #EDEDED;
    border-radius: 10px;
    position: absolute;
    right: 0; /* Encostar ao canto direito do overlay que tem widht=100% */
    width: 180px; 
    padding: 10px; 
}

.overlay-content p {
    font-family: 'open sans', sans-serif;
    font-size: 15px;
    color: black;
    text-align: center;
    cursor: pointer;
    margin: 0; /* Remove default margin */
}

.overlay-content p:hover {
    text-decoration: underline;
}

</style>
