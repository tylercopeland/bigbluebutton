import { expect, Locator, Page as PlaywrightPage } from '@playwright/test';

import { elements as e } from '../core/elements';
import { MultiUsers } from '../user/multiusers';

// The side panel while the navigation is docked in the actions bar (desktop and
// tablet): one or two sections, each with one tool or several as tabs.
const panel = {
  section: (index: number) => `[data-panel-section="${index}"]`,
  title: '[data-test="sectionTitle"]',
  tab: '[role="tab"][data-panel]',
  peopleTab: '[data-test="peopleTab"]',
  chatTab: '[data-test="chatTab"]',
  notesButton: 'div[data-test="sharedNotesSidebarButton"]',
  arrangeButton: '.bbb-sidebar-content [data-test="arrangeMenuButton"]',
  aside: '[data-test="asidePanel"]',
  dropArea: '[data-test^="panelDrop-"]',
  sidebar: '.bbb-sidebar-content',
  pluginsPopover: '[data-test="appsPopover"]',
  pollCard: '[data-test="pollAppsPopoverButton"]',
};

const STORAGE_KEY = 'BBBpanelSections';

export class Panels extends MultiUsers {
  private get page(): PlaywrightPage {
    return this.modPage.page;
  }

  private section(index: number): Locator {
    return this.page.locator(panel.section(index));
  }

  private async expectSections(expected: string[][], message: string) {
    await expect
      .poll(
        () =>
          this.page.evaluate(
            (key) =>
              (JSON.parse(localStorage.getItem(key) || '{}').sections || []).map((s: { tabs: string[] }) => s.tabs),
            STORAGE_KEY,
          ),
        { message },
      )
      .toEqual(expected);
  }

  private async expectAside(expected: string | null, message: string) {
    await expect
      .poll(
        () => this.page.evaluate((key) => JSON.parse(localStorage.getItem(key) || '{}').aside ?? null, STORAGE_KEY),
        { message },
      )
      .toBe(expected);
  }

  private minimizeButton(index: number): Locator {
    return this.section(index).locator('button[aria-label^="Minimize"]').first();
  }

  private async expectPressed(selector: string, pressed: boolean, message: string) {
    await expect(this.page.locator(selector), message).toHaveAttribute('aria-expanded', `${pressed}`);
  }

  // Moves past the click threshold first, so the press is a drag and not a click
  private async drag(source: Locator, to: { x: number; y: number }, expectedLabel: string) {
    const box = await source.boundingBox();
    if (!box) throw new Error('nothing to drag');
    await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await this.page.mouse.down();
    await this.page.mouse.move(box.x + box.width / 2 + 8, box.y + box.height / 2 + 8);
    await this.page.mouse.move(to.x, to.y, { steps: 10 });
    await expect(this.page.locator(panel.dropArea), 'should show where the item goes').toContainText(expectedLabel);
    await expect(this.page.locator(panel.dropArea), 'should accept the drop here').toHaveAttribute(
      'data-active',
      'true',
    );
    await this.page.mouse.up();
    await this.modPage.wasRemoved(panel.dropArea, 'should remove the drop overlay after the drop');
  }

  private async sidebarBox() {
    const box = await this.page.locator(panel.sidebar).boundingBox();
    if (!box) throw new Error('the side panel is not showing');
    return box;
  }

  async nothingOpenByDefault() {
    await this.modPage.wasRemoved(panel.sidebar, 'should start with the side panel closed');
    await this.expectPressed(e.usersListSidebarButton, false, 'should not press People');
    await this.expectPressed(e.messagesSidebarButton, false, 'should not press Chat');
  }

  async openOneTool() {
    await this.modPage.waitAndClick(e.usersListSidebarButton);
    await expect(this.section(0).locator(panel.title), 'should show a plain title').toContainText('People');
    await expect(this.section(0).locator(panel.title), 'should count the people').toContainText('1');
    await this.modPage.wasRemoved(panel.tab, 'should not show tabs for a single tool');
    await this.expectPressed(e.usersListSidebarButton, true, 'should press People');
    await this.expectSections([['userlist']], 'should store People alone');
  }

