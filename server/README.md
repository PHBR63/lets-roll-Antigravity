# Let's Roll - Server

Backend da plataforma Let's Roll, desenvolvido com Node.js, Express, TypeScript e Prisma.

## 🚀 Tecnologias

- **Node.js** + **Express**: Framework web
- **TypeScript**: Type-safety
- **Prisma**: ORM para banco de dados
- **SQLite**: Banco de dados (desenvolvimento)
- **JWT**: Autenticação
- **Socket.io**: Comunicação em tempo real
- **bcryptjs**: Hash de senhas

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Gerar Prisma Client
npm run prisma:generate

# Rodar migrations
npm run prisma:migrate
```

## 🏃 Desenvolvimento

```bash
# Modo desenvolvimento (hot-reload)
npm run dev

# Build para produção
npm run build

# Rodar produção
npm start

# Prisma Studio (visualizar banco)
npm run prisma:studio
```

## 📁 Estrutura de Pastas

```
server/
├── prisma/
│   └── schema.prisma    # Schema do banco de dados
├── src/
│   ├── controllers/     # Lógica de negócio
│   ├── middleware/      # Middlewares (auth, error handling)
│   ├── routes/          # Definição de rotas
│   ├── types/           # Interfaces TypeScript
│   └── index.ts         # Entry point
├── .env.example         # Template de variáveis de ambiente
├── package.json
├── tsconfig.json
└── nodemon.json
```

## 🔒 Variáveis de Ambiente

Veja `.env.example` para as variáveis necessárias.

## 📝 Comandos Úteis

- `npm run dev` - Inicia servidor em modo desenvolvimento
- `npm run build` - Compila TypeScript
- `npm run prisma:migrate` - Cria/aplica migrations
- `npm run prisma:studio` - Abre interface visual do banco
