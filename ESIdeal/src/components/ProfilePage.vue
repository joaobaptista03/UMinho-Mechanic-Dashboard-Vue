<template>
    <div class="profile-page" v-if="show">
        <h2>Perfil de: Diogo</h2>
        <div class="profile-container">
            <div class="profile-details">
                <div class="info-group">
                <label>Idade</label>
                <p>55 anos</p>
                </div>
                <!-- Repeat the info group for each detail -->
                <div class="info-group">
                <label>Profissão</label>
                <p>Mecânico</p>
                </div>
                <!-- ... more fields ... -->
            </div>
            <div class="profile-interests">
                <div class="interests">
                <h3>Interesses</h3>
                <p>Automóveis, futebol, séries</p>
                </div>
                <!-- ... -->
                <div class="challenges">
                <h3>Desafios</h3>
                <p>Adaptar-se às novas tecnologias, evitar erros e reclamações</p>
                </div>
                <!-- ... more fields ... -->
            </div>
            <div class="profile-quote">
                <blockquote>
                "Eu gosto de trabalhar com carros, mas às vezes sinto que não estou preparado para lidar com os novos modelos..."
                <!-- The rest of the quote -->
                </blockquote>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        show: Boolean
    },
    name: 'ProfilePage',
  // Add your data, methods, and other script parts as needed
};
</script>

<style scoped>
.profile-page header {
    background-color: #333;
    color: #fff;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.profile-page main {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.profile-container {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 20px;
    align-items: start;
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
}

.profile-photo img {
  width: 100px; /* Adjust as necessary */
  height: 100px; /* Adjust as necessary */
    border-radius: 50%;
}

.info-group label {
    font-weight: bold;
}

.info-group p {
    margin: 5px 0;
}

.profile-interests, .profile-quote {
    margin-top: 20px;
}

blockquote {
    font-style: italic;
}

/* Add more styles as needed */
</style>
