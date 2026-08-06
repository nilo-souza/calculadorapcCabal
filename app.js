const STORAGE_KEY = "cabal-weapon-comparator-v1";

const attributes = [
  {
    key: "magicAttack",
    label: "Ataque mágico",
    unit: "pontos",
    hint: "Mago: entra como Todos os Ataques.",
    defaultWeight: 34.5,
  },
  {
    key: "attack",
    label: "Ataque físico",
    unit: "pontos",
    hint: "Peso 0 por padrão para evitar duplicar o Ataque Mágico.",
    defaultWeight: 0,
  },
  {
    key: "criticalRate",
    label: "Taxa crítica",
    unit: "%",
    hint: "Informe apenas o número, sem o símbolo de porcentagem.",
    defaultWeight: 750,
  },
  {
    key: "criticalDamage",
    label: "Dano crítico",
    unit: "%",
    hint: "Ex.: 24 para +24%.",
    defaultWeight: 177,
  },
  {
    key: "magicAmp",
    label: "Amp. mágica",
    unit: "%",
    hint: "Mago: entra como Todas as Téc. Amp.",
    defaultWeight: 349,
  },
  {
    key: "swordAmp",
    label: "Amp. espada",
    unit: "%",
    hint: "Peso 0 por padrão para Mago.",
    defaultWeight: 0,
  },
  {
    key: "accuracy",
    label: "Precisão",
    unit: "pontos",
    hint: "Attack Rate na calculadora base.",
    defaultWeight: 3,
  },
  {
    key: "evasion",
    label: "Evasão",
    unit: "pontos",
    hint: "Defense Rate na calculadora base.",
    defaultWeight: 2.4,
  },
  {
    key: "defense",
    label: "Defesa",
    unit: "pontos",
    hint: "Útil caso a arma tenha defesa adicional.",
    defaultWeight: 21,
  },
  {
    key: "penetration",
    label: "Penetração",
    unit: "pontos",
    hint: "Perfuração.",
    defaultWeight: 71,
  },
  {
    key: "damageReduction",
    label: "Redução de dano",
    unit: "pontos",
    hint: "DMG Reduce.",
    defaultWeight: 19.5,
  },
];

const seedValidationHistory = [
  {
    id: "sample-1",
    label: "Teste informado 1",
    estimate: 6043.5,
    real: 6041,
    createdAt: "2026-08-06T00:00:00.000Z",
  },
  {
    id: "sample-2",
    label: "Teste informado 2",
    estimate: 14989.5,
    real: 14997,
    createdAt: "2026-08-06T00:00:00.000Z",
  },
];

const defaultMarket = {
  currentPriceValue: "",
  currentPriceUnit: "kk",
  candidatePriceValue: "",
  candidatePriceUnit: "kk",
  note: "",
};

const defaultState = createDefaultState(seedValidationHistory);

let state = loadState();
let latestEstimate = 0;

const elements = {
  currentName: document.querySelector("#current-name"),
  candidateName: document.querySelector("#candidate-name"),
  currentFields: document.querySelector("#current-fields"),
  candidateFields: document.querySelector("#candidate-fields"),
  weightFields: document.querySelector("#weight-fields"),
  impactTable: document.querySelector("#impact-table"),
  totalDifference: document.querySelector("#total-difference"),
  resultDirection: document.querySelector("#result-direction"),
  changedFields: document.querySelector("#changed-fields"),
  resetWeights: document.querySelector("#reset-weights"),
  clearItems: document.querySelector("#clear-items"),
  clearAll: document.querySelector("#clear-all"),
  realDifference: document.querySelector("#real-difference"),
  calibrationOutput: document.querySelector("#calibration-output"),
  saveValidation: document.querySelector("#save-validation"),
  clearValidationHistory: document.querySelector("#clear-validation-history"),
  validationSummary: document.querySelector("#validation-summary"),
  validationTable: document.querySelector("#validation-table"),
  costSummary: document.querySelector("#cost-summary"),
};

