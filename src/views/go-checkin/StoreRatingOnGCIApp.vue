<template>
  <div class="h-full flex flex-col">
    <breadcrumb class="shrink-0"></breadcrumb>
    <a-card class="grow">
      <h2 class="main-title">Store Rating On GCI App</h2>
      <a-form :model="formModel">
        <a-form-item>
          <div class="flex space-x-2.5">
            <a-switch
                v-model:checked="formModel.is_visible"
                :checked-value="'1'"
                :un-checked-value="'0'"
                @change="handleUpdate"
                :loading="isLoading"
                class="shrink-0"
            />
            <span>Display store rating on GCI app</span>
          </div>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import {useGoCheckInStore} from "../../stores/go-check-in";
import {notification} from "ant-design-vue";
import handleError from "../../utils/error";

const goCheckInStore = useGoCheckInStore();
const {getStoreRatingDisplay, updateStoreRatingDisplay} = goCheckInStore;
const formModel = ref({
  is_visible: '0',
});
const isLoading = ref(false);
const handleGet = async () => {
  try {
    isLoading.value = true;
    await getStoreRatingDisplay();
    formModel.value.is_visible = goCheckInStore?.storeRatingDisplay?.is_visible || '0';
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isLoading.value = false;
  }
};
handleGet();

const handleUpdate = async (newValue: any) => {
  try {
    isLoading.value = true;
    const formData = new FormData() as any;
    formData.append('status', newValue)
    await updateStoreRatingDisplay(formData);
    notification.success({
      message: 'Success',
      description: 'Update store rating display success',
    });
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isLoading.value = false
  }
};
</script>

<style scoped>
</style>
