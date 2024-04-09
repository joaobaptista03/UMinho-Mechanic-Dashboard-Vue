<template>
    <div class="overlay" v-if="show">
        <div class="overlay-content">
            <a @click="$emit('openProfilePage')">Ver Perfil</a>
            <a @click="$emit('logout')">Logout</a>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        show: Boolean
    },
    name: 'UserProfileOverlay'
};
</script>

<style>

</style>
