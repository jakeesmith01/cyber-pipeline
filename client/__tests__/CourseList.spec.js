import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useCoursesStore } from '../src/stores/Courses.js'
import { useTeachersStore } from '../src/stores/Teachers.js'
import PrimeVue from 'primevue/config'
import Panel from 'primevue/panel'
import DataTable from 'primevue/datatable'
import Button from 'primevue/button'
import Popover from 'primevue/popover'
import Dialog from 'primevue/dialog'
import ConfirmDialog from 'primevue/confirmdialog'
import { ref } from 'vue'

// Import the component to test
import CourseList from '@/components/course/CourseList.vue'
import StepItem from 'primevue/stepitem'

vi.mock('../src/stores/Courses')
vi.mock('../src/stores/Teachers')

describe('CourseList', () => {
  let wrapper;
  let coursesStore;
  let teachersStore;

  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)

    coursesStore = {
      hydrate: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
      new: vi.fn(),
      courses: ref([])
    }

    teachersStore = {
      hydrate: vi.fn(),
      teachers: ref([])
    }

    useCoursesStore.mockReturnValue(coursesStore)
    useTeachersStore.mockReturnValue(teachersStore)

    wrapper = mount(CourseList, {
      global: {
        plugins: [pinia]
      }
    })
  })

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.findComponent(Panel).exists()).toBe(true);
    expect(wrapper.findComponent(Panel).text()).toContain('Manage Courses');

    expect(wrapper.findComponent(Button).exists()).toBe(true);
    expect(wrapper.findComponent(Button).text()).toContain('New');
    expect(wrapper.findComponent(Button).props().icon).toBe('pi pi-plus');
  })

  it('calls the editCourse method', async () => {
    const course = { id: 1, name: 'Test Course' };
    const spy = vi.spyOn(wrapper.vm, 'editCourse');
    await wrapper.vm.editCourse(course);

    expect(spy).toHaveBeenCalledWith(course);
    expect(wrapper.vm.courseDialog).toBe(true);
    expect(wrapper.vm.courseDialogHeader).toBe('Edit Course');
    expect(wrapper.vm.course).toEqual(course);
  })

  it('calls the newCourse method', async () => {
    const spy = vi.spyOn(wrapper.vm, 'newCourse');
    await wrapper.vm.newCourse();

    expect(spy).toHaveBeenCalled();
    expect(wrapper.vm.courseDialog).toBe(true);
    expect(wrapper.vm.courseDialogHeader).toBe('New Course');
  })

  it('calls the deleteCourse method', async () => {
    const course = { id: 1, name: 'Test Course' };
    const spy = vi.spyOn(wrapper.vm, 'deleteCourse');
    const confirmSpy = vi.spyOn(wrapper.vm.$confirm, 'require');

    await wrapper.vm.deleteCourse(course);

    expect(spy).toHaveBeenCalledWith(course);
    expect(confirmSpy).toHaveBeenCalledWith({
      message: 'Are you sure you want to delete Test Course?',
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

  it('calls the save method', async () => {
    const course = { name: 'Test Course' };
    course.teachers = course.teachers ? course.teachers.filter((item) => item.id) : [];
    wrapper.vm.course = course;

    const spy = vi.spyOn(wrapper.vm, 'save');
    await wrapper.vm.save(course);

    expect(spy).toHaveBeenCalled();
    expect(coursesStore.new).toHaveBeenCalledWith(course);
    expect(wrapper.vm.courseDialog).toBe(false);
  })

  it('exports the datatable to CSV', () => {
    wrapper.vm.dt = { exportCSV: vi.fn() };
    wrapper.vm.exportCSV();
    expect(wrapper.vm.dt.exportCSV).toHaveBeenCalled();
  })

  it('renders the datatable', () => {
    expect(wrapper.findComponent(DataTable).exists()).toBe(true);
    expect(wrapper.findComponent(DataTable).props().value).toBe(wrapper.vm.courses);
  })

  it('renders the Dialog', () => {
    expect(wrapper.findComponent(Dialog).exists()).toBe(true);
    expect(wrapper.findComponent(ConfirmDialog).exists()).toBe(true);
    expect(wrapper.findComponent(Popover).exists()).toBe(true);
  })
})