renderFields();
bindStaticEvents();
syncFormValues();
calculateAndRender();

function renderFields() {
  elements.currentFields.innerHTML = attributes.map((attribute) => renderAttributeInput(attribute, "current")).join("");
  elements.candidateFields.innerHTML = attributes.map((attribute) => renderAttributeInput(attribute, "candidate")).join("");
  elements.weightFields.innerHTML = attributes.map(renderWeightInput).join("");

  document.querySelectorAll("[data-item]").forEach((input) => {
    input.addEventListener("input", () => {
      state[input.dataset.item][input.dataset.attribute] = input.value;
      persistAndRender();
    });
  });

  document.querySelectorAll("[data-weight]").forEach((input) => {
    input.addEventListener("input", () => {
      state.weights[input.dataset.weight] = input.value;
      persistAndRender();
    });
  });

  document.querySelectorAll("[data-market]").forEach((input) => {
    input.addEventListener("input", () => {
      state.market[input.dataset.market] = input.value;
      persistAndRender();
    });

    input.addEventListener("change", () => {
      state.market[input.dataset.market] = input.value;
      persistAndRender();
    });
  });
}

function renderAttributeInput(attribute, itemKey) {
  const id = `${itemKey}-${attribute.key}`;

  return `
    <div class="attribute-row">
      <label for="${id}">
        ${attribute.label}
        <small>${attribute.hint}</small>
      </label>
      <input id="${id}" data-item="${itemKey}" data-attribute="${attribute.key}" type="number" step="0.1" placeholder="0 ${attribute.unit}" />
    </div>
  `;
}

function renderWeightInput(attribute) {
  const id = `weight-${attribute.key}`;

  return `
    <div class="attribute-row">
      <label for="${id}">
        ${attribute.label}
        <small>${attribute.unit}</small>
      </label>
      <input id="${id}" data-weight="${attribute.key}" type="number" step="0.1" />
    </div>
  `;
}

function bindStaticEvents() {
  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (event) => event.preventDefault());
  });

  elements.currentName.addEventListener("input", () => {
    state.currentName = elements.currentName.value;
    saveState();
  });

  elements.candidateName.addEventListener("input", () => {
    state.candidateName = elements.candidateName.value;
    saveState();
  });

  elements.realDifference.addEventListener("input", () => {
    state.realDifference = elements.realDifference.value;
    persistAndRender();
  });

  elements.saveValidation.addEventListener("click", () => {
    if (state.realDifference === "") {
      elements.calibrationOutput.textContent = "Informe a diferença real antes de registrar o teste.";
      return;
    }

    state.validationHistory.unshift({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      label: buildValidationLabel(),
      estimate: latestEstimate,
      real: toNumber(state.realDifference),
      createdAt: new Date().toISOString(),
    });

    persistAndRender();
  });

  elements.clearValidationHistory.addEventListener("click", () => {
    state.validationHistory = [];
    persistAndRender();
  });

  elements.resetWeights.addEventListener("click", () => {
    state.weights = Object.fromEntries(attributes.map((attribute) => [attribute.key, attribute.defaultWeight]));
    syncFormValues();
    persistAndRender();
  });

  elements.clearItems.addEventListener("click", () => {
    state.currentName = "";
    state.candidateName = "";
    state.current = Object.fromEntries(attributes.map((attribute) => [attribute.key, ""]));
    state.candidate = Object.fromEntries(attributes.map((attribute) => [attribute.key, ""]));
    state.realDifference = "";
    state.market = { ...defaultMarket };
    syncFormValues();
    persistAndRender();
  });

  elements.clearAll.addEventListener("click", () => {
    state = createDefaultState([]);
    syncFormValues();
    persistAndRender();
  });
}

