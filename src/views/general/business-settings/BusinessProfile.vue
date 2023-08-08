<template>
    <div class="h-full flex flex-col">
        <breadcrumb class="shrink-0"></breadcrumb>
        <a-card class="grow card-body-0">
            <template #title>
                <div class="sm:text-xl flex items-center space-x-3">
                    <img class="shrink-0" src="@/assets/images/business-profile-list.svg" alt="">
                    <span>Business Profile</span>
                </div>
            </template>
            <div class="divide-y divide-CE6">
                <div class="py-2.5 px-2.5 sm:px-6 last:pb-0">
                    <p class="mb-0 text-base font-medium">Business name</p>
                    <p class="mb-0 text-C82">{{ businessSiteInfo?.name }}</p>
                </div>
                <div class="py-2.5 px-2.5 sm:px-6 first:pt-0 last:pb-0">
                    <p class="mb-0 text-base font-medium">Business phone</p>
                    <p class="mb-0 text-C82">{{ businessSiteInfo?.phone }}</p>
                </div>
                <div class="py-2.5 px-2.5 sm:px-6 first:pt-0 last:pb-0">
                    <p class="mb-0 text-base font-medium">Business address</p>
                    <p class="mb-0 text-C82">{{ businessSiteInfo?.address }}</p>
                </div>
                <div class="py-2.5 px-2.5 sm:px-6 first:pt-0 last:pb-0">
                    <p class="mb-0 text-base font-medium">Business phone</p>
                    <p class="mb-0 text-C82">{{ businessSiteInfo?.city }}</p>
                </div>
            </div>
        </a-card>
    </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import Breadcrumb from "@/components/Breadcrumb.vue";
import {useBusinessStore} from '@/stores/business';

const businessStore = useBusinessStore();
const businessSiteInfo = computed<any>(() => businessStore.businessSiteInfo);
</script>

<style lang="scss" scoped>
</style>
