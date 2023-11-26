import BasePage from '../BasePage.js'
import HeroSection from './HeroSection.js'
import RegistrationPopup from './RegistrationPopup.js'
import SignInPopup from "./SignInPopup.js";

export default class WelcomePage extends BasePage {
    constructor(page) {
        super(page, '/', page.locator('button', {hasText: 'Guest log in'}))
        this.heroSection = new HeroSection(page)
        this.signInButton = page.locator('.header_signin')
    }

    async openRegistrationPopup() {
        await this.heroSection.clickSignUpButton()
        const popup = new RegistrationPopup(this._page)
        await popup.waitLoaded()
        return popup
    }

    async openSignInPopup() {
        await this.signInButton.click()
        return new SignInPopup(this._page)
    }
}
