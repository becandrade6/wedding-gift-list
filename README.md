# Aplicação de Lista de Presentes de Casamento

Uma aplicação web moderna projetada para ajudar na gestão de listas de presentes de casamento, facilitando a coordenação entre os noivos e seus convidados. Este projeto foi criado para ajudar meus amigos que estão se casando a gerenciar seus presentes de casamento de forma mais eficiente.

## 🎯 Objetivo

O principal objetivo deste projeto é fornecer uma plataforma amigável onde:
- Os convidados podem facilmente navegar e selecionar presentes de casamento
- Os noivos podem gerenciar sua lista de presentes de forma efetiva
- A comunicação entre convidados e o casal sobre os presentes é simplificada
- O processo de entrega de presentes é organizado e transparente

## ✨ Principais Funcionalidades

### Para Convidados
- Navegar pelos presentes disponíveis sem necessidade de login
- Filtrar presentes por nome, loja ou valor
- Marcar presentes como comprados
- Fornecer informações de entrega
- Links diretos para comprar presentes nas lojas

### Para os Noivos (Admin)
- Login seguro de administrador
- Adicionar, editar e remover presentes
- Acompanhar status dos presentes
- Receber notificações por email quando presentes são comprados
- Gerenciar lista de presentes de forma eficiente

## 🛠 Tecnologias Utilizadas

- **Next.js**: Framework React para aplicações em produção
- **Supabase**: Backend as a Service (BaaS) para:
  - Autenticação
  - Banco de dados
  - Atualizações em tempo real
- **Shadcn/ui**: Componentes UI de alta qualidade
- **Tailwind CSS**: Framework CSS baseado em utilitários
- **TypeScript**: Tipagem estática para melhor experiência de desenvolvimento
- **Serviço de Email - [Resend](https://resend.com/)**: Facil integração em minutos e serviço ótimo

## 🚀 Como Começar

### Pré-requisitos
- Node.js (v18 ou superior)
- npm ou yarn
- Git

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seunome/lista-presentes-casamento.git
cd lista-presentes-casamento
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# Configuração do Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_supabase

# Configuração de Email (usando Resend)
RESEND_API_KEY=sua_chave_do_resend

```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

5. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📦 Esquema do Banco de Dados

A aplicação utiliza as seguintes tabelas principais no Supabase:

```sql
-- Tabela de presentes
create table presentes (
  id uuid default uuid_generate_v4() primary key,
  nome text not null,
  descricao text,
  preco decimal(10,2),
  nome_loja text,
  url_loja text,
  url_imagem text,
  comprado boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Tabela de compras
create table compras (
  id uuid default uuid_generate_v4() primary key,
  presente_id uuid references presentes(id),
  nome_comprador text not null,
  sobrenome_comprador text not null,
  entrega_para_casal boolean default false,
  data_estimada_entrega date,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

## 🔒 Considerações de Segurança

- Acesso administrativo é restrito a emails específicos
- Interações dos convidados são monitoradas para prevenir abusos
- Limitação de taxa implementada nas rotas da API
- Validação de formulários implementada tanto no cliente quanto no servidor

## 🤝 Contribuindo

Sinta-se à vontade para contribuir com este projeto. Você pode:
1. Fazer um fork do repositório
2. Criar uma nova branch
3. Fazer suas alterações
4. Enviar um pull request

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.