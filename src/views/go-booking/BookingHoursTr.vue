<template>
    <tr>
        <td class="text-secondary font-medium text-tiny sm:text-[length:inherit]">
            <span class="hidden sm:block">{{ item.weekDay }}</span>
            <span class="sm:hidden">{{ (item.weekDay || '').slice(0, 3) }}</span>
        </td>
        <td class="text-center">
            <a-time-picker
                    v-model:value="item.inTime"
                    use12-hours
                    format="hh:mm A"
                    :show-now="false"
                    inputReadOnly
                    :disabled="!item.isActive"
                    ref="inTimeRef"
                    @open-change="handleInTimeOpenChange"
            >
                <template #suffixIcon></template>
                <template #clearIcon></template>
            </a-time-picker>
        </td>
        <td class="text-center">
            <a-time-picker
                    v-model:value="item.outTime"
                    use12-hours
                    format="hh:mm A"
                    :show-now="false"
                    inputReadOnly
                    :disabled="!item.isActive"
                    ref="outTimeRef"
                    @open-change="handleOutTimeOpenChange"
            >
                <template #suffixIcon></template>
                <template #clearIcon></template>
            </a-time-picker>
        </td>
        <td class="text-right">
            <a-switch v-model:checked="item.isActive"/>
        </td>
    </tr>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import {ref} from "vue";

interface IProps {
    item: any,
}

const props = defineProps<IProps>();

const inTimeRef = ref<any>(null);
const outTimeRef = ref<any>(null);
const handleInTimeOpenChange = (isOpen: boolean) => {
    if(!inTimeRef.value) return;
    const input = inTimeRef.value.$el.querySelector('input');
    if(!isOpen) {
        props.item.inTime = dayjs(input.value, 'hh:mm A')
    }
}
const handleOutTimeOpenChange = (isOpen: boolean) => {
    if(!outTimeRef.value) return;
    const input = outTimeRef.value.$el.querySelector('input');
    if(!isOpen) {
        props.item.outTime = dayjs(input.value, 'hh:mm A')
    }
}
</script>

<style lang="scss" scoped>
:deep {
  .ant-picker {
    text-align: center;
    font-weight: 600;
    width: 146px;
    font-size: inherit;
    @media (max-width: 640px) {
      font-weight: 500;
      padding: 4px 6px;
      width: auto;
    }
  }

  .ant-picker-input > input {
    font-size: inherit;
  }
}
</style>
