<template>
  <a-drawer
    v-model:visible="isVisible"
    placement="right"
    :width="500"
    class="create-service"
  >
    <div class="py-3 flex items-center justify-between space-x-3 border-b sticky top-0 left-0 bg-white text-black z-50">
      <h2 class="main-title mb-0">{{ isEdit ? 'Update Category' : 'Create Category' }}</h2>
      <svg @click="hide" class="cursor-pointer" width="28" height="28" viewBox="0 0 28 28" fill="none"
           xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14.0002 25.6667C20.4435 25.6667 25.6668 20.4434 25.6668 14C25.6668 7.55672 20.4435 2.33337 14.0002 2.33337C7.55684 2.33337 2.3335 7.55672 2.3335 14C2.3335 20.4434 7.55684 25.6667 14.0002 25.6667Z"
          stroke="#EB5757" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M17.5 10.5L10.5 17.5" stroke="#EB5757" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round"/>
        <path d="M10.5 10.5L17.5 17.5" stroke="#EB5757" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round"/>
      </svg>
    </div>
    <div class="py-4">
      <a-form
        layout="vertical"
        class="space-y-5 sm:space-y-6"
        :model="formModel"
        :rules="formRules"
        @finish="handleSubmit"
      >
        <div class="child:!mb-0 grid gap-3">
          <a-form-item label="Category name" name="name">
            <a-input v-model:value="formModel.name"/>
          </a-form-item>
          <div>
            <p class="text-C62 font-medium">Category color</p>
            <ul class="grid grid-cols-6 sm:grid-cols-11 gap-3 mb-0 child:aspect-w-1 child:aspect-h-1 child:rounded">
              <li
                class="cursor-pointer opacity-70"
                v-for="color in colorList"
                :key="color"
                :style="{backgroundColor: color}"
                @click="formModel.color_code = color">
                <div
                  class="flex justify-center items-center"
                  v-if="formModel.color_code === color">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 4.5L6.75 12.75L3 9" stroke="white" stroke-width="3" stroke-linecap="round"
                          stroke-linejoin="round"/>
                  </svg>
                </div>
              </li>
            </ul>
          </div>
          <a-form-item label="Status">
            <a-checkbox v-model:checked="isActive">Active</a-checkbox>
          </a-form-item>
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
          <a-button type="primary" html-type="submit" :loading="isLoading">Submit</a-button>
          <a-button type="ghost" danger @click="hide">Cancel</a-button>
        </div>
      </a-form>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import {ref, computed} from "vue";
import {useGeneralStore} from "@/stores/general";
import {notification} from "ant-design-vue";
import type {CreateCheckInCategoryRequest, UpdateCheckInCategoryRequest} from 'gap-nodejs-sdk';
import handleError from "@/utils/error";

const generalStore = useGeneralStore();
const {createCategory, updateCategory} = generalStore;
const isVisible = ref(false);

const emits = defineEmits(['getListCategory']);

const colorList = [
  "#EA5C2B",
  "#2DC069",
  "#4659BD",
  "#C85CE0",
  "#74B42B",
  "#F38702",
  "#596FF6",
  "#F655BD",
  "#07B4A4",
  "#B55812",
  "#217AA3",
  "#FF8E77",
  "#9D67D0",
  "#4BAF28",
  "#CC9F02",
  "#035397",
  "#FF7175",
  "#6E3CBC",
  "#00A3FF",
  "#F1A815",
  "#DCC0E0",
  "#FCB88D",
  "#82CCB5",
  "#71ABDD",
  "#8F9BCE",
  "#C5A896",
  "#F79D8B",
  "#FDCD79",
  "#81D2A2",
  "#6BCADE",
  "#A19CCB",
  "#CCA7AA",
  "#DF93A8",
  "#F4B97C",
  "#B6D884",
  "#8BD4D2",
  "#C083A9",
  "#E6C3A8",
  "#E89B68",
  "#FFA468",
  "#C4C487",
  "#83B5B9",
  "#CCA7CD",
  "#BBB4AC",
  "#942CA6",
  "#D9A429",
  "#A2AE66",
  "#66A7AC",
  "#88729D",
  "#B38888",
  "#BC5ECC",
  "#DC8EEA"
];

interface FormModel {
  id: number | undefined,
  name: string,
  type: string,
  color_code: string,
  status: string
}

const formModel = ref<FormModel>({
  id: undefined,
  name: "",
  type: "",
  status: "2",
  color_code: colorList[0]
});
const isEdit = computed(() => formModel.value.id !== undefined);

const formRules = {
  name: [
    {
      required: true,
      message: 'The category name field is required\n'
    }
  ]
}

const isActive = computed({
  get() {
    return formModel.value.status === "2";
  },
  set(newValue) {
    formModel.value.status = newValue ? "2" : "1";
  }
});

const show = (data?: any) => {
  formModel.value = {
    id: data?.id ?? undefined,
    name: data?.name ?? "",
    type: data?.type ?? "",
    status: data?.status ?? "2",
    color_code: data?.color_detail?.color_code ?? colorList[0]
  }
  isVisible.value = true;
};

const hide = () => {
  isVisible.value = false;
}

const isLoading = ref(false);
const handleCreateCategory = async () => {
  isLoading.value = true;
  try {
    const data: CreateCheckInCategoryRequest = {
      name: formModel.value.name,
      type: formModel.value.type,
      color_code: formModel.value.color_code,
      status: formModel.value.status
    }
    await createCategory(data);
    notification.success({
      message: 'Success',
      description: 'Create category success',
    });
    hide();
    emits('getListCategory');
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isLoading.value = false;
  }
}
const handleUpdateCategory = async () => {
  isLoading.value = true;
  try {
    const data: UpdateCheckInCategoryRequest = {
      id: formModel.value.id!,
      data: {
        id: formModel.value.id!,
        name: formModel.value.name,
        type: formModel.value.type,
        color_code: formModel.value.color_code,
        status: formModel.value.status,
      }
    }
    await updateCategory(data);
    notification.success({
      message: 'Success',
      description: 'Update category success',
    });
    hide();
    emits('getListCategory');
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isLoading.value = false;
  }
}
const handleSubmit = () => {
  isEdit.value ? handleUpdateCategory() : handleCreateCategory();
}
defineExpose({
  show,
  hide
})
</script>

<style lang="scss" scoped>
:deep {
  @media (max-width: 640px) {
    .ant-form-vertical .ant-form-item {
      flex-direction: row;
    }
  }
}
</style>

<style lang="scss">
.create-service {
  .ant-drawer-header {
    display: none;
  }

  .ant-drawer-body {
    padding: 0 1rem;
  }

  .ant-form-item-label {
    > label {
      color: var(--color-C62)
    }
  }
}

.avatar-upload {

}
</style>
