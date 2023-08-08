<template>
  <a-modal v-model:visible="isVisible"
           title="Select network printer"
           :footer="false"
           :width="552"
           centered>
    <a-form layout="vertical" :model="blockData">
      <div class="flex justify-center">
        <base-loading/>
      </div>
      <div class="flex justify-center gap-3 mt-2 child:!min-w-[120px] sm:child:!min-w-[190px]">
        <a-button type="primary" ghost class="text-center" @click.prevent="handleScan" disabled>Scan</a-button>
        <a-button type="primary" html-type="submit" class="text-center" disabled>Connect</a-button>
      </div>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {ref} from "vue";
import BaseLoading from "@/components/BaseLoading.vue";

const isVisible = ref(false);
const blockData = ref({
  name: '',
  param: ''
});

const show = () => {
  blockData.value = {
    name: '',
    param: ''
  }
  isVisible.value = true;
}
const hide = () => {
  isVisible.value = false;
}
const handleScan = () => {

}

defineExpose({
  show,
  hide
});
</script>

<style scoped>

</style>
