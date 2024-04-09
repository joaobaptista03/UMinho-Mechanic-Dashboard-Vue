<template>
    <div>
        <header>
            <nav>
                <ul>
                    <li><h1>E.S.Ideal</h1></li>
                    <li><a @click="toggleServicosAtribuidos">Serviços Atribuídos</a></li>
                    <li>
                        <a @click="this.showUserProfileOverlay = !this.showUserProfileOverlay">
                            <img :src="userProfilePic" class="profile-pic" />
                        </a>
                    </li>
                </ul>
            </nav>
        </header>
        
        <UserProfileOverlay :show="showUserProfileOverlay" @openProfilePage="toggleProfilePage" @logout="logout"></UserProfileOverlay>
        <ServicosAtribuidos :show="showServicosAtribuidos"></ServicosAtribuidos>
        <ProfilePage :show="showProfilePage"></ProfilePage>
    </div>
</template>

<script>
import ProfilePage from './ProfilePage.vue';
import ServicosAtribuidos from './ServicosAtribuidos.vue';
import UserProfileOverlay from './UserProfileOverlay.vue';

export default {
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
            userProfilePic: 'src/assets/profilepic.png'
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

<style>
.profile-pic {
    width: 50px;
    height: 50px;
    border-radius: 50%;
}
</style>