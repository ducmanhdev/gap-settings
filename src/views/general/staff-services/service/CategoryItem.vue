<template>
  <div
    class="shadow rounded py-2 px-2 sm:px-3.5 flex justify-between items-center space-x-2 sm:space-x-3 cursor-pointer"
    :class="[isActive ? 'bg-primary text-white' : 'bg-white text-black']"
    :style="{'--icon-color': isActive ? 'currentColor' : 'var(--color-C90)'}"
  >
    <div class="flex items-center space-x-2">
      <svg :class="{'opacity-0 pointer-event-none': !isShowDragButton}" class="shrink-0 drag-button" width="20" height="20"
           viewBox="0 0 20 20"
           fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M8.18182 7.27273H11.8182V4.54545H14.5455L10 0L5.45455 4.54545H8.18182V7.27273ZM7.27273 8.18182H4.54545V5.45455L0 10L4.54545 14.5455V11.8182H7.27273V8.18182ZM20 10L15.4545 5.45455V8.18182H12.7273V11.8182H15.4545V14.5455L20 10ZM11.8182 12.7273H8.18182V15.4545H5.45455L10 20L14.5455 15.4545H11.8182V12.7273Z"
          fill="var(--icon-color)"/>
      </svg>
      <div :style="{'background-color': item.color_detail.color_code || '#2DC069'}"
           class="w-[14px] h-[14px] rounded-[2px] shrink-0"></div>
      <span>{{ item.name }}</span>
    </div>
    <div class="grid grid-cols-[18px_18px] gap-2 sm:gap-3 items-center shrink-0 child:cursor-pointer">
      <svg @click.stop="handleUpdate" v-if="isShowEditButton" width="18" height="19" viewBox="0 0 18 19" fill="none"
           xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12.75 2.74998C12.947 2.553 13.1808 2.39674 13.4382 2.29014C13.6956 2.18353 13.9714 2.12866 14.25 2.12866C14.5286 2.12866 14.8044 2.18353 15.0618 2.29014C15.3192 2.39674 15.553 2.553 15.75 2.74998C15.947 2.94697 16.1032 3.18082 16.2098 3.43819C16.3165 3.69556 16.3713 3.97141 16.3713 4.24998C16.3713 4.52856 16.3165 4.80441 16.2098 5.06178C16.1032 5.31915 15.947 5.553 15.75 5.74998L5.625 15.875L1.5 17L2.625 12.875L12.75 2.74998Z"
          stroke="var(--icon-color)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <svg @click.stop="handleDelete" v-if="isShowDeleteButton" width="18" height="19" viewBox="0 0 18 19" fill="none"
           xmlns="http://www.w3.org/2000/svg">
        <path d="M2.25 5H3.75H15.75" stroke="var(--icon-color)" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round"/>
        <path
          d="M14.25 5V15.5C14.25 15.8978 14.092 16.2794 13.8107 16.5607C13.5294 16.842 13.1478 17 12.75 17H5.25C4.85218 17 4.47064 16.842 4.18934 16.5607C3.90804 16.2794 3.75 15.8978 3.75 15.5V5M6 5V3.5C6 3.10218 6.15804 2.72064 6.43934 2.43934C6.72064 2.15804 7.10218 2 7.5 2H10.5C10.8978 2 11.2794 2.15804 11.5607 2.43934C11.842 2.72064 12 3.10218 12 3.5V5"
          stroke="var(--icon-color)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";

interface Item {
  id: number
  name: string
  priority: number
  created_at: string
  group_id: any
  status: string
  type: string
  color_detail: {
    type: number
    id: number
    item_id: number
    color_code: string
    priority: number
    created_at: string
    updated_at: string
    status: number
  }
}

interface Props {
  item: Item
  isActive: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false
});
const isShowDeleteButton = computed(() => props.item.type === 'service');
const isShowEditButton = computed(() => props.item.name !== 'Other')
const isShowDragButton = computed(() => props.item.name !== 'Other');
const emits = defineEmits(['update', 'delete']);
const handleUpdate = () => emits('update');
const handleDelete = () => emits('delete');
</script>

<style scoped>

</style>
