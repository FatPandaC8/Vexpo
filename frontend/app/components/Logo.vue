<script setup>
    import Logo from '~/assets/images/expo.svg'
</script>

<template>
    <Logo :font-controlled="false"/>
    <!--:font-controlled = false meaning outer class css has higher priority to change the css-->
</template>