<script setup>
const route = useRoute()
const token = route.query.token

if (token) {
  localStorage.setItem('token', token)
}
</script>

<template>
  <div class="p-10">
    <h1 class="text-2xl font-bold mb-6">Select Your Role</h1>

    <button class="btn">Visitor</button>
    <button class="btn">Company</button>
    <button class="btn">Organizer</button>
  </div>
</template>