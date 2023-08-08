<template>
  <a-modal
      v-model:visible="isVisible"
      :footer="false"
      :width="552"
      class="logout-modal"
      :body-style="{padding: '1.875rem'}"
      :title="headerTitle"
      @cancel="handleCancel"
      centered>
    <div class="text-center">
      <img :src="getImageUrl(bodyImage)" alt="" class="w-[186px] mx-auto mb-3">
      <p class="main-title mb-1">{{ bodyTitle }}</p>
      <p class="mb-7">{{ bodyMessage }}</p>
      <div class="flex justify-center gap-3 mt-2 child:!min-w-[120px] sm:child:!min-w-[190px]">
        <a-button danger html-type="button" ghost @click.prevent="handleCancel">No</a-button>
        <a-button type="primary" html-type="button" @click.prevent="handleOk">Yes</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {getImageUrl} from "../../utils/url";

const isVisible = ref(false);

interface ShowPayload {
  headerTitle?: string,
  bodyTitle: string,
  bodyImage: string,
  bodyMessage: string,
}

const headerTitle = ref<string | undefined>(undefined);
const bodyImage = ref<string>('');
const bodyTitle = ref<string>('');
const bodyMessage = ref<string>('');

const handleOk = ref<any>(null);
const handleCancel = ref<any>(null);

const hide = () => {
  headerTitle.value = '';
  bodyTitle.value = '';
  bodyMessage.value = '';
  isVisible.value = false;
}

const show = (payload: ShowPayload) => {
  headerTitle.value = payload.headerTitle;
  bodyTitle.value = payload.bodyTitle;
  bodyImage.value = payload.bodyImage;
  bodyMessage.value = payload.bodyMessage;
  isVisible.value = true;

  return new Promise((resolve, reject) => {
    handleOk.value = () => {
      resolve(null);
      hide();
    };
    handleCancel.value = () => {
      reject();
      hide();
    };
  });
}

defineExpose({
  show,
  hide
});
</script>

<style lang="scss">
</style>
