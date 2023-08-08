<template>
  <div class="min-h-[60px] py-2 border-b sm:flex items-center justify-between space-y-3 sm:space-y-0 sm:space-x-3">
    <p class="main-title mb-0">Combo</p>
    <div class="flex items-start space-x-2 sm:space-x-3">
      <a-select v-model:value="detailFilterSelected" :options="detailFilterList"
                class="custom-mobile-select"></a-select>
      <button
        type="button"
        class="main-btn main-btn--sm main-btn--primary self-stretch"
        @click="handleOpenCreateCombo">
        Add Combo
      </button>
    </div>
  </div>
  <div class="py-3">
    <div class="overflow-auto">
      <div class="min-w-[600px]">
        <div class="font-medium grid grid-cols-[1fr_6fr_3fr_3fr_4fr] p-2 gap-3 items-center text-center">
          <div></div>
          <div v-for="item in comboListHeader" :key="item.name">{{ item.name }}</div>
        </div>
        <a-skeleton active v-if="isGetListComboLoading"/>
        <div v-else-if="listCombo && listCombo.length" class="relative">
          <draggable
            v-model="listCombo"
            @end="handleSortProductList"
            handle=".drag-button"
            item-key="id"
          >
            <template #item="{element}">
              <div class="mb-3 last:mb-0 transition border hover:border-primary bg-white text-black">
                <div class="cursor-pointer grid grid-cols-[1fr_6fr_3fr_3fr_4fr] p-2 gap-3 items-center text-center"
                     @click="element.isShowCombo = !element.isShowCombo">
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
                  <div class="grid grid-cols-[auto_auto] items-center justify-center content-center gap-3">
                    <svg @click.stop="handleOpenUpdateCombo(element)" class="cursor-pointer" width="18" height="19"
                         viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12.75 2.74998C12.947 2.553 13.1808 2.39674 13.4382 2.29014C13.6956 2.18353 13.9714 2.12866 14.25 2.12866C14.5286 2.12866 14.8044 2.18353 15.0618 2.29014C15.3192 2.39674 15.553 2.553 15.75 2.74998C15.947 2.94697 16.1032 3.18082 16.2098 3.43819C16.3165 3.69556 16.3713 3.97141 16.3713 4.24998C16.3713 4.52856 16.3165 4.80441 16.2098 5.06178C16.1032 5.31915 15.947 5.553 15.75 5.74998L5.625 15.875L1.5 17L2.625 12.875L12.75 2.74998Z"
                        stroke="#909090" stroke-width="1.5" stroke-linecap="round"
                        stroke-linejoin="round"></path>
                    </svg>
                    <svg @click.stop="handleDeleteCombo(element)" class="cursor-pointer" width="18" height="18"
                         viewBox="0 0 18 18" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.25 4.5H3.75H15.75" stroke="#909090" stroke-width="1.5" stroke-linecap="round"
                            stroke-linejoin="round"/>
                      <path
                        d="M14.25 4.5V15C14.25 15.3978 14.092 15.7794 13.8107 16.0607C13.5294 16.342 13.1478 16.5 12.75 16.5H5.25C4.85218 16.5 4.47064 16.342 4.18934 16.0607C3.90804 15.7794 3.75 15.3978 3.75 15V4.5M6 4.5V3C6 2.60218 6.15804 2.22064 6.43934 1.93934C6.72064 1.65804 7.10218 1.5 7.5 1.5H10.5C10.8978 1.5 11.2794 1.65804 11.5607 1.93934C11.842 2.22064 12 2.60218 12 3V4.5"
                        stroke="#909090" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                </div>
                <Transition name="slide-fade">
                  <div v-if="element.isShowCombo" class="border-t">
                    <div class="grid grid-cols-[1fr_6fr_3fr_3fr_4fr] p-2 gap-3 items-center text-center"
                         v-for="item in element.combo_item"
                         :key="item.id"
                    >
                      <div></div>
                      <div>{{ item.item_detail.name }}</div>
                      <div>{{ `$${item.item_detail.price || 0}` }}</div>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                </Transition>
              </div>
            </template>
          </draggable>
          <base-loading-overlay v-if="isSortListComboLoading"></base-loading-overlay>
        </div>
        <a-empty v-else class="!mt-4"></a-empty>
      </div>
    </div>
  </div>
  <create-combo
    ref="createComboRef"
    :category-name="categoryName"
    :category-id="categoryId"
    @get-list-combo="handleGetComboSiteList"
    :key="comboComponentKey"
  >
  </create-combo>
  <confirm-modal ref="confirmModalRef"></confirm-modal>
</template>

<script setup lang="ts">
import {nextTick, ref, watch} from "vue";
import {notification} from "ant-design-vue";
import CreateCombo from "./CreateCombo.vue";
import ConfirmModal from "@/components/modals/ConfirmModal.vue";
import {useGeneralStore} from "@/stores/general";
import BaseLoadingOverlay from "@/components/BaseLoadingOverlay.vue";
import handleError from "@/utils/error";
import draggable from 'vuedraggable';
import {currencyFormat} from "../../../../utils/formatter";

const generalStore = useGeneralStore();
const {getComboSiteList, deleteCombo, sortCombo} = generalStore;

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

const listCombo = ref<any>([]);
const isGetListComboLoading = ref(false);
const handleGetComboSiteList = async () => {
  try {
    isGetListComboLoading.value = true;
    listCombo.value = [];
    await getComboSiteList({
      category_id: props.categoryId,
      status: detailFilterSelected.value as any
    });
    listCombo.value = ((generalStore?.listCombo.data || []) as unknown as any[]).map((item: any) => ({
      ...item,
      isShowDetail: false,
    }));
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isGetListComboLoading.value = false;
  }
};
const createComboRef = ref<InstanceType<typeof CreateCombo> | null>(null);
const comboComponentKey = ref<number>(1);
const handleOpenCreateCombo = async () => {
  comboComponentKey.value += 1;
  await nextTick();
  createComboRef.value?.show({
    category_id: props.categoryId,
    cate_name: props.categoryName
  });
}
const handleOpenUpdateCombo = async (data: any) => {
  comboComponentKey.value += 1;
  await nextTick();
  createComboRef.value?.show({
    category_id: props.categoryId,
    cate_name: props.categoryName,
    ...data,
  });
}
const handleDeleteCombo = async (item: any) => {
  try {
    await confirmModalRef.value?.show({
      bodyImage: 'delete-staff.svg',
      bodyTitle: 'Oh no!',
      bodyMessage: 'Do you want to delete this item?'
    })
    await deleteCombo({
      id: item.id,
      status: 'delete'
    });
    notification.success({
      message: 'Success',
      description: 'Delete combo success',
    });
    await handleGetComboSiteList();
  } catch (error) {
    if (!error) return;
    handleError({
      error: error
    })
  } finally {

  }
}
const isSortListComboLoading = ref(false);
const handleSortProductList = async () => {
  isSortListComboLoading.value = true;
  try {
    await sortCombo({
      items: listCombo.value.map((item: any) => item.id).join(','),
    })
    notification.success({
      message: 'Success',
      description: 'Sort combo success',
    });
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isSortListComboLoading.value = false;
  }
}
const comboListHeader = ref([
  {
    name: 'Combo name',
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
watch([() => props.categoryId, detailFilterSelected], handleGetComboSiteList, {immediate: true});
</script>

<style lang="scss" scoped>
:deep {
  @media (max-width: 640px) {
    .custom-mobile-select.ant-select-single:not(.ant-select-customize-input) .ant-select-selector {
      padding-left: 0.5rem;
      padding-right: 0.5rem;
    }
  }
}
</style>
