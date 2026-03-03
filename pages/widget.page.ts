import { expect, Page } from '@playwright/test';
import { WidgetConfig } from '../builders/widget.builder';

export class WidgetPage {
    constructor(private readonly page: Page) {}

    // iframe с превью в полном размере
    private get fullSizeIframe() {
        return this.page.locator('iframe[id="3snet-frame"][width="100%"][height="100%"]');
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

    // генерируем превью и ждём, пока кнопка перестанет быть "Загрузка..."
    async generatePreview() {
        const button = this.page.getByRole('button', { name: 'Сгенерировать превью' });
        await button.click();
        await expect(button).toBeEnabled(); // страница сама включает её после load iframe
    }

    // ждём, пока в #preview появится iframe с width/height = 100%
    async waitForPreviewLoaded() {
        await this.fullSizeIframe.waitFor({ timeout: 15000 });
    }

    async expectWidgetVisible() {
        await this.waitForPreviewLoaded();
        await expect(this.fullSizeIframe).toBeVisible();
    }

    async takeScreenshot() {
        await this.page.screenshot({ path: 'screenshots/widget-final.png', fullPage: true });
    }
}