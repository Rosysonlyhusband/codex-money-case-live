const leads = [
  {
    id: "L-2401",
    name: "陈女士",
    channel: "官网表单",
    time: "09:12",
    intent: "高",
    childAge: "7 岁",
    city: "杭州",
    budget: "3000-5000 元/月",
    need: "希望给孩子找自然拼读和口语课，最好这周末能试听，预算每月 3000 到 5000。",
    urgency: "本周试听",
    source: "搜索广告",
    tags: ["自然拼读", "口语", "周末试听"],
    next: ["10 分钟内电话联系", "发送周末试听课排期", "询问孩子英语基础和可上课时间"],
  },
  {
    id: "L-2402",
    name: "王先生",
    channel: "微信咨询",
    time: "10:34",
    intent: "中",
    childAge: "9 岁",
    city: "上海",
    budget: "待确认",
    need: "想了解线上课和线下课差别，孩子三年级，之前学过一点英语，不确定是否适合长期班。",
    urgency: "两周内决策",
    source: "老学员转介绍",
    tags: ["线上线下对比", "三年级", "长期班"],
    next: ["发送课程对比表", "邀约 15 分钟测评", "追问通勤距离和学习目标"],
  },
  {
    id: "L-2403",
    name: "李女士",
    channel: "抖音私信",
    time: "11:08",
    intent: "低",
    childAge: "5 岁",
    city: "苏州",
    budget: "1000 元以内/月",
    need: "先看看价格，孩子还小，主要想培养兴趣，暂时不着急报名。",
    urgency: "暂不紧急",
    source: "短视频",
    tags: ["启蒙", "价格敏感", "兴趣培养"],
    next: ["发送启蒙体验课", "加入低频跟进名单", "3 天后推送家长公开课"],
  },
  {
    id: "L-2404",
    name: "赵先生",
    channel: "客服转录",
    time: "13:26",
    intent: "高",
    childAge: "10 岁",
    city: "南京",
    budget: "可接受一对一",
    need: "孩子准备明年参加国际学校面试，需要提升听说表达，想尽快安排老师测评。",
    urgency: "今天安排",
    source: "朋友推荐",
    tags: ["国际学校", "一对一", "面试"],
    next: ["立即分配资深顾问", "确认目标学校", "安排今天晚间测评"],
  },
];

const leadList = document.querySelector("#leadList");
const detailPanel = document.querySelector("#detailPanel");
const searchInput = document.querySelector("#searchInput");
const intentFilter = document.querySelector("#intentFilter");
const exportBtn = document.querySelector("#exportBtn");
const copyPitchBtn = document.querySelector("#copyPitchBtn");
const toast = document.querySelector("#toast");

let selectedId = leads[0].id;

function intentClass(intent) {
  if (intent === "高") return "high";
  if (intent === "中") return "mid";
  return "low";
}

function buildReply(lead) {
  const urgencyLine =
    lead.intent === "高"
      ? "我这边可以先帮您锁定一个近期试听/测评名额。"
      : "我先把适合您情况的课程信息整理给您，您可以对比后再决定。";

  return `${lead.name}您好，看到您主要关注${lead.tags.join("、")}。${urgencyLine}

根据孩子 ${lead.childAge}、目前需求“${lead.need}”，建议先做一次 15 分钟水平测评，再匹配班型和老师。

方便的话，我可以现在发您一份课程安排，并确认一个适合的沟通时间。`;
}

function filteredLeads() {
  const query = searchInput.value.trim().toLowerCase();
  const intent = intentFilter.value;

  return leads.filter((lead) => {
    const text = `${lead.name} ${lead.channel} ${lead.need} ${lead.city} ${lead.tags.join(" ")}`.toLowerCase();
    const matchesQuery = !query || text.includes(query);
    const matchesIntent = intent === "all" || lead.intent === intent;
    return matchesQuery && matchesIntent;
  });
}