function syncFormValues() {
  elements.currentName.value = state.currentName || "";
  elements.candidateName.value = state.candidateName || "";
  elements.realDifference.value = state.realDifference || "";

  Object.entries(state.market).forEach(([key, value]) => {
    setInputValue(`[data-market="${key}"]`, value);
  });

  attributes.forEach((attribute) => {
    setInputValue(`[data-item="current"][data-attribute="${attribute.key}"]`, state.current[attribute.key]);
    setInputValue(`[data-item="candidate"][data-attribute="${attribute.key}"]`, state.candidate[attribute.key]);
    setInputValue(`[data-weight="${attribute.key}"]`, state.weights[attribute.key]);
  });
}

function calculateAndRender() {
  const rows = attributes.map((attribute) => {
    const current = toNumber(state.current[attribute.key]);
    const candidate = toNumber(state.candidate[attribute.key]);
    const weight = toNumber(state.weights[attribute.key]);
    const difference = candidate - current;
    const impact = difference * weight;

    return {
      ...attribute,
      current,
      candidate,
      difference,
      weight,
      impact,
    };
  });

  const total = rows.reduce((sum, row) => sum + row.impact, 0);
  const changedRows = rows.filter((row) => row.difference !== 0 || row.impact !== 0);
  latestEstimate = total;

  renderSummary(total, changedRows.length);
  renderImpactTable(rows);
  renderCalibration(total);
  renderCostBenefit(total);
  renderValidationHistory();
}

function renderSummary(total, changedCount) {
  elements.totalDifference.textContent = formatSigned(total);
  elements.totalDifference.classList.toggle("negative", total < 0);

  if (total > 0) {
    elements.resultDirection.textContent = "A arma nova deve aumentar seu PC.";
  } else if (total < 0) {
    elements.resultDirection.textContent = "A arma nova deve diminuir seu PC.";
  } else {
    elements.resultDirection.textContent = "Sem diferença calculada.";
  }

  elements.changedFields.textContent = `${changedCount} ${changedCount === 1 ? "atributo alterado" : "atributos alterados"}`;
}

function renderImpactTable(rows) {
  const orderedRows = [...rows].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

  elements.impactTable.innerHTML = orderedRows
    .map((row) => {
      const impactClass = row.impact > 0 ? "impact-positive" : row.impact < 0 ? "impact-negative" : "";

      return `
        <tr>
          <td>${row.label}</td>
          <td>${formatSigned(row.difference)}</td>
          <td>${formatNumber(row.weight)}</td>
          <td class="${impactClass}">${formatSigned(row.impact)}</td>
        </tr>
      `;
    })
    .join("");
}

function renderCalibration(total) {
  const realDifference = toNumber(state.realDifference);

  if (state.realDifference === "") {
    elements.calibrationOutput.textContent = "Informe a diferença real para ver o erro da estimativa.";
    return;
  }

  const error = total - realDifference;
  const multiplier = total === 0 ? null : realDifference / total;
  const multiplierText = multiplier === null ? "indisponível" : `${formatNumber(multiplier)}x`;

  elements.calibrationOutput.textContent = `Estimativa: ${formatSigned(total)} PC. Erro: ${formatSigned(error)} PC. Fator global sugerido: ${multiplierText}.`;
}

