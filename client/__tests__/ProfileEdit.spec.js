import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import ProfileEdit from '@/components/profile/ProfileEdit.vue'
import { useProfileStore } from '@/stores/Profile'
import { ref } from 'vue'
import Panel from 'primevue/panel'
import TextField from '@/components/forms/TextField.vue'

vi.mock('@/stores/Profile')

describe('ProfileEdit', () => {

  let wrapper;
  let profileStore

  beforeEach(() => {
    profileStore = {
      hydrate: vi.fn(),
      update: vi.fn(),
      user: ref({
        eid: '12345',
        name: 'John Doe',
      }),
    }
    useProfileStore.mockReturnValue(profileStore)

    // Mount the component with props and reactive properties
    wrapper = mount(ProfileEdit);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders correctly', () => {
    const panel = wrapper.findComponent(Panel)
    expect(panel.props('header')).toBe("Profile Settings")
  })

  it('should have eid textfield disabled and name textfield enabled', () => {

    // Get the TextField component for name
    const textFieldComponents = wrapper.findAllComponents(TextField);

    const eidTextField = textFieldComponents[0]; //grab eid text field
    const nameTextField = textFieldComponents[1]; //grab name text field

    expect(eidTextField.props('field')).toBe('eid');//check that textfield is actually for eid
    expect(nameTextField.props('field')).toBe('name'); //check that texfield is actually for name

    expect(eidTextField.props('disabled')).toBe(true);
    expect(nameTextField.props('disabled')).toBe(false);
  })

  it('save method should save data correctly', async () => {

    const spy = vi.spyOn(wrapper.vm, 'save');
    profileStore.user.value.name = 'New Name'
    await wrapper.vm.save();
    expect(spy).toHaveBeenCalled()

    profileStore.hydrate()

    expect(profileStore.user.value.name).toBe('New Name');
  })

  it('save should show success toast on successful update', async () => {

    // Mock the toast plugin
    const toast = wrapper.vm.$toast
    vi.spyOn(toast, 'add')

    profileStore.update.mockResolvedValueOnce() // Mock a successful update

    await wrapper.vm.save();

    expect(toast.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success',
      detail: 'Profile Updated!',
      life: 3000
    })
  })

  it('save should handle errors and show error message', async () => {

    profileStore.update.mockRejectedValueOnce({
      response: {
        data: {
          data: { name: 'Name is required' } // Mocking an error response
        }
      }
    })

    await wrapper.vm.save();

    expect(wrapper.vm.message).toBe('The server rejected this submission. Please correct errors listed below')
    expect(wrapper.vm.errors).toEqual({ name: 'Name is required' }) // Check if errors are set correctly
  })
})