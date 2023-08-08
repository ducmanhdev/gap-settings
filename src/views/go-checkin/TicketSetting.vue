<template>
  <div class="sm:h-full flex flex-col">
    <breadcrumb class="shrink-0"></breadcrumb>
    <a-card class="grow">
      <h2 class="main-title">Ticket Template</h2>
      <div class="sm:grid grid-cols-[1fr_302px] space-y-7 sm-space-y-0 gap-7">
        <div>
          <div class="mb-3 sm:min-h-[34px] flex items-center">
            <p class="sub-title mb-0">Ticket Template</p>
          </div>
          <base-loading v-if="isLoading"></base-loading>
          <TransitionGroup
            tag="ul"
            name="list"
            class="space-y-3 sm:space-y-5 mb-0 relative"
            v-else-if="ticketInfoItems && ticketInfoItems.length"
          >
            <li
                v-for="(template, index) in ticketInfoItems"
                :key="template.id!"
                class="box grid grid-cols-[7fr,3fr] gap-3 w-full">
              <div class="line-clamp-3">{{ index + 1 }}. {{ template.name }}</div>
              <div class="flex items-center justify-end space-x-2 text-secondary">
                <svg class="cursor-pointer text-inherit transition hover:text-primary" width="14" height="14"
                     @click="handleMove(template.id!, 'up')"
                     viewBox="0 0 14 14" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 11.0833L7 2.91668" stroke="currentColor" stroke-linecap="round"
                        stroke-linejoin="round"/>
                  <path d="M2.91666 7L6.99999 2.91667L11.0833 7" stroke="currentColor" stroke-linecap="round"
                        stroke-linejoin="round"/>
                </svg>
                <svg class="cursor-pointer text-inherit transition hover:text-primary" width="14" height="14"
                     @click="handleMove(template.id!, 'down')"
                     viewBox="0 0 14 14" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 2.91666V11.0833" stroke="currentColor" stroke-linecap="round"
                        stroke-linejoin="round"/>
                  <path d="M11.0833 7L7.00001 11.0833L2.91667 7" stroke="currentColor" stroke-linecap="round"
                        stroke-linejoin="round"/>
                </svg>
                <svg class="cursor-pointer text-inherit transition hover:text-primary" width="12" height="14"
                     @click="handleDelete(template.id!)"
                     viewBox="0 0 12 14" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.1887 1.7305H7.47874C7.42457 1.25432 7.19703 0.814726 6.83951 0.495564C6.48198 0.176402 6.01949 0 5.54024 0C5.06098 0 4.59848 0.176402 4.24096 0.495564C3.88344 0.814726 3.6559 1.25432 3.60174 1.7305H0.890734C0.644285 1.74218 0.412444 1.8508 0.245734 2.03268C0.0790236 2.21457 -0.00904122 2.45497 0.000735043 2.7015V3.3495C-0.0069895 3.57906 0.0689815 3.8036 0.214499 3.98132C0.360017 4.15903 0.565163 4.2778 0.791735 4.3155V12.3155C0.776257 12.6993 0.913181 13.0737 1.17264 13.3569C1.4321 13.6402 1.79304 13.8093 2.17673 13.8275H8.90074C9.28443 13.8093 9.64537 13.6402 9.90483 13.3569C10.1643 13.0737 10.3012 12.6993 10.2857 12.3155V4.3155C10.5123 4.2778 10.7175 4.15903 10.863 3.98132C11.0085 3.8036 11.0845 3.57906 11.0767 3.3495V2.7015C11.0865 2.4553 10.9987 2.21519 10.8324 2.03336C10.6662 1.85153 10.4348 1.74269 10.1887 1.7305ZM5.53974 0.865503C5.7937 0.872518 6.03888 0.959956 6.23998 1.11522C6.44107 1.27049 6.5877 1.48558 6.65874 1.7295H4.42073C4.49177 1.48558 4.6384 1.27049 4.8395 1.11522C5.04059 0.959956 5.28577 0.872518 5.53974 0.865503ZM9.50074 12.3175C9.50752 12.4819 9.44897 12.6424 9.33787 12.7638C9.22676 12.8852 9.07213 12.9577 8.90774 12.9655H2.17673C2.01234 12.9577 1.85771 12.8852 1.7466 12.7638C1.6355 12.6424 1.57695 12.4819 1.58374 12.3175V4.3225H9.50074V12.3175ZM10.2917 3.3505C10.2928 3.36429 10.2911 3.37816 10.2865 3.39123C10.282 3.4043 10.2748 3.41629 10.2654 3.42644C10.256 3.4366 10.2446 3.44469 10.2319 3.4502C10.2193 3.45572 10.2056 3.45855 10.1917 3.4585H0.891734C0.877901 3.45855 0.864208 3.45572 0.851523 3.4502C0.838838 3.44469 0.827436 3.4366 0.818038 3.42644C0.808639 3.41629 0.801451 3.4043 0.796923 3.39123C0.792396 3.37816 0.790629 3.36429 0.791735 3.3505V2.7015C0.790629 2.68771 0.792396 2.67385 0.796923 2.66077C0.801451 2.6477 0.808639 2.63571 0.818038 2.62556C0.827436 2.61541 0.838838 2.60732 0.851523 2.6018C0.864208 2.59629 0.877901 2.59346 0.891734 2.5935H10.1917C10.2056 2.59346 10.2193 2.59629 10.2319 2.6018C10.2446 2.60732 10.256 2.61541 10.2654 2.62556C10.2748 2.63571 10.282 2.6477 10.2865 2.66077C10.2911 2.67385 10.2928 2.68771 10.2917 2.7015V3.3505Z"
                    fill="currentColor"/>
                </svg>
              </div>
            </li>
            <li :key="-1"
                class="box text-primary p-1.5 sm:p-4 min-h-[38px] sm:min-h-[62px] flex items-center justify-center cursor-pointer transition hover:bg-primary hover:text-white"
                @click="handleOpenAddTicket">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.0329 2L12.0329 22.066" stroke="currentColor" stroke-width="3" stroke-miterlimit="10"
                      stroke-linecap="round"/>
                <path d="M22.0659 12.033L1.99988 12.033" stroke="currentColor" stroke-width="3"
                      stroke-miterlimit="10"
                      stroke-linecap="round"/>
              </svg>
            </li>
          </TransitionGroup>
          <a-empty v-else/>
        </div>
        <div class="flex flex-col">
          <div
            class="sm:flex shrink-0 items-center justify-between space-y-2 sm:space-y-0 sm:space-x-3 mb-3 sm:min-h-[34px]">
            <p class="sub-title mb-0">TICKET PREVIEW</p>
            <button
              type="button"
              class="main-btn main-btn--secondary"
              :disabled="isRestoreDefaultTemplateLoading"
              @click="handleRestoreDefaultTemplate">
              {{ isRestoreDefaultTemplateLoading ? 'Restoring...' : 'Restore default' }}
            </button>
          </div>
          <a-card class="grow custom-card-mobile" :body-style="{padding: '1.5rem 1rem'}">
            <div v-html="ticketInfoTemplateText"></div>
          </a-card>
        </div>
      </div>
    </a-card>
  </div>
  <add-ticket-modal
    ref="addTicketModalRef"
    @add-ticket="handleAddTicket"
    :ticket-list-block-name="ticketListBlockName">
  </add-ticket-modal>
  <confirm-modal ref="confirmModalRef"></confirm-modal>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import AddTicketModal from "@/components/modals/AddTicketModal.vue";
