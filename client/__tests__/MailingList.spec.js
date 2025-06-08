import { describe, it, beforeEach, expect, vi } from 'vitest';
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia';
import { mount } from '@vue/test-utils';
import MailingView from '../src/views/MailingView.vue';
import { useUsersStore } from '../src/stores/Users.js';
import { useRolesStore } from '../src/stores/Roles.js';
import { useTeachersStore } from '../src/stores/Teachers.js';
import PrimeVue from 'primevue/config'
import Panel from 'primevue/panel'
import Button from 'primevue/button'
import TextField from '@/components/forms/TextField.vue';
import InputText from 'primevue/inputtext'
import Editor from 'primevue/editor';


vi.mock('../src/stores/Users')
vi.mock('../src/stores/Roles')
vi.mock('../src/stores/Teachers')

global.URL.createObjectURL = vi.fn()

describe('Mailing List', () => {
    let wrapper;
    let usersStore;
    let rolesStore;
    let teachersStore;

    beforeEach(async () => {
        setActivePinia(createPinia())
        usersStore = {
            hydrate: vi.fn(),
            delete: vi.fn(),
            update: vi.fn(),
            new: vi.fn(),
        }

        rolesStore = {
            hydrate: vi.fn(),
        }

        teachersStore = {
            hydrate: vi.fn(),
            teachers: [
                { name: 'Russell Feldhausen', email: 'russell@example.com' },
                { name: 'John Doe', email: 'john@example.com' },
                { name: 'Jane Smith', email: 'jane@example.com' }
            ]
        }

        useUsersStore.mockReturnValue(usersStore);
        useRolesStore.mockReturnValue(rolesStore);
        useTeachersStore.mockReturnValue(teachersStore);

        wrapper = mount(MailingView)
        await wrapper.vm.$nextTick()
    })

    it('renders correctly', async () => {
        expect(wrapper.exists()).toBe(true)

        const textFields = wrapper.findAllComponents(TextField)
        await wrapper.vm.$nextTick()
        expect(textFields.length).toBe(2)
        expect(textFields[0].props('label')).toBe("Recipients")
        expect(textFields[1].props('label')).toBe("Subject")
        expect(textFields[0].props().icon).toBe('pi pi-envelope')
        expect(textFields[1].props().icon).toBe("pi pi-bookmark")

        const editor = wrapper.findComponent(Editor)
        expect(editor).toBeDefined()

        const buttons = wrapper.findAllComponents(Button)
        expect(buttons.length).toBe(1)
        expect(buttons[0].props('label')).toBe("Send")
        expect(buttons[0].props().icon).toBe('pi pi-check')
    })

    it.todo('calls hydrate on mount', () => {
        expect(teachersStore.hydrate).toHaveBeenCalled()
    })

    it('calls filterTeachers method', async () => {
        const spy = vi.spyOn(wrapper.vm, 'filterTeachers')
        wrapper.vm.searchTerm = 'russell'
        await wrapper.vm.filterTeachers()
        expect(spy).toHaveBeenCalledWith()
        expect(wrapper.vm.filteredTeachers).toStrictEqual(teachersStore.teachers.filter(teacher =>
            teacher.name.toLowerCase().includes('russell') ||
            teacher.email.toLowerCase().includes('russell')))
    })

    it('calls showRecipientDialog', async () => {
        const spy = vi.spyOn(wrapper.vm, 'showRecipientDialog')
        await wrapper.vm.showRecipientDialog()
        expect(spy).toHaveBeenCalledWith()
        expect(wrapper.vm.recipientDialog).toBe(true)
    })

    it('calls selectRecipient method', async () => {
        const spy = vi.spyOn(wrapper.vm, 'selectRecipient')
        const teacher = {
            name: "Russell Feldhausen",
            email: "russell@gmail.com"
        }
        await wrapper.vm.selectRecipient(teacher)
        expect(spy).toHaveBeenCalled(teacher)
        expect(wrapper.vm.recipient).toContain("russell@gmail.com")
        expect(wrapper.vm.recipientDisplay).toBe("russell@gmail.com")

    })

    it('calls removeRecipient method', async () => {
        const user = { name: 'Test User', email: "test@gmail.com" }
        const spy = vi.spyOn(wrapper.vm, 'removeRecipient');
        await wrapper.vm.selectRecipient(user)
        await wrapper.vm.removeRecipient(user)
        expect(spy).toHaveBeenCalled(user)
        expect(wrapper.vm.recipient).not.toContain("test@gmail.com")
        expect(wrapper.vm.recipientDisplay).toBe('')
    })

    it('calls focusCloseButton method', async () => {
        const spy = vi.spyOn(wrapper.vm, 'focusCloseButton');
        await wrapper.vm.focusCloseButton();
        expect(spy).toHaveBeenCalled();
    })

    it('calls sendEmail method', async () => {
        const recipient = { name: 'Test User', email: "test@gmail.com" }
        const sender = { name: 'Test sender', email: "sender@gmail.com" }
        const spy = vi.spyOn(wrapper.vm, 'sendEmail')
        await wrapper.vm.sendEmail()
        await wrapper.vm.$nextTick()
        expect(spy).toHaveBeenCalled()
        expect(wrapper.vm.message).toBe('At least one recipient is required')
        wrapper.vm.subject = 'test subject'
        wrapper.vm.text = 'test text'
        wrapper.vm.selectRecipient(recipient)
        await wrapper.vm.sendEmail()
        await wrapper.vm.$nextTick()
        expect(spy).toHaveBeenCalled()
        expect(wrapper.vm.recipient.length).toBe(0)
        expect(wrapper.vm.recipientDisplay).toBe('')
        expect(wrapper.vm.subject).toBe('')
        expect(wrapper.vm.text).toBe('')
        expect(wrapper.vm.message).toBe('Email sent successfully')
    })


});