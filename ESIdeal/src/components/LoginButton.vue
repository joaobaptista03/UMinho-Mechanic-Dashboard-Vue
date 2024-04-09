<template>
    <button @click="openLoginModal">Login</button>
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
button {
    background-color: orange;
    border-radius: 20px;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
}
</style>