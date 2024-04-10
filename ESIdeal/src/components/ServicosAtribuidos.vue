<template>
    <div class="servicosAtribuidos" v-if="show">
        <h2>Serviços Atribuídos</h2>
        
    </div>
</template>

<script>
export default {
    props: {
        show: Boolean,
        username: String
    },
    name: 'ServicosAtribuidos',
};
</script>

<style>

</style>