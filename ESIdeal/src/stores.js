import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        username: null
    }),
    actions: {
        setUser(username) {
            this.username = username;
        },
        clearUser() {
            this.username = null;
        },
        getUser() {
            return this.username;
        }
    }
});

export const useServicoStore = defineStore('servico', {
    state: () => ({
        servico: null
    }),
    actions: {
        setServico(servico) {
            this.servico = servico;
        },
        clearServico() {
            this.servico = null;
        },
        getServico() {
            return this.servico;
        }
    }
});
