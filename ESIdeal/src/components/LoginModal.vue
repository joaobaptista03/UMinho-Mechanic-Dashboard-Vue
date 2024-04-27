<template>
    <div class="login-modal" v-if="show">
        <div class="modal-content">
            <h2>Login</h2>
            <form @submit.prevent="submitLogin">
                <input type="text" id="username" placeholder="Nome de utilizador" v-model="username">
                <input type="password" id="password" placeholder="Palavra-Passe" v-model="password">
                <span v-if="loginError" class="error-message">{{ loginError }}</span>
                <div class="form-actions">
                    <button type="button" id="cancelar" @click="close">Cancelar</button>
                    <button type="submit">Confirmar</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import bcrypt from 'bcryptjs';
import { useUserStore } from '../stores';

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
        async checkLogin() {
            try {
                const response = await fetch('http://localhost:3000/workers');
                const workers = await response.json();
                
                const worker = workers.find(worker => worker.nome_utilizador === this.username);
                if (!worker) return false;
                
                return await bcrypt.compare(this.password, worker.password);
            } catch (error) {
                console.error(error);
                return false;
            }
        },
        async submitLogin() {
            const userStore = useUserStore();

            if (await this.checkLogin()) {
                this.loginError = '';
                userStore.setUser(this.username);
                this.$router.push({ name: 'servicosAtribuidos' });
                this.close();
            } else {
                this.loginError = 'Palavra-passe e/ou email estão incorretos';
            }
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

<style scoped>
.login-modal {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    top: -15%;
    left: 0;
    width: 100%;
    height: 100%;
}

form input {
    width: 95%;
    padding: 10px;
    margin: 5px 0;
    border: 1px solid #ccc;
    border-radius: 10px;
}

.modal-content {
    background: white;
    border-radius: 20px;
    width: 27%;
    display: flex;
    flex-direction: column;
    padding-left: 1.2%;
    padding-top: 1%;
    padding-bottom: 1%;  
    padding-right: 1.2%;
}

.modal-content h2 {
    display: flex;
    color: #1E1E1E;
    font-size: 35px;
    margin:0;
    margin-bottom: 3%;
}

.form-actions {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 3%;
}

.form-actions button {
    padding: 10px 20px;
    border: none;
    border-radius: 11px;
    background: #FF9D73;
    color: white;
    cursor: pointer;
    width: 40%;
}
#cancelar {
    background: #505050;
}

h2, #username, #password {
    font-family: 'inter' , sans-serif;
    font-size: 15px;
}

.error-message {
    font-family: 'inter', sans-serif;
    color: #C73030 !important; 
    width: 100% !important;
    margin: 5px;
}

</style>
