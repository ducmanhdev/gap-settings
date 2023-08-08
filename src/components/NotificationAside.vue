<template>
    <a-drawer v-model:visible="isVisible" title="Notification" :body-style="{padding: 0}">
        <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="appointment" tab="Appointment">
                <div class="divide-y">
                    <div
                            v-for="item in listNotifyAppointment"
                            :key="item.id"
                            class="cursor-pointer px-4 py-3 text-xs"
                            :class="{'bg-[aliceblue]': item.is_read === 0}"
                            @click="handleMaskAsRead(item.id, 'appointment')"
                    >
                        <div class="flex justify-between items-center space-x-2">
                            <a-tag :color="tagColors.get(item.type)">{{ capitalizeFirstLetter(item.type) }}</a-tag>
                            <div>{{ dayjs(item.created_at).fromNow() }}</div>
                        </div>
                        <div class="mt-1 line-clamp-2">{{ item.content }}</div>
                    </div>
                </div>
            </a-tab-pane>
            <a-tab-pane key="system" tab="System">
                <div class="divide-y">
                    <div
                            v-for="item in listNotifySystem"
                            :key="item.id"
                            class="cursor-pointer px-4 py-3 text-xs"
                            :class="{'bg-[aliceblue]': item.is_read === 0}"
                            @click="handleMaskAsRead(item.id, 'normal')"
                    >
                        <div class="flex justify-between items-center space-x-2">
                            <div class="font-semibold text-primary text-sm">{{ item.title }}</div>
                            <div>{{ dayjs(item.created_at).fromNow() }}</div>
                        </div>
                        <div class="mt-1 line-clamp-2">{{ item.description }}</div>
                    </div>
                </div>
            </a-tab-pane>
        </a-tabs>
        <template #footer>
            <button
                    class="main-btn main-btn--primary w-full"
                    @click="handleViewAllNotification">
                View all appointment notifications
            </button>
        </template>
    </a-drawer>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {useNotificationStore} from "@/stores/notification";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import {useRouter} from "vue-router";
import handleError from "@/utils/error";

dayjs.extend(relativeTime);

const notificationStore = useNotificationStore();

const listNotifyAppointment = computed(() => notificationStore.listNotifyAppointment.data);

const listNotifySystem = computed(() => notificationStore.listNotifySystem.data);

const {getNotifyAppointment, getNotifySystem, maskAsRead} = notificationStore;

const handleGetNotification = async () => {
    try {
        const params = {
            page: 1,
            'per-page': 20,
        }
        await getNotifyAppointment(params);
        await getNotifySystem(params);
    } catch (error: any) {
        handleError({
            error: error
        })
    }
};

const handleMaskAsRead = async (id: number, type: 'appointment' | 'normal') => {
    try {
        await maskAsRead({id, type});
        await handleGetNotification();
    } catch (error) {
        handleError({error});
    }
};

const activeKey = ref('appointment');

const router = useRouter();

const handleViewAllNotification = () => {
    hide();
    router.push({name: 'Notifications', query: {type: activeKey.value}});
};

const tagColors = new Map([
    ['confirmed', 'var(--color-primary)'],
    ['cancelled', 'var(--color-error)'],
]);

const capitalizeFirstLetter = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

const isVisible = ref(false);

const show = () => {
    isVisible.value = true;
};

const hide = () => {
    isVisible.value = false;
};

defineExpose({show, hide});
</script>

<style lang="scss" scoped>
.ant-tabs {
  overflow: visible !important;
}

:deep {
  .ant-tabs-nav-list {
    width: 100%;
  }

  .ant-tabs-nav {
    position: sticky !important;
    top: 0 !important;
    margin-bottom: 0 !important;
    background-color: var(--color-white);
  }

  .ant-tabs-tab {
    width: 50%;
    justify-content: center;
    padding: 0.75rem 1rem;
  }

  .ant-tabs-tab + .ant-tabs-tab {
    margin: 0;
  }
}
</style>
