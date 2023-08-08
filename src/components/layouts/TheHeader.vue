<template>
    <header
            class="shrink-0 sticky top-0 left-0 bg-white text-black py-3 sm:py-4 px-5 sm:shadow-[1px_1px_2px_rgba(0,0,0,0.15)] z-[999] text-lg">
        <div class="sm:h-full flex items-center justify-between">
            <router-link :to="{name: 'Home'}" class="flex items-center text-secondary transition">
                <svg class="hidden sm:block mr-2.5" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                            d="M23.7489 11.3938L22.0364 9.68132L12.6061 0.251218C12.5266 0.171576 12.4321 0.108398 12.3281 0.0652921C12.2241 0.0221867 12.1126 0 12 0C11.8874 0 11.7759 0.0221867 11.6719 0.0652921C11.5679 0.108398 11.4734 0.171576 11.3939 0.251218L1.96599 9.68132L0.251074 11.395C0.0903139 11.5558 0 11.7738 0 12.0012C0 12.2285 0.0903139 12.4465 0.251074 12.6073C0.411833 12.768 0.62987 12.8584 0.857219 12.8584C1.08457 12.8584 1.3026 12.768 1.46336 12.6073L1.71348 12.3548V23.1432C1.71348 23.2557 1.73564 23.3671 1.77871 23.4711C1.82177 23.575 1.88488 23.6695 1.96445 23.749C2.04402 23.8286 2.13848 23.8917 2.24244 23.9348C2.3464 23.9778 2.45782 24 2.57034 24H21.4285C21.541 24 21.6524 23.9778 21.7564 23.9348C21.8603 23.8917 21.9548 23.8286 22.0344 23.749C22.1139 23.6695 22.177 23.575 22.2201 23.4711C22.2632 23.3671 22.2853 23.2557 22.2853 23.1432V12.3548L22.5366 12.6061C22.6974 12.7668 22.9154 12.8572 23.1428 12.8572C23.3701 12.8572 23.5882 12.7668 23.7489 12.6061C23.9097 12.4453 24 12.2273 24 12C24 11.7726 23.9097 11.5546 23.7489 11.3938ZM14.5712 22.2839H9.42523V15.4267H14.5712V22.2839ZM20.5716 22.2839H16.2861V14.5723C16.2861 14.345 16.1958 14.1271 16.0351 13.9664C15.8744 13.8057 15.6565 13.7154 15.4292 13.7154H8.57076C8.34351 13.7154 8.12556 13.8057 7.96487 13.9664C7.80418 14.1271 7.7139 14.345 7.7139 14.5723V22.2875H3.4284V10.6411L12.0006 2.06903L20.5728 10.6411L20.5716 22.2839Z"
                            fill="currentColor"/>
                </svg>
                <svg class="sm:hidden mr-2.5" width="18" height="18" viewBox="0 0 18 18" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.75 9H2.25" stroke="black" stroke-width="2" stroke-linecap="round"
                          stroke-linejoin="round"/>
                    <path d="M15.75 4.5H2.25" stroke="black" stroke-width="2" stroke-linecap="round"
                          stroke-linejoin="round"/>
                    <path d="M15.75 13.5H2.25" stroke="black" stroke-width="2" stroke-linecap="round"
                          stroke-linejoin="round"/>
                </svg>
                <span class="font-medium">Setting</span>
            </router-link>
            <div class="flex items-center">
                <input type="text"
                       class="hidden sm:block mr-4 rounded-3xl border border-transparent text-A4 sm:w-[186px] h-[34px] text-sm appearance-none outline-none pl-[34px] pr-4 transition bg-[url('@/assets/images/icon-search.svg')] bg-no-repeat bg-[left_10px_center] shadow-[0_0_4px_0_rgba(0,0,0,0.15)] focus:border-primary focus:shadow-none"
                       placeholder="Search ...">
                <div v-if="userInfo">
                    <a-dropdown placement="bottomRight" :trigger="['click']" overlay-class-name="!min-w-0">
                        <div class="flex items-center cursor-pointer font-medium">
                            <span class="hidden sm:block mr-3">{{ businessSiteInfo?.name }}</span>
                            <a-avatar :size="28" :src="getImageUrl('fastboy-logo.png')"/>
                        </div>
                        <template #overlay>
                            <a-menu style="min-width: 138px;">
                                <a-menu-item @click="handleLogout">Logout</a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </div>
            </div>
        </div>
        <input type="text"
               class="sm:hidden mt-3 rounded-3xl border border-transparent text-A4 w-full h-[34px] text-sm appearance-none outline-none pl-[34px] pr-4 transition bg-[url('@/assets/images/icon-search.svg')] bg-no-repeat bg-[left_10px_center] shadow-[0_0_4px_0_rgba(0,0,0,0.15)] focus:border-primary focus:shadow-none"
               placeholder="Search ...">
    </header>
    <confirm-modal ref="confirmModalRef"></confirm-modal>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {useUserStore} from "@/stores/auth";
import {getImageUrl} from "@/utils/url";
import ConfirmModal from "@/components/modals/ConfirmModal.vue";
import handleError from "@/utils/error";
import {useBusinessStore} from "@/stores/business";

const businessStore = useBusinessStore();
const userStore = useUserStore();
const {logout} = userStore;
const userInfo = computed(() => userStore.userInfo);

const businessSiteInfo = computed<any>(() => businessStore.businessSiteInfo);

const confirmModalRef = ref<InstanceType<typeof ConfirmModal> | null>(null);
const handleLogout = async () => {
    try {
        await confirmModalRef.value?.show({
            bodyImage: 'logout.svg',
            bodyTitle: 'Oh no!',
            bodyMessage: 'You are leaving now? Are you sure?'
        });
        await logout();
    } catch (error) {
        if (!error) return;
        handleError({
            error: error
        })
    }
};
</script>

<style lang="scss" scoped>
:deep {
  .ant-badge-count {
    min-width: 1rem;
    height: 1rem;
    padding: 0;
    font-size: 0.575rem;
    top: 0.125rem;
    right: 0.25rem;
    line-height: 1rem;
  }
}
</style>
