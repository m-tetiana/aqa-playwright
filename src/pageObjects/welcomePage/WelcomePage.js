import BasePage from '../BasePage.js'
import HeroSection from './HeroSection.js'
import RegistrationPopup from './RegistrationPopup.js'

export default class WelcomePage extends BasePage {
    constructor(page) {
        super(page, '/', page.locator('button', {hasText: 'Guest log in'}))
        this.heroSection = new HeroSection(page)
    }

    async openRegistrationPopup() {
        await this.heroSection.clickSignUpButton()
        const popup = new RegistrationPopup(this._page)
        await popup.waitLoaded()
        return popup
    }
}
