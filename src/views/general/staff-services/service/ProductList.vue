<template>
  <div class="min-h-[60px] py-2 border-b sm:flex items-center justify-between space-y-3 sm:space-y-0 sm:space-x-3">
    <p class="main-title mb-0">Product</p>
    <div class="flex items-start space-x-2 sm:space-x-3">
      <a-select v-model:value="detailFilterSelected" :options="detailFilterList"></a-select>
      <button
          type="button"
          class="main-btn main-btn--sm main-btn--primary self-stretch"
          @click="handleOpenCreateProduct">
        Add Product
      </button>
    </div>
  </div>
  <div class="py-3">
    <div class="overflow-auto">
      <div class="min-w-[600px]">
        <div class="font-medium grid grid-cols-[1fr_6fr_3fr_3fr_4fr] p-2 gap-3 items-center text-center">
          <div></div>
          <div v-for="item in productListHeader" :key="item.name">{{ item.name }}</div>
        </div>
        <a-skeleton active v-if="isGetListProductLoading"/>
        <div v-else-if="listProduct && listProduct.length" class="relative">
          <draggable
            v-model="listProduct"
            @end="handleSortProductList"
            handle=".drag-button"
            item-key="id"
          >
            <template #item="{element}">
              <div
                class="cursor-pointer mb-3 last:mb-0 transition hover:border-primary bg-white text-black border rounded grid grid-cols-[1fr_6fr_3fr_3fr_4fr] p-2 gap-3 items-center text-center"
                @click="handleOpenUpdateProduct(element)"
              >
                <svg class="mx-auto cursor-pointer drag-button" width="14" height="14" viewBox="0 0 14 14" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M5.72727 5.09091H8.27273V3.18182H10.1818L7 0L3.81818 3.18182H5.72727V5.09091ZM5.09091 5.72727H3.18182V3.81818L0 7L3.18182 10.1818V8.27273H5.09091V5.72727ZM14 7L10.8182 3.81818V5.72727H8.90909V8.27273H10.8182V10.1818L14 7ZM8.27273 8.90909H5.72727V10.8182H3.81818L7 14L10.1818 10.8182H8.27273V8.90909Z"
                    fill="#929292"/>
                </svg>
                <div>{{ element.name }}</div>
                <div>{{ element.price ? currencyFormat(element.price) : 'N/A' }}</div>
                <div>
                  <a-checkbox :checked="element.status === 1"></a-checkbox>
                </div>
                <svg @click.stop="handleRemoveProduct(element)" class="mx-auto cursor-pointer" width="18" height="18"
                     viewBox="0 0 18 18" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.25 4.5H3.75H15.75" stroke="#909090" stroke-width="1.5" stroke-linecap="round"
                        stroke-linejoin="round"/>
                  <path
                    d="M14.25 4.5V15C14.25 15.3978 14.092 15.7794 13.8107 16.0607C13.5294 16.342 13.1478 16.5 12.75 16.5H5.25C4.85218 16.5 4.47064 16.342 4.18934 16.0607C3.90804 15.7794 3.75 15.3978 3.75 15V4.5M6 4.5V3C6 2.60218 6.15804 2.22064 6.43934 1.93934C6.72064 1.65804 7.10218 1.5 7.5 1.5H10.5C10.8978 1.5 11.2794 1.65804 11.5607 1.93934C11.842 2.22064 12 2.60218 12 3V4.5"
                    stroke="#909090" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </template>
          </draggable>
          <base-loading-overlay v-if="isSortListProductLoading"></base-loading-overlay>
        </div>
        <a-empty v-else class="!mt-4"></a-empty>
      </div>
    </div>
  </div>
  <create-product
      ref="createProductRef"
      :category-name="categoryName"
      :category-id="categoryId"
      @get-list-product="handleGetListProduct">
  </create-product>
  <confirm-modal ref="confirmModalRef"></confirm-modal>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {notification} from "ant-design-vue";
import CreateProduct from "./CreateProduct.vue";
import ConfirmModal from "@/components/modals/ConfirmModal.vue";
import {useGeneralStore} from "@/stores/general";
import type {GetPosListProductResponse} from "gap-nodejs-sdk";
import BaseLoadingOverlay from "@/components/BaseLoadingOverlay.vue";
import handleError from "@/utils/error";
import draggable from 'vuedraggable';
import {currencyFormat} from "@/utils/formatter";

const generalStore = useGeneralStore();
const {getListProduct, deleteProduct, sortProduct} = generalStore;

interface Props {
  categoryId: number,
  categoryName: string,
}

const props = defineProps<Props>();

const confirmModalRef = ref<InstanceType<typeof ConfirmModal> | null>(null);
const detailFilterList = ref([
  {
    label: 'All',
    value: null
  },
  {
    label: 'Active',
    value: '1',
  },
  {
    label: 'Inactive',
    value: '0'
  }
]);
const detailFilterSelected = ref(detailFilterList.value[1].value);

const listProduct = ref<GetPosListProductResponse>([]);
const isGetListProductLoading = ref(false);
const handleGetListProduct = async () => {
  try {
    isGetListProductLoading.value = true;
    listProduct.value = [];
    await getListProduct({
      category_id: props.categoryId,
      status: detailFilterSelected.value as any
    });
    listProduct.value = generalStore.listProduct;
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isGetListProductLoading.value = false;
  }
};
const createProductRef = ref<InstanceType<typeof CreateProduct> | null>(null);
const handleOpenCreateProduct = () => {
  createProductRef.value?.show({
    category_id: props.categoryId,
    cate_name: props.categoryName
  });
}
const handleOpenUpdateProduct = (data: any) => {
  createProductRef.value?.show({
    category_id: props.categoryId,
    cate_name: props.categoryName,
    ...data,
  });
}
const handleRemoveProduct = async (item: any) => {
  try {
    await confirmModalRef.value?.show({
      bodyImage: 'delete-staff.svg',
      bodyTitle: 'Oh no!',
      bodyMessage: 'Do you want to delete this item?'
    })
    await deleteProduct({
      id: item.id,
      category_id: item.category_id,
      statusFilter: item.statusFilter
    });
    notification.success({
      message: 'Success',
      description: 'Delete product success',
    });
    await handleGetListProduct();
  } catch (error) {
    if(!error) return;
    handleError({
      error: error
    })
  } finally {

  }
}
const isSortListProductLoading = ref(false);
const handleSortProductList = async () => {
  isSortListProductLoading.value = true;
  try {
    await sortProduct({
      items: listProduct.value.map((item: any) => item.id).join(','),
    })
    notification.success({
      message: 'Success',
      description: 'Sort product success',
    });
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isSortListProductLoading.value = false;
  }
}
const productListHeader = ref([
  {
    name: 'Product name',
  },
  {
    name: 'Price'
  },
  {
    name: 'Active'
  },
  {
    name: 'Action'
  },
]);
watch([() => props.categoryId, detailFilterSelected], handleGetListProduct, {immediate: true});
</script>

<style lang="scss" scoped>
</style>