function renderList() {
  const visibleLeads = filteredLeads();
  if (!visibleLeads.some((lead) => lead.id === selectedId)) {
    selectedId = visibleLeads[0]?.id ?? "";
  }

  leadList.innerHTML = visibleLeads
    .map(
      (lead) => `
        <button class="lead-card ${lead.id === selectedId ? "selected" : ""}" type="button" data-id="${lead.id}">
          <div class="lead-card-header">
            <strong>${lead.name}</strong>
            <span class="intent ${intentClass(lead.intent)}">${lead.intent}意向</span>
          </div>
          <p>${lead.need}</p>
          <div class="lead-meta">
            <span>${lead.channel}</span>
            <span>${lead.time}</span>
            <span>${lead.city}</span>
          </div>
        </button>
      `,
    )
    .join("");

  if (!visibleLeads.length) {
    leadList.innerHTML = `<div class="empty-state"><strong>没有匹配咨询</strong><p>换个关键词或筛选条件试试。</p></div>`;
  }

  renderDetail();
}

function renderDetail() {
  const lead = leads.find((item) => item.id === selectedId);
  if (!lead) {
    detailPanel.innerHTML = `<div class="empty-state"><strong>暂无咨询</strong><p>清空筛选条件后再查看。</p></div>`;
    return;
  }

  detailPanel.innerHTML = `
    <div class="detail-header">
      <div>
        <h2>${lead.name}</h2>
        <p>${lead.channel} · ${lead.time} · ${lead.source}</p>
      </div>
      <span class="intent ${intentClass(lead.intent)}">${lead.intent}意向</span>
    </div>

    <div class="message-box">${lead.need}</div>

    <div class="analysis-grid">
      <div><span>城市</span><strong>${lead.city}</strong></div>
      <div><span>孩子年龄</span><strong>${lead.childAge}</strong></div>
      <div><span>预算</span><strong>${lead.budget}</strong></div>
      <div><span>紧急程度</span><strong>${lead.urgency}</strong></div>
    </div>

    <section class="reply-box">
      <h3>AI 回复草稿</h3>
      <div class="reply-text" id="replyText">${buildReply(lead)}</div>
      <div class="reply-actions">
        <button class="secondary-action" type="button" id="copyReplyBtn">复制回复</button>
      </div>
    </section>

    <section class="next-steps">
      <h3>建议跟进动作</h3>
      <ul>
        ${lead.next.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    </section>
  `;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function downloadCsv() {
  const rows = [
    ["编号", "姓名", "渠道", "意向", "城市", "预算", "紧急程度", "需求"],
    ...leads.map((lead) => [
      lead.id,
      lead.name,
      lead.channel,
      lead.intent,
      lead.city,
      lead.budget,
      lead.urgency,
      lead.need,
    ]),
  ];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "ai-leads-demo.csv";
  link.click();
  URL.revokeObjectURL(url);
  showToast("线索 CSV 已生成");
}

async function copyText(text, successMessage) {
  await navigator.clipboard.writeText(text);
  showToast(successMessage);
}

leadList.addEventListener("click", (event) => {
  const card = event.target.closest(".lead-card");
  if (!card) return;
  selectedId = card.dataset.id;
  renderList();
});

detailPanel.addEventListener("click", (event) => {
  if (event.target.id !== "copyReplyBtn") return;
  const replyText = document.querySelector("#replyText")?.textContent.trim();
  if (replyText) copyText(replyText, "回复草稿已复制");
});

searchInput.addEventListener("input", renderList);
intentFilter.addEventListener("change", renderList);
exportBtn.addEventListener("click", downloadCsv);

copyPitchBtn.addEventListener("click", () => {
  const pitch =
    "我可以帮你把每天分散在微信、官网和表单里的客户咨询自动整理成线索表，系统会标注高意向客户、生成回复草稿，并提醒销售下一步怎么跟进。通常 5 天可以交付轻量版，适合先从一个咨询入口开始试。";
  copyText(pitch, "销售话术已复制");
});

renderList();
