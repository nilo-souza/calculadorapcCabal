# Comparador de Armas - Cabal Online

App web local para estimar a diferença de Pontos de Combate ao trocar uma arma de Mago e avaliar o custo-benefício da compra.

Versão atual: `v0.4`.

## Como usar

1. Abra `index.html` no navegador.
2. Preencha os atributos da arma atual.
3. Preencha os atributos da arma nova.
4. Confira a diferença estimada de Pontos de Combate.
5. Informe o preço da arma nova em `kk` ou `bi` para calcular o custo-benefício.
6. Opcionalmente, informe o preço da arma atual para calcular o custo líquido da troca.
7. Clique em "Adicionar arma à lista" para salvar a arma candidata no ranking.
8. Repita o preenchimento para comparar várias armas do mercado.
9. Se tiver a diferença real vista no jogo, informe no campo "Comparar com o jogo" para medir o erro.
10. Clique em "Registrar teste" para guardar a validação no histórico e acompanhar o erro médio.

Exemplos de preço:

```text
500 kk = 0,5 bi
250 kk = 0,25 bi
1,5 bi = 1.500 kk
```

## Fórmula inicial

O cálculo usa uma soma ponderada:

```text
Diferença estimada = soma((atributo da arma nova - atributo da arma atual) * peso do atributo)
```

Os pesos iniciais foram baseados na calculadora pública do Mr. Wormy para Combat Power. Para Mago, a própria calculadora orienta usar Ataque Mágico como "Todos os Ataques" e Amp. Mágica como "Todas as Téc. Amp.".

Todos os pesos podem ser editados na tela. Os dados ficam salvos no navegador via `localStorage`.

## Custo-benefício

A partir da versão `v0.3`, a ferramenta calcula:

- Preço da arma nova.
- Custo líquido da troca, quando o preço da arma atual é informado.
- PC ganho por bilhão de Alzes.
- Avaliação automática: excelente, bom, razoável, caro pelo ganho ou não compensa pelo PC.

O cálculo principal é:

```text
Eficiência = diferença estimada de PC / custo em bilhões de Alzes
```

Se o preço da arma atual for informado, o custo usado é:

```text
Custo líquido = preço da arma nova - preço da arma atual
```

## Ranking de armas

A versão `v0.4` permite salvar várias armas candidatas e comparar todas contra a arma atual.

O ranking pode ser ordenado por:

- Melhor custo-benefício.
- Maior ganho de PC.
- Menor preço.

As armas salvas são recalculadas automaticamente quando a arma atual ou os pesos são alterados.

## Validação atual

Com os dois testes informados até agora, o erro médio absoluto está em torno de `5 PC`, com erro percentual médio abaixo de `0,05%`.

## Changelog

### v0.4

- Adicionado cadastro de múltiplas armas candidatas.
- Adicionado ranking de armas salvas.
- Adicionada ordenação por custo-benefício, ganho de PC e preço.
- Adicionadas ações para carregar e remover opções salvas.
- As opções salvas são recalculadas contra a arma atual e os pesos configurados.

### v0.3

- Adicionado cálculo de custo-benefício.
- Adicionados campos de preço em `kk` e `bi`.
- Adicionado cálculo de PC por bilhão de Alzes.
- Adicionada avaliação automática de compra.
- Adicionado campo de observação do item.

### v0.2

- Adicionado histórico de validações.
- Adicionado erro médio e erro percentual médio.
- Adicionado registro de testes com diferença real vista no jogo.

### v0.1

- Criado comparador manual de armas para Mago.
- Adicionados pesos editáveis por atributo.
- Adicionado cálculo de diferença estimada de Pontos de Combate.
