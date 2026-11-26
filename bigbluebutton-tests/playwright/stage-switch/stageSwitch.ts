import { expect } from '@playwright/test';

import { ELEMENT_WAIT_EXTRA_LONG_TIME } from '../core/constants';
import { elements as e } from '../core/elements';
import { MultiUsers } from '../user/multiusers';

// The presenter's switch between their shared screen and their slides, above
// the stage while the navigation is docked in the actions bar.
const stage = {
  switch: '[data-test="stageSwitch"]',
  presentationTab: '[data-test="stageSwitchPresentation"]',
  screenTab: '[data-test="stageSwitchScreen"]',
  live: '[data-test="stageSwitchLive"]',
  stop: '[data-test="stageSwitchStop"]',
  shareMenu: '#mediaAreaDropUp',
  screenShareTab: '[data-test="screenShareTab"]',
  slides: '#presentationInnerWrapper',
};

export class StageSwitch extends MultiUsers {
  private async startScreenShare() {
    await this.modPage.waitAndClick(e.mediaAreaButton);
    await this.modPage.waitAndClick(stage.screenShareTab);
    await this.modPage.waitAndClick(`${stage.shareMenu} ${e.startScreenSharing}`);
    await this.modPage.hasElement(
      e.screenShareVideo,
      'should show the screen share preview',
      ELEMENT_WAIT_EXTRA_LONG_TIME,
    );
    await this.modPage.page.keyboard.press('Escape');
  }

  async switchKeepsScreenShared() {
    await this.userPage.wasRemoved(stage.switch, 'viewers should never see the switch');
    await this.startScreenShare();

    const modPage = this.modPage.page;
    await expect(modPage.locator(stage.switch), 'should show the switch while sharing').toBeVisible();
    await expect(modPage.locator(stage.screenTab), 'should start on the shared screen').toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(modPage.locator(stage.live), 'should say everyone sees the screen').toContainText('Everyone sees');
    await this.userPage.hasElement(e.screenShareVideo, 'the viewer should see the screen');
    await this.userPage.wasRemoved(stage.switch, 'viewers should not get the switch');

    await this.modPage.waitAndClick(stage.presentationTab);
    await expect(modPage.locator(stage.presentationTab), 'should select Presentation').toHaveAttribute(
      'aria-selected',
      'true',
    );
    await this.modPage.wasRemoved(stage.live, 'should hide the live pill on the slides');
    await this.userPage.hasElement(stage.slides, 'the viewer should see the slides');
    await this.userPage.wasRemoved(e.screenShareVideo, 'the viewer should no longer see the screen');
    await expect(modPage.locator(stage.switch), 'should keep the switch, as the screen is still shared').toBeVisible();

    await this.modPage.waitAndClick(stage.screenTab);
    await this.userPage.hasElement(e.screenShareVideo, 'the viewer should see the screen again');

    await this.modPage.waitAndClick(stage.stop);
    await this.modPage.wasRemoved(stage.switch, 'should remove the switch once sharing stops');
    await this.userPage.wasRemoved(e.screenShareVideo, 'the viewer should no longer see the screen');
    await this.userPage.hasElement(stage.slides, 'the viewer should see the slides after sharing stops');
  }
}
