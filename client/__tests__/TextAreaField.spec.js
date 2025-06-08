import { it, expect, describe } from 'vitest'
import TextAreaField from '@/components/forms/TextAreaField.vue'
import Textarea from 'primevue/textarea'
import { mount } from '@vue/test-utils'

describe('TextAreaField', () => {
    const props = {
        field: 'testField',
        label: 'Test Field',
        icon: 'pi pi-user',
        disabled: false,
        errors: {
            testField: [{ message: 'Field is required' }]
        }
    }

    it('renders a text area', () => {
        const wrapper = mount(TextAreaField, { props })

        expect(wrapper.findComponent(Textarea).exists()).toBe(true)
    })
})