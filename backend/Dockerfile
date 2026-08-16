FROM node:22-alpine

WORKDIR /app

# bcrypt yerel (native) derlenir; alpine'da derleme araclari gerekir, sonra silinir.
# Bagimliliklar /app/node_modules'a kurulur; kod bind-mount edilse bile gorunur kalir.
COPY backend/package.json ./package.json
RUN apk add --no-cache --virtual .derleme python3 make g++ \
 && npm install --omit=dev --build-from-source \
 && apk del .derleme

COPY backend ./backend
COPY seed ./seed

ENV PORT=3001
EXPOSE 3001
CMD ["node", "backend/src/index.js"]
