import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import Panel from 'primevue/panel'
import DataTable from 'primevue/datatable'
import Button from 'primevue/button'
import Popover from 'primevue/popover'
import Dialog from 'primevue/dialog'
import ConfirmDialog from 'primevue/confirmdialog'
import { ref } from 'vue'

// Import the component to test
import DistrictList from '@/components/district/DistrictList.vue'
import { useTokenStore } from '@/stores/Token.js'
import { useDistrictsStore } from '@/stores/Districts.js'

vi.mock('../src/stores/Token')
vi.mock('../src/stores/Districts')

describe('DistrictList', () => {
  let wrapper;
  let tokensStore;
  let districtsStore;

  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)

    tokensStore = {
      token: ref('mockedTokenValue'), // initial token value for testing
      refresh_token: vi.fn().mockReturnValue('mockedRefreshToken'), // example getter return
      eid: vi.fn().mockReturnValue('mockedEID'),
      is_admin: vi.fn().mockReturnValue(true),
      is_user: vi.fn().mockReturnValue(true),
      getToken: vi.fn(), // mocked action
      tryToken: vi.fn(),
      refreshToken: vi.fn(),
      logout: vi.fn(),
    }

    districtsStore = {
      districts: ref([]), // initial districts array for testing
      getDistrict: vi.fn((id) => districtsStore.districts.value.find(d => d.id === id)),
      getAllDistrictsUsd: vi.fn().mockReturnValue('USD string for test'), // sample USD result for testing
      hydrate: vi.fn(), // mock API action
      update: vi.fn(),
      new: vi.fn(),
      delete: vi.fn(),
    }

    useTokenStore.mockReturnValue(tokensStore)
    useDistrictsStore.mockReturnValue(districtsStore)

    wrapper = mount(DistrictList, {
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
    expect(wrapper.findComponent(DataTable).exists()).toBe(true);
    expect(wrapper.findComponent(DataTable).props().value).toBe(wrapper.vm.districts);
    expect(wrapper.findComponent(Dialog).exists()).toBe(true);
    expect(wrapper.findComponent(ConfirmDialog).exists()).toBe(true);
    expect(wrapper.findComponent(Popover).exists()).toBe(true);
  })

  it('calls the editDistrict method', async () => {
    const district = { id: 1, name: 'Test District' };
    const spy = vi.spyOn(wrapper.vm, 'editDistrict');
    await wrapper.vm.editDistrict(district);

    expect(spy).toHaveBeenCalledWith(district);
    expect(wrapper.vm.districtDialog).toBe(true);
    expect(wrapper.vm.districtDialogHeader).toBe('Edit District');
    expect(wrapper.vm.district).toEqual(district);
  })

  it('calls the newDistrict method', async () => {
    const spy = vi.spyOn(wrapper.vm, 'newDistrict');
    await wrapper.vm.newDistrict();

    expect(spy).toHaveBeenCalled();
    expect(wrapper.vm.districtDialog).toBe(true);
    expect(wrapper.vm.districtDialogHeader).toBe('New District');
  })

  it('calls the deleteDistrict method', async () => {
    const district = { id: 1, name: 'Test District' };
    const spy = vi.spyOn(wrapper.vm, 'deleteDistrict');
    const confirmSpy = vi.spyOn(wrapper.vm.$confirm, 'require');

    await wrapper.vm.deleteDistrict(district);

    expect(spy).toHaveBeenCalledWith(district);
    expect(confirmSpy).toHaveBeenCalledWith({
      message: 'Are you sure you want to delete Test District?',
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
    const district = { name: 'Test District' };
    district.districts = district.districts ? district.districts.filter((item) => item.id) : [];
    wrapper.vm.district = district;

    const spy = vi.spyOn(wrapper.vm, 'save');
    await wrapper.vm.save(district);

    expect(spy).toHaveBeenCalled();
    expect(districtsStore.new).toHaveBeenCalledWith(district);
    expect(wrapper.vm.districtDialog).toBe(false);
  })

  it('can export the datatable to CSV', () => {
    wrapper.vm.dt = { exportCSV: vi.fn() };
    wrapper.vm.exportCSV();
    expect(wrapper.vm.dt.exportCSV).toHaveBeenCalled();
  })
})