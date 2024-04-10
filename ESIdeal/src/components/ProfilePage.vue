<template>
    <div class="profile-page" v-if="show">
        <h2>Perfil de: {{ worker.nome }}</h2>
        <div class="profile-container">
            <div class="profile-details">
                <div class="info-group">
                    <label>Idade</label>
                    <p>{{ worker.idade }}</p>
                </div>
                <div class="info-group">
                    <label>Profissão</label>
                    <p>{{ worker.profissao }}</p>
                </div>
                <div class="info-group">
                    <label>Localização</label>
                    <p>{{ worker.localizacao }}</p>
                </div>
                <div class="info-group">
                    <label>Educação</label>
                    <p>{{ worker.educacao }}</p>
                </div>
                <div class="info-group">
                    <label>Especialização</label>
                    <p>{{ worker.especializacao }}</p>
                </div>
            </div>
            <div class="profile-interests">
                <div class="info-group">
                    <h3>Interesses</h3>
                    <p>{{ worker.interesses }}</p>
                </div>
                <div class="info-group">
                    <h3>Objetivos</h3>
                    <p>{{ worker.objetivos }}</p>
                </div>
                <div class="info-group">
                    <h3>Desafios</h3>
                    <p>{{ worker.desafios }}</p>
                </div>
                <div class="info-group">
                    <h3>Soluções</h3>
                    <p>{{ worker.solucoes }}</p>
                </div>
            </div>
            <div class="profile-quote">
                <blockquote>
                    {{ worker.citacao }}
                </blockquote>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        show: { type: Boolean, required: true },
        username: { type: String, required: true }
    },
    name: 'ProfilePage',
    data() {
        return {
            worker: null,
            error: null // To store potential fetching errors
        };
    },
    async mounted() {
        try {
            const response = await fetch('http://localhost:3000/workers?nome_utilizador=' + this.username);
            if (!response.ok) throw new Error('Failed to fetch');
            const workerC = (await response.json())[0];
            this.worker = workerC;
        } catch (error) {
            this.error = error.message;
        }
    }
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
