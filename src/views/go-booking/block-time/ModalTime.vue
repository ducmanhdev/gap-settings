<template>
    <teleport to="body">
        <a-modal v-model:visible="isVisible"
                 :title="title"
                 :width="520"
                 centered
                 :after-close="handleResetState"
                 @ok="handleSubmit"
                 :ok-button-props="{disabled: isSubmitLoading}"
                 :ok-text="textButton"
                 :mask-closable="!isSubmitLoading"
                 :closable="!isSubmitLoading"
                 class="modal-time"
        >
            <div class="grid grid-cols-[1fr_3fr] items-center mb-3">
                <p class="mb-0">Day Off</p>
                <a-date-picker
                        v-model:value="date"
                        :format="DATE_PREVIEW_FORMAT"
                        :value-format="DATE_FORMAT"
                        :disabled-date="disabledDate"
                />
            </div>
            <div class="grid grid-cols-[1fr_3fr] items-center mb-3" v-if="!isAllDay">
                <p class="mb-0">Duration</p>
                <div class="grid grid-cols-[1fr_20px_1fr] items-center">
                    <a-time-picker v-model:value="startTime"
                                   :format="TIME_PREVIEW_FORMAT"
                                   :value-format="TIME_FORMAT"
                                   :show-now="false"
                                   ref="startTimeRef"
                                   @open-change="handleStartTimeOpenChange"
                                   :allow-clear="false"
                    />
                    <span class="text-center block">-</span>
                    <a-time-picker v-model:value="endTime"
                                   :format="TIME_PREVIEW_FORMAT"
                                   :value-format="TIME_FORMAT"
                                   :show-now="false"
                                   ref="endTimeRef"
                                   @open-change="handleEndTimeOpenChange"
                                   :allow-clear="false"
                    />
                </div>
            </div>
            <div class="grid grid-cols-[1fr_3fr] items-center mb-3">
                <p></p>
                <div class="grid grid-cols-2">
                    <div>
                        <a-checkbox v-model:checked="isAllDay">All day</a-checkbox>
                    </div>
                    <div
                            class="flex items-center justify-end text-[#2979FF] cursor-pointer"
                            @click="isCheckMoreOptions = !isCheckMoreOptions"
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
                                class="feather feather-plus h-4 w-4 stroke-current text-primary pr-1"
                                v-if="!isCheckMoreOptions"
                        >
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
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
                                class="feather feather-minus h-4 w-4 stroke-current text-primary pr-1"
                                v-else
                        >
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        <span>More options</span>
                    </div>
                </div>
            </div>
            <template v-if="isCheckMoreOptions">
                <div class="grid grid-cols-[1fr_3fr] items-center mb-3">
                    <p class="mb-0">Recurring?</p>
                    <div>
                        <a-switch v-model:checked="isCheckRecurring" checked-children="On" un-checked-children="Off"/>
                    </div>
                </div>
                <template v-if="isCheckRecurring">
                    <div class="grid grid-cols-[1fr_3fr] items-center mb-3">
                        <p class="mb-0">Repeat</p>
                        <a-select v-model:value="repeat" :options="repeatOptions"></a-select>
                    </div>
                    <div class="grid grid-cols-[1fr_3fr] items-center mb-3">
                        <p class="mb-0">End Date</p>
                        <a-date-picker
                                v-model:value="recurringEndDate"
                                :format="DATE_PREVIEW_FORMAT"
                                :value-format="DATE_FORMAT"
                                :disabled-date="disabledDate"
                        />
                    </div>
                </template>
                <div class="grid grid-cols-[1fr_3fr] items-center mb-3">
                    <p class="mb-0">Description</p>
                    <a-input type="text" v-model:value="description" placeholder="Vacation, Holiday, Other..."/>
                </div>
            </template>
            <div class="bg-[#fdffe5] border-[1px] border-[#e9edab] py-2 text-center" v-if="!id">
                {{ textDay }}
            </div>
        </a-modal>
    </teleport>
</template>

<script lang="ts" setup>
import {ref, computed} from "vue";
import dayjs from "dayjs";
import objectSupport from "dayjs/plugin/objectSupport";
import {useGoBookingStore} from "@/stores/go-booking";
import {notification} from "ant-design-vue";
import handleError from "@/utils/error";

dayjs.extend(objectSupport);
const bookingStore = useGoBookingStore();

const props = defineProps<{
    staffId?: number;
}>()
const emits = defineEmits<{
    (e: 'refresh'): void
}>();

const disabledDate = (currentDate: any) => dayjs().isAfter(currentDate, 'date');

const DATE_PREVIEW_FORMAT = 'DD MMM YYYY';
const DATE_FORMAT = 'YYYY-MM-DD';
const TIME_PREVIEW_FORMAT = 'hh:mm A';
const TIME_FORMAT = 'HH:mm:ss';
const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const DEFAULT_DATE = dayjs().format(DATE_FORMAT);
const DEFAULT_START_TIME = '08:00:00';
const DEFAULT_END_TIME = '17:00:00';

const DEFAULT_TYPE = 1;

