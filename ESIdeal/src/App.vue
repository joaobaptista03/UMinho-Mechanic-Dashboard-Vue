<template>
    <div id="app">
        <logged-out-page v-if="!isAuthenticated" @login-success="isAuthenticated = true"></logged-out-page>
        <logged-in-page v-if="isAuthenticated"></logged-in-page>
    </div>
</template>

<script>
import LoggedOutPage from './components/Home.vue';
import LoggedInPage from './components/LoggedHome.vue';

export default {
    components: {
    LoggedOutPage,
    LoggedInPage
    },
    data() {
        return {
            isAuthenticated: false
        };
    }
};
</script>