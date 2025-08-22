<template>
  <Bar
    :data="chartData"
    :options="chartOptions"
    :plugins="chartPlugins"
  />
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, onBeforeUnmount, ref, nextTick } from 'vue'
import { useStore } from 'vuex'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import chartjsPluginAnnotation from 'chartjs-plugin-annotation'
import { FETCH_PARAMETERS } from '../store/action.type'
import moment from 'moment'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  chartjsPluginAnnotation
)

export default defineComponent({
    name: 'SimulationChart',
    components: {
        Bar
    },
    setup() {
        const store = useStore()
        
        onMounted(async () => {
            await store.dispatch(FETCH_PARAMETERS)
        })

        // Cleanup on component unmount to prevent DOM reference errors
        onBeforeUnmount(() => {
            // Force cleanup of Chart.js instances
            nextTick(() => {
                const chartElements = document.querySelectorAll('canvas')
                chartElements.forEach(canvas => {
                    const chart = ChartJS.getChart(canvas)
                    if (chart) {
                        chart.destroy()
                    }
                })
            })
        })

        const getTimetable = computed(() => store.getters.getTimetable)
        const getSimulationSlots = computed(() => store.getters.getSimulationSlots)
        const getParameters = computed(() => store.getters.getParameters)

        const labels = computed(() => {
            return getTimetable.value.map((date: string) => moment(date).utc().format('HH:mm'))
        })

        const dataWaitingVisitors = computed(() => {
            return getSimulationSlots.value ? getSimulationSlots.value.map((slot: any) => slot.waitingVisitors) : []
        })

        const startActionZone = computed(() => {
            const actionZoneSlot = getSimulationSlots.value ? getSimulationSlots.value.find((slot: any) => slot.isActionZone === true) : undefined
            if (actionZoneSlot === undefined || !actionZoneSlot.endTime) {
                return undefined
            }
            return moment(actionZoneSlot.endTime).utc().format('HH:mm')
        })

        const colorActionZone = computed(() => {
            if (!getSimulationSlots.value || getSimulationSlots.value.find((slot: any) => slot.isActionZone === true) === undefined) {
                return 'rgba(226, 238, 216, 0)'
            }
            return 'rgba(226, 238, 216, 0.8)'
        })

        const colorRedZone = computed(() => {
            if (!getSimulationSlots.value || getSimulationSlots.value.find((slot: any) => slot.isRedZone === true) === undefined) {
                return 'rgba(239, 223, 223, 0)'
            }
            return 'rgba(239, 223, 223, 0.8)'
        })

        const startRedZone = computed(() => {
            const redZoneSlot = getSimulationSlots.value ? getSimulationSlots.value.find((slot: any) => slot.isRedZone === true) : undefined
            if (redZoneSlot === undefined || !redZoneSlot.startTime) {
                return undefined
            }
            if (redZoneSlot.startTime === getSimulationSlots.value[0]?.startTime) {
                return undefined
            }
            return moment(redZoneSlot.startTime).utc().format('HH:mm')
        })

        const endRedZone = computed(() => {
            const redZoneParam = getParameters.value.find((parameter: any) => parameter.keyParam === 'red_zone')
            const redZoneSlot = getSimulationSlots.value ? getSimulationSlots.value.find((slot: any) => slot.isRedZone === true) : undefined
            
            if (redZoneParam !== undefined && redZoneSlot !== undefined && getSimulationSlots.value) {
                let duration = redZoneParam.value
                duration = duration / 30
                const index = getSimulationSlots.value.findIndex((slot: any) => slot.isRedZone === true)
                const targetSlot = getSimulationSlots.value[index + duration]
                return targetSlot && targetSlot.startTime ? moment(targetSlot.startTime).utc().format('HH:mm') : null
            }
            return null
        })

        const limit = computed(() => {
            const limitParam = getParameters.value.find((parameter: any) => parameter.keyParam === 'limit')
            if (limitParam === undefined) {
                return undefined
            }
            return limitParam.value
        })

        const limitColor = computed(() => {
            return 'rgba(0, 0, 0, 1)'
        })

        const annotations = computed(() => {
            const annotationsList = []
            
            // Red zone annotation
            if (startRedZone.value && endRedZone.value) {
                annotationsList.push({
                    type: 'box',
                    id: 'region-2',
                    xScaleID: 'x',
                    yScaleID: 'y',
                    xMin: startRedZone.value,
                    xMax: endRedZone.value,
                    backgroundColor: colorRedZone.value
                })
            }
            
            // Action zone annotation
            if (startActionZone.value) {
                annotationsList.push({
                    type: 'box',
                    id: 'region-1',
                    xScaleID: 'x',
                    yScaleID: 'y',
                    xMin: startActionZone.value,
                    backgroundColor: colorActionZone.value
                })
            }
            
            // Limit line annotation
            if (limit.value !== undefined) {
                annotationsList.push({
                    type: 'line',
                    mode: 'horizontal',
                    scaleID: 'y',
                    value: limit.value,
                    borderColor: limitColor.value,
                    borderWidth: 3
                })
            }
            
            return annotationsList
        })

        const chartData = computed(() => {
            return {
                labels: labels.value,
                datasets: [{
                    label: 'Visiteurs en attente',
                    data: dataWaitingVisitors.value,
                    backgroundColor: '#A94442',
                    barThickness: 11
                }]
            }
        })

        const chartOptions = computed(() => {
            return {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: true
                    },
                    annotation: {
                        annotations: annotations.value
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(192, 192, 192, 1)'
                        },
                        display: true
                    },
                    y: {
                        grid: {
                            color: 'rgba(192, 192, 192, 1)'
                        },
                        display: true,
                        ticks: {
                            suggestedMin: 0,
                            beginAtZero: true
                        }
                    }
                }
            }
        })

        const chartPlugins = ref([chartjsPluginAnnotation])

        return {
            chartData,
            chartOptions,
            chartPlugins
        }
    }
})
</script>
<style scoped>
    canvas{
        height:30rem !important;
    }
</style>
