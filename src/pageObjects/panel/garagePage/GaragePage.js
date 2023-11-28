import BasePage from '../../BasePage.js'
import ProfilePage from "../profilePage/ProfilePage.js";


export default class GaragePage extends BasePage {
    constructor(page) {
        super(page, '/panel/garage', page.locator('app-panel-layout', {has: page.locator('button', {hasText: 'Add car'})}));
        this.addCarButton = page.locator('.btn-primary', {hasText: 'Add car'})
        this.profileNavLink = page.locator('.sidebar-wrapper .sidebar_btn', {hasText: 'Profile'})
    }

    async clickProfileNavLink() {
        await this.profileNavLink.click()
        const profilePage = new ProfilePage(this._page)
        await profilePage.waitLoaded()
        return profilePage
    }
}
