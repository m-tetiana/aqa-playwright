import {expect} from '@playwright/test'
import BaseComponent from '../BaseComponent.js'

export default class HeroSection extends BaseComponent {
    constructor(page) {
        super(page, page.locator('.section.hero'))
    }

    async clickSignUpButton() {
        const signUpButton = this._container.locator('.hero-descriptor_btn.btn.btn-primary')
        await expect(signUpButton, 'Sign up button should be visible').toBeVisible()
        await expect(signUpButton, 'Sign up button should be enabled').toBeEnabled()

        await signUpButton.click()
    }
}
