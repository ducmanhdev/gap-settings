<template>
    <template v-if="isRouterReady && !isLoading">
        <div v-if="isEmptyLayout">
            <router-view></router-view>
        </div>
        <div class="h-screen flex flex-col overflow-hidden" v-else>
            <the-header></the-header>
            <main
                    class="grow bg-CF2 pl-[78px] relative overflow-hidden"
                    :class="[isShowFullAside ? 'sm:pl-[315px]': 'sm:pl-[60px]']"
            >
                <the-aside></the-aside>
                <section class="p-3.5 sm:p-5 h-full overflow-auto">
                    <router-view></router-view>
                </section>
            </main>
        </div>
    </template>
    <div class="h-screen flex justify-center items-center" v-else>
        <base-loading></base-loading>
    </div>
    <passcode-modal />
    <reload-prompt />
</template>

<script setup lang="ts">
import {ref, computed, onMounted, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import TheHeader from "@/components/layouts/TheHeader.vue";
import TheAside from "@/components/layouts/TheAside.vue";
import BaseLoading from "@/components/BaseLoading.vue";
import PasscodeModal from "@/components/modals/PasscodeModal.vue";
import ReloadPrompt from "@/components/ReloadPrompt.vue";
import {sdkInit} from "@/sdk";
import {useUserStore} from "@/stores/auth";
import {useBusinessStore} from "@/stores/business";
import handleError from "@/utils/error";

const router = useRouter();
const route = useRoute();
const isShowFullAside = computed(() => route?.meta?.showFullAside);
const isEmptyLayout = computed(() => route?.meta?.emptyLayout);

const userStore = useUserStore();
const businessStore = useBusinessStore();
const {getUserInfo} = userStore;
const {getBusinessSiteInfo} = businessStore;

const isLoading = ref(false);
const handleInit = async () => {
    try {
        isLoading.value = true;
        await sdkInit();
        await getUserInfo();
        await getBusinessSiteInfo();
    } catch (error) {
        console.log(error);
        handleError({error});
    } finally {
        isLoading.value = false;
    }
}
watch(
    () => userStore.reloadSdkCount,
    handleInit,
    {
      immediate: true
    }
);

const isRouterReady = ref(false);
onMounted(async () => {
    await router.isReady();
    isRouterReady.value = true;

    let customViewportCorrectionVariable = 'vh';

    const setViewportProperty = () => {
        let prevClientHeight: number;
        const customVar = '--' + (customViewportCorrectionVariable || 'vh');
        const doc = document.documentElement;

        function handleResize() {
            let clientHeight = doc.clientHeight;
            if (clientHeight === prevClientHeight) return;
            requestAnimationFrame(function updateViewportHeight() {
                doc.style.setProperty(customVar, (clientHeight * 0.01) + 'px');
                prevClientHeight = clientHeight;
            });
        }

        handleResize();
        return handleResize;
    }
    window.addEventListener('resize', setViewportProperty());
});
</script>

<style lang="scss" scoped></style>
