import { test } from '../fixtures/widget.fixture';
import { WidgetBuilder } from '../builders/widget.builder';

test('Генерация виджета', async ({ widgetPage }) => {
    const config = await test.step('Готовим конфигурацию виджета', async () => {
        return new WidgetBuilder().build();
    });

    await test.step('Применяем конфигурацию', async () => {
        await widgetPage.applyConfig(config);
    });

    await test.step('Генерируем превью и ждём готовность', async () => {
        await widgetPage.generatePreview();
    });

    await test.step('Проверяем отображение виджета', async () => {
        await widgetPage.expectWidgetVisible();
        await widgetPage.takeScreenshot();
    });
});