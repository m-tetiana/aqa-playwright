import {test as base, request} from "@playwright/test"
import {USERS} from "../data/dictionaries/users.js";
import {STORAGE_STATE_USER_PATH} from "../data/storageState.js";
import GaragePage from "../pageObjects/panel/garagePage/GaragePage.js";
import APIClient from "../client/APIClient.js";
import {config} from "../../config/config.js";
import {CookieJar} from "tough-cookie";
import UserController from "../controllers/UserController.js";
import AuthController from "../controllers/AuthController.js";

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

            await ctx.close()
        },

        userAPIClient: async ({}, use) => {
            const ctx = await request.newContext({
                storageState: STORAGE_STATE_USER_PATH
            })
            await use(ctx)

            await ctx.dispose()
        },

        testUserAPIClient: async ({}, use) => {
            const testUserClient = await APIClient.authenticate({
                email: USERS.TEST_USER.email,
                password: USERS.TEST_USER.password,
            })

            await use(testUserClient)
        },

        newUserAPIClient: async ({}, use) => {
            const userData = {
                "name": "New",
                "lastName": "User",
                "email": `aqa.new.test.user.${Date.now()}@test.com`,
                "password": "Qwerty12345",
                "repeatPassword": "Qwerty12345"
            }

            await new AuthController().signUp(userData)
            const newUserClient = await APIClient.authenticate({
                email: userData.email,
                password: userData.password,
            })

            await use(newUserClient)

            await newUserClient.users.deleteCurrentUser()
        }
    }
)
