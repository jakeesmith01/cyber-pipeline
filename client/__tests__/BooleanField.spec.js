import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
// Import your component
import BooleanField from '@/components/forms/BooleanField.vue'
// PrimeVue component mock
import ToggleSwitch from 'primevue/toggleswitch'

describe('BooleanField', () => {
  const props = {
    field: 'testField',
    label: 'TestLabel',
    disabled: false,
    errors: {
      testField: [{ message: 'Field is required' }]
    }
  }

  let wrapper;
  beforeEach(() => {
      wrapper = mount(BooleanField, {
      props
    })
  })

  // Test: Renders correctly with given props
  it('renders correctly with given props', () => {
    const label = wrapper.get('label')
    const labelText = label.text()

    // Check the label text
    expect(labelText).toBe(props.label)
  })

  // Test: Binds v-model correctly to ToggleSwitch
  it('binds v-model correctly to ToggleSwitch', async () => {
    const toggleSwitch = wrapper.findComponent(ToggleSwitch)

    //true works
    await toggleSwitch.vm.$emit('update:modelValue', true)
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual([true])

    //false works
    await toggleSwitch.vm.$emit('update:modelValue', false)
    expect(wrapper.emitted()['update:modelValue'][1]).toEqual([false])
  })

  // Test: Disables the switch when the disabled prop is true
  it('disables the switch when the disabled prop is true', async() => {
    await wrapper.setProps({ disabled: true })
    const toggleSwitch = wrapper.findComponent(ToggleSwitch)
    expect(toggleSwitch.props().disabled).toBe(true)
  })

  // Test: Displays error messages correctly when validation fails
  it('displays error messages correctly when validation fails', () => {
    const errorMessage = wrapper.find('small')
    expect(errorMessage.text()).toBe('Field is required')
  })

  // Test: Associates label correctly with the input
  it('associates label correctly with the input', () => {
    const label = wrapper.find('label')
    expect(label.exists()).toBe(true)
    expect(label.attributes('for')).toBe(props.field)
  })


  it('matches the snapshot', () => {
    const wrapper = mount(BooleanField, {
      props
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})