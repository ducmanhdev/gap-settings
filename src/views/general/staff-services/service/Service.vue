<template>
  <div class="sm:h-full flex flex-col">
    <breadcrumb class="shrink-0"></breadcrumb>
    <a-card class="grow" :body-style="{padding: 0, height: '100%'}">
      <div class="grid grid-cols-1 sm:grid-cols-[312px_1fr] gap-3.5 sm:gap-0 sm:h-full">
        <div class="shadow sm:shadow-lg rounded-lg sm:rounded-none bg-white sm:bg-inherit px-3 divide-y grid grid-rows-[auto_auto_1fr]">
          <div class="min-h-[60px] py-2 flex justify-between items-center space-x-3">
            <p class="main-title mb-0">Categories</p>
            <svg @click="handleOpenCreateCategory" class="cursor-pointer" width="28" height="28" viewBox="0 0 28 28"
                 fill="none"
                 xmlns="http://www.w3.org/2000/svg">
              <rect width="28" height="28" rx="4" fill="#129BA4"/>
              <path d="M14 8V20" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 14H20" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="py-3 flex space-x-3">
            <button
                v-for="item in categoryStatusList"
                type="button"
                class="main-btn main-btn--sm"
                :class="[categoryStatusSelected === item.value ? 'main-btn--primary' : 'main-btn--outline-gray']"
                @click="categoryStatusSelected = item.value">
              {{ item.label }}
            </button>
          </div>
          <div class="pt-3 mb-3 space-y-3">
            <div class="relative sm:h-full">
              <base-loading-overlay v-if="isSortListCategoryLoading"></base-loading-overlay>
              <a-skeleton active v-if="isGetListCategoryLoading"/>
              <div v-else-if="listCategory && listCategory.length"
                   class="sm:absolute top-0 left-0 right-0 bottom-0 sm:overflow-auto">
                <draggable
                    v-model="listCategory"
                    @end="handleSortCategoryList"
                    handle=".drag-button"
                    item-key="id"
                >
                  <template #item="{element}">
                    <category-item
                        :key="element"
                        :item="element"
                        :is-active="categorySelected.id === element.id"
                        @click="categorySelected = element"
                        @update="handleOpenUpdateCategory(element)"
                        @delete="handleDeleteCategory(element)"
                        class="mb-2 sm:mb-3 last:mb-0"
                    >
                    </category-item>
                  </template>
                </draggable>
              </div>
              <div class="text-center" v-else>Empty category</div>
            </div>
          </div>
        </div>
        <div class="shadow sm:shadow-lg rounded-lg sm:rounded-none bg-white sm:bg-inherit px-4">
          <template v-if="categorySelected">
            <service-list
                v-if="categorySelected.type === 'service' || categorySelected.type === null"
                :category-id="categorySelected.id"
                :category-name="categorySelected.name"
                :category-color="categorySelected?.color_detail?.color_code"
            >
            </service-list>
            <product-list
                v-if="categorySelected.type === 'product'"
                :category-id="categorySelected.id"
                :category-name="categorySelected.name"
            >
            </product-list>
            <combo-list
                v-if="categorySelected.type === 'combo'"
                :category-id="categorySelected.id"
                :category-name="categorySelected.name"
            >
            </combo-list>
          </template>
        </div>
      </div>
    </a-card>
  </div>
  <create-category ref="createCategoryRef" @get-list-category="handleGetListCategory"></create-category>
  <confirm-modal ref="confirmModalRef"></confirm-modal>
</template>

<script setup lang="ts">
import {ref, watch, watchEffect} from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import CategoryItem from "./CategoryItem.vue";
import CreateCategory from "./CreateCategory.vue"
import ConfirmModal from "@/components/modals/ConfirmModal.vue";
import {useGeneralStore} from "@/stores/general";
import {notification} from "ant-design-vue";
import ServiceList from "./ServiceList.vue";
import ProductList from "./ProductList.vue";
import ComboList from "./ComboList.vue";
import type {GetCheckInListCategoryResponse} from "gap-nodejs-sdk";
import BaseLoadingOverlay from "@/components/BaseLoadingOverlay.vue";
import handleError from "@/utils/error";
import draggable from 'vuedraggable';

const confirmModalRef = ref<InstanceType<typeof ConfirmModal> | null>(null);
const generalStore = useGeneralStore();
const listCategory = ref<GetCheckInListCategoryResponse>([]);

const {
  getListCategory,
  deleteCategory,
  sortCategory
} = generalStore;
const isGetListCategoryLoading = ref(false);
const categoryStatusList = ref([
  {
    label: 'Show',
    value: '2',
  },
  {
    label: 'Hide',
    value: '1',
  }
]);
const categoryStatusSelected = ref('2');
const handleGetListCategory = async () => {
  try {
    isGetListCategoryLoading.value = true;
    listCategory.value = [];
    await getListCategory({
      status: categoryStatusSelected.value
    });
    listCategory.value = generalStore.listCategory.filter((item: any) => item.name !== 'Customize' && item.name !== 'Gift Card')
    categorySelected.value = listCategory.value[0]
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isGetListCategoryLoading.value = false;
  }
};
watch(categoryStatusSelected, handleGetListCategory, {immediate: true, deep: true});

const categorySelected = ref<any>(null);
const createCategoryRef = ref<InstanceType<typeof CreateCategory> | null>(null);
const handleOpenCreateCategory = () => {
  createCategoryRef.value?.show();
}
const handleOpenUpdateCategory = (data: any) => {
  createCategoryRef.value?.show(data);
}
const handleDeleteCategory = async (item: any) => {
  try {
    await confirmModalRef.value?.show({
      bodyImage: 'delete-staff.svg',
      bodyTitle: 'Oh no!',
      bodyMessage: 'Do you want to delete this category?'
    })
    await deleteCategory({
      id: item.id,
      type: item.type,
      statusFilter: item.status,
    });
    await handleGetListCategory();
    notification.success({
      message: 'Success',
      description: 'Delete category success',
    });
  } catch (error) {
    if(!error) return;
    handleError({
      error: error
    })
  } finally {

  }
}
const isSortListCategoryLoading = ref(false);
const handleSortCategoryList = async () => {
  isSortListCategoryLoading.value = true;
  try {
    await sortCategory({
      categories: listCategory.value.map((item: any) => item.id).join(',')
    })
    notification.success({
      message: 'Success',
      description: 'Sort category success',
    });
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isSortListCategoryLoading.value = false;
  }
}
</script>

<style lang="scss" scoped>
@media (max-width: 640px) {
  .ant-card {
    background-color: transparent;
    box-shadow: none;
  }
}
</style>