function renderValidationHistory() {
  if (state.validationHistory.length === 0) {
    elements.validationSummary.innerHTML = renderValidationStat("Testes", "0", "Registre validações reais para medir a confiabilidade.");
    elements.validationTable.innerHTML = `<tr><td colspan="5">Nenhum teste registrado.</td></tr>`;
    return;
  }

  const stats = state.validationHistory.reduce(
    (summary, record) => {
      const error = record.estimate - record.real;
      const absoluteError = Math.abs(error);
      const percentageError = record.real === 0 ? 0 : (absoluteError / Math.abs(record.real)) * 100;

      return {
        count: summary.count + 1,
        absoluteError: summary.absoluteError + absoluteError,
        percentageError: summary.percentageError + percentageError,
        maxError: Math.max(summary.maxError, absoluteError),
      };
    },
    { count: 0, absoluteError: 0, percentageError: 0, maxError: 0 },
  );

  const averageError = stats.absoluteError / stats.count;
  const averagePercentageError = stats.percentageError / stats.count;

  elements.validationSummary.innerHTML = [
    renderValidationStat("Testes", formatNumber(stats.count), "Comparações registradas"),
    renderValidationStat("Erro médio", `${formatNumber(averageError)} PC`, "Média absoluta"),
    renderValidationStat("Erro médio %", `${formatNumber(averagePercentageError, 3)}%`, `Maior erro: ${formatNumber(stats.maxError)} PC`),
  ].join("");

  elements.validationTable.innerHTML = state.validationHistory
    .map((record) => {
      const error = record.estimate - record.real;
      const percentageError = record.real === 0 ? 0 : (Math.abs(error) / Math.abs(record.real)) * 100;
      const errorClass = error > 0 ? "impact-positive" : error < 0 ? "impact-negative" : "";

      return `
        <tr>
          <td>${escapeHtml(record.label)}</td>
          <td>${formatSigned(record.estimate)}</td>
          <td>${formatSigned(record.real)}</td>
          <td class="${errorClass}">${formatSigned(error)}</td>
          <td>${formatNumber(percentageError, 3)}%</td>
        </tr>
      `;
    })
    .join("");
}

function renderCostBenefit(total) {
  const currentPriceBi = priceToBi(state.market.currentPriceValue, state.market.currentPriceUnit);
  const candidatePriceBi = priceToBi(state.market.candidatePriceValue, state.market.candidatePriceUnit);

  if (!candidatePriceBi || candidatePriceBi <= 0) {
    elements.costSummary.innerHTML = `
      <div class="cost-empty">Informe o preço da arma nova para calcular PC por bi e avaliar o custo-benefício.</div>
    `;
    return;
  }

  const hasCurrentPrice = currentPriceBi !== null && currentPriceBi > 0;
  const investmentBi = hasCurrentPrice ? candidatePriceBi - currentPriceBi : candidatePriceBi;
  const efficiency = investmentBi > 0 ? total / investmentBi : null;
  const evaluation = getCostEvaluation(total, investmentBi, efficiency);
  const investmentHint = hasCurrentPrice ? "Preço novo - preço atual" : "Preço cheio da arma nova";

  elements.costSummary.innerHTML = `
    ${renderCostStat("Preço novo", formatAlzes(candidatePriceBi), "Valor informado para a arma candidata")}
    ${renderCostStat("Custo líquido", formatSignedAlzes(investmentBi), investmentHint)}
    ${renderCostStat("Eficiência", efficiency === null ? "Indisponível" : `${formatNumber(efficiency)} PC/bi`, "PC ganho por bilhão de Alzes")}
    <div class="cost-evaluation ${evaluation.tone}">
      <span>Avaliação</span>
      <strong>${evaluation.label}</strong>
      <small>${evaluation.detail}</small>
    </div>
  `;
}

function renderCostStat(label, value, hint) {
  return `
    <div class="cost-stat">
      <span>${label}</span>
      <strong>${value}</strong>
      <small>${hint}</small>
    </div>
  `;
}

