import { mount } from '@vue/test-utils';
import Login from '../src/components/Login.vue';

describe('Login.vue', () => {
  it('renders login button', () => {
    const wrapper = mount(Login);
    expect(wrapper.text()).toContain('Login');
  });
});
