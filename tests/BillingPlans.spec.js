import { mount } from '@vue/test-utils';
import BillingPlans from '../src/components/BillingPlans.vue';

describe('BillingPlans.vue', () => {
  it('renders the billing header', () => {
    const wrapper = mount(BillingPlans);
    expect(wrapper.text()).toContain('Billing');
  });
});
