<template>
    <div class="sm:h-full flex flex-col">
        <breadcrumb class="shrink-0"></breadcrumb>
        <div class="grow flex flex-col space-y-4">
            <section class="shrink-0">
                <h3 class="flex items-center text-xl cursor-pointer" @click="open = 'business'">
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
                            class="feather feather-chevron-up h-6 w-6 color-black"
                            v-if="open === 'business'"
                    >
                        <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
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
                            class="feather feather-chevron-down h-6 w-6 color-black"
                            v-else
                    >
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                    <span>Business Block Time</span>
                </h3>
                <a-card v-show="open === 'business'">
                    <business-block-time/>
                </a-card>
            </section>
            <section class="grow flex flex-col">
                <h3 class="flex items-center text-xl cursor-pointer" @click="open = 'staff'">
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
                            class="feather feather-chevron-up h-6 w-6 color-black"
                            v-if="open === 'staff'"
                    >
                        <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
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
                            class="feather feather-chevron-down h-6 w-6 color-black"
                            v-else
                    >
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                    <span>Staff Block Time</span>
                </h3>
                <staff-block-time class="grow" v-show="open === 'staff'"/>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import BusinessBlockTime from "./BusinessBlockTime.vue";
import StaffBlockTime from "./StaffBlockTime.vue";

const open = ref<'business' | 'staff'>('business');
</script>
<style lang="scss" scoped>
</style>
