<template>
  <a-modal v-model:visible="isVisible"
           title="Create new block"
           :footer="false"
           :width="552"
           centered>
    <a-form
      layout="vertical"
      :model="formModel"
      :rules="formRules"
      @finish="handleAddTicket"
    >
      <a-form-item
        label="Block Name"
        name="subject"
      >
        <a-select
          v-model:value="formModel.subject"
          :options="listBlockName"
        >
        </a-select>
      </a-form-item>
      <a-form-item
        label="Param (Optional)"
        name="content"
        class="!mb-4"
      >
        <a-input v-model:value="formModel.content"/>
      </a-form-item>
      <a-form-item class="!mb-0">
        <div
          class="flex justify-center gap-3 mt-2 child:!min-w-[120px] sm:child:!min-w-[190px]">
          <a-button type="ghost" danger @click.prevent="hide">Cancel</a-button>
          <a-button type="primary" html-type="submit">Save</a-button>
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {ref, computed} from "vue";
import type {CreatePosTicketTemplateRequest} from "gap-nodejs-sdk";

const props = defineProps<{
  ticketListBlockName: any,
}>();

const emits = defineEmits<{
  (e: 'addTicket', data: CreatePosTicketTemplateRequest): void,
}>();

const formModel = ref<CreatePosTicketTemplateRequest>({
  subject: '',
  content: '',
  type: '',
});

const formRules = ref({
  subject: [{required: true, message: 'Please input template subject!', trigger: 'change'}],
})

const listBlockName = computed(() => props.ticketListBlockName.map((item: any) => ({
  label: item.name,
  value: item.subject
})));

const handleAddTicket = async () => {
  emits('addTicket', formModel.value);
};

const isVisible = ref(false);

const show = (type?: string) => {
  formModel.value = {
    subject: '',
    content: '',
    type: type,
  }
  isVisible.value = true;
}
const hide = () => {
  isVisible.value = false;
}

defineExpose({
  show,
  hide
});
</script>

<style scoped>

</style>
