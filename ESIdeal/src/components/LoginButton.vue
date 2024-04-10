<template>
    <button class="loginButton" @click="openLoginModal"><a>Login</a></button>
</template>

<script>
export default {
    methods: {
        openLoginModal() {
            this.$emit("login-clicked");
        },
    },
};
</script>

<style>
.loginButton {
    background-color: #FF9D73;
    border-radius: 20px;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    width: 120%;
    transition: all 0.5s ease;
}

.loginButton a{
    color: white;
    text-decoration: none;
}

.loginButton:hover {
    scale: 1.1;
    cursor: pointer;
}
</style>
