import { test } from '../core/setup/fixtures';
import { Panels } from './panels';

test.describe.parallel('Side panel sections', { tag: '@ci' }, () => {
  test('Nothing is open when joining', async ({ browser, context, page }, testInfo) => {
    const panels = new Panels(browser, context);
    await panels.initModPage(page, { testInfo });
    await panels.nothingOpenByDefault();
  });

  test('One tool opens with a plain title and no tabs', async ({ browser, context, page }, testInfo) => {
    const panels = new Panels(browser, context);
    await panels.initModPage(page, { testInfo });
    await panels.openOneTool();
  });

  test('A second tool turns the header into tabs', async ({ browser, context, page }, testInfo) => {
    const panels = new Panels(browser, context);
    await panels.initModPage(page, { testInfo });
    await panels.openSecondTool();
  });

  test('A third tool stacks below', async ({ browser, context, page }, testInfo) => {
    const panels = new Panels(browser, context);
    await panels.initModPage(page, { testInfo });
    await panels.openThirdTool();
  });

  test('A fourth tool takes the place of the lower one', async ({ browser, context, page }, testInfo) => {
    const panels = new Panels(browser, context);
    await panels.initModPage(page, { testInfo });
    await panels.fourthToolTakesLowerSection();
  });

  test('Closing a section closes every tool in it', async ({ browser, context, page }, testInfo) => {
    const panels = new Panels(browser, context);
    await panels.initModPage(page, { testInfo });
    await panels.closeButtonClosesSection();
  });

  test('Dragging a tab to the right edge docks it in a right panel', async ({ browser, context, page }, testInfo) => {
    const panels = new Panels(browser, context);
    await panels.initModPage(page, { testInfo });
    await panels.dragTabToRightPanel();
  });

  test('Dragging a tab down stacks it', async ({ browser, context, page }, testInfo) => {
    const panels = new Panels(browser, context);
    await panels.initModPage(page, { testInfo });
    await panels.dragTabDownToStack();
  });

  test('Dragging a section title up rejoins the tabs', async ({ browser, context, page }, testInfo) => {
    const panels = new Panels(browser, context);
    await panels.initModPage(page, { testInfo });
    await panels.dragBackUpToRejoin();
  });

  test('Dragging the header moves the panel to the other side', async ({ browser, context, page }, testInfo) => {
    const panels = new Panels(browser, context);
    await panels.initModPage(page, { testInfo });
    await panels.movePanelToOtherSide();
  });

  test('The arrange menu does the same from the keyboard', async ({ browser, context, page }, testInfo) => {
    const panels = new Panels(browser, context);
    await panels.initModPage(page, { testInfo });
    await panels.arrangeWithKeyboard();
  });

  test('The arrangement survives a reload', async ({ browser, context, page }, testInfo) => {
    const panels = new Panels(browser, context);
    await panels.initModPage(page, { testInfo });
    await panels.layoutSurvivesReload();
  });

  test('Plugins open in a popover, never a panel', async ({ browser, context, page }, testInfo) => {
    const panels = new Panels(browser, context);
    await panels.initModPage(page, { testInfo });
    await panels.pluginsPopover();
  });

  test('Losing the presenter role closes only Polling', async ({ browser, context, page }, testInfo) => {
    const panels = new Panels(browser, context);
    await panels.initModPage(page, { testInfo });
    await panels.initUserPage(context);
    await panels.presenterLeavesWithPollOpen();
  });
});
