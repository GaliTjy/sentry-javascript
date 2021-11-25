import { expect } from '@playwright/test';

import test from '../../../utils/fixtures';
import { getSentryRequest } from '../../../utils/helpers';

test('should record an XMLHttpRequest with a handler attached after send was called', async ({
  page,
  getLocalTestPath,
}) => {
  const url = await getLocalTestPath({ testDir: __dirname });

  const eventData = await getSentryRequest(page, url);

  const handlerCalled = await (await page.evaluateHandle(() => Promise.resolve(window.handlerCalled))).jsonValue();

  expect(handlerCalled).toBe(true);
  expect(eventData.message).toBe('test');
  expect(eventData.breadcrumbs?.length).toBe(1);
  expect(eventData.breadcrumbs?.[0].category).toBe('xhr');
  expect(eventData.breadcrumbs?.[0].type).toBe('http');
  expect(eventData.breadcrumbs?.[0].data?.method).toBe('GET');
  expect(eventData.breadcrumbs?.[0].data?.url).toBe('/base/subjects/example.json');
});
