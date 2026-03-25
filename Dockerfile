FROM mcr.microsoft.com/playwright:v1.42.1-jammy

WORKDIR /app

# Копируем только зависимости — для кэширования
COPY package.json package-lock.json ./

# Устанавливаем зависимости без лишнего
RUN npm ci && npm cache clean --force

# Копируем остальной код
COPY . .

CMD ["npm", "test"]
