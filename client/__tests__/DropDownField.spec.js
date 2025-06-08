import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { vi } from 'vitest'

// Import the component to test
import DropDownField from '@/components/forms/DropDownField.vue'
import Select from 'primevue/select'

describe('DropDownField', () => {

  const props = {
    field: 'testField',
    label: 'Test Label',
    icon: 'pi pi-search',
    values: [{ id: 1, name: 'Option 1' }, { id: 2, name: 'Option 2' }],
    valueLabel: 'name',
    disabled: false,
    modelValue: [],
    errors: {
      testField: [{ message: 'Field is required' }]
    }
  }

  const wrapper = mount(DropDownField, {
    props
  })

  it('renders correctly', () => {

    // Check if the dropdown is rendered with correct options
    const dropdown = wrapper.findComponent(Select)
    expect(dropdown.exists()).toBe(true)
    expect(dropdown.props('options')).toEqual(props.values)
  })
})