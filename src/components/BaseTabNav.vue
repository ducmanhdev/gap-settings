<template>
  <ul class="custom-tabs-nav">
    <li
        v-for="item in tabList"
        :key="item.value" @click="tabActive = (item as any).value"
        :class="{active: tabActive === (item as any).value}"
    >
      {{ (item as any).label }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import {computed} from "vue";

interface TabList {
  label: string,
  value: string
}

interface Props {
  tabList: TabList[],
  modelValue: string,
}

const props = defineProps<Props>();
const emits = defineEmits(['update:modelValue']);
const tabActive = computed({
  get() {
    return props.modelValue;
  },
  set(newKey) {
    emits('update:modelValue', newKey)
  }
});
</script>

<style lang="scss" scoped>

</style>
