import { flushPromises, mount } from '@vue/test-utils';
import { describe, it, vi } from 'vitest';
import TopMenu from '@/components/topmenu/TopMenu.vue';
import { useTokenStore } from '@/stores/Token';
import { createTestingPinia } from '@pinia/testing';


describe('MyComponent', () => {
  it('renders menu for admin user', async () => {

    const wrapper = mount(TopMenu, {
        global: {
          plugins: [createTestingPinia(
            {
                stubActions: false,
            },
        )],
        },
    })

    const tokenStore = useTokenStore()

    //apply mock values from token store
    tokenStore.is_admin = true
    tokenStore.is_user = true

    //patch the token so that $subscibe listener is triggered
    tokenStore.$patch({ token: ''})

    // Assert that the admin menu items are rendered
    expect(wrapper.vm.items).toHaveLength(11);
  });
});
