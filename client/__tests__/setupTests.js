// setupTests.js
import { config } from '@vue/test-utils';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';
import FocusTrap from 'primevue/focustrap';
import { vi } from 'vitest';
import 'vitest-localstorage-mock';

// Install PrimeVue globally in tests
config.global.plugins = [PrimeVue, ConfirmationService, ToastService];

config.global.directives = {
  tooltip: Tooltip,
  focustrap: FocusTrap,
};

// Mock matchMedia for tests
window.matchMedia = vi.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(), // Deprecated
  removeListener: vi.fn(), // Deprecated
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}))
