import {test} from '../../src/fixtures/test.fixtures.js'
import {expect} from "@playwright/test";

test.describe('User garage', () => {
    test.only('page should contain add car button', async ({userGaragePage, userInfo, page}) => {
        await userGaragePage.navigate()
        await expect(userGaragePage.addCarButton, "Add car button should be visible").toBeVisible()
        await expect(userGaragePage.addCarButton, "Add car button should be enabled").toBeEnabled()
    })

})
