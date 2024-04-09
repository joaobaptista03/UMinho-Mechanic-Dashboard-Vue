<template>
    <div>
    <login-button @login-clicked="showLoginModal = true"></login-button>
    <login-modal
        :show="showLoginModal"
        @close="showLoginModal = false"
        @login-success="handleLoginSuccess"
    ></login-modal>
    </div>
</template>

<script>
import LoginButton from './LoginButton.vue';
import LoginModal from './LoginModal.vue';

export default {
    components: {
    LoginButton,
    LoginModal
    },
    data() {
        return {
            showLoginModal: false
        };
    },
    methods: {
        handleLoginSuccess() {
            this.$emit('login-success');
        }
    }
};
</script>
