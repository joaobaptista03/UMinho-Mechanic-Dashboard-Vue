<template>
    <div class="login-modal" v-if="show">
    <div class="modal-content">
        <h2>Login</h2>
        <form @submit.prevent="submitLogin">
            <input type="text" id="username" placeholder="Nome de utilizador" v-model="username">
            <input type="password" id="password" placeholder="Palavra-Passe" v-model="password">
            <p v-if="loginError" class="error-message">{{ loginError }}</p>
            <div class="form-actions">
                <button type="button" @click="close">Cancelar</button>
                <button type="submit">Confirmar</button>
            </div>
        </form>
    </div>
    </div>
</template>

<script>
export default {
    props: ['show'],
    data() {
    return {
        username: '',
        password: '',
        loginError: ''
    }
    },
    methods: {
        submitLogin() {
            if (this.checkLogin(this.username, this.password)) {
                this.loginError = '';
                this.$emit('login-success');
                this.close();
            } else {
                this.loginError = 'Palavra-passe e/ou email estão incorretos';
            }
        },
        checkLogin(username, password) {
            // Simulate a check against a database
            return username === 'user' && password === 'password';
        },
        close() {
            this.username = '';
            this.password = '';
            this.loginError = '';
            this.$emit('close');
        }
    }
}
</script>

<style>
.login-modal {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
form input {
    width: 100%;
    padding: 10px;
    margin: 5px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
}
.modal-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    width: 500px;
}
.modal-content h2, label {
    color: black;
}
.error-message {
    color: red;
}
</style>