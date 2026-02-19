<script setup>
    import Logo from '~/assets/images/expo.svg'
</script>

<template>
    <Logo class="w-25 h-25" :font-controlled="false"/>
    <!--:font-controlled = false meaning outer class css has higher priority to change the css-->
</template>