import ConfirmModal from "@/components/modals/ConfirmModal.vue";
import {useGoCheckInStore} from "../../stores/go-check-in";
import {notification} from 'ant-design-vue';
import BaseLoading from "@/components/BaseLoading.vue";
import handleError from "../../utils/error";

const addTicketModalRef = ref<InstanceType<typeof AddTicketModal> | null>(null);
const confirmModalRef = ref<InstanceType<typeof ConfirmModal> | null>(null);

const goCheckInStore = useGoCheckInStore();
const {
  getTicketInfo,
  createTicketTemplate,
  deleteTicketTemplate,
  setDefaultTicketTemplate,
  moveSubject,
  getTicketListBlockName
} = goCheckInStore;
const ticketInfoItems = computed(() => goCheckInStore.ticketInfo?.items);
const ticketInfoTemplateText = computed(() => goCheckInStore.ticketInfo?.template_text);

const isLoading = ref(false);
const handleGetTicketInfo = async () => {
  try {
    isLoading.value = true;
    await getTicketInfo();
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isLoading.value = false;
  }
}
handleGetTicketInfo();

const ticketListBlockName = computed(() => goCheckInStore.ticketListBlockName);
const handleGetTicketListBlockName = async () => {
  try {
    await getTicketListBlockName();
  } catch (error) {
    console.error(error)
  }
};
handleGetTicketListBlockName();
const handleOpenAddTicket = () => {
  addTicketModalRef.value?.show()
};
const handleAddTicket = async (data: any) => {
  try {
    await createTicketTemplate(data);
    await handleGetTicketInfo();
    addTicketModalRef.value?.hide();
    notification.success({
      message: 'Success',
      description: 'Create ticket template success',
    });
  } catch (error) {
    handleError({
      error: error
    })
  }
}

const isRestoreDefaultTemplateLoading = ref(false);
const handleRestoreDefaultTemplate = async () => {
  try {
    isRestoreDefaultTemplateLoading.value = true;
    await confirmModalRef.value?.show({
      headerTitle: 'Restore Default Template',
      bodyImage: 'restore-default-template.svg',
      bodyTitle: 'Oh no!',
      bodyMessage: 'Do you want to restore default for this template?'
    })
    await setDefaultTicketTemplate();
    await handleGetTicketInfo();
    notification.success({
      message: 'Success',
      description: 'Restore default ticket template success',
    });
  } catch (error) {
    if (!error) return;
    handleError({
      error: error
    })
  } finally {
    isRestoreDefaultTemplateLoading.value = false;
  }
}
const handleMove = async (id: number, action: 'up' | 'down') => {
  try {
    await moveSubject({
      id: id,
      action: action,
    });
    await getTicketInfo();
    // notification.success({
    //   message: 'Success',
    //   description: 'Delete ticket template success',
    // });
  } catch (error) {
    console.error(error)
    notification.success({
      message: 'Error',
      description: 'Move ticket template failed',
    });
  }
}
const handleDelete = async (id: number) => {
  try {
    await confirmModalRef.value?.show({
      headerTitle: 'Delete Template',
      bodyImage: 'restore-default-template.svg',
      bodyTitle: 'Oh no!',
      bodyMessage: 'Do you want to delete this template?'
    });
    await deleteTicketTemplate({id});
    await getTicketInfo();
    notification.success({
      message: 'Success',
      description: 'Delete ticket template success',
    });
  } catch (error) {
    if (!error) return;
    handleError({
      error: error
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
