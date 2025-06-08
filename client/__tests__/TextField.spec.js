import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TextField from '../src/components/forms/TextField.vue'
import InputText from 'primevue/inputtext'

describe('TextField', () => {

    const props = {
        field: 'testField',
        label: 'Test Field',
        icon: 'pi pi-user',
        disabled: false,
        modelValue: '',
        errors: {
            testField: [{ message: 'Field is required' }]
        }
    }

    it('renders a text field', () => {
        const wrapper = mount(TextField, { props })

        expect(wrapper.findComponent(InputText).exists()).toBe(true)
    })
})