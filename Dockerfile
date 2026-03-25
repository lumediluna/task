FROM node:lts

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Устанавливаем браузеры Playwright + зависимости
RUN npx playwright install --with-deps

COPY . .

CMD ["npm", "start"]
