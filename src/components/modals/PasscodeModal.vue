<template>
  <a-modal
    v-model:visible="isVisible"
    :footer="false"
    :width="552"
    class="passcode-modal"
    :body-style="{padding: '1.875rem'}"
    title="Passcode"
    centered
  >
    <a-form
      layout="vertical"
      :model="formModel"
      :rules="formRules"
      @finish="handleSubmit"
    >
      <a-form-item label="Passcode" name="passcode">
        <a-input v-model:value="formModel.passcode" placeholder=""/>
      </a-form-item>
      <a-form-item>
        <div class="flex justify-center gap-3 mt-2 child:!min-w-[120px] sm:child:!min-w-[190px]">
          <a-button type="primary" html-type="submit" :loading="isValidateLoading">Accept</a-button>
          <a-button type="ghost" danger @click="hide">Cancel</a-button>
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {ref, computed, watch} from "vue";
import type {Rule} from "ant-design-vue/es/form";
import {usePasscodeStore} from "../../stores/passcode";

const passcodeStore = usePasscodeStore();
const {show, hide, validate} = passcodeStore;

const formModel = ref({
  passcode: '',
});

const validatePasscode = async (_rule: Rule, value: string) => {
  if (value === '' || value.length !== 4) {
    return Promise.reject('New passcode length need to be exactly 4');
  }
  return Promise.resolve();
};

const formRules: Record<string, Rule[]> = {
  passcode: [{validator: validatePasscode, trigger: 'change'}],
};

const isValidateLoading = computed(() => passcodeStore.isValidateLoading);
const isVisible = computed({
  get() {
    return passcodeStore.isVisible
  },
  set(newValue) {
    passcodeStore.isVisible = newValue;
  }
});
watch(isVisible, (newState: boolean) => {
  if (newState) {
    formModel.value.passcode = '';
  }
}, {immediate: true});
const handleSubmit = async () => {
  await validate(formModel.value.passcode);
}
</script>

<style lang="scss">
</style>
