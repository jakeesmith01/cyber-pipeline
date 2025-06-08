import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import TeacherDashboard from '@/components/teacher/TeacherDashboard.vue'
import Chart from 'primevue/chart'
import Panel from 'primevue/panel'
import { nextTick } from 'vue'


// unmounting the TeacherDashboard throws an error that should be looked into
describe('TeacherDashboard', () => {
  let wrapper

  beforeEach(() => {
    // Mount the component before each test
    wrapper = mount(TeacherDashboard)
  })


  it('contains the Panel and Chart component', () => {
    const panel = wrapper.findComponent(Panel)
    expect(panel.props('header')).toBe("Teacher Dashboard")
    const chartComponent = wrapper.findComponent(Chart)
    expect(chartComponent.exists()).toBe(true)
  })

  it('renders chart data and options correctly', async () => {
    // Access chart data and options
    const chartData = wrapper.vm.chartData
    const chartOptions = wrapper.vm.chartOptions

    await nextTick()

    // Ensure chart data is defined and contains the expected labels
    expect(chartData).toBeDefined()
    expect(chartData.labels).toEqual(['January', 'February', 'March', 'April', 'May', 'June', 'July'])

    // Ensure chart options are defined and check specific configuration
    expect(chartOptions).toBeDefined()
    expect(chartOptions.scales.x.stacked).toBe(true)
  })
})