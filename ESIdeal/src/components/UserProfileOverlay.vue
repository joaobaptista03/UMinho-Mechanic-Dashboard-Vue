<template>
    <div class="overlay" v-if="show">
        <div class="overlay-content">
            <p><a @click="this.$router.push({ name: 'profilePage' })">Ver Perfil</a></p>
            <p><a @click="logout">Logout</a></p>
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
            userStore.setUser(null);
            this.$router.push({ name: 'home' });
        }
    }
};
</script>

<style scoped>
.overlay {
    position: absolute;
    right: 0;
    display: flex;
    padding-right: 0.5%;
    z-index: 999;
}

.overlay-content {
    background-color: #EDEDED;
    border-radius: 10px;

}

.overlay-content p {
    font-family: 'open sans', sans-serif;
    font-size: 15px;
    color: black;
    width: 180px;
    text-align: center;
    cursor: pointer;
}
</style>
