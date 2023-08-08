<template>
    <tr>
        <td class="text-secondary font-medium">{{ item.weekDay }}</td>
        <td class="text-center">
            <a-time-picker
                    v-model:value="item.inTime"
                    use12-hours
                    :format="TIME_FORMAT"
                    :value-format="TIME_FORMAT"
                    :show-now="false"
                    class="text-center font-semibold w-[146px]"
                    ref="inTimeRef"
                    @open-change="handleInTimeOpenChange"
                    :disabled="!item.isActive"
            >
                <template #suffixIcon></template>
                <template #clearIcon></template>
            </a-time-picker>
        </td>
        <td class="text-center">
            <a-time-picker
                    v-model:value="item.outTime"
                    use12-hours
                    :format="TIME_FORMAT"
                    :value-format="TIME_FORMAT"
                    :show-now="false"
                    class="text-center font-semibold w-[146px]"
                    ref="outTimeRef"
                    @open-change="handleOutTimeOpenChange"
                    :disabled="!item.isActive"
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
import {ref} from "vue";

interface IProps {
    item: any,
}

const TIME_FORMAT = 'h:mm A';
const props = defineProps<IProps>();
const inTimeRef = ref<any>(null);
const outTimeRef = ref<any>(null);
const handleInTimeOpenChange = (isOpen: boolean) => {
    if(!inTimeRef.value) return;
    const input = inTimeRef.value.$el.querySelector('input');
    if(!isOpen) {
        props.item.inTime = input.value
    }
}
const handleOutTimeOpenChange = (isOpen: boolean) => {
    if(!outTimeRef.value) return;
    const input = outTimeRef.value.$el.querySelector('input');
    if(!isOpen) {
        props.item.outTime = input.value
    }
}
</script>

<style scoped>

</style>
