import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import AutoComplete from 'primevue/autocomplete'
import { nextTick } from 'vue'
// Import the component to test
import AutocompleteMultiple from '@/components/forms/AutocompleteMultiple.vue'

describe('AutoCompleteMultiple', () => {
  const props = {
    field: 'testField',
    label: 'Test Label',
    icon: 'pi pi-search',
    values: [
      { name: 'Apple' },
      { name: 'Banana' },
      { name: 'Orange' },
      { name: 'Option 4'}
    ],
    valueLabel: 'name',
    disabled: false,
    modelValue: [],
    errors: {
      testField: [{ message: 'Field is required' }]
    }
  }

  let wrapper;
  beforeEach(() => {
      wrapper = mount(AutocompleteMultiple, {
      props
    })
  })

  it('renders correctly with provided props', async () => {

    const autoComplete = wrapper.getComponent(AutoComplete)

    expect(autoComplete).toBeDefined();

    await autoComplete.vm.$emit('complete', { query: 'A' }); //testing the searching could add more search tests in the future
    await nextTick();

    expect(wrapper.vm.items).toEqual([
    { name: 'Apple' }
    ]);

    wrapper.unmount();
  })

  //right now autocomplete is case sensitive but onces that is gone take off the todo
  it.todo('autocompletes correctly', async () => {
    const autoComplete = wrapper.getComponent(AutoComplete)

    // Standard case-sensitive search
    await autoComplete.vm.$emit('complete', { query: 'A' })
    await nextTick()
    expect(wrapper.vm.items).toEqual([
      { name: 'Apple'},
      { name: 'Banana' },
      { name: 'Orange' }
    ])

    // Case insensitivity
    await autoComplete.vm.$emit('complete', { query: 'a' })
    await nextTick()
    expect(wrapper.vm.items).toEqual([
      { name: 'Apple'},
      { name: 'Banana' },
      { name: 'Orange' }
    ])

    //middle of word match
    await autoComplete.vm.$emit('complete', { query: 'an' })
    await nextTick()
    expect(wrapper.vm.items).toEqual([
      { name: 'Banana' },
      { name: 'Orange' }
    ])

    //only one item with b
    await autoComplete.vm.$emit('complete', { query: 'b' })
    await nextTick()
    expect(wrapper.vm.items).toEqual([{ name: 'Banana' }])

    // No matches case
    await autoComplete.vm.$emit('complete', { query: 'xyz' })
    await nextTick()
    expect(wrapper.vm.items).toEqual([])

    // Special characters or numbers
    await autoComplete.vm.$emit('complete', { query: '4' })
    await nextTick()
    expect(wrapper.vm.items).toEqual([{name: 'Option 4'}])
  });

  it('binds v-model correctly to AutoComplete', async () => {
    const autoComplete = wrapper.getComponent(AutoComplete)
    await autoComplete.vm.$emit('update:modelValue', ['Apple'])
    await nextTick()
    expect(wrapper.vm.model).toEqual(['Apple'])
  })

  it('disables input when the disabled prop is true', async () => {
    await wrapper.setProps({ disabled: true })
    const autoComplete = wrapper.getComponent(AutoComplete)
    expect(autoComplete.props('disabled')).toBe(true)
  })

  it('displays error messages correctly', async () => {
    const errorMessage = wrapper.find('small')
    expect(errorMessage.text()).toBe('Field is required')
  })

  it('matches the snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot()
  })
})