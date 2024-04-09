<template>
    <div id="app">
        <Home v-if="!isAuthenticated" @login-success="isAuthenticated = true"></Home>
        <LoggedHome v-if="isAuthenticated" @logout="logout"></LoggedHome>
    </div>
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
