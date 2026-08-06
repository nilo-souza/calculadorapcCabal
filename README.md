# Comparador de Armas - Cabal Online

MVP local para estimar a diferença de Pontos de Combate ao trocar uma arma de Mago.

## Como usar

1. Abra `index.html` no navegador.
2. Preencha os atributos da arma atual.
3. Preencha os atributos da arma nova.
4. Confira a diferença estimada de Pontos de Combate.
5. Se tiver a diferença real vista no jogo, informe no campo "Comparar com o jogo" para medir o erro.
6. Clique em "Registrar teste" para guardar a validação no histórico e acompanhar o erro médio.

## Fórmula inicial

O cálculo usa uma soma ponderada:

```text
Diferença estimada = soma((atributo da arma nova - atributo da arma atual) * peso do atributo)
```

Os pesos iniciais foram baseados na calculadora pública do Mr. Wormy para Combat Power. Para Mago, a própria calculadora orienta usar Ataque Mágico como "Todos os Ataques" e Amp. Mágica como "Todas as Téc. Amp.".

Todos os pesos podem ser editados na tela. Os dados ficam salvos no navegador via `localStorage`.

## Validação atual

Com os dois testes informados até agora, o erro médio absoluto está em torno de `5 PC`, com erro percentual médio abaixo de `0,05%`.
