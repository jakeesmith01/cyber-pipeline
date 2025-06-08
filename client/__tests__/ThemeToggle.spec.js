import { flushPromises, mount } from '@vue/test-utils'
import { vi, describe, it, expect, afterEach, beforeAll, afterAll, beforeEach } from 'vitest'
import ThemeToggle from '@/components/topmenu/ThemeToggle.vue'

describe('ThemeToggle.vue', () => {

  beforeEach(() => {
    global.localStorage.clear();
  })

  afterEach(() => {
    global.localStorage.clear();
  })

  it('renders correctly with no initial theme', async () => {
    const wrapper = mount(ThemeToggle)
    await wrapper.vm.$nextTick()

    // Should render the moon icon, as we default to light mode
    const toggle = wrapper.find('span.pi-moon')
    expect(toggle.exists()).toBe(true)
  })

  it('renders correctly with light theme in localStorage', async () => {
    global.localStorage.setItem('user-theme', 'light')
    const wrapper = mount(ThemeToggle)
    //await flushPromises()
    await wrapper.vm.$nextTick()

    // Should render the moon icon, as we are in light mode
    const toggle = wrapper.find('span.pi-moon')
    expect(toggle.exists()).toBe(true)
  })

  it('renders correctly with dark theme in localStorage', async () => {
    window.localStorage.setItem('user-theme', 'dark')
    const wrapper = mount(ThemeToggle)
    await wrapper.vm.$nextTick()

    // Should render the sun icon, as we are in dark mode
    const toggle = wrapper.find('span.pi-sun')
    expect(toggle.exists()).toBe(true)
  })

  it('renders correctly when dark theme is toggled', async () => {
    const wrapper = mount(ThemeToggle)
    await wrapper.vm.$nextTick()

    // We should start in light mode, so clicking will put us into dark mode
    wrapper.find('a.p-menuitem-link').trigger('click')
    await wrapper.vm.$nextTick()

    // Should render the sun icon, as we are in dark mode
    const toggle = wrapper.find('span.pi-sun')
    expect(toggle.exists()).toBe(true)

    // Clicking once more should put us back into light mode 
    wrapper.find('a.p-menuitem-link').trigger('click')
    await wrapper.vm.$nextTick()

    // Should render the moon icon, as we are once again in dark mode
    const toggle2 = wrapper.find('span.pi-moon')
    expect(toggle2.exists()).toBe(true)

  })

  it('localStorage should not contain a theme initially', () => {
    const theme = global.localStorage.getItem('user-theme')
    expect(theme).toBeNull()
  })

  it('localStorage should not contain a theme after mount but before toggle has been interacted with', async () => {
    const wrapper = mount(ThemeToggle)
    await wrapper.vm.$nextTick()

    const theme = global.localStorage.getItem('user-theme')
    expect(theme).toBeNull()
  })

  it('should set user-theme in localstorage when dark theme is toggled', async () => {
    const wrapper = mount(ThemeToggle)
    await wrapper.vm.$nextTick()

    // We should start in light mode, so clicking will put us into dark mode
    wrapper.find('a.p-menuitem-link').trigger('click')
    await wrapper.vm.$nextTick()

    // localStorage should now contain 'dark' as 'user-theme'
    const theme = global.localStorage.getItem('user-theme')
    expect(theme).toBe('dark')

    // Clicking once more should put us back into light mode 
    wrapper.find('a.p-menuitem-link').trigger('click')
    await wrapper.vm.$nextTick()

    // localStorage should now contain 'light' as 'user-theme'
    const theme2 = global.localStorage.getItem('user-theme')
    expect(theme2).toBe('light')

  })

  it('should render in dark theme when media preference is for dark mode', async () => {

    // jsdom does not support the matchMedia property, so we'll mock it:
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)', // This is the one we care about!
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const wrapper = mount(ThemeToggle)
    await wrapper.vm.$nextTick()

    // Should render the sun icon, as we are in dark mode
    const toggle = wrapper.find('span.pi-sun')
    expect(toggle.exists()).toBe(true)
  })

  it('should render in light theme when media preference is for light mode', async () => {

    // jsdom does not support the matchMedia property, so we'll mock it:
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: light)', // This is the one we care about!
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const wrapper = mount(ThemeToggle)
    await wrapper.vm.$nextTick()

    // Should render the moon icon, as we are in light mode
    const toggle = wrapper.find('span.pi-moon')
    expect(toggle.exists()).toBe(true)
  })

  it('should render in light theme when local storage calls for it, even if media preference is for dark mode', async () => {

    // jsdom does not support the matchMedia property, so we'll mock it:
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)', // This is the one we care about!
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    global.localStorage.setItem('user-theme', 'light')

    const wrapper = mount(ThemeToggle)
    await wrapper.vm.$nextTick()

    // Should render the moon icon, as we are in light mode
    const toggle = wrapper.find('span.pi-moon')
    expect(toggle.exists()).toBe(true)
  })

})