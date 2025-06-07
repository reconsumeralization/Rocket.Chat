import { mockAppRoot } from '@rocket.chat/mock-providers';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { SubscriptionCalloutLimits } from './SubscriptionCalloutLimits';
import { useLicenseLimitsByBehavior } from '../../../hooks/useLicenseLimitsByBehavior';

jest.mock('../../../hooks/useLicenseLimitsByBehavior');

const appRoot = mockAppRoot().withTranslations('en', 'core', {
  'subscription.callout.servicesDisruptionsMayOccur': 'Services disruptions may occur',
  'subscription.callout.description.limitsReached_one': 'Your workspace reached the <1>{{val}}</1> license limit. <3>Manage your subscription</3> to increase limits.',
  'subscription.callout.activeUsers': 'seats',
});

const mockUseLicenseLimitsByBehavior = useLicenseLimitsByBehavior as jest.Mock;

describe('SubscriptionCalloutLimits', () => {
  it('renders callout when upgrade is eligible', () => {
    mockUseLicenseLimitsByBehavior.mockReturnValue({ start_fair_policy: ['activeUsers'] });
    render(<SubscriptionCalloutLimits />, { wrapper: appRoot.build(), legacyRoot: true });
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('hides callout when no limits are returned', () => {
    mockUseLicenseLimitsByBehavior.mockReturnValue(null);
    render(<SubscriptionCalloutLimits />, { wrapper: appRoot.build(), legacyRoot: true });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
