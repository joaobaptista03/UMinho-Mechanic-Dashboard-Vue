<template>
    <Home v-if="!isAuthenticated" @login-success="authenticate"></Home>
    <LoggedHome :username="this.username" v-if="isAuthenticated" @logout="logout"></LoggedHome>
</template>

<script>
import Home from './components/Home.vue';
import LoggedHome from './components/LoggedHome.vue';

export default {
    components: {
        Home,
        LoggedHome
    },
    data() {
        return {
            isAuthenticated: false,
            username: null
        };
    },
    methods: {
        authenticate(username) {
            this.isAuthenticated = true;
            this.username = username;
        },
        logout() {
            this.isAuthenticated = false;
            this.username = null;
        }
    }
};
</script>

<style scoped>
</style>