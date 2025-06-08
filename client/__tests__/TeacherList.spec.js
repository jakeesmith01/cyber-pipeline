import { describe, it, beforeEach, expect, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import TeacherList from '../src/features/TeacherList.vue';
import { useTokenStore } from '../src/stores/Token.js';
import { useTeachersStore } from '../src/stores/Teachers.js';
import { useDistrictsStore } from '../src/stores/Districts.js';
import { useCohortsStore } from '../src/stores/Cohorts.js';
import { useCoursesStore } from '../src/stores/Courses.js';
import PrimeVue from 'primevue/config'
import Panel from 'primevue/panel'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Dialog from 'primevue/dialog'
import ConfirmDialog from 'primevue/confirmdialog'
import Popover from 'primevue/popover'
import { ref } from 'vue';

vi.mock('../src/stores/Token')
vi.mock('../src/stores/Teachers')
vi.mock('../src/stores/Districts')
vi.mock('../src/stores/Cohorts')
vi.mock('../src/stores/Courses')

describe('TeacherList', () => {
    let wrapper;
    let tokenStore;
    let teacherStore;
    let districtStore;
    let cohortsStore;
    let coursesStore;

    beforeEach(() => {
        tokenStore = {
            hydrate: vi.fn(),
            is_admin: ref(true)
        }

        teacherStore = {
            hydrate: vi.fn(),
            delete: vi.fn(),
            update: vi.fn(),
            new: vi.fn(),
            teachers: ref([])
        }

        districtStore = {
            hydrate: vi.fn(),
            districts: ref([])
        }

        cohortsStore = {
            hydrate: vi.fn(),
            cohorts: ref([])
        }

        coursesStore = {
            hydrate: vi.fn(),
            courses: ref([])
        }

        useTokenStore.mockReturnValue(tokenStore);
        useTeachersStore.mockReturnValue(teacherStore);
        useDistrictsStore.mockReturnValue(districtStore);
        useCohortsStore.mockReturnValue(cohortsStore);
        useCoursesStore.mockReturnValue(coursesStore);

        wrapper = mount(TeacherList)
    })

    afterEach(() => {
        wrapper.unmount();
    })

    it('renders correctly', () => {
        expect(wrapper.exists()).toBe(true);
        expect(wrapper.findComponent(Panel).exists()).toBe(true);
        expect(wrapper.findComponent(Panel).text()).toContain('Manage Teachers')

        expect(wrapper.findComponent(Button).exists()).toBe(true);
        expect(wrapper.findComponent(Button).text()).toContain('New')
        expect(wrapper.findComponent(Button).props().icon).toBe('pi pi-plus')
    })

    it('opens new teacher dialog', async () => {
        const newButton = wrapper.findComponent(Button);
        await newButton.trigger('click');
        expect(wrapper.vm.teacherDialog).toBe(true);
        expect(wrapper.vm.teacherDialogHeader).toBe('New Teacher');
    })

    it('opens edit teacher dialog', async () => {
        const teacher = { id: 1, name: 'John Doe' };
        const spy = vi.spyOn(wrapper.vm, 'editTeacher');
        await wrapper.vm.editTeacher(teacher);

        expect(spy).toHaveBeenCalledWith(teacher);
        expect(wrapper.vm.teacherDialog).toBe(true);
        expect(wrapper.vm.teacherDialogHeader).toBe('Edit Teacher');
        expect(wrapper.vm.teacher).toEqual(teacher);
    })

    it('deletes a teacher', async () => {
        const teacher = { id: 1, name: 'John Doe' };
        const spy = vi.spyOn(wrapper.vm, 'deleteTeacher');
        const confirmSpy = vi.spyOn(wrapper.vm.$confirm, 'require');

        await wrapper.vm.deleteTeacher(teacher);

        expect(spy).toHaveBeenCalledWith(teacher);
        expect(confirmSpy).toHaveBeenCalledWith({
            message: 'Are you sure you want to delete John Doe?',
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

    it('saves a teacher', async () => {
        const teacher = { name: 'John Doe' };
        teacher.districts = teacher.districts ? teacher.districts.filter((item) => item.id) : [];
        wrapper.vm.teacher = teacher;
        const spy = vi.spyOn(wrapper.vm, 'save');
        await wrapper.vm.save();
        expect(spy).toHaveBeenCalled();
        expect(teacherStore.new).toHaveBeenCalledWith(teacher);
        expect(wrapper.vm.teacherDialog).toBe(false);
    })

    it('exports CSV', () => {
        wrapper.vm.dt = { exportCSV: vi.fn() };
        wrapper.vm.exportCSV();
        expect(wrapper.vm.dt.exportCSV).toHaveBeenCalled();
    })

    it('toggles notes dialog', () => {
        const teacher = { notes: 'Some notes' };
        const mockEvent = { currentTarget: [teacher] };

        wrapper.vm.notesDialog = { toggle: vi.fn() };

        wrapper.vm.toggleNotes(teacher, mockEvent);
        expect(wrapper.vm.notes).toBe('Some notes');
        expect(wrapper.vm.notesDialog.toggle).toHaveBeenCalledWith(mockEvent);
    })

    it('renders DataTable correctly', () => {
        expect(wrapper.findComponent(DataTable).exists()).toBe(true);
        expect(wrapper.findComponent(DataTable).props().value).toBe(wrapper.vm.teachers);
    })

    it('renders Dialogs correctly', () => {
        expect(wrapper.findComponent(Dialog).exists()).toBe(true);
        expect(wrapper.findComponent(ConfirmDialog).exists()).toBe(true);
        expect(wrapper.findComponent(Popover).exists()).toBe(true);
    })
})