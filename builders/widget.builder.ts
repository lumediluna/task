export type WidgetConfig = {
  width: string;
  height: string;
};

export class WidgetBuilder {
    private config: WidgetConfig = {
        width: '300',
        height: '240',
    };

    withWidth(width: string) {
        this.config.width = width;
        return this;
    }

    withHeight(height: string) {
        this.config.height = height;
        return this;
    }

    build(): WidgetConfig {
        return { ...this.config };
    }
}