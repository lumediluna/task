import { expect, Page } from '@playwright/test';
import { WidgetConfig } from '../builders/widget.builder';

export class WidgetPage {
    constructor(private readonly page: Page) {}

    private get widgetContainer() {
        return this.page.locator('[id="3snet-frame"]').contentFrame().locator('body'); 
    }

    async goto() {
        await this.page.goto('/eventswidget/');
    }

    async applyConfig(config: WidgetConfig) {
        await this.selectCategories();
        await this.selectAllCountries();
        await this.setSize();
    }
    private async selectCategories() {
        await this.page.locator('.checkselect-over').first().click();
        await this.page.getByText('Igaming', { exact: true }).click();
        await this.page.getByText('Affiliate').click();
    }

    private async selectAllCountries() {
        await this.page.getByText('Выберите страны').click();
        await this.page.locator('.checkselect-over').nth(1).click();
        await this.page.getByText('Выбрать все').nth(1).click();
    }

    async setSize() {
        await this.page.getByText('на всю ширину контейнера').click();
        await this.page.getByText('на всю высоту блока').click();

    }

    async generatePreview() {
        await this.page.getByRole('button', { name: 'Сгенерировать превью' }).click();
    }

    async expectWidgetVisible() {
        await expect(this.widgetContainer).toBeVisible();
    }
    async takeScreenshot() {
        await this.page.screenshot({path: 'screenshots/widget-final.png', fullPage: true});
    }
}
