<template>
    <div class="overlay" v-if="show">
        <div class="overlay-content">
            <p><a @click="$emit('openProfilePage')">Ver Perfil</a></p>
            <p><a @click="$emit('logout')">Logout</a></p>
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
.overlay {
    position: absolute;
    right: 0;
    display: flex;
    padding-right: 0.5%;
    z-index: 999;
}

.overlay-content {
    background-color: #EDEDED;
    border-radius: 5px;

}

.overlay-content p {
    padding: 1% 5% 1% 1%;
    font-family: 'open sans', sans-serif;
    font-size: 15px;
    color: black;
    width: 180px;
    text-align: center;
}
</style>
