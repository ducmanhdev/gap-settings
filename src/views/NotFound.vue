<template>
  <div class="h-full flex justify-center items-center">
    <div class="w-[700px] max-w-full space-y-3 child:mb-0 text-center">
      <h1 class="text-8xl font-bold">404</h1>
      <h2 class="text-2xl font-semibold">PAGE NOT FOUND</h2>
      <router-link :to="{name: 'Home'}" class="main-btn main-btn--primary">Back to home</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss">
</style>
