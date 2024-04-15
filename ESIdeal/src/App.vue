<template>
    <router-view></router-view>
</template>

<script>
export default {
    name: "App",
};
</script>

<style>
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

.navbar a.navlink {
    position: relative;
    text-decoration: none;
    color: white;
    cursor: pointer;
}

.navbar a.navlink::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -5px;
    width: 0;
    height: 2px;
    background-color: #FF7F48;
    transition: width 0.3s ease-in-out, left 0.3s ease-in-out;
}

.navbar a.navlink:hover::after {
    width: 100%;
    left: 0;
}

.profile-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-right: 15%;
    cursor: pointer;
    transition: .5s ease;
}

.profile-container:hover {
    transform: scale(1.1);
}

.navbar img {
    width: 65px;
    height: 65px;
    border-radius: 50%;
}


</style>