function getCostEvaluation(total, investmentBi, efficiency) {
  if (total <= 0) {
    return {
      label: "Não compensa pelo PC",
      detail: "A troca reduz ou não altera os Pontos de Combate.",
      tone: "negative",
    };
  }

  if (investmentBi < 0) {
    return {
      label: "Excelente custo-benefício",
      detail: "Ganha PC e a arma nova é mais barata que a atual.",
      tone: "positive",
    };
  }

  if (investmentBi === 0) {
    return {
      label: "Excelente custo-benefício",
      detail: "Ganha PC sem custo líquido informado.",
      tone: "positive",
    };
  }

  if (efficiency >= 5000) {
    return {
      label: "Excelente custo-benefício",
      detail: "Muito PC ganho por bilhão investido.",
      tone: "positive",
    };
  }

  if (efficiency >= 2000) {
    return {
      label: "Bom custo-benefício",
      detail: "Ganho de PC consistente para o preço.",
      tone: "positive",
    };
  }

  if (efficiency >= 1000) {
    return {
      label: "Custo-benefício razoável",
      detail: "Pode valer se o item tiver outros benefícios.",
      tone: "neutral",
    };
  }

  return {
    label: "Caro pelo ganho",
    detail: "O ganho de PC é baixo para o preço informado.",
    tone: "negative",
  };
}

function renderValidationStat(label, value, hint) {
  return `
    <div class="validation-stat">
      <span>${label}</span>
      <strong>${value}</strong>
      <small>${hint}</small>
    </div>
  `;
}

function buildValidationLabel() {
  const currentName = state.currentName.trim() || "Arma atual";
  const candidateName = state.candidateName.trim() || "Arma nova";

  return `${currentName} -> ${candidateName}`;
}

function persistAndRender() {
  saveState();
  calculateAndRender();
}

function createDefaultState(validationHistory) {
  return {
    currentName: "",
    candidateName: "",
    current: Object.fromEntries(attributes.map((attribute) => [attribute.key, ""])),
    candidate: Object.fromEntries(attributes.map((attribute) => [attribute.key, ""])),
    weights: Object.fromEntries(attributes.map((attribute) => [attribute.key, attribute.defaultWeight])),
    realDifference: "",
    market: { ...defaultMarket },
    validationHistory: validationHistory.map((record) => ({ ...record })),
  };
}

function loadState() {
  try {
    const storedState = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (!storedState) {
      return structuredClone(defaultState);
    }

    return {
      ...structuredClone(defaultState),
      ...storedState,
      current: { ...defaultState.current, ...storedState.current },
      candidate: { ...defaultState.candidate, ...storedState.candidate },
      weights: { ...defaultState.weights, ...storedState.weights },
      market: { ...defaultState.market, ...storedState.market },
      validationHistory: Array.isArray(storedState.validationHistory) ? storedState.validationHistory : defaultState.validationHistory,
    };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function setInputValue(selector, value) {
  const input = document.querySelector(selector);

  if (input) {
    input.value = value ?? "";
  }
}

function toNumber(value) {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) ? number : 0;
}

function priceToBi(value, unit) {
  const number = toFlexibleNumber(value);

  if (number === null) {
    return null;
  }

  return unit === "kk" ? number / 1000 : number;
}

function toFlexibleNumber(value) {
  const rawValue = String(value ?? "").trim();

  if (!rawValue) {
    return null;
  }

  const normalizedValue = rawValue.includes(",")
    ? rawValue.replace(/\./g, "").replace(",", ".")
    : rawValue;
  const number = Number.parseFloat(normalizedValue);

  return Number.isFinite(number) ? number : null;
}

function formatSigned(value) {
  if (value === 0) {
    return "0";
  }

  return `${value > 0 ? "+" : "-"}${formatNumber(Math.abs(value))}`;
}

function formatNumber(value, maximumFractionDigits = 1) {
  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits,
  }).format(value);
}

function formatAlzes(valueBi) {
  if (Math.abs(valueBi) < 1) {
    return `${formatNumber(valueBi * 1000, 1)} kk (${formatNumber(valueBi, 3)} bi)`;
  }

  return `${formatNumber(valueBi, 3)} bi`;
}

function formatSignedAlzes(valueBi) {
  if (valueBi === 0) {
    return "0";
  }

  return `${valueBi > 0 ? "+" : "-"}${formatAlzes(Math.abs(valueBi))}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
    };

    return entities[character];
  });
}
