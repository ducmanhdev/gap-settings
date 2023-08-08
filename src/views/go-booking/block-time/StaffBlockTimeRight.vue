<template>
    <div class="staff-block-time__right"
         :class="{'opacity-50 pointer-events-none': isGetListBusinessTimeOffOfStaffLoading}">
        <div class="overflow-x-auto">
            <div class="flex items-start min-w-[500px]">
                <template v-if="activeStaff">
                    <div
                            class="staff-block-time__right__avatar bg-contain"
                            :style="{
                  backgroundColor: activeStaff?.color_code,
                  backgroundImage: `url(${activeStaff?.image_url})`
                }">
                        {{ avatarName }}
                    </div>
                    <div class="staff-block-time__right__info">
                        <p class="staff-block-time__right__info__title text-lg">
                            <span>Time Off for {{ activeStaff?.name }}</span>
                            <button
                                    class="bg-[#2979FF] text-white px-2 py-2 rounded-lg mr-3 hover:shadow-lg"
                                    @click="timeOffModalRef.open()"
                                    v-if="listBusinessTimeOffOfStaff?.data?.length"
                            >
                                <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24px"
                                        height="24px"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="feather feather-plus h-5 w-5 stroke-current"
                                >
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                            </button>
                        </p>
                        <div class="staff-block-time__right__info__content"
                             v-if="listBusinessTimeOffOfStaff?.data?.length">
                            <div class="overflow-y-auto">
                                <time-off-staff-item
                                        v-for="item in listBusinessTimeOffOfStaff.data"
                                        :item="item"
                                        @click="timeOffModalRef.open(item)"
                                        @delete="handleDeleteTimeOffStaffItem(item.id)"
                                />
                            </div>
                            <paginate
                                    v-if="listBusinessTimeOffOfStaff?._meta?.pageCount > 1 && listBusinessTimeOffOfStaff?._meta"
                                    :page-count="listBusinessTimeOffOfStaff?._meta?.pageCount"
                                    :prev-text="'<'"
                                    :next-text="'>'"
                                    :container-class="'pagination'"
                                    v-model="page"
                                    :click-handler="handlePaginationClick"
                                    first-last-button
                            ></paginate>
                        </div>
                        <div class="add-time-off" v-else>
                            <p>Add time off by clicking the button below.</p>
                            <button class="add-time-off__btn" @click="timeOffModalRef.open()">
                                <img
                                        src="@/assets/images/icon-add-circle.png"
                                        alt=""
                                />
                                <span>Add Time Off</span>
                            </button>
                        </div>
                    </div>
                </template>
                <div v-else class="w-full text-center text-lg font-bold">No staff selected</div>
            </div>
        </div>
        <Teleport to="body">
            <modal-time
                    ref="timeOffModalRef"
                    :staff-id="activeStaff?.user_id"
                    @refresh="handleRefresh"
            />
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import {ref, computed, watch} from "vue";
import TimeOffStaffItem from "./TimeOffStaffItem.vue";
import ModalTime from "./ModalTime.vue";
import {useGoBookingStore} from "@/stores/go-booking";
import {notification} from "ant-design-vue";
import handleError from "@/utils/error";

const goBookingStore = useGoBookingStore();
const props = defineProps<{
    activeStaff: any;
}>();

const page = ref(1);
const timeOffModalRef = ref<any>(null);
const listBusinessTimeOffOfStaff = ref<any>(null);
const isGetListBusinessTimeOffOfStaffLoading = ref(false);
const handleGetListBusinessTimeOffOfStaff = async () => {
    try {
        isGetListBusinessTimeOffOfStaffLoading.value = true;
        listBusinessTimeOffOfStaff.value = await goBookingStore.getListBusinessTimeOffOfStaff({
            filterStaffId: props?.activeStaff?.user_id,
            page: page.value,
        });
        page.value = listBusinessTimeOffOfStaff.value?._meta?.currentPage;
    } catch (error) {
        console.error(error);
    } finally {
        isGetListBusinessTimeOffOfStaffLoading.value = false;
    }
};

const handlePaginationClick = (page: number) => {
    handleGetListBusinessTimeOffOfStaff()
}
watch(() => props.activeStaff?.user_id, () => {
    if (!props.activeStaff) return;
    page.value = 1;
    handleGetListBusinessTimeOffOfStaff();
}, {immediate: true});
const handleRefresh = () => {
    handleGetListBusinessTimeOffOfStaff()
}

const isDeleteTimeOffStaffItem = ref(false);
const handleDeleteTimeOffStaffItem = async (id: number) => {
    try {
        isDeleteTimeOffStaffItem.value = true;
        await goBookingStore.deleteBusinessTimeOff({id});
        await handleGetListBusinessTimeOffOfStaff();
        notification.success({
            message: 'Delete successfully!'
        });
    } catch (error: any) {
        handleError({error})
    } finally {
        isDeleteTimeOffStaffItem.value = false;
    }
};

const avatarName = computed(() => props.activeStaff?.image_url ? '' : props.activeStaff?.name?.split(" ").map((item: any) => item.charAt(0)).join("").slice(0, 2))
</script>
<style lang="scss" scoped>
.staff-block-time__right {
  padding: 20px;
  flex-grow: 1;

  &__avatar {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background-color: rgb(204, 159, 2);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 32px;
    flex-shrink: 0;
  }

  &__info {
    flex-grow: 1;
    padding-left: 1rem;
    align-self: stretch;
    display: flex;
    flex-direction: column;

    &__title {
      font-weight: 500;
      padding-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e5e5e5;
      flex-shrink: 0;
    }

    &__content {
      flex-grow: 1;
      display: flex;
      flex-direction: column;

      .overflow-y-auto {
        flex-grow: 1;
      }

      .pagination {
        flex-shrink: 0;
      }
    }
  }

  @media (max-width: 768px) {
    padding: 0.875rem;
    &__avatar {
      width: 40px;
      height: 40px;
      font-size: 1rem;
    }
  }
}

.add-time-off {
  border: 1px solid #e5e5e5;
  margin: 20px 0;
  padding: 1.5rem 1rem;
  text-align: center;
  color: #262626;
  font-size: 16px;

  &__btn {
    height: 42px;
    background-color: #2979ff;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    color: #fff;
    font-size: 14px;
    display: inline-flex;
    align-items: center;
    margin-top: 15px;

    img {
      width: 15px;
      height: auto;
      margin-right: 5px;
    }
  }
}
</style>