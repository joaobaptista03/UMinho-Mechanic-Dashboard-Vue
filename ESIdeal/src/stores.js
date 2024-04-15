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
        }
    }
});