<template>

    <div>
        <header>
            <p>E.S.Ideal</p>
            <div class="navbar">
                <p><a @click="toggleServicosAtribuidos">Serviços Atribuídos</a></p>
                <div class="profile-container">
                    <a id="nav-img" @click="this.showUserProfileOverlay = !this.showUserProfileOverlay">
                        <img :src="userProfilePic"/>
                    </a>  
                </div>
            </div>
        </header>
        
        <UserProfileOverlay :show="showUserProfileOverlay" @openProfilePage="toggleProfilePage" @logout="logout"></UserProfileOverlay>
        <ProfilePage :username="this.username" :show="showProfilePage"></ProfilePage>
    </div>
</template>

<script>
import ProfilePage from './ProfilePage.vue';
import ServicosAtribuidos from './ServicosAtribuidos.vue';
import UserProfileOverlay from './UserProfileOverlay.vue';
import userProfilePic from '@/assets/profilepic.png';

export default {
    props: {
        username: String
    },
    components: {
        ServicosAtribuidos,
        UserProfileOverlay,
        ProfilePage
    },
    data() {
        return {
            showServicosAtribuidos: true,
            showUserProfileOverlay: false,
            showProfilePage: false,
            userProfilePic: userProfilePic
        };
    },
    methods: {
        toggleServicosAtribuidos() {
            this.showUserProfileOverlay = false;
            this.showProfilePage = false;
            this.showServicosAtribuidos = true;
        },
        toggleProfilePage() {
            this.showUserProfileOverlay = false;
            this.showServicosAtribuidos = false;
            this.showProfilePage = true;
        },
        logout() {
            this.$emit("logout");
        }
    },
};
</script>

<style scoped>


header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: #000000; /* Set background color on the header element */
}

header p {
    font-size: 40px;
    color: #FF9D73;
    font-family: 'Inspiration', cursive;
    padding-left: 2%;
    margin: 15px;
}

.navbar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: #000000;
}

.navbar p { /* Cada link do navbar */
    font-family: 'open sans', sans-serif;
    font-size: 15px;
    color: #FFFFFF;
    width: 180px;
    text-align: center;
}

.navbar img {
    width: 65px;
    height: 65px;
    border-radius: 50%;
    padding-right: 20%;
}

#nav-img {
    margin-right: 10%;
}

</style>