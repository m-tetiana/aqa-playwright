import {test} from '@playwright/test'
import WelcomePage from '../../../src/pageObjects/welcomePage/WelcomePage.js'

test.describe.only('Registration @smoke', () => {
    let welcomePage
    let registrationPopup

    test.beforeEach(async ({page}) => {
        welcomePage = new WelcomePage(page)
        await welcomePage.navigate()

        registrationPopup = await welcomePage.openRegistrationPopup()
    })

    function randomString(length) {
        const charset = 'abcdefghijklmnopqrstuvwxyz0123456789'
        const result = []
        for (let i = 0; i < length; i++) {
            result.push(charset.charAt(Math.floor(Math.random() * charset.length)))
        }
        return result.join('')
    }

    test('Successful registration', async ({page}) => {
        const name = 'Mike'
        const lastName = 'Wazowski'
        const email = `aqa-mike.wazowski.${randomString(10)}@monster.co`
        const password = 'Password12345'

        await registrationPopup.fillName(name)
        await registrationPopup.fillLastName(lastName)
        await registrationPopup.fillEmail(email)
        await registrationPopup.fillPassword(password)
        await registrationPopup.fillRepeatPassword(password)

        await registrationPopup.checkRegisterButtonIsEnabled()

        const garagePage = await registrationPopup.clickRegisterButton()
        await garagePage.waitLoaded()
    })

    test('Name is required for registration', async ({page}) => {
        const emptyName = ''

        await registrationPopup.fillName(emptyName)
        await registrationPopup.focusOnRepeatPasswordInput()

        await registrationPopup.checkErrorMessage('Name required')
        await registrationPopup.checkRegisterButtonIsDisabled()
    })

    test('Last Name should be correct', async ({page}) => {
        const incorrectLastName = 'W'

        await registrationPopup.fillLastName(incorrectLastName)
        await registrationPopup.focusOnRepeatPasswordInput()

        await registrationPopup.checkErrorMessage('Last name has to be from 2 to 20 characters long')
        await registrationPopup.checkRegisterButtonIsDisabled()
    })

    test('Email is required for registration', async ({page}) => {
        const emptyEmail = ''

        await registrationPopup.fillEmail(emptyEmail)
        await registrationPopup.focusOnRepeatPasswordInput()

        await registrationPopup.checkErrorMessage('Email required')
        await registrationPopup.checkRegisterButtonIsDisabled()
    })

    test('Password should be correct', async ({page}) => {
        const invalidPassword = 'password'

        await registrationPopup.fillPassword(invalidPassword)
        await registrationPopup.focusOnRepeatPasswordInput()

        await registrationPopup.checkErrorMessage('Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter')
        await registrationPopup.checkRegisterButtonIsDisabled()
    })

    test('Passwords should match', async ({page}) => {
        const password = 'Password123'
        const repeatPassword = 'Password1'

        await registrationPopup.fillPassword(password)
        await registrationPopup.fillRepeatPassword(repeatPassword)
        await registrationPopup.focusOnNameInput()

        await registrationPopup.checkErrorMessage('Passwords do not match')
        await registrationPopup.checkRegisterButtonIsDisabled()
    })

})
