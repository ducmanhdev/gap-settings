<template>
  <div class="sm:h-full flex flex-col">
    <breadcrumb class="shrink-0"></breadcrumb>
    <a-card class="grow">
      <base-tab-nav
          :tab-list="tabList"
          v-model="activeKey">
      </base-tab-nav>
      <a-form :model="formModel" :rules="formRules" @finish="handleUpdatePolicies">
        <a-form-item>
          <div class="flex text-secondary">
            <svg class="shrink-0 mr-3" width="20" height="20" viewBox="0 0 20 20" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M9.99999 18.3333C14.6024 18.3333 18.3333 14.6023 18.3333 9.99996C18.3333 5.39759 14.6024 1.66663 9.99999 1.66663C5.39762 1.66663 1.66666 5.39759 1.66666 9.99996C1.66666 14.6023 5.39762 18.3333 9.99999 18.3333Z"
                  stroke="#909090" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10 6.66663V9.99996" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10 13.3334H10.0083" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="self-center">You can add your liability policies here so customers will need to agree with it when they check in on the ipad</span>
          </div>
        </a-form-item>
        <a-form-item class="!mb-7">
          <ckeditor :editor="editor" v-model="formModel.content" :config="editorConfig"></ckeditor>
        </a-form-item>
        <a-form-item class="!mb-7" v-if="activeKey === 'liability-policies'">
          <a-checkbox v-model:checked="formModel.confirm" class="!text-secondary">
            By checking the box, I am the business owner and understand
            that this template is just the suggestion from Go Check In and Go Check In will not bear any
            responsibility
            of the above content.
          </a-checkbox>
        </a-form-item>
        <a-form-item class="!mb-0">
          <a-button
              type="primary"
              html-type="submit"
              :disabled="activeKey === 'liability-policies' && !formModel.confirm"
              :loading="isGetPoliciesLoading || isUpdatePoliciesLoading"
          >
            Save
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
// @ts-ignore
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {useGeneralStore} from "@/stores/general";
import {notification} from "ant-design-vue";
import BaseTabNav from "@/components/BaseTabNav.vue";
import handleError from "@/utils/error";

const generalStore = useGeneralStore();

const {getPolicies, updatePolicies} = generalStore;
const tabList = ref([
  {
    label: 'Liability policies',
    value: 'liability-policies'
  },
  {
    label: 'Cancellation policies',
    value: 'cancellation-policies'
  },
  {
    label: 'Other policies',
    value: 'other-policies'
  }
]);
const activeKey = ref(tabList.value[0].value);
const editor = ClassicEditor;
const editorConfig = {};

const formModel = ref({
  content: '',
  confirm: false,
})

const formRules = ref({})

const isGetPoliciesLoading = ref(false);
const handleGetPolicies = async () => {
  try {
    isGetPoliciesLoading.value = true;
    await getPolicies();
    const selectedPolicy: any = generalStore.policies.find((item: any) => item.slug === activeKey.value);
    formModel.value.content = selectedPolicy?.body || '';
    formModel.value.confirm = false;
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isGetPoliciesLoading.value = false;
  }
};
watch(activeKey, handleGetPolicies, {immediate: true});

const isUpdatePoliciesLoading = ref(false);
const handleUpdatePolicies = async () => {
  try {
    isUpdatePoliciesLoading.value = true;
    await updatePolicies({
      type: activeKey.value,
      value: formModel.value.content
    })
    notification.success({
      message: 'Success',
      description: 'Update policies success!'
    })
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isUpdatePoliciesLoading.value = false;
  }
}
</script>
<style lang="scss" scoped>
:deep {
  .ck-editor__editable {
    min-height: 240px;
  }
  .custom-tabs-nav > li {
    @media (max-width: 640px) {
      flex: 0 0 auto;
    }
  }
}
</style>
