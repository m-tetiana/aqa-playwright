import {expect, test} from '@playwright/test';

test.describe('Registration', () => {

    async function openRegistrationPopup(page) {
        return await test.step('Open registration popup', async () => {
            await page.goto('/')

            const signInButton = page.locator('button.header_signin')
            await expect(signInButton, 'Sign in button should be visible').toBeVisible()
            await expect(signInButton, 'Sign in button should be enabled').toBeEnabled()

            await signInButton.click()

            const popup = page.locator('div.modal-dialog')

            const loginPopup = popup.filter({has: page.locator('h4.modal-title', {hasText: 'Log in'})})
            await expect(loginPopup, 'Sign in popup should be visible').toBeVisible()

            const registrationButton = loginPopup.locator('.modal-footer .btn-link')
            await registrationButton.click()

            const registrationPopup = popup.filter({has: page.locator('h4.modal-title', {hasText: 'Registration'})})
            await expect(registrationPopup, 'Registration popup should be visible').toBeVisible()

            return registrationPopup
        })
    }

    function randomString(length) {
        const charset = 'abcdefghijklmnopqrstuvwxyz0123456789'
        const result = []
        for(let i = 0; i < length; i++) {
            result.push(charset.charAt(Math.floor(Math.random() * charset.length)))
        }
        return result.join('')
    }

    test('Successful registration', async ({page}) => {
        const name = 'Mike'
        const lastName = 'Wazowski'
        const email = `aqa-mike.wazowski.${randomString(10)}@monster.co`
        const password = 'Password12345'

        const registrationPopup = await openRegistrationPopup(page)

        const nameInput = registrationPopup.locator('input#signupName')
        const lastNameInput = registrationPopup.locator('input#signupLastName')
        const emailInput = registrationPopup.locator('input#signupEmail')
        const passwordInput = registrationPopup.locator('input#signupPassword')
        const repeatPasswordInput = registrationPopup.locator('input#signupRepeatPassword')
        const registerButton = registrationPopup.locator('.btn-primary')

        await nameInput.fill(name)
        await lastNameInput.fill(lastName)
        await emailInput.fill(email)
        await passwordInput.fill(password)
        await repeatPasswordInput.fill(password)

        await expect(registerButton, 'Register button should be visible').toBeVisible()
        await expect(registerButton, 'Register button should be enabled').toBeEnabled()

        await registerButton.click()
        await expect(page).toHaveURL('/panel/garage')
    })

    test('Name is required for registration', async ({page}) => {
        const emptyName = ''

        const registrationPopup = await openRegistrationPopup(page)

        const nameInput = registrationPopup.locator('input#signupName')
        const lastNameInput = registrationPopup.locator('input#signupLastName')
        const registerButton = registrationPopup.locator('.btn-primary')

        await nameInput.fill(emptyName)
        await lastNameInput.focus()

        const nameErrorMessage = registrationPopup.locator('div.invalid-feedback')
        await expect(nameErrorMessage, 'Error message should be shown when user has not entered Name').toHaveText('Name required')

        await expect(nameInput, 'Name input should have red border when user has not entered Name').toHaveCSS('border-color', 'rgb(220, 53, 69)')
        await expect(registerButton, 'Register button should be visible').toBeVisible()
        await expect(registerButton, 'Register button should be disabled').toBeDisabled()
    })

    test('Last Name should be correct', async ({page}) => {
        const incorrectLastName = 'W'

        const registrationPopup = await openRegistrationPopup(page)

        const nameInput = registrationPopup.locator('input#signupName')
        const lastNameInput = registrationPopup.locator('input#signupLastName')
        const registerButton = registrationPopup.locator('.btn-primary')

        await lastNameInput.fill(incorrectLastName)
        await nameInput.focus()

        const lastNameErrorMessage = registrationPopup.locator('div.invalid-feedback')
        await expect(lastNameErrorMessage, 'Error message should be shown when user entered invalid Last Name').toHaveText('Last name has to be from 2 to 20 characters long')
        await expect(lastNameInput, 'Last Name input should have red border after the user entered invalid Last Name').toHaveCSS('border-color', 'rgb(220, 53, 69)')

        await expect(registerButton, 'Register button should be visible').toBeVisible()
        await expect(registerButton, 'Register button should be disabled').toBeDisabled()
    })

    test('Email is required for registration', async ({page}) => {
        const emptyEmail = ''

        const registrationPopup = await openRegistrationPopup(page)

        const nameInput = registrationPopup.locator('input#signupName')
        const emailInput = registrationPopup.locator('input#signupEmail')
        const registerButton = registrationPopup.locator('.btn-primary')

        await emailInput.fill(emptyEmail)
        await nameInput.focus()

        const emailErrorMessage = registrationPopup.locator('div.invalid-feedback')
        await expect(emailErrorMessage, 'Error message should be shown when user has not entered Email').toHaveText('Email required')
        await expect(emailInput, 'Email input should have red border when user has not entered Email').toHaveCSS('border-color', 'rgb(220, 53, 69)')

        await expect(registerButton, 'Register button should be visible').toBeVisible()
        await expect(registerButton, 'Register button should be disabled').toBeDisabled()
    })

    test('Password should be correct', async ({page}) => {
        const invalidPassword = 'password'

        const registrationPopup = await openRegistrationPopup(page)

        const nameInput = registrationPopup.locator('input#signupName')
        const passwordInput = registrationPopup.locator('input#signupPassword')
        const registerButton = registrationPopup.locator('.btn-primary')

        await passwordInput.fill(invalidPassword)
        await nameInput.focus()

        const passwordErrorMessage = registrationPopup.locator('div.invalid-feedback')
        await expect(passwordErrorMessage, 'Error message should be shown when user entered invalid Password').toHaveText('Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter')
        await expect(passwordInput, 'Password input should have red border when user entered invalid Password').toHaveCSS('border-color', 'rgb(220, 53, 69)')

        await expect(registerButton, 'Register button should be visible').toBeVisible()
        await expect(registerButton, 'Register button should be disabled').toBeDisabled()
    })

    test('Passwords should match', async ({page}) => {
        const password = 'Password123'
        const repeatPassword = 'Password1'

        const registrationPopup = await openRegistrationPopup(page)

        const nameInput = registrationPopup.locator('input#signupName')
        const passwordInput = registrationPopup.locator('input#signupPassword')
        const repeatPasswordInput = registrationPopup.locator('input#signupRepeatPassword')
        const registerButton = registrationPopup.locator('.btn-primary')

        await passwordInput.fill(password)
        await repeatPasswordInput.fill(repeatPassword)
        await nameInput.focus()

        const repeatPasswordErrorMessage = registrationPopup.locator('div.invalid-feedback')
        await expect(repeatPasswordErrorMessage, 'Error message should be shown when user entered wrong password in the Re-enter Password').toHaveText('Passwords do not match')
        await expect(repeatPasswordInput, 'Re-enter Password input should have red border when user entered invalid Password').toHaveCSS('border-color', 'rgb(220, 53, 69)')

        await expect(registerButton, 'Register button should be visible').toBeVisible()
        await expect(registerButton, 'Register button should be disabled').toBeDisabled()
    })

})
