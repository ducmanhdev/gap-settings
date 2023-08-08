<template>
  <div class="h-full flex flex-col">
    <breadcrumb class="shrink-0"></breadcrumb>
    <a-card class="grow">
      <h2 class="main-title">Select Language</h2>
      <a-form :model="formModel" @finish="handleUpdate">
        <a-form-item class="!mb-4 sm:!mb-7" name="language">
          <a-select class="w-full shadow" v-model:value="formModel.language" :options="languageList"></a-select>
        </a-form-item>
        <a-form-item class="sm:text-center !mb-0">
          <a-button type="primary" html-type="submit" :loading="isGetLoading || isUpdateLoading">Save</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import {useSettingStore} from "@/stores/setting";
import type {GetKeyStorageResponse} from "gap-nodejs-sdk";
import {notification} from "ant-design-vue";
import handleError from "@/utils/error";

const settingStore = useSettingStore();
const {getKeyStorage, updateKeyStorage} = settingStore;


const languageList = ref([
    { label: 'English', value: 'en' },
    { label: 'Deutsch', value: 'de' },
    { label: 'French', value: 'fr' },
    { label: 'Spanish', value: 'sp' },
    { label: 'Italian', value: 'it' },
    { label: 'Dutch', value: 'nl' },
    { label: 'Danish', value: 'da' },
    { label: 'Swedish', value: 'sw' },
    { label: 'Portuguese', value: 'pt' },
    { label: 'Czech', value: 'cs' },
    { label: 'Finnish', value: 'fi' },
    { label: 'Irish', value: 'ir' },
    { label: 'Polish', value: 'pl' }
]);
const formModel = ref({
  language: languageList.value[0].value
})
const key = "config.checkin.language";
const isGetLoading = ref(false);
const handleGet = async () => {
  try {
    isGetLoading.value = true;
    const response: GetKeyStorageResponse = await getKeyStorage({key});
    formModel.value.language = response.value!;
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isGetLoading.value = false;
  }
};
handleGet();

const isUpdateLoading = ref(false);
const handleUpdate = async () => {
  try {
    isUpdateLoading.value = true;
    await updateKeyStorage({
      key: key,
      value: formModel.value.language
    });
    notification.success({
      message: 'Success',
      description: 'Update language success!'
    })
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isUpdateLoading.value = false;
  }
}
</script>

<style scoped>
</style>
