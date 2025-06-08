import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import CohortList from '../src/components/cohort/CohortList.vue'
import { useCohortsStore } from '../src/stores/Cohorts.js'
import { useTeachersStore } from '../src/stores/Teachers.js'
import Panel from 'primevue/panel'
import DataTable from 'primevue/datatable'
import Button from 'primevue/button'
import Popover from 'primevue/popover'
import Dialog from 'primevue/dialog'
import ConfirmDialog from 'primevue/confirmdialog'
import { ref } from 'vue'
import { nextTick } from 'vue'

// Mocking the stores
vi.mock('../src/stores/Cohorts')
vi.mock('../src/stores/Teachers')

describe('CohortList', () => {
  let wrapper;
  let cohortsStore;
  let teachersStore;

  beforeEach(() => {
    cohortsStore = {
      hydrate: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
      new: vi.fn(),
      cohorts: ref([{ id: 1, name: 'Test Cohort' }]) // Added a test cohort
    };

    teachersStore = {
      hydrate: vi.fn(),
      teachers: ref([{ id: 1, name: 'Test Teacher' }]) // Added a test teacher
    };

    useCohortsStore.mockReturnValue(cohortsStore);
    useTeachersStore.mockReturnValue(teachersStore);

    // Mount the component with props and reactive properties
    wrapper = mount(CohortList);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.findComponent(Panel).exists()).toBe(true);
    expect(wrapper.findComponent(Panel).text()).toContain('Manage Cohorts');

    expect(wrapper.findComponent(Button).exists()).toBe(true);
    expect(wrapper.findComponent(Button).text()).toContain('New');
    expect(wrapper.findComponent(Button).props().icon).toBe('pi pi-plus');

    expect(wrapper.findComponent(DataTable).exists()).toBe(true);
    expect(wrapper.findComponent(DataTable).props().value).toBe(wrapper.vm.cohorts);
  });


  it('opens the cohort dialog with correct header when "New" button is clicked', async () => {
    const buttons = wrapper.findAllComponents(Button)
    const newButton = buttons[0]
    expect(newButton.text()).toBe("New")

    expect(wrapper.vm.cohortDialog).toBe(false);
    await newButton.trigger('click');
    expect(wrapper.vm.cohortDialog).toBe(true);
  })

  it.todo('opens the cohort dialog with correct data when "Edit" button is clicked', async () => {
   
  })

  it.todo('triggers the confirmation dialog when "Delete" button is clicked', async () => {
  })

  it.todo('deletes a cohort after confirmation', async () => {
  })

  it.todo('shows an error toast when the deletion fails', async () => {
  })

  it.todo('opens the notes dialog when the "Notes" button is clicked', async () => {
  })

  it.todo('calls the save method and successfully updates/creates a cohort', async () => {
  })

  it.todo('displays form errors when saving fails', async () => {
  })

  it.todo('exports the DataTable to CSV when the "Export" button is clicked', async () => {
  })

  it.todo('filters the table correctly when a keyword is entered in the search box', async () => {
  })

  it.todo('opens and closes the dialog correctly', async () => {
  })

  it.todo('displays the correct error message when no cohorts are available in the table', () => {
  })

  it.todo('handles multiple teachers in the cohort form correctly', async () => {
  })

  it.todo('displays the error message if required fields are missing or invalid during saving', async () => {
  })

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })
});