import { createPinia, setActivePinia } from 'pinia';
import LoginProfile from '@/components/topmenu/LoginProfile.vue';
import { useTokenStore } from '@/stores/Token';
import { describe, it, beforeEach, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router';
import Menu from 'primevue/menu';
import Avatar from 'primevue/avatar';

describe('LoginProfile', () => {

  let wrapper;

  // Set up a router for the tests
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  beforeEach(() => {
    // Activate Pinia before each test
    setActivePinia(createPinia());

    wrapper = mount(LoginProfile, {
      global: {
        plugins: [router], // Add router as a plugin
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should show login button when no token is present', () => {

    wrapper.vm.tokenStore.token = '';

    // Check if the "Login" button is rendered
    expect(wrapper.text()).toContain('Login');
  });

  it('should show profile menu when token is present', async () => {
    // Set up the token store with a token
    wrapper.vm.tokenStore.token = 'some-token'

    // Wait for the next tick to ensure the DOM updates
    await wrapper.vm.$nextTick();

    // Check if the Menu and Avatar are rendered
    const menu = wrapper.findComponent(Menu);
    expect(menu.exists()).toBe(true);
    const avatar = wrapper.findComponent(Avatar);
    expect(avatar.exists()).toBe(true);
  });

  it.todo('should route you to profile page when profile clicked', async () => {
    const tokenStore = useTokenStore();
    tokenStore.token = 'some-token';

    router.push('/')
    await router.isReady()

    await wrapper.find('a').trigger('click')
  })
});