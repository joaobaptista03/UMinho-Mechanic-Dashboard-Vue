<template>
    <div>
        <LoginButton @login-clicked="showLoginModal = true"></LoginButton>
        <LoginModal
            :show="showLoginModal"
            @close="showLoginModal = false"
            @login-success="handleLoginSuccess"
        ></LoginModal>
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
