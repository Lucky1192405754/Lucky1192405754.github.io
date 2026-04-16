(() => {
  const DATA = [
    {
      id: 'case1',
      title: '案例 A · 信息可视化提示词',
      prompt: 'Data visualization empowers users to',
      model: 'GPT-2 small',
      temperature: 0.8,
      sampling: 'top-k = 5',
      tokens: ['Data', ' visualization', ' em', 'powers', ' users', ' to'],
      tokenIds: [6601, 32704, 795, 30132, 2985, 284],
      top5: [
        { token: ' visualize', prob: 0.5467, logit: -135.91, scaled: -169.89 },
        { token: ' create', prob: 0.2087, logit: -136.68, scaled: -170.85 },
        { token: ' see', prob: 0.1209, logit: -137.12, scaled: -171.40 },
        { token: ' make', prob: 0.0626, logit: -137.65, scaled: -172.06 },
        { token: ' easily', prob: 0.0611, logit: -137.67, scaled: -172.08 }
      ],
      views: [
        {
          key: '0-0',
          layer: 0,
          head: 0,
          label: 'L0 / H0',
          title: '浅层 · 局部拼接',
          desc: '浅层头主要在短距离上下文里重新组合 token，说明模型最早做的是局部语义拼接，而不是全局抽象。',
          matrix: [
            [1, 0, 0, 0, 0, 0],
            [0.8388, 0.1612, 0, 0, 0, 0],
            [0.6315, 0.2056, 0.1629, 0, 0, 0],
            [0.4651, 0.2172, 0.2427, 0.0751, 0, 0],
            [0.2807, 0.3418, 0.2181, 0.0853, 0.0741, 0],
            [0.247, 0.1526, 0.2474, 0.1765, 0.142, 0.0345]
          ]
        },
        {
          key: '0-3',
          layer: 0,
          head: 3,
          label: 'L0 / H3',
          title: '浅层 · 位置锁定',
          desc: '这个 head 的对角结构很强，更像“位置/自保持头”，它帮助模型在一开始先稳住 token 自身状态。',
          matrix: [
            [1, 0, 0, 0, 0, 0],
            [0.2969, 0.7031, 0, 0, 0, 0],
            [0.0335, 0.015, 0.9515, 0, 0, 0],
            [0.0187, 0.0022, 0.0391, 0.94, 0, 0],
            [0.0583, 0.0067, 0.0436, 0.0104, 0.8809, 0],
            [0.0241, 0.0141, 0.1485, 0.0181, 0.0715, 0.7237]
          ]
        },
        {
          key: '5-2',
          layer: 5,
          head: 2,
          label: 'L5 / H2',
          title: '中层 · 语义聚焦',
          desc: '中层开始压缩无关路径，把注意力拉向更关键的词；这一步通常对应较稳定的语义聚焦。',
          matrix: [
            [1, 0, 0, 0, 0, 0],
            [0.7032, 0.2968, 0, 0, 0, 0],
            [0.7258, 0.2218, 0.0524, 0, 0, 0],
            [0.4401, 0.1393, 0.3747, 0.0458, 0, 0],
            [0.8507, 0.0412, 0.0568, 0.0377, 0.0136, 0],
            [0.7471, 0.0347, 0.0421, 0.1227, 0.0499, 0.0036]
          ]
        },
        {
          key: '11-7',
          layer: 11,
          head: 7,
          label: 'L11 / H7',
          title: '深层 · 最终汇聚',
          desc: '深层 head 会把大量注意力汇聚到少数高价值 token，上下文在这里被压缩成最终预测所需的线索。',
          matrix: [
            [1, 0, 0, 0, 0, 0],
            [0.9181, 0.0819, 0, 0, 0, 0],
            [0.9848, 0.0115, 0.0037, 0, 0, 0],
            [0.843, 0.0329, 0.0285, 0.0956, 0, 0],
            [0.8806, 0.0447, 0.0352, 0.0223, 0.0172, 0],
            [0.9196, 0.026, 0.0147, 0.0146, 0.0077, 0.0173]
          ]
        }
      ]
    },
    {
      id: 'case2',
      title: '案例 B · AI 叙述提示词',
      prompt: 'Artificial Intelligence is transforming the',
      model: 'GPT-2 small',
      temperature: 0.8,
      sampling: 'top-k = 5',
      tokens: ['Art', 'ificial', ' Intelligence', ' is', ' transforming', ' the'],
      tokenIds: [8001, 9542, 9345, 318, 25449, 262],
      top5: [
        { token: ' way', prob: 0.5264, logit: -100.88, scaled: -126.10 },
        { token: ' world', prob: 0.4255, logit: -101.05, scaled: -126.31 },
        { token: ' lives', prob: 0.0240, logit: -103.35, scaled: -129.19 },
        { token: ' field', prob: 0.0128, logit: -103.85, scaled: -129.82 },
        { token: ' future', prob: 0.0113, logit: -103.95, scaled: -129.94 }
      ],
      views: [
        {
          key: '0-0',
          layer: 0,
          head: 0,
          label: 'L0 / H0',
          title: '浅层 · 子词合并',
          desc: '这里能明显看到 `Art` 与 `ificial` 的早期耦合，说明 BPE 切分后的子词会先重新聚合。',
          matrix: [
            [1, 0, 0, 0, 0, 0],
            [0.9335, 0.0665, 0, 0, 0, 0],
            [0.6441, 0.216, 0.1399, 0, 0, 0],
            [0.5348, 0.1573, 0.1969, 0.111, 0, 0],
            [0.2261, 0.1493, 0.386, 0.1185, 0.1202, 0],
            [0.3066, 0.1078, 0.0985, 0.0778, 0.3669, 0.0423]
          ]
        },
        {
          key: '0-3',
          layer: 0,
          head: 3,
          label: 'L0 / H3',
          title: '浅层 · 对角稳定',
          desc: '对角主导说明这个 head 倾向于保留 token 自身特征，是典型的“状态保持型”注意力头。',
          matrix: [
            [1, 0, 0, 0, 0, 0],
            [0.3182, 0.6818, 0, 0, 0, 0],
            [0.1621, 0.4064, 0.4314, 0, 0, 0],
            [0.0709, 0.0346, 0.0758, 0.8187, 0, 0],
            [0.0135, 0.0031, 0.001, 0.0007, 0.9817, 0],
            [0.0471, 0.0231, 0.0305, 0.1039, 0.2245, 0.5709]
          ]
        },
        {
          key: '5-2',
          layer: 5,
          head: 2,
          label: 'L5 / H2',
          title: '中层 · 主题压缩',
          desc: '来到中层后，模型更偏向把整句压向主题词，从而服务于 `way / world` 这类抽象续写。',
          matrix: [
            [1, 0, 0, 0, 0, 0],
            [0.9717, 0.0283, 0, 0, 0, 0],
            [0.7366, 0.2349, 0.0286, 0, 0, 0],
            [0.5968, 0.2358, 0.1081, 0.0594, 0, 0],
            [0.6638, 0.044, 0.041, 0.199, 0.0523, 0],
            [0.7714, 0.0188, 0.0116, 0.034, 0.1549, 0.0093]
          ]
        },
        {
          key: '11-7',
          layer: 11,
          head: 7,
          label: 'L11 / H7',
          title: '深层 · 抽象汇总',
          desc: '深层注意力回收到极少数 token，表明模型已把句法碎片压缩为高层语义摘要。',
          matrix: [
            [1, 0, 0, 0, 0, 0],
            [0.9481, 0.0519, 0, 0, 0, 0],
            [0.8518, 0.0593, 0.0889, 0, 0, 0],
            [0.7944, 0.0701, 0.0737, 0.0618, 0, 0],
            [0.8981, 0.0347, 0.023, 0.0183, 0.0259, 0],
            [0.8915, 0.0371, 0.0246, 0.014, 0.0122, 0.0206]
          ]
        }
      ]
    },
    {
      id: 'case3',
      title: '案例 C · 科幻叙事提示词',
      prompt: 'As the spaceship was approaching the',
      model: 'GPT-2 small',
      temperature: 0.8,
      sampling: 'top-k = 5',
      tokens: ['As', ' the', ' spaceship', ' was', ' approaching', ' the'],
      tokenIds: [1722, 262, 40663, 373, 13885, 262],
      top5: [
        { token: ' planet', prob: 0.6224, logit: -92.86, scaled: -116.08 },
        { token: ' surface', prob: 0.1197, logit: -94.18, scaled: -117.73 },
        { token: ' station', prob: 0.0893, logit: -94.42, scaled: -118.02 },
        { token: ' moon', prob: 0.0850, logit: -94.46, scaled: -118.07 },
        { token: ' Earth', prob: 0.0836, logit: -94.47, scaled: -118.09 }
      ],
      views: [
        {
          key: '0-0',
          layer: 0,
          head: 0,
          label: 'L0 / H0',
          title: '浅层 · 场景铺垫',
          desc: '浅层还在把叙事片段组织成局部场景：主语、动作和介词结构尚未彻底压缩。',
          matrix: [
            [1, 0, 0, 0, 0, 0],
            [0.9432, 0.0568, 0, 0, 0, 0],
            [0.5935, 0.2927, 0.1138, 0, 0, 0],
            [0.4508, 0.0567, 0.0896, 0.4029, 0, 0],
            [0.3411, 0.1237, 0.2084, 0.1955, 0.1314, 0],
            [0.3682, 0.0385, 0.2752, 0.0581, 0.2312, 0.0287]
          ]
        },
        {
          key: '0-3',
          layer: 0,
          head: 3,
          label: 'L0 / H3',
          title: '浅层 · 强语法锚点',
          desc: '这个 head 在 `spaceship / approaching / the` 上形成明显锚点，说明模型很早就在组织句法骨架。',
          matrix: [
            [1, 0, 0, 0, 0, 0],
            [0.5909, 0.4091, 0, 0, 0, 0],
            [0.0076, 0.0007, 0.9917, 0, 0, 0],
            [0.088, 0.1042, 0.0168, 0.791, 0, 0],
            [0.0047, 0.0002, 0.0044, 0.0005, 0.9902, 0],
            [0.0453, 0.0527, 0.0104, 0.0988, 0.2131, 0.5797]
          ]
        },
        {
          key: '5-2',
          layer: 5,
          head: 2,
          label: 'L5 / H2',
          title: '中层 · 目标聚焦',
          desc: '中层已经把“飞船正在接近某个天体/地点”这一核心模式稳定下来，因此概率集中到 `planet` 一类词。',
          matrix: [
            [1, 0, 0, 0, 0, 0],
            [0.8625, 0.1375, 0, 0, 0, 0],
            [0.4502, 0.4989, 0.0508, 0, 0, 0],
            [0.1283, 0.7252, 0.1411, 0.0054, 0, 0],
            [0.4678, 0.2413, 0.1836, 0.1002, 0.0071, 0],
            [0.5504, 0.046, 0.1228, 0.0719, 0.1919, 0.017]
          ]
        },
        {
          key: '11-7',
          layer: 11,
          head: 7,
          label: 'L11 / H7',
          title: '深层 · 结局前压缩',
          desc: '临近输出层时，模型将大部分权重回收为少量全局提示，从而给出更确定的续写。',
          matrix: [
            [1, 0, 0, 0, 0, 0],
            [0.9777, 0.0223, 0, 0, 0, 0],
            [0.9272, 0.0176, 0.0553, 0, 0, 0],
            [0.9422, 0.0118, 0.0214, 0.0245, 0, 0],
            [0.8459, 0.0278, 0.0267, 0.0371, 0.0625, 0],
            [0.8243, 0.008, 0.1132, 0.0121, 0.0179, 0.0245]
          ]
        }
      ]
    }
  ];

  const FLOW_STEPS = [
    {
      key: 'embedding',
      title: 'Embedding',
      note: '先把自然语言切成 BPE token，并映射成高维向量。'
    },
    {
      key: 'attention',
      title: 'Attention',
      note: '不同 layer/head 以不同方式重分配上下文注意力。'
    },
    {
      key: 'mlp',
      title: 'MLP',
      note: '每个 token 再经过逐位置的非线性变换，提炼局部表示。'
    },
    {
      key: 'prob',
      title: 'Probabilities',
      note: '最后只对少量候选词保留显著概率，形成下一个 token 排名。'
    }
  ];

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const state = {
    caseIdx: 0,
    viewKey: '11-7',
    queryIdx: null,
    hoverCell: null
  };

  function formatToken(token) {
    return token.replace(/^ /, '␠');
  }

  function clamp(num, min, max) {
    return Math.min(max, Math.max(min, num));
  }

  function getCurrentCase() {
    return DATA[state.caseIdx];
  }

  function getCurrentView() {
    const data = getCurrentCase();
    return data.views.find((view) => view.key === state.viewKey) || data.views[0];
  }

  function getCurrentRow() {
    const view = getCurrentView();
    const rowIdx = state.queryIdx ?? (view.matrix.length - 1);
    return { rowIdx, row: view.matrix[rowIdx] };
  }

  function getTopContextTokens(limit = 4) {
    const current = getCurrentCase();
    const { rowIdx, row } = getCurrentRow();
    return row
      .map((value, idx) => ({
        idx,
        value: value || 0,
        token: current.tokens[idx]
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, limit)
      .map((item, rank) => ({ ...item, rank, rowIdx }));
  }

  function cellStyle(value, isSelectedRow, isStrong) {
    if (!value) {
      return 'background: repeating-linear-gradient(135deg, rgba(166,179,206,0.12), rgba(166,179,206,0.12) 6px, rgba(166,179,206,0.03) 6px, rgba(166,179,206,0.03) 12px);';
    }
    const intensity = clamp(value, 0, 1);
    const alpha = isSelectedRow ? 0.22 + intensity * 0.72 : 0.14 + intensity * 0.58;
    const bg = `linear-gradient(180deg, rgba(226,236,252,${0.75 + intensity * 0.2}), rgba(182,154,255,${alpha}))`;
    const shadow = isStrong
      ? 'box-shadow: inset 0 0 0 1px rgba(123, 104, 238, 0.34), 0 10px 18px rgba(122, 108, 170, 0.14);'
      : 'box-shadow: inset 0 0 0 1px rgba(140, 155, 190, 0.16);';
    return `background:${bg};${shadow}`;
  }

  function createMatrixHTML() {
    const current = getCurrentCase();
    const view = getCurrentView();
    const { rowIdx } = getCurrentRow();
    const strongByRow = view.matrix.map((row) => Math.max(...row.map((value) => value || 0)));

    const headerCells = current.tokens
      .map((token) => `<div class="tfx-lite-grid-head">${formatToken(token)}</div>`)
      .join('');

    const rows = view.matrix
      .map((row, rIdx) => {
        const labelClass = rIdx === rowIdx ? 'tfx-lite-grid-side is-active' : 'tfx-lite-grid-side';
        const side = `<button class="${labelClass}" data-action="query" data-query-index="${rIdx}" type="button">${formatToken(current.tokens[rIdx])}</button>`;
        const cells = row
          .map((value, cIdx) => {
            const visible = value || 0;
            const isStrong = visible === strongByRow[rIdx] && visible > 0;
            const selected = rIdx === rowIdx;
            const tooltip = `${formatToken(current.tokens[rIdx])} → ${formatToken(current.tokens[cIdx])}：${(visible * 100).toFixed(2)}%`;
            return `<button class="tfx-lite-grid-cell${selected ? ' is-selected-row' : ''}${isStrong ? ' is-strong' : ''}${!visible ? ' is-masked' : ''}" style="${cellStyle(visible, selected, isStrong)}" data-action="cell" data-row="${rIdx}" data-col="${cIdx}" data-tooltip="${tooltip}" type="button">${visible >= 0.10 ? `<span>${(visible * 100).toFixed(1)}%</span>` : ''}</button>`;
          })
          .join('');
        return side + cells;
      })
      .join('');

    return `
      <div class="tfx-lite-matrix-legend">
        <span>低关注</span>
        <div class="tfx-lite-legend-bar"></div>
        <span>高关注</span>
      </div>
      <div class="tfx-lite-matrix-grid" style="grid-template-columns: 112px repeat(${current.tokens.length}, minmax(58px, 1fr));">
        <div class="tfx-lite-grid-corner">Query \ Key</div>
        ${headerCells}
        ${rows}
      </div>
    `;
  }

  function createProbabilityHTML() {
    const current = getCurrentCase();
    const maxProb = Math.max(...current.top5.map((item) => item.prob));

    return current.top5
      .map((item, idx) => {
        const width = (item.prob / maxProb) * 100;
        return `
          <div class="tfx-lite-prob-row${idx === 0 ? ' is-top' : ''}">
            <div class="tfx-lite-prob-rank">#${idx + 1}</div>
            <div class="tfx-lite-prob-token">${formatToken(item.token)}</div>
            <div class="tfx-lite-prob-bar-wrap">
              <div class="tfx-lite-prob-bar" style="width:${width.toFixed(2)}%"></div>
            </div>
            <div class="tfx-lite-prob-value">${(item.prob * 100).toFixed(2)}%</div>
          </div>
        `;
      })
      .join('');
  }

  function createTopContextHTML() {
    const current = getCurrentCase();
    const { rowIdx } = getCurrentRow();
    const contexts = getTopContextTokens();
    const max = contexts[0]?.value || 1;

    return contexts
      .map((item) => {
        const width = (item.value / max) * 100;
        return `
          <div class="tfx-lite-context-row">
            <div class="tfx-lite-context-token">${formatToken(item.token)}</div>
            <div class="tfx-lite-context-bar-wrap">
              <div class="tfx-lite-context-bar" style="width:${width.toFixed(2)}%"></div>
            </div>
            <div class="tfx-lite-context-value">${(item.value * 100).toFixed(2)}%</div>
          </div>
        `;
      })
      .join('');
  }

  function buildInsight() {
    const current = getCurrentCase();
    const view = getCurrentView();
    const { rowIdx } = getCurrentRow();
    const topContexts = getTopContextTokens(2);
    const topNext = current.top5[0];
    const q = formatToken(current.tokens[rowIdx]);
    const c1 = topContexts[0] ? formatToken(topContexts[0].token) : '—';
    const c2 = topContexts[1] ? formatToken(topContexts[1].token) : '—';

    return `当前查看的是 <strong>${view.label}</strong>。当 Query token 取 <strong>${q}</strong> 时，这个 head 主要回看 <strong>${c1}</strong>${c2 !== '—' ? ` 与 <strong>${c2}</strong>` : ''}，最终让候选续写更集中到 <strong>${formatToken(topNext.token)}</strong>（${(topNext.prob * 100).toFixed(2)}%）。`;
  }

  function buildPromptTokensHTML() {
    const current = getCurrentCase();
    return current.tokens
      .map((token, idx) => {
        const active = idx === (state.queryIdx ?? current.tokens.length - 1) ? ' is-active' : '';
        return `<button class="tfx-lite-token-chip${active}" data-action="query" data-query-index="${idx}" type="button"><span class="tfx-lite-token-text">${formatToken(token)}</span><span class="tfx-lite-token-id">${current.tokenIds[idx]}</span></button>`;
      })
      .join('');
  }

  function render(root) {
    const current = getCurrentCase();
    const view = getCurrentView();
    const predicted = current.top5[0];

    if (state.queryIdx == null) {
      state.queryIdx = current.tokens.length - 1;
    }

    root.innerHTML = `
      <div class="tfx-lite-shell">
        <div class="tfx-lite-top">
          <div>
            <div class="tfx-lite-eyebrow">Precomputed Transformer Explainer</div>
            <h4>在一篇博客里，把 Transformer 的“下一词预测”压缩成一个可读、可点、可解释的科研面板</h4>
            <p>这不是在线跑 600MB 模型，而是从 Georgia Tech <code>transformer-explainer</code> 的真实 GPT-2 案例里提取出最有解释力的快照，再重组为适合 Hexo 的轻量交互版。</p>
          </div>
          <div class="tfx-lite-meta-card">
            <div class="tfx-lite-meta-label">当前最高概率候选</div>
            <div class="tfx-lite-next-token">${formatToken(predicted.token)}</div>
            <div class="tfx-lite-next-prob">${(predicted.prob * 100).toFixed(2)}%</div>
            <div class="tfx-lite-meta-sub">${current.model} · ${current.sampling} · T=${current.temperature}</div>
          </div>
        </div>

        <div class="tfx-lite-example-tabs">
          ${DATA.map((item, idx) => `<button class="tfx-lite-tab${idx === state.caseIdx ? ' is-active' : ''}" data-action="case" data-case-index="${idx}" type="button">${item.title}</button>`).join('')}
        </div>

        <div class="tfx-lite-prompt-card">
          <div class="tfx-lite-card-title">Prompt</div>
          <div class="tfx-lite-prompt-text">${current.prompt}</div>
          <div class="tfx-lite-prompt-tokens">${buildPromptTokensHTML()}</div>
        </div>

        <div class="tfx-lite-flow">
          ${FLOW_STEPS.map((step) => `<div class="tfx-lite-flow-card${step.key === 'attention' ? ' is-focus' : ''}"><div class="tfx-lite-flow-title">${step.title}</div><div class="tfx-lite-flow-note">${step.note}</div></div>`).join('')}
        </div>

        <div class="tfx-lite-main-grid">
          <section class="tfx-lite-panel tfx-lite-panel-attn">
            <div class="tfx-lite-panel-head">
              <div>
                <div class="tfx-lite-card-title">Attention snapshots</div>
                <div class="tfx-lite-card-sub">为了保证博客轻量，这里只保留 4 组最有解释力的 layer/head 快照。</div>
              </div>
              <div class="tfx-lite-snapshot-tabs">
                ${current.views.map((item) => `<button class="tfx-lite-snapshot${item.key === state.viewKey ? ' is-active' : ''}" data-action="view" data-view-key="${item.key}" type="button">${item.label}</button>`).join('')}
              </div>
            </div>

            <div class="tfx-lite-view-note">
              <div class="tfx-lite-view-title">${view.title}</div>
              <div class="tfx-lite-view-desc">${view.desc}</div>
            </div>

            <div class="tfx-lite-axis-note">点击 token 或矩阵左侧 Query 行标签，可以查看“当前 token 正在从哪些上下文位置收集信息”。</div>
            <div class="tfx-lite-matrix-wrap">${createMatrixHTML()}</div>
          </section>

          <section class="tfx-lite-panel tfx-lite-panel-side">
            <div class="tfx-lite-side-block">
              <div class="tfx-lite-card-title">当前 Query 的上下文拉取</div>
              <div class="tfx-lite-card-sub">行 Softmax 权重之和为 1，这里展示它最依赖的几个上下文 token。</div>
              <div class="tfx-lite-context-list">${createTopContextHTML()}</div>
            </div>
            <div class="tfx-lite-side-block">
              <div class="tfx-lite-card-title">Top-k 候选词分布</div>
              <div class="tfx-lite-card-sub">这是文章版解释器保留下来的候选词排名；它足够说明为什么某个 token 会胜出。</div>
              <div class="tfx-lite-prob-list">${createProbabilityHTML()}</div>
            </div>
            <div class="tfx-lite-side-block tfx-lite-insight-block">
              <div class="tfx-lite-card-title">解释器观察</div>
              <div class="tfx-lite-insight-text">${buildInsight()}</div>
            </div>
          </section>
        </div>

        <div class="tfx-lite-bottom-notes">
          <div class="tfx-lite-mini-note">
            <div class="tfx-lite-mini-title">为什么不直接跑完整模型？</div>
            <p>因为博客场景更适合“快开即读”。相比下载整套 ONNX 权重，这种预计算快照更轻，也更稳定。</p>
          </div>
          <div class="tfx-lite-mini-note">
            <div class="tfx-lite-mini-title">保留了什么？</div>
            <p>我保留了最关键的结构：tokenization、layer/head 快照、attention row、top-k 概率条，以及一段可解释叙事。</p>
          </div>
          <div class="tfx-lite-mini-note">
            <div class="tfx-lite-mini-title">适合后续怎么扩展？</div>
            <p>后面你如果愿意，可以继续接更多 prompt，或者再加一版 cross-attention / ViT 风格面板，结构上已经兼容。</p>
          </div>
        </div>

        <div class="tfx-lite-tooltip" hidden></div>
      </div>
    `;

    bindEvents(root);
  }

  function bindEvents(root) {
    root.addEventListener('click', (event) => {
      const target = event.target.closest('[data-action]');
      if (!target) return;
      const action = target.dataset.action;

      if (action === 'case') {
        state.caseIdx = Number(target.dataset.caseIndex);
        state.viewKey = '11-7';
        state.queryIdx = DATA[state.caseIdx].tokens.length - 1;
        render(root);
        return;
      }

      if (action === 'view') {
        state.viewKey = target.dataset.viewKey;
        render(root);
        return;
      }

      if (action === 'query') {
        state.queryIdx = Number(target.dataset.queryIndex);
        render(root);
        return;
      }
    }, { once: true });

    const tooltip = $('.tfx-lite-tooltip', root);

    $$('[data-action="cell"]', root).forEach((cell) => {
      cell.addEventListener('mouseenter', () => {
        tooltip.hidden = false;
        tooltip.textContent = cell.dataset.tooltip;
      });
      cell.addEventListener('mousemove', (event) => {
        tooltip.style.left = `${event.clientX + 16}px`;
        tooltip.style.top = `${event.clientY - 8}px`;
      });
      cell.addEventListener('mouseleave', () => {
        tooltip.hidden = true;
      });
    });
  }

  function init() {
    const root = document.getElementById('tfx-lite-demo');
    if (!root || root.dataset.tfxReady === 'true') return;
    root.dataset.tfxReady = 'true';
    state.queryIdx = DATA[state.caseIdx].tokens.length - 1;
    render(root);
  }

  window.initTfxLiteDemo = init;

  if (!window.__tfxLitePjaxBound) {
    document.addEventListener('pjax:complete', init);
    window.__tfxLitePjaxBound = true;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
