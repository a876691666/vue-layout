<template>
  <div>
    <slot />
  </div>
</template>
<script lang="ts" setup>
import { onUpdated } from 'vue';

onUpdated(() => {
  // console.log(111);
});
</script>
