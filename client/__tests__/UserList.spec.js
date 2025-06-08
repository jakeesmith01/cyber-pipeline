import { describe, it, beforeEach, expect, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import UserList from '../src/components/user/UserList.vue';
import { useUsersStore } from '../src/stores/Users.js';
import { useRolesStore } from '../src/stores/Roles.js';
import PrimeVue from 'primevue/config'
import Panel from 'primevue/panel'
import Button from 'primevue/button'


vi.mock('../src/stores/Users')
vi.mock('../src/stores/Roles')

describe('UserList', () => {
    let wrapper;
    let usersStore;
    let rolesStore;

    beforeEach(() => {
        usersStore = {
            hydrate: vi.fn(),
            delete: vi.fn(),
            update: vi.fn(),
            new: vi.fn(),
        }

        rolesStore = {
            hydrate: vi.fn(),
        }

        useUsersStore.mockReturnValue(usersStore);
        useRolesStore.mockReturnValue(rolesStore);

        wrapper = mount(UserList)
    })

    afterEach(() => {
        wrapper.unmount();
    })

    it('renders correctly', () => {
        expect(wrapper.exists()).toBe(true);
        expect(wrapper.findComponent(Panel).exists()).toBe(true);
        expect(wrapper.findComponent(Panel).text()).toContain('Manage Users')

        expect(wrapper.findComponent(Button).exists()).toBe(true);
        expect(wrapper.findComponent(Button).text()).toContain('New')
        expect(wrapper.findComponent(Button).props().icon).toBe('pi pi-plus')
    })

    it.todo('calls hydrate on mount', () => {
        expect(usersStore.hydrate).toHaveBeenCalled();
        expect(rolesStore.hydrate).toHaveBeenCalled();
    })

    it('calls editUser method', async () => {
        const user = { id: 1, name: 'Test User' }
        const spy = vi.spyOn(wrapper.vm, 'editUser');
        await wrapper.vm.editUser(user);
        expect(spy).toHaveBeenCalledWith(user);
        expect(wrapper.vm.userDialogHeader).toBe('Edit User');
        expect(wrapper.vm.userDialog).toBe(true);
    })

    it('calls newUser method', async () => {
        const spy = vi.spyOn(wrapper.vm, 'newUser');
        await wrapper.vm.newUser();
        expect(spy).toHaveBeenCalled();
        expect(wrapper.vm.user).toEqual({ eid: '', name: '', roles: [] });
        expect(wrapper.vm.editEid).toBe(true);
        expect(wrapper.vm.userDialogHeader).toBe('New User');
        expect(wrapper.vm.userDialog).toBe(true);
    })

    it('calls deleteUser method', async () => {
        const user = { id: 1, name: 'Test User' }
        const spy = vi.spyOn(wrapper.vm, 'deleteUser');
        const confirmSpy = vi.spyOn(wrapper.vm.$confirm, 'require');
        await wrapper.vm.deleteUser(user);

        expect(spy).toHaveBeenCalledWith(user);
        expect(confirmSpy).toHaveBeenCalledWith({
            message: 'Are you sure you want to delete Test User?',
            header: 'Danger Zone',
            icon: 'pi pi-exclamation-triangle',
            rejectLabel: 'Cancel',
            acceptLabel: 'Delete',
            rejectClass: 'p-button-secondary p-button-outlined',
            acceptClass: 'p-button-danger',
            accept: expect.any(Function),
            reject: expect.any(Function)
        })
    })

    it('calls save method', async () => {
        const user = { id: 1, name: 'Test User' }
        wrapper.vm.user = user;
        const spy = vi.spyOn(wrapper.vm, 'save');
        await wrapper.vm.save();
        expect(spy).toHaveBeenCalled();
    })

    it('calls exportFunction method', async () => {
        const row = { data: [{ name: 'Admin' }] };
        const result = wrapper.vm.exportFunction(row);
        expect(result).toBe('"Admin,"');
    })

});