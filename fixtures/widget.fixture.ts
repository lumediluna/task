import { test as base } from '@playwright/test';
import { WidgetPage } from '../pages/widget.page';

type WidgetFixtures = {
  widgetPage: WidgetPage;
};
//создание фикстуры для страницы виджета, которая будет использоваться в тестах
export const test = base.extend<WidgetFixtures>({
    widgetPage: async ({ page }, use) => {
        const widgetPage = new WidgetPage(page);
        await widgetPage.goto();
        await use(widgetPage);
    },
});

export { expect } from '@playwright/test';