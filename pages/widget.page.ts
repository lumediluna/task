import { expect, Page } from '@playwright/test';
import { WidgetConfig } from '../builders/widget.builder';
//класс для взаимодействия со страницей виджета, который инкапсулирует все действия, связанные с настройкой и генерацией виджета
export class WidgetPage {
    constructor(private readonly page: Page) {}
//локатор для контейнера виджета, который находится внутри iframe, и позволяет взаимодействовать с элементами внутри этого контейнера
    private get widgetContainer() {
        return this.page.locator('[id="3snet-frame"]').contentFrame().locator('body'); 
    }
//метод для перехода на страницу виджета
    async goto() {
        await this.page.goto('/eventswidget/');
    }
//метод для применения конфигурации виджета, который включает в себя выбор категорий, стран и размеров виджета
    async applyConfig(config: WidgetConfig) {
        await this.selectCategories();
        await this.selectAllCountries();
        await this.setSize();
    }
//методы для взаимодействия с элементами страницы, которые выполняют конкретные действия, такие как выбор категорий, стран и размеров виджета    
    private async selectCategories() {
        await this.page.locator('.checkselect-over').first().click();
        await this.page.getByText('Igaming', { exact: true }).click();
        await this.page.getByText('Affiliate').click();
    }
//метод для выбора всех стран, который открывает выпадающий список стран и выбирает опцию "Выбрать все"
    private async selectAllCountries() {
        await this.page.getByText('Выберите страны').click();
        await this.page.locator('.checkselect-over').nth(1).click();
        await this.page.getByText('Выбрать все').nth(1).click();
    }
//метод для установки размера виджета, который кликает по опциям для установки ширины и высоты виджета на всю ширину контейнера и всю высоту блока соответственно
    async setSize() {
        await this.page.getByText('на всю ширину контейнера').click();
        await this.page.getByText('на всю высоту блока').click();

    }
//метод для генерации превью виджета, который кликает по кнопке "Сгенерировать превью" для отображения виджета с примененными настройками
    async generatePreview() {
        await this.page.getByRole('button', { name: 'Сгенерировать превью' }).click();
    }
//метод для проверки видимости виджета, который использует локатор для контейнера виджета и проверяет, что он видим на странице
    async expectWidgetVisible() {
        await expect(this.widgetContainer).toBeVisible();
    }
//метод для снятия скриншота виджета, который сохраняет изображение виджета в папке "screenshots" с именем "widget-final.png"    
    async takeScreenshot() {
        await this.page.screenshot({path: 'screenshots/widget-final.png', fullPage: true});
    }
}
