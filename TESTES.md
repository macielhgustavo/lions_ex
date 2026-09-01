# Testes executados

| Exercício | Cenários validados |
| --- | --- |
| 07 | Listagem, criação, atualização completa e exclusão de usuários. |
| 08 | Criação, atualização parcial, consulta e exclusão de usuários. |
| 09 | Duplicidade com 409, criação válida, corpo inválido com 400 e usuário ausente com 404. |
| 10 | Criação de produto, preço zero, nome inválido, atualização, produto ausente e exclusão. |
| 11 | Usuário com RequestHandler tipado, atualização parcial e filtro de produtos por query. |
| 12 | Usuário pelo Repository, atualização assíncrona, duplicidade, criação e filtro de produtos. |

Todos os projetos também foram validados com `npm run check`.

# Respostas curtas

O middleware registra cada requisição antes de ela chegar às rotas e chama `next()` para que o fluxo continue. O UserService deixa a rota só com a parte HTTP e concentra as operações de usuários.

Centralizar erros evita respostas diferentes para o mesmo problema e impede que detalhes internos sejam enviados ao cliente. Tipagem verifica o código durante o desenvolvimento; validação em tempo de execução confere o JSON que chegou na API.

O Controller traduz a requisição HTTP, o Service aplica as regras e o Repository guarda ou busca os dados. Assim, a forma de persistir os usuários pode mudar sem alterar as rotas nem as regras.