const isVisible = ref(false);
const title = computed(() => id.value ? 'Update Time Off' : 'Add Time Off');
const textButton = computed(() => id.value ? 'Update Time Off' : 'Add Time Off');
const textDay = computed(() => {
    if (isAllDay.value) {
        return `All day on ${dayjs(date.value, DATE_FORMAT).format("MMM DD, YYYY")}`;
    }
    return `From ${dayjs(date.value, DATE_FORMAT).format(DATE_PREVIEW_FORMAT)} ${dayjs(startTime.value, TIME_FORMAT).format(TIME_PREVIEW_FORMAT)} to ${dayjs(date.value, DATE_FORMAT).format(DATE_PREVIEW_FORMAT)} ${dayjs(endTime.value, TIME_FORMAT).format(TIME_PREVIEW_FORMAT)}`;
});

const isCheckMoreOptions = ref(false);
const isCheckRecurring = ref(false);
const isAllDay = ref(true);

const date = ref(DEFAULT_DATE);
const blockTimeType = ref(DEFAULT_TYPE);

const startTime = ref(DEFAULT_START_TIME);
const endTime = ref(DEFAULT_END_TIME);
const startTimeRef = ref<any>(null);
const endTimeRef = ref<any>(null);
const handleStartTimeOpenChange = (isOpen: boolean) => {
    if(!startTimeRef.value) return;
    const input = startTimeRef.value.$el.querySelector('input');
    if(!isOpen) {
        startTime.value = dayjs(input.value, TIME_PREVIEW_FORMAT).format(TIME_FORMAT)
    }
}
const handleEndTimeOpenChange = (isOpen: boolean) => {
    if(!endTimeRef.value) return;
    const input = endTimeRef.value.$el.querySelector('input');
    if(!isOpen) {
        endTime.value = dayjs(input.value, TIME_PREVIEW_FORMAT).format(TIME_FORMAT)
    }
}

const repeatOptions = ref([
    {
        label: 'Weekly',
        value: 'Weekly',
    },
    {
        label: 'Monthly',
        value: 'Weekly'
    }
]);
const recurringEndDate = ref('');
const repeat = ref(repeatOptions.value[0].value);
const description = ref("");
const id = ref<number | null>(null);
const staffId = ref<number | null>(null);

const open = (data: any) => {
    if (data && !(data instanceof Event)) {
        id.value = data?.id;
        staffId.value = data?.staff_id;
        isAllDay.value = data?.all_day === 1;
        blockTimeType.value = data?.type;
        description.value = data?.description;
        isCheckRecurring.value = data?.recurring === '1';
        isCheckMoreOptions.value = isCheckRecurring.value || Boolean(description.value);
        repeat.value = data?.data?.recurring_type || repeatOptions.value[0].value;
        recurringEndDate.value = data?.data?.recurring_end_date;
        date.value = dayjs(data?.start_date, DATE_TIME_FORMAT).format(DATE_FORMAT);
        startTime.value = dayjs(data?.start_date, DATE_TIME_FORMAT).format(TIME_FORMAT);
        endTime.value = dayjs(data?.end_date, DATE_TIME_FORMAT).format(TIME_FORMAT);
    }
    isVisible.value = true;
};
const close = () => {
    isVisible.value = false;
};
const handleResetState = async () => {
    id.value = null;
    staffId.value = null;
    date.value = DEFAULT_DATE;
    isAllDay.value = true;
    isCheckMoreOptions.value = false;
    isCheckRecurring.value = false;
    recurringEndDate.value = "";
    description.value = "";
    repeat.value = repeatOptions.value[0].value;
    startTime.value = DEFAULT_START_TIME;
    endTime.value = DEFAULT_END_TIME;
    blockTimeType.value = DEFAULT_TYPE;
};

const isSubmitLoading = ref(false);
const handleSubmit = async () => {
    try {
        isSubmitLoading.value = true;
        let data: any;
        if (isCheckRecurring.value) {
            let recurringEndDateFormat = '';
            if (recurringEndDate.value) {
                if (isAllDay.value) {
                    recurringEndDateFormat = `${recurringEndDate.value} 00:00:00`;
                } else {
                    recurringEndDateFormat = `${recurringEndDate.value} ${endTime.value}`;
                }
            }
            data = {
                recurring_type: repeat.value.toLowerCase(),
                recurring_end_date: recurringEndDateFormat,
            }
        }
        let payload: any = {
            all_day: isAllDay.value ? 1 : 0,
            recurring: isCheckRecurring.value ? '1' : '0',
            description: description.value,
            start_date: `${date.value} ${startTime.value}`,
            end_date: `${date.value} ${endTime.value}`,
            staff_id: props.staffId,
        };
        if (isCheckMoreOptions.value) {
            payload.data = data
        }
        if (id.value) {
            payload.id = id.value;
            payload.type = blockTimeType.value;
            await bookingStore.updateBusinessTimeOff(payload);
            notification.success({
                message: 'Update Block Time Success!'
            })
        } else {
            payload.type = props.staffId ? 2 : 1;
            await bookingStore.addBusinessTimeOff(payload);
            notification.success({
                message: 'Add Block Time Success!'
            })
        }
        emits('refresh');
        isVisible.value = false;
    } catch (error: any) {
        handleError({error})
    } finally {
        isSubmitLoading.value = false;
    }
};
defineExpose({
    open,
    close,
});
</script>
<style lang="scss">
.modal-time .ant-btn {
  min-width: 150px;
}
</style>
