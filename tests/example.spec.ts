import { test } from '../fixtures/widget.fixture';
import { WidgetBuilder } from '../builders/widget.builder';
//тест для проверки генерации виджета с определенной конфигурацией, который использует фикстуру для страницы виджета и билдера для создания конфигурации виджета
test('Генерация виджета', async ({ widgetPage }) => {
    const config = await test.step('Готовим конфигурацию виджета', async () => {
        return new WidgetBuilder().build();
        }
    );
//шаги теста, которые выполняют конкретные действия и проверки, такие как применение конфигурации, генерация превью и проверка отображения виджета
    await test.step('Применяем конфигурацию', async () => {
        await widgetPage.applyConfig(config);
    });
//шаг для генерации превью виджета, который кликает по кнопке "Сгенерировать превью" для отображения виджета с примененными настройками
    await test.step('Генерируем превью', async () => {
        await widgetPage.generatePreview();
    });
//шаг для проверки отображения виджета, который использует метод expectWidgetVisible для проверки видимости виджета на странице и метод takeScreenshot для сохранения скриншота виджета
    await test.step('Проверяем отображение виджета', async () => {
        await widgetPage.expectWidgetVisible();
       await widgetPage.takeScreenshot();
    });
});