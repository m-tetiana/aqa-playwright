import {test} from '../../src/fixtures/test.fixtures.js'
import {expect} from "@playwright/test";
import {MOCKED_USER_PROFILE_RESPONSE} from '../fixtures/users.js';

test.describe('User profile', () => {
    test('page should contain correct user name', async ({userGaragePage}) => {
        const {page} = userGaragePage
        await page.route(`/api/users/profile`, route => {
            route.fulfill({body: JSON.stringify(MOCKED_USER_PROFILE_RESPONSE)})
        })

        const expectedUser = `${MOCKED_USER_PROFILE_RESPONSE.data.name} ${MOCKED_USER_PROFILE_RESPONSE.data.lastName}`

        const profilePage = await userGaragePage.clickProfileNavLink()
        await expect(profilePage.userName, "User name should be correct").toHaveText(expectedUser)
    })

})
