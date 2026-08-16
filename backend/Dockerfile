FROM node:22-alpine

WORKDIR /app

# Bagimliliklar /app/node_modules'a kurulur; kod bind-mount edilse bile gorunur kalir.
COPY backend/package.json ./package.json
RUN npm install --omit=dev

COPY backend ./backend
COPY seed ./seed

ENV PORT=3001
EXPOSE 3001
CMD ["node", "backend/src/index.js"]
