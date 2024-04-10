<template>
        <Home v-if="!isAuthenticated" @login-success="isAuthenticated = true"></Home>
        <LoggedHome v-if="isAuthenticated" @logout="logout"></LoggedHome>
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
            isAuthenticated: false
        };
    },
    methods: {
        logout() {
            this.isAuthenticated = false;
        }
    }
};
</script>

<style scoped>
</style>