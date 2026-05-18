(() => {
  const HERO_CASES = [
    {
      id: 'hero-a',
      label: 'Prompt A',
      prompt: 'Data visualization empowers users to',
      tokens: ['Data', ' visualization', ' em', 'powers', ' users', ' to'],
      nextToken: ' visualize',
      nextProb: 54.67,
      notes: {
        embedding: 'BPE 把输入切成可学习的 token 单元，再投影到高维向量空间。',
        attention: '不同注意力头分别聚焦局部拼接、位置保持与主题压缩。',
        mlp: '逐位置 MLP 把路由后的上下文重写成更利于预测的特征。',
        probability: '输出层只保留少量高概率候选，形成最终 next-token 排名。'
      },
      edges: [
        [0, 0, 0.86], [1, 0, 0.52], [1, 1, 0.82], [2, 1, 0.76], [3, 2, 0.78], [4, 1, 0.66], [5, 0, 0.72],
        [0, 2, 0.48], [2, 3, 0.68], [4, 4, 0.62], [5, 5, 0.74]
      ],
      topk: [
        { token: ' visualize', prob: 54.67 },
        { token: ' create', prob: 20.87 },
        { token: ' see', prob: 12.09 },
        { token: ' make', prob: 6.26 },
        { token: ' easily', prob: 6.11 }
      ]
    },
    {
      id: 'hero-b',
      label: 'Prompt B',
      prompt: 'Artificial Intelligence is transforming the',
      tokens: ['Art', 'ificial', ' Intelligence', ' is', ' transforming', ' the'],
      nextToken: ' way',
      nextProb: 52.64,
      notes: {
        embedding: '子词切分后，模型会在浅层很快把 `Art` 与 `ificial` 聚合回来。',
        attention: '中层开始把权重压向主题 token，减少无关上下文干扰。',
        mlp: 'MLP 把“变革某个对象”的抽象模式变成更锐利的语义表征。',
        probability: 'logits 在这里已经高度偏向 `way / world` 这样的主题续写。'
      },
      edges: [
        [0, 0, 0.88], [1, 0, 0.84], [2, 2, 0.82], [3, 2, 0.64], [4, 2, 0.74], [5, 4, 0.8],
        [2, 1, 0.44], [3, 3, 0.78], [4, 0, 0.42], [5, 0, 0.7]
      ],
      topk: [
        { token: ' way', prob: 52.64 },
        { token: ' world', prob: 42.55 },
        { token: ' lives', prob: 2.40 },
        { token: ' field', prob: 1.28 },
        { token: ' future', prob: 1.13 }
      ]
    }
  ];

  const ATTENTION_LAB = {
    modes: [
      {
        key: 'self',
        label: 'Self-Attention',
        title: '文本 token 对文本 token 的上下文重分配',
        note: '这里展示的是教学上最重要的几类 head：局部依存、位置保持、语义压缩与深层汇聚。每一行表示 Query token 如何回看整段上下文。',
        detailTitle: '矩阵应该怎么看？',
        detailText: '横轴是被关注的 Key，纵轴是发起查询的 Query。每一行 softmax 之后都归一化为 1，因此真正重要的是“当前 token 把概率分给了谁”。',
        sourceLabel: 'Query token',
        targetsLabel: 'Top context',
        tokens: ['[CLS]', '猫', '坐', '在', '垫', '子', '上', '。', '[SEP]'],
        items: [
          {
            id: 'self-local',
            label: 'Local head',
            title: '浅层：局部句法拼接',
            summary: '这个 head 更偏向短程依赖，常见于浅层，用于把局部短语和邻接语义快速组织起来。',
            focusIndex: 2,
            matrix: [
              [0.42,0.12,0.08,0.07,0.07,0.07,0.08,0.06,0.03],
              [0.11,0.38,0.16,0.09,0.08,0.07,0.06,0.04,0.01],
              [0.08,0.18,0.35,0.13,0.09,0.07,0.06,0.03,0.01],
              [0.07,0.10,0.15,0.32,0.14,0.10,0.07,0.04,0.01],
              [0.06,0.08,0.09,0.14,0.33,0.15,0.09,0.05,0.01],
              [0.06,0.07,0.08,0.10,0.16,0.32,0.13,0.07,0.01],
              [0.06,0.06,0.07,0.08,0.09,0.14,0.37,0.12,0.01],
              [0.05,0.05,0.06,0.07,0.08,0.10,0.15,0.42,0.02],
              [0.35,0.08,0.07,0.07,0.07,0.07,0.08,0.10,0.11]
            ]
          },
          {
            id: 'self-anchor',
            label: 'Anchor head',
            title: '浅层：位置与状态保持',
            summary: '对角线强，说明这个 head 更像“状态保持器”，帮助 token 在经过多层时不至于过早丢失自身身份。',
            focusIndex: 4,
            matrix: [
              [0.55,0.06,0.05,0.05,0.05,0.05,0.06,0.06,0.07],
              [0.48,0.14,0.07,0.06,0.06,0.06,0.05,0.05,0.03],
              [0.46,0.09,0.12,0.08,0.07,0.07,0.05,0.04,0.02],
              [0.44,0.08,0.10,0.14,0.09,0.07,0.05,0.02,0.01],
              [0.43,0.07,0.08,0.11,0.15,0.09,0.05,0.01,0.01],
              [0.42,0.07,0.07,0.08,0.12,0.16,0.06,0.01,0.01],
              [0.41,0.06,0.06,0.07,0.08,0.12,0.17,0.02,0.01],
              [0.39,0.06,0.05,0.06,0.07,0.09,0.14,0.12,0.02],
              [0.20,0.07,0.07,0.08,0.08,0.09,0.12,0.18,0.11]
            ]
          },
          {
            id: 'self-semantic',
            label: 'Semantic head',
            title: '中层：语义依存开始压缩',
            summary: '中层开始把更多权重拉向语义上真正关键的 token，而不再只是局部相邻关系。',
            focusIndex: 6,
            matrix: [
              [0.22,0.14,0.12,0.10,0.10,0.10,0.10,0.09,0.03],
              [0.10,0.20,0.22,0.12,0.11,0.10,0.09,0.05,0.01],
              [0.08,0.28,0.18,0.16,0.12,0.09,0.06,0.02,0.01],
              [0.07,0.12,0.14,0.19,0.22,0.14,0.08,0.03,0.01],
              [0.07,0.11,0.12,0.22,0.18,0.16,0.09,0.04,0.01],
              [0.06,0.09,0.10,0.14,0.24,0.20,0.12,0.04,0.01],
              [0.06,0.08,0.09,0.10,0.12,0.24,0.25,0.05,0.01],
              [0.05,0.06,0.07,0.08,0.09,0.12,0.20,0.31,0.02],
              [0.28,0.07,0.07,0.08,0.08,0.09,0.12,0.16,0.05]
            ]
          }
        ]
      },
      {
        key: 'vit',
        label: 'ViT Patch Attention',
        title: '图像切成 patch 之后，CLS token 如何汇聚全局视觉证据',
        note: '这里不是直接展示某个开源 ViT 的完整真实权重，而是用教学近似的 patch 热度场帮助理解：CLS token 如何在不同 head 中重新分配全图关注。',
        detailTitle: '为什么 ViT 值得单独看？',
        detailText: '因为 ViT 的关键不只是“也能做 attention”，而是它把整张图像改写成 patch token 序列，使得第一层就具备全局感受野。',
        sourceLabel: 'Scene',
        targetsLabel: 'Patch focus',
        gridSize: 14,
        items: [
          {
            id: 'vit-cat',
            label: 'Cat',
            title: '主体聚焦：头部与躯干优先',
            summary: 'CLS token 会明显集中到主体区域，而不是平均地处理整个背景，这与人类视觉任务中对主体的优先关注非常相似。',
            descriptor: '猫的头部、耳朵与躯干',
            scene: 'cat',
            focus: [[5,4,0.85],[6,4,0.92],[7,4,0.84],[5,5,0.9],[6,5,1],[7,5,0.88],[5,6,0.82],[6,6,0.9],[7,6,0.81],[4,3,0.62],[8,3,0.58]],
            heads: [
              { label: 'Head 1', note: '主体轮廓', values: [[6,5,1],[6,4,0.86],[6,6,0.83],[5,5,0.78],[7,5,0.75]] },
              { label: 'Head 2', note: '眼耳区域', values: [[5,3,0.84],[7,3,0.8],[6,4,0.72],[6,5,0.66]] },
              { label: 'Head 3', note: '躯干全局', values: [[5,5,0.72],[6,5,0.84],[7,5,0.88],[6,6,0.74]] }
            ]
          },
          {
            id: 'vit-city',
            label: 'Street',
            title: '复杂场景：行人、建筑与路面分工',
            summary: '不同 head 会把注意力分别派给行人、建筑轮廓与路面区域，多头机制在这里体现为对不同语义部分的并行解耦。',
            descriptor: '行人、建筑立面与街道',
            scene: 'city',
            focus: [[2,4,0.8],[3,4,0.78],[9,3,0.74],[10,3,0.82],[11,3,0.79],[6,10,0.72],[7,10,0.8],[8,10,0.76],[10,8,0.65]],
            heads: [
              { label: 'Head 1', note: '行人目标', values: [[6,10,0.86],[7,10,1],[8,10,0.84]] },
              { label: 'Head 2', note: '建筑轮廓', values: [[9,3,0.9],[10,3,1],[11,3,0.91]] },
              { label: 'Head 3', note: '全局路面', values: [[5,11,0.72],[6,11,0.82],[7,11,0.85],[8,11,0.77]] }
            ]
          },
          {
            id: 'vit-flower',
            label: 'Flower',
            title: '纹理任务：花蕊与花瓣细节',
            summary: 'ViT 在细粒度对象上往往会把头部分工成中心纹理、边缘轮廓和整体形状几类关注方式。',
            descriptor: '花蕊与五瓣纹理',
            scene: 'flower',
            focus: [[6,6,1],[6,5,0.86],[6,7,0.82],[5,6,0.8],[7,6,0.81],[4,5,0.7],[8,5,0.66],[4,7,0.62],[8,7,0.64]],
            heads: [
              { label: 'Head 1', note: '花蕊中心', values: [[6,6,1],[6,5,0.82],[6,7,0.8]] },
              { label: 'Head 2', note: '花瓣形状', values: [[4,5,0.84],[8,5,0.79],[4,7,0.76],[8,7,0.74]] },
              { label: 'Head 3', note: '整体轮廓', values: [[5,6,0.72],[6,6,0.82],[7,6,0.74],[6,8,0.66]] }
            ]
          }
        ]
      },
      {
        key: 'cross',
        label: 'Cross-Attention',
        title: '目标 token 如何去源模态 patch 序列中寻址',
        note: '这类可视化更适合教学型近似：Query 来自文本 token，Key/Value 来自图像 patch。你看到的不是“图文配对分数”，而是“当前词汇正在图像哪里取证”。',
        detailTitle: 'Cross-Attention 的核心是什么？',
        detailText: '不是“两个模态简单拼在一起”，而是目标模态的当前位置主动去另一个模态中查找最相关的上下文区域。',
        sourceLabel: 'Text token',
        targetsLabel: 'Region focus',
        items: [
          {
            id: 'cross-cat',
            label: '一只橘色的猫坐在窗边',
            title: '文本 token 对图像区域的跨模态寻址',
            summary: '当 token 从“猫”切换到“窗边”时，注意力热点会从主体区域移动到右侧窗户区域，说明生成中的 query 正在重定向证据来源。',
            descriptor: '左侧猫主体，右侧窗户',
            tokens: ['一只', '橘色', '的', '猫', '坐', '在', '窗边'],
            maps: {
              '一只': [[2,1,0.6],[3,1,0.72],[3,3,0.88],[2,4,0.76],[3,4,0.8]],
              '橘色': [[2,3,0.76],[3,3,0.92],[3,4,1],[2,4,0.84]],
              '的': [[3,2,0.44],[4,2,0.41],[4,3,0.4]],
              '猫': [[2,1,0.82],[3,1,0.9],[2,3,0.86],[3,3,1],[3,4,0.92]],
              '坐': [[3,4,0.74],[3,5,0.82],[4,5,0.88],[3,6,0.72]],
              '在': [[4,3,0.42],[4,4,0.44],[5,4,0.46]],
              '窗边': [[5,2,0.82],[6,2,0.9],[5,3,0.84],[6,3,1],[6,4,0.72]]
            },
            regionSummary: {
              '一只': '量词通常需要对象证据，因此会先对主体区域建立弱绑定。',
              '橘色': '颜色词优先从主体表面纹理区域取证，而不是背景。',
              '的': '功能词语义较弱，注意力更分散。',
              '猫': '模型会回到主体头部与躯干区域，以确认类别与主体语义。',
              '坐': '动作词会偏向身体姿态和支撑区域。',
              '在': '介词类 token 通常起结构连接作用，关注较分散。',
              '窗边': '位置词会把证据拉到右侧窗户及其邻近边界。'
            }
          }
        ]
      }
    ]
  };

  const INFERENCE_CASES = [
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
      snapshots: [
        {
          key: '0-0',
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
          ],
          systems: ['浅层 head 先完成局部重组，再交给更深层进行主题压缩。', '这一步更像“把句子拼顺”，还没有进入最终概率决策。']
        },
        {
          key: '5-2',
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
          ],
          systems: ['这里开始形成更稳定的主题上下文，logits 会逐渐变尖。', '深层 block 并不是突然“理解了”，而是在中层逐步压缩路径的基础上完成最后决策。']
        },
        {
          key: '11-7',
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
          ],
          systems: ['这个阶段的 hidden state 已经足够支持 logits 排名。', '若进入自回归推理，KV cache 会缓存历史 K/V，避免下一步重复计算这些旧 token。']
        }
      ]
    },
    {
      id: 'case2',
      title: '案例 B · AI 叙述提示词',
      prompt: 'Artificial Intelligence is transforming the',
      model: 'GPT-2 small',
      temperature: 0.8,
      sampling: 'top-p = 0.92',
      tokens: ['Art', 'ificial', ' Intelligence', ' is', ' transforming', ' the'],
      tokenIds: [8001, 9542, 9345, 318, 25449, 262],
      top5: [
        { token: ' way', prob: 0.5264, logit: -100.88, scaled: -126.10 },
        { token: ' world', prob: 0.4255, logit: -101.05, scaled: -126.31 },
        { token: ' lives', prob: 0.0240, logit: -103.35, scaled: -129.19 },
        { token: ' field', prob: 0.0128, logit: -103.85, scaled: -129.82 },
        { token: ' future', prob: 0.0113, logit: -103.95, scaled: -129.94 }
      ],
      snapshots: [
        {
          key: '0-0',
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
          ],
          systems: ['子词切分会改变浅层注意力的任务形态：先聚合 subword，再压缩主题。', '这也是为什么 tokenization 会直接影响 early-layer attention pattern。']
        },
        {
          key: '5-2',
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
          ],
          systems: ['中层更像一个“语义压缩器”，把句法碎片合成为更抽象的主题表示。', '如果这里采用 GQA，多组 query 头会共享更少量的 K/V，从而降低推理 cache 占用。']
        },
        {
          key: '11-7',
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
          ],
          systems: ['logits 在深层已经非常尖锐，temperature / top-p 主要改变的是采样分布，而不是 attention 本体。', 'FlashAttention 优化的不是这条数学链路，而是这些 score / softmax / V 聚合在硬件上的 IO 路径。']
        }
      ]
    }
  ];

  const SYSTEM_CARDS = [
    {
      title: 'KV Cache',
      text: '缓存历史 K/V，让下一步推理只需要处理新 token，减少重复 attention 计算。'
    },
    {
      title: 'MQA / GQA',
      text: '通过共享部分或全部 K/V，降低长上下文推理中的 cache 成本与显存压力。'
    },
    {
      title: 'FlashAttention',
      text: '重点优化显存 IO 与 kernel 调度，不改数学定义，却显著提高 exact attention 的效率。'
    }
  ];

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const state = {
    heroIndex: 0,
    heroStage: 'attention',
    attentionMode: 'self',
    attentionItemId: 'self-local',
    crossToken: '猫',
    inferenceCaseId: 'case1',
    inferenceSnapshotKey: '11-7',
    inferenceQueryIdx: null
  };

  function clamp(num, min, max) {
    return Math.min(max, Math.max(min, num));
  }

  function formatToken(token) {
    return token.replace(/^ /, '␠');
  }

  function getHeroCase() {
    return HERO_CASES[state.heroIndex];
  }

  function getAttentionMode() {
    return ATTENTION_LAB.modes.find((mode) => mode.key === state.attentionMode) || ATTENTION_LAB.modes[0];
  }

  function getAttentionItem() {
    const mode = getAttentionMode();
    return mode.items.find((item) => item.id === state.attentionItemId) || mode.items[0];
  }

  function getInferenceCase() {
    return INFERENCE_CASES.find((item) => item.id === state.inferenceCaseId) || INFERENCE_CASES[0];
  }

  function getInferenceSnapshot() {
    const current = getInferenceCase();
    return current.snapshots.find((item) => item.key === state.inferenceSnapshotKey) || current.snapshots[0];
  }

  function getInferenceRow() {
    const snapshot = getInferenceSnapshot();
    const rowIdx = state.inferenceQueryIdx ?? (snapshot.matrix.length - 1);
    return { rowIdx, row: snapshot.matrix[rowIdx] };
  }

  function createHeroHTML() {
    const current = getHeroCase();
    const stageNote = current.notes[state.heroStage];
    const maxProb = Math.max(...current.topk.map((item) => item.prob));

    return `
      <div class="tfx-pro-shell tfx-pro-shell--hero">
        <div class="tfx-pro-shell__header">
          <div>
            <div class="tfx-pro-eyebrow">Transformer walkthrough</div>
            <h3>把 token 如何流过 Transformer block 这件事，压缩成一个可悬停、可切换、可观察的信息流仪表板</h3>
            <p>这个面板不是在线跑完整模型，而是把最关键的结构阶段——tokenization、attention、MLP、probabilities——组织成一条可读的解释链路。</p>
          </div>
          <div class="tfx-pro-meta-card">
            <div class="tfx-pro-meta-card__label">当前最高概率候选</div>
            <div class="tfx-pro-meta-card__token">${formatToken(current.nextToken)}</div>
            <div class="tfx-pro-meta-card__prob">${current.nextProb.toFixed(2)}%</div>
            <div class="tfx-pro-meta-card__sub">Precomputed explainer · ${current.label}</div>
          </div>
        </div>

        <div class="tfx-pro-hero-tabs">
          ${HERO_CASES.map((item, idx) => `<button class="tfx-pro-chip${idx === state.heroIndex ? ' is-active' : ''}" data-role="hero-case" data-hero-index="${idx}" type="button">${item.label}</button>`).join('')}
        </div>

        <div class="tfx-pro-hero-prompt">
          <span class="tfx-pro-hero-prompt__label">Prompt</span>
          <div class="tfx-pro-hero-prompt__text">${current.prompt}</div>
        </div>

        <div class="tfx-pro-hero-flow">
          <div class="tfx-pro-token-stack">
            ${current.tokens.map((token) => `<div class="tfx-pro-token-pill">${formatToken(token)}</div>`).join('')}
          </div>
          <div class="tfx-pro-flow-stage tfx-pro-flow-stage--active"><span>Embedding</span></div>
          <svg class="tfx-pro-flow-svg" viewBox="0 0 760 340" preserveAspectRatio="none" aria-hidden="true">
            ${current.edges.map(([from, to, weight], idx) => {
              const y1 = 30 + from * 44;
              const y2 = 40 + to * 48;
              const alpha = 0.18 + weight * 0.7;
              const stroke = state.heroStage === 'attention' ? `rgba(104, 123, 241, ${alpha.toFixed(3)})` : `rgba(120, 136, 176, ${(0.08 + weight * 0.18).toFixed(3)})`;
              return `<path d="M 80 ${y1} C 220 ${y1}, 250 ${y2}, 360 ${y2}" stroke="${stroke}" stroke-width="${(1.5 + weight * 8).toFixed(2)}" fill="none" stroke-linecap="round"></path>`;
            }).join('')}
            <rect x="360" y="22" width="110" height="236" rx="24" class="tfx-pro-flow-block" />
            <text x="415" y="52" text-anchor="middle" class="tfx-pro-flow-label">Attention</text>
            <text x="545" y="52" text-anchor="middle" class="tfx-pro-flow-label">MLP</text>
            <rect x="500" y="22" width="88" height="236" rx="24" class="tfx-pro-flow-block tfx-pro-flow-block--secondary" />
            <path d="M 470 140 C 500 140, 515 140, 535 140" class="tfx-pro-flow-arrow"></path>
            <path d="M 588 140 C 640 140, 675 140, 706 140" class="tfx-pro-flow-arrow"></path>
            <rect x="706" y="72" width="34" height="136" rx="14" class="tfx-pro-flow-prob-col" />
          </svg>
          <div class="tfx-pro-hero-probs">
            ${current.topk.map((item, idx) => `<div class="tfx-pro-prob-row${idx === 0 ? ' is-top' : ''}"><span class="tfx-pro-prob-row__token">${formatToken(item.token)}</span><div class="tfx-pro-prob-row__bar"><div class="tfx-pro-prob-row__fill" style="width:${(item.prob / maxProb * 100).toFixed(2)}%"></div></div><span class="tfx-pro-prob-row__value">${item.prob.toFixed(2)}%</span></div>`).join('')}
          </div>
        </div>

        <div class="tfx-pro-stage-tabs">
          ${['embedding', 'attention', 'mlp', 'probability'].map((stage) => `<button class="tfx-pro-stage-tab${stage === state.heroStage ? ' is-active' : ''}" data-role="hero-stage" data-hero-stage="${stage}" type="button">${stage === 'probability' ? 'Probabilities' : stage.charAt(0).toUpperCase() + stage.slice(1)}</button>`).join('')}
        </div>

        <div class="tfx-pro-stage-note">
          <div class="tfx-pro-stage-note__title">当前阶段观察</div>
          <p>${stageNote}</p>
        </div>
      </div>
    `;
  }

  function createSelfMatrixHTML(mode, item) {
    const focusIdx = item.focusIndex ?? 0;
    const strongByRow = item.matrix.map((row) => Math.max(...row));
    const headers = mode.tokens.map((token) => `<div class="tfx-pro-grid-head">${formatToken(token)}</div>`).join('');
    const rows = item.matrix.map((row, rIdx) => {
      const side = `<button class="tfx-pro-grid-side${rIdx === focusIdx ? ' is-active' : ''}" data-role="self-focus" data-self-focus="${rIdx}" type="button">${formatToken(mode.tokens[rIdx])}</button>`;
      const cells = row.map((value, cIdx) => {
        const intensity = clamp(value, 0, 1);
        const alpha = rIdx === focusIdx ? 0.16 + intensity * 0.78 : 0.08 + intensity * 0.48;
        const bg = `linear-gradient(180deg, rgba(232, 239, 255, ${0.92 - intensity * 0.1}), rgba(123, 102, 240, ${alpha.toFixed(3)}))`;
        const strong = value === strongByRow[rIdx] ? ' is-strong' : '';
        const selected = rIdx === focusIdx ? ' is-selected-row' : '';
        return `<button class="tfx-pro-grid-cell${selected}${strong}" style="background:${bg}" data-role="self-focus" data-self-focus="${rIdx}" type="button">${value >= 0.1 ? `${(value * 100).toFixed(1)}%` : ''}</button>`;
      }).join('');
      return side + cells;
    }).join('');

    return `
      <div class="tfx-pro-grid-legend"><span>低关注</span><div class="tfx-pro-grid-legend__bar"></div><span>高关注</span></div>
      <div class="tfx-pro-grid" style="grid-template-columns: 118px repeat(${mode.tokens.length}, minmax(56px, 1fr));">
        <div class="tfx-pro-grid-corner">Query \ Key</div>
        ${headers}
        ${rows}
      </div>
    `;
  }

  function createVitCanvasHTML(item) {
    return `
      <div class="tfx-pro-visual-board">
        <div class="tfx-pro-visual-board__main">
          <canvas class="tfx-pro-canvas" data-role="vit-canvas" data-vit-id="${item.id}" width="336" height="336"></canvas>
        </div>
        <div class="tfx-pro-head-strip">
          ${item.heads.map((head, idx) => `<button class="tfx-pro-head-card${idx === 0 ? ' is-active' : ''}" data-role="vit-head" data-vit-id="${item.id}" data-vit-head="${idx}" type="button"><span>${head.label}</span><small>${head.note}</small></button>`).join('')}
        </div>
      </div>
    `;
  }

  function createCrossCanvasHTML(item) {
    const tokens = item.tokens.map((token) => `<button class="tfx-pro-token-pill-alt${token === state.crossToken ? ' is-active' : ''}" data-role="cross-token" data-cross-token="${token}" type="button">${token}</button>`).join('');
    const summary = item.regionSummary[state.crossToken] || item.regionSummary[item.tokens[0]];
    return `
      <div class="tfx-pro-cross-layout">
        <div class="tfx-pro-cross-layout__controls">
          <div class="tfx-pro-cross-layout__title">文本 token</div>
          <div class="tfx-pro-token-bank">${tokens}</div>
          <div class="tfx-pro-cross-note">${summary}</div>
        </div>
        <div class="tfx-pro-cross-layout__canvas">
          <canvas class="tfx-pro-canvas" data-role="cross-canvas" data-cross-id="${item.id}" width="336" height="336"></canvas>
        </div>
      </div>
    `;
  }

  function createAttentionLabHTML() {
    const mode = getAttentionMode();
    const item = getAttentionItem();
    const body = mode.key === 'self'
      ? createSelfMatrixHTML(mode, item)
      : mode.key === 'vit'
        ? createVitCanvasHTML(item)
        : createCrossCanvasHTML(item);

    return `
      <div class="tfx-pro-shell tfx-pro-shell--lab">
        <div class="tfx-pro-shell__header tfx-pro-shell__header--stacked">
          <div>
            <div class="tfx-pro-eyebrow">Attention lab</div>
            <h3>${mode.title}</h3>
            <p>${mode.note}</p>
          </div>
          <div class="tfx-pro-mode-tabs">
            ${ATTENTION_LAB.modes.map((entry) => `<button class="tfx-pro-chip${entry.key === mode.key ? ' is-active' : ''}" data-role="attention-mode" data-attention-mode="${entry.key}" type="button">${entry.label}</button>`).join('')}
          </div>
        </div>

        <div class="tfx-pro-lab-grid">
          <section class="tfx-pro-panel">
            <div class="tfx-pro-panel__head">
              <div>
                <div class="tfx-pro-panel__title">Mode snapshots</div>
                <div class="tfx-pro-panel__sub">在同一张实验台上切换文本、视觉与跨模态注意力的不同工作形态。</div>
              </div>
              <div class="tfx-pro-item-tabs">
                ${mode.items.map((entry) => `<button class="tfx-pro-snapshot${entry.id === item.id ? ' is-active' : ''}" data-role="attention-item" data-attention-item="${entry.id}" type="button">${entry.label}</button>`).join('')}
              </div>
            </div>

            <div class="tfx-pro-lab-card">
              <div class="tfx-pro-lab-card__title">${item.title}</div>
              <p>${item.summary}</p>
            </div>

            <div class="tfx-pro-lab-stage">${body}</div>
          </section>

          <aside class="tfx-pro-panel tfx-pro-panel--aside">
            <div class="tfx-pro-side-note">
              <div class="tfx-pro-panel__title">当前模式关注点</div>
              <div class="tfx-pro-side-note__meta">${mode.detailTitle}</div>
              <p>${mode.detailText}</p>
            </div>
            <div class="tfx-pro-side-note">
              <div class="tfx-pro-panel__title">当前样本摘要</div>
              <div class="tfx-pro-side-note__meta">${mode.sourceLabel}</div>
              <p>${item.descriptor || item.label}</p>
            </div>
            <div class="tfx-pro-side-note">
              <div class="tfx-pro-panel__title">你应该看到什么</div>
              <div class="tfx-pro-side-note__meta">${mode.targetsLabel}</div>
              <p>${item.summary}</p>
            </div>
          </aside>
        </div>
      </div>
    `;
  }

  function createInferenceMatrixHTML(snapshot, current) {
    const { rowIdx } = getInferenceRow();
    const strongByRow = snapshot.matrix.map((row) => Math.max(...row.map((value) => value || 0)));
    const headerCells = current.tokens.map((token) => `<div class="tfx-pro-grid-head">${formatToken(token)}</div>`).join('');
    const rows = snapshot.matrix.map((row, rIdx) => {
      const side = `<button class="tfx-pro-grid-side${rIdx === rowIdx ? ' is-active' : ''}" data-role="inference-query" data-inference-query="${rIdx}" type="button">${formatToken(current.tokens[rIdx])}</button>`;
      const cells = row.map((value) => {
        const visible = value || 0;
        const isStrong = visible === strongByRow[rIdx] && visible > 0;
        const selected = rIdx === rowIdx;
        const alpha = selected ? 0.18 + visible * 0.76 : 0.10 + visible * 0.5;
        const bg = visible
          ? `linear-gradient(180deg, rgba(231, 238, 255, ${0.92 - visible * 0.1}), rgba(113, 137, 233, ${alpha.toFixed(3)}))`
          : 'repeating-linear-gradient(135deg, rgba(166,179,206,0.12), rgba(166,179,206,0.12) 6px, rgba(166,179,206,0.03) 6px, rgba(166,179,206,0.03) 12px)';
        return `<button class="tfx-pro-grid-cell${selected ? ' is-selected-row' : ''}${isStrong ? ' is-strong' : ''}${!visible ? ' is-masked' : ''}" style="background:${bg}" data-role="inference-query" data-inference-query="${rIdx}" type="button">${visible >= 0.10 ? `${(visible * 100).toFixed(1)}%` : ''}</button>`;
      }).join('');
      return side + cells;
    }).join('');

    return `
      <div class="tfx-pro-grid-legend"><span>低关注</span><div class="tfx-pro-grid-legend__bar"></div><span>高关注</span></div>
      <div class="tfx-pro-grid" style="grid-template-columns: 112px repeat(${current.tokens.length}, minmax(58px, 1fr));">
        <div class="tfx-pro-grid-corner">Query \ Key</div>
        ${headerCells}
        ${rows}
      </div>
    `;
  }

  function getInferenceTopContext(limit = 4) {
    const current = getInferenceCase();
    const { row } = getInferenceRow();
    return row
      .map((value, idx) => ({ idx, value: value || 0, token: current.tokens[idx] }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);
  }

  function createInferenceHTML() {
    const current = getInferenceCase();
    const snapshot = getInferenceSnapshot();
    const topCandidate = current.top5[0];
    const topContext = getInferenceTopContext();
    const maxContext = topContext[0]?.value || 1;
    const maxProb = Math.max(...current.top5.map((item) => item.prob));
    const { rowIdx } = getInferenceRow();

    return `
      <div class="tfx-pro-shell tfx-pro-shell--inference">
        <div class="tfx-pro-shell__header">
          <div>
            <div class="tfx-pro-eyebrow">Inference & systems</div>
            <h3>把 layer/head 快照、候选词分布与现代推理优化放在同一个解释面板里</h3>
            <p>这里关注的是 Transformer 在自回归生成阶段如何把上下文压缩成 logits，以及为什么现代推理一定会谈到 KV Cache、GQA 与 FlashAttention。</p>
          </div>
          <div class="tfx-pro-meta-card">
            <div class="tfx-pro-meta-card__label">当前最高概率候选</div>
            <div class="tfx-pro-meta-card__token">${formatToken(topCandidate.token)}</div>
            <div class="tfx-pro-meta-card__prob">${(topCandidate.prob * 100).toFixed(2)}%</div>
            <div class="tfx-pro-meta-card__sub">${current.model} · ${current.sampling} · T=${current.temperature}</div>
          </div>
        </div>

        <div class="tfx-pro-hero-tabs">
          ${INFERENCE_CASES.map((item) => `<button class="tfx-pro-chip${item.id === current.id ? ' is-active' : ''}" data-role="inference-case" data-inference-case="${item.id}" type="button">${item.title}</button>`).join('')}
        </div>

        <div class="tfx-pro-prompt-card">
          <div class="tfx-pro-prompt-card__title">Prompt</div>
          <div class="tfx-pro-prompt-card__text">${current.prompt}</div>
          <div class="tfx-pro-token-bank">
            ${current.tokens.map((token, idx) => `<button class="tfx-pro-token-pill-alt${idx === rowIdx ? ' is-active' : ''}" data-role="inference-query" data-inference-query="${idx}" type="button"><span>${formatToken(token)}</span><small>${current.tokenIds[idx]}</small></button>`).join('')}
          </div>
        </div>

        <div class="tfx-pro-lab-grid">
          <section class="tfx-pro-panel">
            <div class="tfx-pro-panel__head">
              <div>
                <div class="tfx-pro-panel__title">Attention snapshots</div>
                <div class="tfx-pro-panel__sub">选择不同 layer/head 快照，观察 attention 如何从局部拼接过渡到最终汇聚。</div>
              </div>
              <div class="tfx-pro-item-tabs">
                ${current.snapshots.map((item) => `<button class="tfx-pro-snapshot${item.key === snapshot.key ? ' is-active' : ''}" data-role="inference-snapshot" data-inference-snapshot="${item.key}" type="button">${item.label}</button>`).join('')}
              </div>
            </div>
            <div class="tfx-pro-lab-card">
              <div class="tfx-pro-lab-card__title">${snapshot.title}</div>
              <p>${snapshot.desc}</p>
            </div>
            <div class="tfx-pro-lab-stage">${createInferenceMatrixHTML(snapshot, current)}</div>
          </section>

          <aside class="tfx-pro-panel tfx-pro-panel--aside">
            <div class="tfx-pro-side-note">
              <div class="tfx-pro-panel__title">当前 Query 的上下文拉取</div>
              <div class="tfx-pro-side-note__meta">row softmax = 1</div>
              <div class="tfx-pro-bars">
                ${topContext.map((item) => `<div class="tfx-pro-bar-row"><span>${formatToken(item.token)}</span><div class="tfx-pro-bar-row__track"><div class="tfx-pro-bar-row__fill" style="width:${(item.value / maxContext * 100).toFixed(2)}%"></div></div><strong>${(item.value * 100).toFixed(2)}%</strong></div>`).join('')}
              </div>
            </div>
            <div class="tfx-pro-side-note">
              <div class="tfx-pro-panel__title">Top candidate distribution</div>
              <div class="tfx-pro-side-note__meta">sampling view</div>
              <div class="tfx-pro-bars">
                ${current.top5.map((item, idx) => `<div class="tfx-pro-bar-row${idx === 0 ? ' is-top' : ''}"><span>${formatToken(item.token)}</span><div class="tfx-pro-bar-row__track"><div class="tfx-pro-bar-row__fill" style="width:${(item.prob / maxProb * 100).toFixed(2)}%"></div></div><strong>${(item.prob * 100).toFixed(2)}%</strong></div>`).join('')}
              </div>
            </div>
            <div class="tfx-pro-side-note">
              <div class="tfx-pro-panel__title">Systems view</div>
              <div class="tfx-pro-side-note__meta">why inference optimization matters</div>
              <div class="tfx-pro-system-cards">
                ${SYSTEM_CARDS.map((card, idx) => `<div class="tfx-pro-system-card${idx === 0 ? ' is-first' : ''}"><div class="tfx-pro-system-card__title">${card.title}</div><p>${card.text}</p></div>`).join('')}
              </div>
            </div>
          </aside>
        </div>

        <div class="tfx-pro-bottom-notes">
          ${snapshot.systems.map((text) => `<div class="tfx-pro-bottom-note"><p>${text}</p></div>`).join('')}
        </div>
      </div>
    `;
  }

  function renderHero(root) {
    root.innerHTML = createHeroHTML();
  }

  function renderAttentionLab(root) {
    root.innerHTML = createAttentionLabHTML();
    drawAttentionCanvases(root);
  }

  function renderInference(root) {
    root.innerHTML = createInferenceHTML();
  }

  function drawAttentionCanvases(root) {
    const mode = getAttentionMode();
    const item = getAttentionItem();
    if (mode.key === 'vit') {
      const canvas = $('[data-role="vit-canvas"]', root);
      if (canvas) drawVitScene(canvas, item, 0);
    }
    if (mode.key === 'cross') {
      const canvas = $('[data-role="cross-canvas"]', root);
      if (canvas) drawCrossScene(canvas, item, state.crossToken);
    }
  }

  function drawVitScene(canvas, item, headIndex) {
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const patch = size / 14;
    ctx.clearRect(0, 0, size, size);
    drawVitBaseScene(ctx, size, item.scene);
    const values = item.focus;
    values.forEach(([x, y, v]) => {
      const alpha = 0.12 + v * 0.5;
      ctx.fillStyle = `rgba(115, 103, 240, ${alpha.toFixed(3)})`;
      ctx.fillRect(x * patch, y * patch, patch, patch);
    });
    const head = item.heads[headIndex] || item.heads[0];
    head.values.forEach(([x, y, v]) => {
      ctx.strokeStyle = `rgba(245, 197, 88, ${clamp(0.25 + v * 0.7, 0, 1)})`;
      ctx.lineWidth = 2.4;
      ctx.strokeRect(x * patch + 1.5, y * patch + 1.5, patch - 3, patch - 3);
    });
    drawPatchGrid(ctx, size, 14);
  }

  function drawVitBaseScene(ctx, size, type) {
    ctx.save();
    if (type === 'cat') {
      const bg = ctx.createLinearGradient(0, 0, 0, size);
      bg.addColorStop(0, '#dbeafe');
      bg.addColorStop(1, '#d4d4d8');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = '#8b5e3c';
      ctx.beginPath();
      ctx.ellipse(size * 0.50, size * 0.58, size * 0.18, size * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(size * 0.50, size * 0.38, size * 0.13, size * 0.11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(size * 0.42, size * 0.31);
      ctx.lineTo(size * 0.37, size * 0.21);
      ctx.lineTo(size * 0.46, size * 0.28);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(size * 0.58, size * 0.31);
      ctx.lineTo(size * 0.63, size * 0.21);
      ctx.lineTo(size * 0.54, size * 0.28);
      ctx.fill();
    } else if (type === 'city') {
      ctx.fillStyle = '#dbeafe';
      ctx.fillRect(0, 0, size, size * 0.42);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(0, size * 0.42, size, size * 0.58);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(size * 0.06, size * 0.18, size * 0.18, size * 0.46);
      ctx.fillStyle = '#7c8ea6';
      ctx.fillRect(size * 0.30, size * 0.14, size * 0.18, size * 0.5);
      ctx.fillStyle = '#475569';
      ctx.fillRect(size * 0.62, size * 0.10, size * 0.26, size * 0.56);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(size * 0.40, size * 0.66, size * 0.05, size * 0.16);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(size * 0.69, size * 0.65, size * 0.05, size * 0.17);
    } else {
      const bg = ctx.createRadialGradient(size * 0.5, size * 0.5, 0, size * 0.5, size * 0.5, size * 0.55);
      bg.addColorStop(0, '#fef08a');
      bg.addColorStop(1, '#365314');
      ctx.fillStyle = '#365314';
      ctx.fillRect(0, 0, size, size);
      const colors = ['#fb7185', '#f472b6', '#f9a8d4', '#f43f5e', '#fda4af'];
      for (let i = 0; i < 5; i += 1) {
        const angle = (i / 5) * Math.PI * 2;
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.ellipse(size * 0.5 + Math.cos(angle) * size * 0.18, size * 0.5 + Math.sin(angle) * size * 0.18, size * 0.12, size * 0.08, angle, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(size * 0.5, size * 0.5, size * 0.08, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawCrossScene(canvas, item, token) {
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const grid = 7;
    const cell = size / grid;
    ctx.clearRect(0, 0, size, size);
    drawCrossBaseScene(ctx, size);
    const values = item.maps[token] || item.maps[item.tokens[0]];
    values.forEach(([x, y, v]) => {
      const alpha = 0.15 + v * 0.52;
      ctx.fillStyle = `rgba(234, 88, 12, ${alpha.toFixed(3)})`;
      ctx.fillRect(x * cell, y * cell, cell, cell);
      if (v > 0.82) {
        ctx.strokeStyle = `rgba(251, 191, 36, ${clamp(0.35 + v * 0.5, 0, 1)})`;
        ctx.lineWidth = 2.2;
        ctx.strokeRect(x * cell + 1.5, y * cell + 1.5, cell - 3, cell - 3);
      }
    });
    drawPatchGrid(ctx, size, grid);
  }

  function drawCrossBaseScene(ctx, size) {
    ctx.fillStyle = '#bfdbfe';
    ctx.fillRect(0, 0, size, size * 0.46);
    ctx.fillStyle = '#a16207';
    ctx.fillRect(0, size * 0.46, size, size * 0.54);
    ctx.fillStyle = '#dbeafe';
    ctx.fillRect(size * 0.68, size * 0.16, size * 0.24, size * 0.36);
    ctx.strokeStyle = '#7c2d12';
    ctx.lineWidth = 4;
    ctx.strokeRect(size * 0.68, size * 0.16, size * 0.24, size * 0.36);
    ctx.beginPath();
    ctx.moveTo(size * 0.80, size * 0.16);
    ctx.lineTo(size * 0.80, size * 0.52);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(size * 0.68, size * 0.34);
    ctx.lineTo(size * 0.92, size * 0.34);
    ctx.stroke();
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.ellipse(size * 0.40, size * 0.60, size * 0.16, size * 0.18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(size * 0.40, size * 0.36, size * 0.11, size * 0.09, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawPatchGrid(ctx, size, divisions) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    ctx.lineWidth = 1;
    const cell = size / divisions;
    for (let i = 0; i <= divisions; i += 1) {
      const offset = i * cell;
      ctx.beginPath();
      ctx.moveTo(offset, 0);
      ctx.lineTo(offset, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, offset);
      ctx.lineTo(size, offset);
      ctx.stroke();
    }
    ctx.restore();
  }

  function bindHero(root) {
    root.addEventListener('click', (event) => {
      const target = event.target.closest('[data-role]');
      if (!target) return;
      if (target.dataset.role === 'hero-case') {
        state.heroIndex = Number(target.dataset.heroIndex);
        renderHero(root);
      }
      if (target.dataset.role === 'hero-stage') {
        state.heroStage = target.dataset.heroStage;
        renderHero(root);
      }
    });
  }

  function bindAttentionLab(root) {
    root.addEventListener('click', (event) => {
      const target = event.target.closest('[data-role]');
      if (!target) return;
      if (target.dataset.role === 'attention-mode') {
        state.attentionMode = target.dataset.attentionMode;
        const mode = getAttentionMode();
        state.attentionItemId = mode.items[0].id;
        if (mode.key === 'cross') {
          state.crossToken = mode.items[0].tokens[3];
        }
        renderAttentionLab(root);
        return;
      }
      if (target.dataset.role === 'attention-item') {
        state.attentionItemId = target.dataset.attentionItem;
        const mode = getAttentionMode();
        if (mode.key === 'cross') {
          const item = getAttentionItem();
          state.crossToken = item.tokens[3];
        }
        renderAttentionLab(root);
        return;
      }
      if (target.dataset.role === 'self-focus') {
        const item = getAttentionItem();
        item.focusIndex = Number(target.dataset.selfFocus);
        renderAttentionLab(root);
        return;
      }
      if (target.dataset.role === 'vit-head') {
        const canvas = $('[data-role="vit-canvas"]', root);
        const current = getAttentionItem();
        $$('.tfx-pro-head-card', root).forEach((node, idx) => {
          node.classList.toggle('is-active', idx === Number(target.dataset.vitHead));
        });
        if (canvas) drawVitScene(canvas, current, Number(target.dataset.vitHead));
        return;
      }
      if (target.dataset.role === 'cross-token') {
        state.crossToken = target.dataset.crossToken;
        renderAttentionLab(root);
      }
    });
  }

  function bindInference(root) {
    root.addEventListener('click', (event) => {
      const target = event.target.closest('[data-role]');
      if (!target) return;
      if (target.dataset.role === 'inference-case') {
        state.inferenceCaseId = target.dataset.inferenceCase;
        const current = getInferenceCase();
        state.inferenceSnapshotKey = current.snapshots[current.snapshots.length - 1].key;
        state.inferenceQueryIdx = current.tokens.length - 1;
        renderInference(root);
        return;
      }
      if (target.dataset.role === 'inference-snapshot') {
        state.inferenceSnapshotKey = target.dataset.inferenceSnapshot;
        renderInference(root);
        return;
      }
      if (target.dataset.role === 'inference-query') {
        state.inferenceQueryIdx = Number(target.dataset.inferenceQuery);
        renderInference(root);
      }
    });
  }

  function initHero() {
    const root = document.getElementById('tfx-pro-hero');
    if (!root || root.dataset.tfxProReady === 'true') return;
    root.dataset.tfxProReady = 'true';
    renderHero(root);
    bindHero(root);
  }

  function initAttentionLab() {
    const root = document.getElementById('tfx-pro-attention-lab');
    if (!root || root.dataset.tfxProReady === 'true') return;
    root.dataset.tfxProReady = 'true';
    renderAttentionLab(root);
    bindAttentionLab(root);
  }

  function initInference() {
    const root = document.getElementById('tfx-pro-inference');
    if (!root || root.dataset.tfxProReady === 'true') return;
    root.dataset.tfxProReady = 'true';
    const current = getInferenceCase();
    state.inferenceQueryIdx = current.tokens.length - 1;
    renderInference(root);
    bindInference(root);
  }

  function initAll() {
    initHero();
    initAttentionLab();
    initInference();
  }

  if (!window.__tfxProPjaxBound) {
    document.addEventListener('pjax:complete', initAll);
    window.__tfxProPjaxBound = true;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll, { once: true });
  } else {
    initAll();
  }
})();