  async openSecondTool() {
    await this.openOneTool();
    await this.modPage.waitAndClick(e.messagesSidebarButton);
    await expect(this.page.locator(panel.chatTab), 'should select the new tool').toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(this.page.locator(panel.peopleTab), 'should keep People as a tab').toHaveAttribute(
      'aria-selected',
      'false',
    );
    await this.expectPressed(e.usersListSidebarButton, true, 'should keep People pressed while it is a tab');
    await this.expectSections([['userlist', 'chat']], 'should store People and Chat as tabs');

    // the button of an open tab selects it; the button of the showing tool closes it
    await this.modPage.waitAndClick(e.usersListSidebarButton);
    await expect(this.page.locator(panel.peopleTab), 'should switch to People').toHaveAttribute(
      'aria-selected',
      'true',
    );
    await this.modPage.waitAndClick(e.usersListSidebarButton);
    await this.expectSections([['chat']], 'should close People');
    await this.expectPressed(e.usersListSidebarButton, false, 'should unpress People');
  }

  async openThirdTool() {
    await this.modPage.waitAndClick(e.usersListSidebarButton);
    await this.modPage.waitAndClick(e.messagesSidebarButton);
    await this.modPage.waitAndClick(panel.notesButton);
    await this.expectSections([['userlist', 'chat'], ['shared-notes']], 'should stack Notes below');
    await expect(this.section(1).locator(panel.title), 'should title the new section').toContainText('Notes');
    await expect(this.section(0).locator(panel.chatTab), 'should leave the tabs above as they were').toHaveAttribute(
      'aria-selected',
      'true',
    );
  }

  async fourthToolTakesLowerSection() {
    await this.openThirdTool();
    await this.modPage.waitAndClick(e.appsGallerySidebarButton);
    await this.modPage.waitAndClick(panel.pollCard);
    await this.expectSections([['userlist', 'chat'], ['poll']], 'should keep two tabs on top and one tool below');
    await this.expectPressed(panel.notesButton, false, 'should close Notes, which Poll replaced');
  }

  async minimizeClosesSection() {
    await this.openThirdTool();
    await this.minimizeButton(1).click();
    await this.expectSections([['userlist', 'chat']], 'should close the lower section');
    await this.expectPressed(panel.notesButton, false, 'should unpress Notes');
    await this.minimizeButton(0).click();
    await this.expectSections([], 'should close both tabs of the top section');
    await this.modPage.wasRemoved(panel.sidebar, 'should close the side panel');
    await this.expectPressed(e.usersListSidebarButton, false, 'should unpress People');
  }

  async dragTabToRightPanel() {
    await this.modPage.waitAndClick(e.usersListSidebarButton);
    await this.modPage.waitAndClick(e.messagesSidebarButton);
    const viewport = this.page.viewportSize()!;
    await this.drag(
      this.page.locator(panel.chatTab),
      { x: viewport.width - 60, y: viewport.height / 2 },
      'Drop to open Chat in a panel on the right',
    );
    await this.expectAside('chat', 'should dock Chat on the right');
    await this.expectSections([['userlist']], 'should leave People in the side panel');
    const aside = await this.page.locator(panel.aside).boundingBox();
    expect(aside && aside.x, 'should put the panel at the right edge').toBeGreaterThan(viewport.width / 2);
    await this.expectPressed(e.messagesSidebarButton, true, 'should keep Chat pressed');

    await this.page.reload();
    await this.modPage.closeAudioModal();
    await expect(this.page.locator(panel.aside), 'should keep the right panel after a reload').toBeVisible({
      timeout: 20000,
    });

    // its title goes back onto the side panel as a tab
    const sidebar = await this.sidebarBox();
    await this.drag(
      this.page.locator(`${panel.aside} ${panel.title}`),
      { x: sidebar.x + sidebar.width / 2, y: sidebar.y + 120 },
      'Drop to add Chat as a tab next to People',
    );
    await this.expectAside(null, 'should close the right panel');
    await this.expectSections([['userlist', 'chat']], 'should add Chat back as a tab');
  }

  async dragTabDownToStack() {
    await this.modPage.waitAndClick(e.usersListSidebarButton);
    await this.modPage.waitAndClick(e.messagesSidebarButton);
    const box = await this.sidebarBox();
    await this.drag(
      this.page.locator(panel.peopleTab),
      { x: box.x + box.width / 2, y: box.y + box.height * 0.75 },
      'Drop to stack People below',
    );
    await this.expectSections([['chat'], ['userlist']], 'should stack People below Chat');
    await expect(this.section(0).locator(panel.title), 'should leave Chat as a plain title').toContainText('Chat');
  }

