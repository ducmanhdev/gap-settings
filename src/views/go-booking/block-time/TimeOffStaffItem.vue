<template>
    <div class="grid grid-cols-[3fr_2fr_2fr_1fr] sm:grid-cols-[3fr_1fr_1fr_1fr] gap-2 items-center p-3 border-b rounded hover:bg-slate-100 transition cursor-pointer">
        <div class="flex items-center">
            <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2979FF"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    v-if="item?.all_day === 0"
            >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2979FF"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    v-else
            >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <div class="ml-5">
                <p class="text-sm mb-0">
                    {{ dayjs(item?.start_date).format("MMM DD, YYYY") }}
                </p>
                <p class="text-xs text-C91 mb-0">
                    {{ item?.description || 'No Description' }}
                </p>
            </div>
        </div>
        <div class="text-xs text-center text-C91 mb-0" v-if="item?.data?.recurring_type === 'weekly'">
            EveryWeek
        </div>
        <div class="text-xs text-center text-C91 mb-0" v-else-if="item?.data?.recurring_type === 'monthly'">
            EveryMonth
        </div>
        <div class="text-xs text-center text-C91 mb-0" v-else>No repeat</div>
        <div class="text-xs text-center text-C91 mb-0" v-if="item?.all_day === 1">
            {{ item?.recurring === '1' ? 'Full day' : 'All day' }}
        </div>
        <div class="text-xs text-center text-C91" v-if="item?.all_day === 0">
            {{ dayjs(item?.start_date).format("h:mm a") + " to " + dayjs(item?.end_date).format("h:mm a") }}
        </div>
        <div class="p-2" @click.stop="$emit('delete')">
            <img class="ml-auto w-4 h-auto" src="@/assets/images/icon-delete.png" alt="Delete"/>
        </div>
    </div>
</template>
<script lang="ts" setup>
import dayjs from "dayjs";
import type {GetListBusinessTimeOffResponse} from "gap-nodejs-sdk";

const props = defineProps<{
    item: GetListBusinessTimeOffResponse
}>();
const emits = defineEmits<{
    (e: 'delete'): void
}>();
</script>
