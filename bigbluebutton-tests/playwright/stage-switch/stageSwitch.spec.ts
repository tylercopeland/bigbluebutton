import { test } from '../core/setup/fixtures';
import { StageSwitch } from './stageSwitch';

test.describe('Presenter switch between slides and a shared screen', { tag: '@ci' }, () => {
  test('Showing the slides keeps the screen shared', async ({ browser, context, page }, testInfo) => {
    const stageSwitch = new StageSwitch(browser, context);
    await stageSwitch.initPages(page, testInfo);
    await stageSwitch.switchKeepsScreenShared();
  });
});
