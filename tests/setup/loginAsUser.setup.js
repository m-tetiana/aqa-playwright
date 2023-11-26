import {test} from "@playwright/test";
import {USERS} from "../../src/data/dictionaries/users.js";
import WelcomePage from "../../src/pageObjects/welcomePage/WelcomePage.js";
import {STORAGE_STATE_USER_PATH} from "../../src/data/storageState.js";

test("Login as user and save storage state", async ({page, context}) => {
    const welcomePage = new WelcomePage(page)
    await welcomePage.navigate()
    const popup = await welcomePage.openSignInPopup()
    await popup.signIn({
        email: USERS.TEST_USER.email,
        password: USERS.TEST_USER.password
    })
    await context.storageState({
        path: STORAGE_STATE_USER_PATH
    })
})
