<script setup>
const route = useRoute()
const token = route.query.token

if (token) {
  localStorage.setItem('token', token)

  navigateTo('/')
}
</script>

<template>
  <div>Logging you in...</div>
</template>