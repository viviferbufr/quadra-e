# Quadraê

O **Quadraê** é uma plataforma desenvolvida com o objetivo de facilitar a busca e a reserva de quadras esportivas. O sistema permite que os usuários encontrem espaços para praticar diferentes modalidades, consultem preços e horários disponíveis e realizem suas reservas de maneira simples e prática.

## Funcionalidades

- **Busca de quadras:** filtros por modalidade esportiva, data, horário e bairro.
- **Detalhes das quadras:** visualização de fotos, endereço, preços, características e comodidades.
- **Disponibilidade:** consulta de horários livres e ocupados.
- **Cadastro e login:** criação de conta e autenticação de usuários.
- **Reservas online:** seleção de data e horário e confirmação de reservas.
- **Minhas reservas:** consulta e gerenciamento das reservas realizadas.
- **Cancelamento:** possibilidade de cancelar reservas confirmadas.
- **Pagamento demonstrativo:** simulação de confirmação de pagamento via Pix.

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- LocalStorage
- Google Fonts (Inter)

## Estrutura do projeto

```text
quadra-e/
│
├── css/
│   └── style.css
│
├── img/
│   ├── fut/
│   ├── tenis/
│   ├── baska/
│   └── volei/
│
├── jss/
│   └── script.js
│
├── index.html
├── index1.html
├── index2.html
├── index3.html
├── reservas.html
└── README.md
```

## Como executar o projeto

1. Clone este repositório:

   ```bash
   git clone https://github.com/viviferbufr/quadra-e.git
   ```

2. Abra a pasta do projeto no Visual Studio Code.
3. Execute o arquivo `index.html` utilizando um navegador ou a extensão Live Server.

## Armazenamento de dados

O projeto utiliza o **LocalStorage** do navegador para armazenar informações de usuários, sessões e reservas. Dessa forma, os dados permanecem disponíveis no mesmo navegador e dispositivo.

**Importante:** o pagamento via Pix é apenas demonstrativo, não existindo integração com sistemas bancários ou processamento de pagamentos reais.

## Objetivo do projeto

O Quadraê busca simplificar a organização de atividades esportivas, facilitando a localização de quadras, a comparação de preços e a consulta de horários disponíveis, proporcionando uma experiência mais prática para os usuários.

---

**Projeto acadêmico — Análise e Desenvolvimento de Sistemas.**
