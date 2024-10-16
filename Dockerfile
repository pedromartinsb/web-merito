# Etapa 1: Compilar o código Angular
FROM node:18 AS build

# Definir o diretório de trabalho no contêiner
WORKDIR /app

# Copiar os arquivos package.json e package-lock.json
COPY package*.json ./

# Instalar as dependências do projeto Angular
RUN npm install -g npm@latest

# Copiar o código do projeto Angular para o contêiner
COPY . .

# Compilar o projeto Angular em modo de produção
RUN npm run build --prod

# Etapa 2: Servir o aplicativo Angular
FROM nginx:alpine

# Copiar os arquivos de build gerados pelo Angular para o servidor Nginx
COPY --from=build /app/dist/web-merito /usr/share/nginx/html

# Expor a porta 80 para acessar o aplicativo Angular
EXPOSE 80

# Comando padrão para iniciar o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
