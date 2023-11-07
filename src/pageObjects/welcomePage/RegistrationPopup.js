import {expect} from '@playwright/test'
import BaseComponent from '../BaseComponent.js'
import GaragePage from '../panel/garagePage/GaragePage.js'

export default class RegistrationPopup extends BaseComponent {
    constructor(page) {
        super(page, page.locator('div.modal-dialog'))
    }

    _nameInputLocator = this._container.locator('input#signupName')
    _lastNameInputLocator = this._container.locator('input#signupLastName')
    _emailInputLocator = this._container.locator('input#signupEmail')
    _passwordInputLocator = this._container.locator('input#signupPassword')
    _repeatPasswordInputLocator = this._container.locator('input#signupRepeatPassword')
    _registerButtonLocator = this._container.locator('.btn-primary')
    _errorMessageLocator = this._container.locator('div.invalid-feedback')


    async fillName(name) {
        await this._nameInputLocator.fill(name)
    }

    async focusOnNameInput() {
        await this._nameInputLocator.focus()
    }

    async fillLastName(lastName) {
        await this._lastNameInputLocator.fill(lastName)
    }

    async fillEmail(email) {
        await this._emailInputLocator.fill(email)
    }

    async fillPassword(password) {
        await this._passwordInputLocator.fill(password)
    }

    async fillRepeatPassword(password) {
        await this._repeatPasswordInputLocator.fill(password)
    }

    async focusOnRepeatPasswordInput() {
        await this._repeatPasswordInputLocator.focus()
    }

    async checkRegisterButtonIsEnabled() {
        await expect(this._registerButtonLocator, 'Register button should be visible').toBeVisible()
        await expect(this._registerButtonLocator, 'Register button should be enabled').toBeEnabled()
    }

    async checkRegisterButtonIsDisabled() {
        await expect(this._registerButtonLocator, 'Register button should be visible').toBeVisible()
        await expect(this._registerButtonLocator, 'Register button should be disabled').toBeDisabled()
    }

    async clickRegisterButton() {
        await this._registerButtonLocator.click()
        return new GaragePage(this._page)
    }

    async checkErrorMessage(expectedErrorMessage) {
        await expect(this._errorMessageLocator, 'Error message should be shown when user has entered invalid value').toHaveText(expectedErrorMessage)
        await expect(this._errorMessageLocator, 'Input should have red border when user has entered invalid value').toHaveCSS('border-color', 'rgb(220, 53, 69)')
    }
}