  async dragBackUpToRejoin() {
    await this.dragTabDownToStack();
    const top = await this.section(0).boundingBox();
    if (!top) throw new Error('no top section');
    await this.drag(
      this.section(1).locator(panel.title),
      { x: top.x + top.width / 2, y: top.y + top.height / 2 },
      'Drop to add People as a tab next to Chat',
    );
    await this.expectSections([['chat', 'userlist']], 'should add People to the tabs');
    await this.modPage.wasRemoved(panel.section(1), 'should leave one section');
  }

  async movePanelToOtherSide() {
    await this.modPage.waitAndClick(e.usersListSidebarButton);
    const viewport = this.page.viewportSize()!;
    expect((await this.sidebarBox()).x, 'should start on the left').toBeLessThan(viewport.width / 2);
    await this.drag(
      this.page.locator(panel.arrangeButton),
      { x: viewport.width - 100, y: viewport.height / 2 },
      'Drop to move the panel to the right',
    );
    await expect
      .poll(async () => (await this.sidebarBox()).x, { message: 'should move to the right' })
      .toBeGreaterThan(viewport.width / 2);
  }

  async arrangeWithKeyboard() {
    await this.modPage.waitAndClick(e.usersListSidebarButton);
    await this.modPage.waitAndClick(e.messagesSidebarButton);
    await this.page.locator(panel.chatTab).focus();
    await this.page.keyboard.press('Shift+F10');
    await this.page.getByRole('menuitem', { name: 'Move Chat below' }).click();
    await this.expectSections([['userlist'], ['chat']], 'should stack Chat below from the menu');
    await this.modPage.hasText('#aria-polite-alert', 'Chat moved below People', 'should announce it');
  }

  async layoutSurvivesReload() {
    await this.openThirdTool();
    await this.page.reload();
    await this.modPage.closeAudioModal();
    await expect(this.section(1).locator(panel.title), 'should restore the stacked section').toContainText('Notes', {
      timeout: 20000,
    });
    await this.expectSections([['userlist', 'chat'], ['shared-notes']], 'should keep the stored sections');
    await expect(this.page.locator(panel.chatTab), 'should keep the selected tab').toHaveAttribute(
      'aria-selected',
      'true',
    );
  }

  async pluginsPopover() {
    await this.modPage.waitAndClick(e.appsGallerySidebarButton);
    const popover = this.page.locator(panel.pluginsPopover);
    await expect(popover, 'should open the popover').toBeVisible();
    await expect(popover, 'should title it Plugins').toContainText('Plugins');
    await expect(popover, 'should list more plugins').toContainText('More plugins');
    await this.modPage.wasRemoved(panel.sidebar, 'should not open a panel');

    // opening People closes it
    await this.modPage.waitAndClick(e.usersListSidebarButton);
    await this.modPage.wasRemoved(panel.pluginsPopover, 'should close when People opens');

    // picking a plugin closes it and starts the plugin
    await this.modPage.waitAndClick(e.appsGallerySidebarButton);
    await this.modPage.waitAndClick(panel.pollCard);
    await this.modPage.wasRemoved(panel.pluginsPopover, 'should close when a plugin is picked');
    await this.expectSections([['userlist', 'poll']], 'should open Poll next to People');

    // Escape closes it
    await this.modPage.waitAndClick(e.appsGallerySidebarButton);
    await this.page.keyboard.press('Escape');
    await this.modPage.wasRemoved(panel.pluginsPopover, 'should close on Escape');
  }

  async presenterLeavesWithPollOpen() {
    await this.modPage.waitAndClick(e.usersListSidebarButton);
    await this.modPage.waitAndClick(e.messagesSidebarButton);
    await this.modPage.waitAndClick(e.appsGallerySidebarButton);
    await this.modPage.waitAndClick(panel.pollCard);
    await this.expectSections([['userlist', 'chat'], ['poll']], 'should stack Poll below');

    await this.page.locator(panel.peopleTab).click();
    const attendee = this.page.locator(e.userListItem).filter({ hasText: 'Attendee' }).first();
    await attendee.hover();
    await attendee.locator('[data-test="moreOptionsUserItemButton"]').click();
    await this.page.locator('[data-test="makePresenter"]').first().click();
    await this.expectSections([['userlist', 'chat']], 'should close only Poll, keeping People and Chat');
  }
}
