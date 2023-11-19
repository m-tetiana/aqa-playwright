import {test as base} from "@playwright/test"
import {USERS} from "../data/dictionaries/users.js";
import {STORAGE_STATE_USER_PATH} from "../data/storageState.js";
import GaragePage from "../pageObjects/panel/garagePage/GaragePage.js";

export const test = base.extend({
        userInfo: USERS.TEST_USER,
        userGaragePage: async ({browser}, use) => {
            const ctx = await browser.newContext({
                storageState: STORAGE_STATE_USER_PATH
            })
            const page = await ctx.newPage()
            const garagePage = new GaragePage(page)
            await garagePage.navigate()

            await use(garagePage)
        }
    }
)
