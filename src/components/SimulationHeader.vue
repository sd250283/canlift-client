<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-primary shadow py-0">
      <div class="container-fluid">
        <div class="navbar-collapse justify-content-between" id="nav-collapse">
          <div class="navbar-nav">
            <form class="d-flex">
              <div class="row">
                <div class="col-6 text-nowrap mt-1 text-white">
                  <label for="dateSimulation">Date de simulation
                    <font-awesome-icon title="Date de la journée concernée"
                        class="me-2" :icon="['fas', 'info-circle']" size="xs" />
                  </label>
                </div>
                <div class="col-6 ps-0">
                  <input id="dateSimulation" type="date" v-model="date" @focus="focusDate"
                    @blur="updateSimulationDate" @keyup.enter="updateSimulationDate"
                    class="form-control form-control-sm" />
                </div>
              </div>
            </form>
          </div>
          <div class="navbar-nav">
            <div class="nav-item ms-4 me-2">
              <button class="btn btn-secondary btn-sm rounded-pill text-nowrap shadow-none" @click="exportToPDF"
                :disabled="!getSimulationSlots.length" title="Exporter la simulation en PDF pour la recevoir par mail">
                <font-awesome-icon class="me-2" :icon="['fas', 'external-link-alt']" size="1x" />
                Exporter simulation
              </button>
            </div>
            <div class="nav-item me-2">
              <button class="btn btn-secondary btn-sm rounded-pill text-nowrap shadow-none" @click="exportContact"
                :disabled="!isOneMessageModel"
                title="Exporter les messages à envoyer aux visiteurs pour les recevoir par mail">
                <font-awesome-icon class="me-2" :icon="['fas', 'external-link-alt']" size="1x" />
                Exporter contacts
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes, faRedoAlt, faExternalLinkAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import {
  DATE_SIMULATION,
  POST_SIMULATION_PDF,
  EXPORT_SIMULATION_CONTACT,
  DISABLE_CONFIG,
  ENABLE_LOADING,
  DISABLE_LOADING
} from '../store/action.type';
import { RESET_SIMULATION_EVENT, UPDATE_SIMULATION_CONFIG_DATE } from '../store/mutations.type';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import moment from 'moment';
import { SimulationSlot } from '@/models/SimulationSlot';

library.add(faTimes, faRedoAlt, faExternalLinkAlt, faInfoCircle);

export default defineComponent({
  name: 'SimulationHeader',
  setup() {
    const store = useStore();

    const date = computed({
      get: () => store.getters.getSimulationConfigDate,
      set: (value: string) => store.commit(UPDATE_SIMULATION_CONFIG_DATE, value)
    });

    const getSimulationSlots = computed<SimulationSlot[]>(() => store.getters.getSimulationSlots);

    const isOneMessageModel = computed(() => {
      const slots = getSimulationSlots.value;
      const hasMessageModelElevator = slots.some(slot => slot.messageModelElevator !== null);
      const hasMessageModelStair = slots.some(slot => slot.messageModelStair !== null);
      return hasMessageModelElevator || hasMessageModelStair;
    });

    const focusDate = () => {
      store.dispatch(DISABLE_CONFIG);
    };

    const updateSimulationDate = () => {
      store.dispatch(DATE_SIMULATION);
      store.commit(RESET_SIMULATION_EVENT);
    };

    const exportContact = async () => {
      await store.dispatch(ENABLE_LOADING);
      try {
        await store.dispatch(EXPORT_SIMULATION_CONTACT);
      } catch (error) {
        process.env.NODE_ENV === 'development' && console.error("Error exporting contacts:", error);
      } finally {
        await store.dispatch(DISABLE_LOADING);
      }
    };

    const exportToPDF = async () => {
      await store.dispatch(ENABLE_LOADING);
      try {
        const pdf = new jsPDF('landscape', 'px', 'a4');
        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();

        const simulationDate = moment(date.value).format('DD/MM/YYYY');
        pdf.text(`Date de simulation : ${simulationDate}`, width / 2, 15, { align: 'center' });

        const elementsToPrint = [
          { id: 'configTab', x: 5, y: 25, w: 4 * (width / 10) - 10, h: height * (1 / 6) - 10 },
          { id: 'eventList', x: 4 * (width / 10) + 5, y: 35, w: 6 * (width / 10) - 10, h: height * (1 / 6) - 30 },
          { id: 'simulationTab', x: 5, y: height * (1 / 6) + 25, w: width - 10, h: height * (5 / 6) - 30 },
          { id: 'chart', x: width * (1 / 8), y: height * (1 / 4), w: width * (3 / 4) - 10, h: height * (3 / 6) - 30, newPage: true }
        ];

        for (const el of elementsToPrint) {
          const element = document.getElementById(el.id);
          if (!element) {
            process.env.NODE_ENV === 'development' && console.error(`Element with id "${el.id}" not found.`);
            continue;
          }

          if (el.newPage) {
            pdf.addPage();
            pdf.text(`Date de simulation : ${simulationDate}`, width / 2, 15, { align: 'center' });
          }

          const customSelects = el.id === 'simulationTab' ? element.querySelectorAll('.custom-select') : [];
          customSelects.forEach(select => select.classList.add('blankSelect'));

          const canvas = await html2canvas(element, {
            allowTaint: true,
            useCORS: true,
            imageTimeout: 0,
            scale: 2
          });

          customSelects.forEach(select => select.classList.remove('blankSelect'));

          const imgData = canvas.toDataURL('image/jpeg', 0.9);
          pdf.addImage(imgData, 'JPEG', el.x, el.y, el.w, el.h);
        }

        const pdfBlob = pdf.output('blob');
        await store.dispatch(POST_SIMULATION_PDF, pdfBlob);

      } catch (error) {
        process.env.NODE_ENV === 'development' && console.error("Failed to export PDF:", error);
      } finally {
        await store.dispatch(DISABLE_LOADING);
      }
    };

    onMounted(() => {
      store.dispatch(DATE_SIMULATION);
    });

    return {
      date,
      getSimulationSlots,
      isOneMessageModel,
      focusDate,
      updateSimulationDate,
      exportContact,
      exportToPDF
    };
  }
});
</script>

<style scoped>
.navbar-dark .navbar-nav .nav-link {
  color: white !important
}
</style>

<style lang="scss">
.blankSelect {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: none;
  background: transparent;
}
</style>

