<template>
    <div class="profile-page" v-if="show">
        <div class="title">
            <h2>Perfil de: <span id="worker-name">{{ worker.nome }}</span></h2>
        </div>
        <div class="profile-container">
            <div class="profile-column-divider">
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
                        <label>Interesses</label>
                        <p>{{ worker.interesses }}</p>
                    </div>
                    <div class="info-group">
                        <label>Objetivos</label>
                        <p>{{ worker.objetivos }}</p>
                    </div>
                    <div class="info-group">
                        <label>Desafios</label>
                        <p>{{ worker.desafios }}</p>
                    </div>
                    <div class="info-group">
                        <label>Soluções</label>
                        <p>{{ worker.solucoes }}</p>
                    </div>
                </div>
                
            </div>
            <div class="profile-quote">
                        <label>Citação</label>
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
            error: null 
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
.title {
    display: flex;
    justify-content: center;
}

#worker-name {
    color: #FF9D73;
}

.title h2 {
    font-family: 'Open Sans', sans-serif;
    font-size: 35px;
    margin-bottom: 20px;
}

.profile-container {;
    display:flex;
    flex-direction: column;
    background-color: #EDEDED;
    margin: 10% auto;
    padding: 1% 1% 1% 1%;
    border-radius: 50px;
    width: 70%; 
    margin-top: 20px;
}

.profile-column-divider {
    display: flex;
    align-items: center;
    padding-top:4%;
    
}

.profile-details {
    width: 50%;
}

.profile-interests {
    width: 50%;
    margin-left: 10%;
}

.info-group {
    text-align: center;
    margin-bottom: 35px; 
}

label {
    font-weight: bold;
}

.profile-quote {
    text-align: center;
    display:flex;
    flex-direction: column;
    margin-top: 30px;
    width: 100%;
}

blockquote {
    font-style: italic;
}

p {
    margin-top:8px;
}

</style>
