import type { CompanyContext } from "@/lib/agents";

const ICONS: Record<string, string> = {
  route:
    '<circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M8.5 19h5a4 4 0 0 0 0-8h-3a4 4 0 0 1 0-8h5"/>',
  layers:
    '<path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="m3 13 9 5 9-5"/><path d="m3 18 9 5 9-5"/>',
  shield:
    '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z"/><path d="m9 12 2 2 4-4"/>',
  target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15M15 6v15"/>',
  bell: '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M16 3v4M8 3v4M3 11h18"/>',
  heart: '<path d="M12 20s-7-4.5-7-9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7 3.5C19 15.5 12 20 12 20Z"/>',
  sparkles: '<path d="M12 3l1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3Z"/><path d="M19 15l.9 2.2L22 18l-2.1.8L19 21l-.9-2.2L16 18l2.1-.8L19 15Z"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 5a3 3 0 0 1 0 6M18 20a5.5 5.5 0 0 0-3-4.9"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  wallet: '<path d="M3 7a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/><path d="M16 12h4M3 9h18"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  zap: '<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/>',
  package: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4 7.5 8 4.5 8-4.5M12 21v-9"/>',
  leaf: '<path d="M4 20c0-8 5-13 16-15 1 10-4 15-12 15"/><path d="M8 20c1-4 4-6 8-8"/>',
};

function iconSvg(name: string): string {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] ?? ICONS.sparkles}</svg>`;
}

function esc(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildLandingHtml(ctx: CompanyContext): string {
  const p = ctx.pack;
  const name = esc(ctx.name);
  const latin = esc(ctx.latin);
  const tagline = esc(ctx.tagline);

  const features = p.features
    .slice(0, 3)
    .map(
      (f, i) => `
        <article class="card feature">
          <div class="ficon">${iconSvg(f.icon)}</div>
          <div class="fnum">0${i + 1}</div>
          <h3>${esc(f.title)}</h3>
          <p>${esc(f.desc)}</p>
        </article>`,
    )
    .join("");

  const steps = p.steps
    .map(
      (s, i) => `
        <div class="step">
          <span class="stepnum">${String(i + 1).padStart(2, "0")}</span>
          <h4>${esc(s.title)}</h4>
          <p>${esc(s.desc)}</p>
        </div>`,
    )
    .join("");

  const metrics = p.metrics
    .map(
      (m) => `
        <div class="metric">
          <strong>${esc(m.value)}</strong>
          <span>${esc(m.label)}</span>
        </div>`,
    )
    .join("");

  const rows = p.previewRows
    .map(
      (r) => `
        <div class="row">
          <span class="dot"></span>
          <div class="rowmain">
            <b>${esc(r.label)}</b>
            <small>${esc(r.meta)}</small>
          </div>
          <em>${esc(r.tag)}</em>
        </div>`,
    )
    .join("");

  const tiers = p.pricing
    .map(
      (t) => `
        <article class="card tier ${t.featured ? "featured" : ""}">
          ${t.featured ? '<span class="tierbadge">最受欢迎</span>' : ""}
          <h4>${esc(t.name)}</h4>
          <div class="price"><strong>${esc(t.price)}</strong><span>${esc(t.unit)}</span></div>
          <p class="tierdesc">${esc(t.desc)}</p>
          <ul>${t.perks.map((perk) => `<li>${esc(perk)}</li>`).join("")}</ul>
          <button class="btn ${t.featured ? "primary" : "ghost"} full" data-toast="${esc(t.name)} 已加入演示候补">选择 ${esc(t.name)}</button>
        </article>`,
    )
    .join("");

  const seo = p.seo.map((k) => `<span class="tag">${esc(k)}</span>`).join("");

  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="description" content="${esc(p.subline)}" />
<title>${name} · ${tagline}</title>
<style>
  :root{
    --from:${p.palette.from};
    --to:${p.palette.to};
    --glow:${p.palette.glow};
    --bg:#05060b;
    --fg:#f4f4fb;
    --muted:#a2a3bb;
    --line:rgba(255,255,255,.09);
    --card:rgba(255,255,255,.032);
  }
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{
    background:var(--bg);color:var(--fg);
    font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;
    -webkit-font-smoothing:antialiased;line-height:1.6;overflow-x:hidden;
  }
  a{color:inherit;text-decoration:none}
  .orb{position:fixed;border-radius:50%;filter:blur(90px);pointer-events:none;z-index:0;opacity:.55}
  .orb.a{width:520px;height:520px;top:-160px;left:-120px;background:var(--from);opacity:.22}
  .orb.b{width:460px;height:460px;top:120px;right:-160px;background:var(--to);opacity:.16}
  .gridveil{position:fixed;inset:0;z-index:0;pointer-events:none;
    background-image:linear-gradient(to right,rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,.035) 1px,transparent 1px);
    background-size:52px 52px;
    mask-image:radial-gradient(ellipse 75% 55% at 50% 25%,#000 25%,transparent 100%);
    -webkit-mask-image:radial-gradient(ellipse 75% 55% at 50% 25%,#000 25%,transparent 100%);
  }
  .wrap{max-width:1120px;margin:0 auto;padding:0 24px;position:relative;z-index:1}
  header{position:sticky;top:0;z-index:20;backdrop-filter:blur(18px);background:rgba(5,6,11,.62);border-bottom:1px solid rgba(255,255,255,.05)}
  .nav{display:flex;align-items:center;justify-content:space-between;height:64px}
  .brand{display:flex;align-items:center;gap:10px;font-weight:600;letter-spacing:-.01em}
  .mark{width:28px;height:28px;border-radius:9px;background:linear-gradient(135deg,var(--from),var(--to));box-shadow:0 8px 26px -10px var(--to)}
  .navlinks{display:flex;gap:26px;font-size:13px;color:var(--muted)}
  .navlinks a:hover{color:#fff}
  .navcta{font-size:13px;padding:8px 14px;border-radius:999px;border:1px solid var(--line);background:rgba(255,255,255,.04)}
  .navcta:hover{background:rgba(255,255,255,.09)}
  .hero{display:grid;grid-template-columns:1.04fr .96fr;gap:56px;align-items:center;padding:74px 0 64px}
  .eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:#cfc9ff;
    border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.045);padding:6px 12px;border-radius:999px}
  .eyebrow i{width:6px;height:6px;border-radius:50%;background:var(--to);box-shadow:0 0 12px var(--to);font-style:normal}
  h1{font-size:clamp(34px,4.3vw,58px);line-height:1.08;letter-spacing:-.03em;margin:22px 0 18px;font-weight:650}
  h1 .grad{background:linear-gradient(100deg,var(--from),var(--to));-webkit-background-clip:text;background-clip:text;color:transparent}
  .lede{color:var(--muted);font-size:16px;max-width:34em}
  .actions{display:flex;gap:12px;margin-top:28px;flex-wrap:wrap}
  .btn{border:0;cursor:pointer;font:inherit;font-size:14px;font-weight:550;padding:12px 20px;border-radius:12px;transition:.2s}
  .btn.primary{background:linear-gradient(100deg,var(--from),var(--to));color:#fff;box-shadow:0 14px 40px -16px var(--to)}
  .btn.primary:hover{filter:brightness(1.1);transform:translateY(-1px)}
  .btn.ghost{background:rgba(255,255,255,.045);color:#e8e8f5;border:1px solid var(--line)}
  .btn.ghost:hover{background:rgba(255,255,255,.09)}
  .btn.full{width:100%;margin-top:18px}
  .metrics{display:flex;gap:36px;margin-top:44px;padding-top:24px;border-top:1px solid rgba(255,255,255,.06);flex-wrap:wrap}
  .metric strong{display:block;font-size:24px;letter-spacing:-.02em;font-weight:600}
  .metric span{font-size:12px;color:var(--muted)}
  .app{position:relative;border-radius:22px;border:1px solid rgba(255,255,255,.1);
    background:linear-gradient(165deg,rgba(255,255,255,.075),rgba(255,255,255,.02));
    padding:16px;box-shadow:0 40px 90px -50px rgba(0,0,0,.95),0 0 70px -30px var(--glow)}
  .appbar{display:flex;align-items:center;gap:6px;margin-bottom:14px}
  .appbar i{width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,.16);font-style:normal}
  .appbar span{margin-left:auto;font-size:11px;color:var(--muted);letter-spacing:.06em}
  .appbody{border-radius:14px;border:1px solid rgba(255,255,255,.06);background:rgba(8,9,16,.7);padding:14px}
  .apptitle{display:flex;align-items:center;justify-content:space-between;font-size:12.5px;color:#d9d9ea;margin-bottom:12px}
  .apptitle em{font-style:normal;font-size:10.5px;color:var(--muted);border:1px solid var(--line);padding:2px 8px;border-radius:999px}
  .row{display:flex;align-items:center;gap:11px;padding:11px 10px;border-radius:11px;border:1px solid transparent;transition:.2s}
  .row:hover{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.07)}
  .dot{width:7px;height:7px;border-radius:50%;background:var(--to);box-shadow:0 0 10px var(--to);flex:none}
  .rowmain{min-width:0;flex:1}
  .rowmain b{display:block;font-size:12.8px;font-weight:520;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .rowmain small{font-size:11px;color:var(--muted)}
  .row em{font-style:normal;font-size:10.5px;color:#d8d4ff;background:rgba(139,92,246,.14);border:1px solid rgba(139,92,246,.25);padding:3px 8px;border-radius:999px;white-space:nowrap}
  .appfoot{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:12px;padding:10px 12px;border-radius:11px;border:1px dashed rgba(255,255,255,.13);font-size:11.5px;color:var(--muted)}
  .pulse{display:inline-flex;align-items:center;gap:6px}
  .pulse i{width:6px;height:6px;border-radius:50%;background:#4ade80;box-shadow:0 0 10px #4ade80;font-style:normal;animation:pulse 1.8s infinite}
  @keyframes pulse{50%{opacity:.35}}
  section{padding:66px 0;position:relative;z-index:1}
  .sechead{max-width:640px;margin-bottom:34px}
  .kicker{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#b9b1ff}
  h2{font-size:clamp(26px,3vw,38px);letter-spacing:-.025em;line-height:1.2;margin-top:10px;font-weight:620}
  .sub{color:var(--muted);font-size:14px;margin-top:12px}
  .grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
  .card{border-radius:18px;border:1px solid rgba(255,255,255,.08);background:var(--card);padding:22px;position:relative;overflow:hidden;transition:.25s}
  .card:hover{border-color:rgba(255,255,255,.18);transform:translateY(-3px);background:rgba(255,255,255,.05)}
  .feature h3{font-size:16px;margin:14px 0 8px;letter-spacing:-.01em;font-weight:600}
  .feature p{font-size:13px;color:var(--muted);line-height:1.7}
  .ficon{width:38px;height:38px;border-radius:11px;display:grid;place-items:center;color:#fff;
    background:linear-gradient(140deg,rgba(255,255,255,.14),rgba(255,255,255,.03));border:1px solid rgba(255,255,255,.1)}
  .ficon svg{width:19px;height:19px}
  .fnum{position:absolute;top:18px;right:20px;font-size:11px;color:rgba(255,255,255,.24);letter-spacing:.1em}
  .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:8px}
  .step{border-left:1px solid rgba(255,255,255,.1);padding:4px 0 4px 20px;position:relative}
  .step:before{content:"";position:absolute;left:-3px;top:9px;width:5px;height:5px;border-radius:50%;background:linear-gradient(var(--from),var(--to));box-shadow:0 0 12px var(--to)}
  .stepnum{font-size:11px;color:#a9a2e6;letter-spacing:.16em}
  .step h4{font-size:15px;margin:8px 0 6px;font-weight:580}
  .step p{font-size:12.8px;color:var(--muted)}
  .pricing{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;align-items:stretch}
  .tier{display:flex;flex-direction:column}
  .tier h4{font-size:14px;color:#e6e4ff;font-weight:560}
  .price{display:flex;align-items:baseline;gap:5px;margin:12px 0 6px}
  .price strong{font-size:30px;letter-spacing:-.03em;font-weight:640}
  .price span{font-size:12px;color:var(--muted)}
  .tierdesc{font-size:12px;color:var(--muted)}
  .tier ul{list-style:none;margin:16px 0 0;display:grid;gap:9px}
  .tier li{font-size:12.5px;color:#cfcfe2;padding-left:18px;position:relative}
  .tier li:before{content:"";position:absolute;left:0;top:7px;width:8px;height:8px;border-radius:3px;background:linear-gradient(135deg,var(--from),var(--to));opacity:.85}
  .tier.featured{border-color:transparent;background:linear-gradient(160deg,rgba(139,92,246,.16),rgba(255,255,255,.03));box-shadow:0 24px 70px -40px var(--to)}
  .tier.featured:before{content:"";position:absolute;inset:0;border-radius:18px;padding:1px;background:linear-gradient(140deg,var(--from),var(--to));
    -webkit-mask:linear-gradient(#000,#000) content-box,linear-gradient(#000,#000);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}
  .tierbadge{position:absolute;top:16px;right:16px;font-size:10px;padding:3px 9px;border-radius:999px;color:#fff;background:linear-gradient(100deg,var(--from),var(--to))}
  footer{border-top:1px solid rgba(255,255,255,.06);padding:32px 0 40px;position:relative;z-index:1}
  .foot{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;align-items:center}
  .foot .brand{font-size:14px}
  .tags{display:flex;gap:8px;flex-wrap:wrap}
  .tag{font-size:11px;color:var(--muted);border:1px solid var(--line);padding:3px 9px;border-radius:999px}
  .made{font-size:11px;color:rgba(255,255,255,.3);margin-top:16px}
  #toast{position:fixed;left:50%;bottom:28px;transform:translate(-50%,20px);opacity:0;pointer-events:none;z-index:50;
    background:rgba(20,18,33,.92);border:1px solid rgba(139,92,246,.4);color:#f0eeff;font-size:12.5px;
    padding:10px 18px;border-radius:999px;backdrop-filter:blur(14px);transition:.28s;box-shadow:0 20px 50px -20px rgba(0,0,0,.9)}
  #toast.on{opacity:1;transform:translate(-50%,0)}
  @media(max-width:900px){
    .hero{grid-template-columns:1fr;gap:34px;padding:44px 0 30px}
    .grid3,.pricing,.steps{grid-template-columns:1fr}
    .navlinks{display:none}
    .metrics{gap:22px}
    section{padding:48px 0}
  }
</style>
</head>
<body>
  <div class="orb a"></div><div class="orb b"></div><div class="gridveil"></div>

  <header>
    <div class="wrap nav">
      <div class="brand"><span class="mark"></span>${name}<span style="color:var(--muted);font-size:11px;letter-spacing:.16em">${latin}</span></div>
      <nav class="navlinks">
        <a href="#features">能力</a><a href="#how">怎么用</a><a href="#pricing">价格</a>
      </nav>
      <a class="navcta" href="#pricing">${esc(p.cta)}</a>
    </div>
  </header>

  <main>
    <section class="wrap hero">
      <div>
        <span class="eyebrow"><i></i>内测中 · ${latin}</span>
        <h1>${esc(p.heroLead)}<br /><span class="grad">${esc(p.heroAccent)}</span></h1>
        <p class="lede">${esc(p.subline)}</p>
        <div class="actions">
          <button class="btn primary" data-toast="演示环境 · 已记录你的体验意向">${esc(p.cta)}</button>
          <button class="btn ghost" data-toast="演示环境 · 这里会播放一段产品导览">${esc(p.secondaryCta)}</button>
        </div>
        <div class="metrics">${metrics}</div>
      </div>
      <div class="app">
        <div class="appbar"><i></i><i></i><i></i><span>${latin} · LIVE</span></div>
        <div class="appbody">
          <div class="apptitle">${esc(p.previewTitle)}<em>实时</em></div>
          ${rows}
          <div class="appfoot">
            <span class="pulse"><i></i>3 个动作正在进行</span>
            <span>更新于刚刚</span>
          </div>
        </div>
      </div>
    </section>

    <section class="wrap" id="features">
      <div class="sechead">
        <p class="kicker">Core</p>
        <h2>三件事做好，就够了</h2>
        <p class="sub">${esc(p.promise)}</p>
      </div>
      <div class="grid3">${features}</div>
    </section>

    <section class="wrap" id="how">
      <div class="sechead">
        <p class="kicker">How it works</p>
        <h2>从第一次点击，到拿到结果</h2>
      </div>
      <div class="steps">${steps}</div>
    </section>

    <section class="wrap" id="pricing">
      <div class="sechead">
        <p class="kicker">Pricing</p>
        <h2>先免费跑通，再按需升级</h2>
        <p class="sub">价格是演示数据，用于验证付费意愿与分层设计。</p>
      </div>
      <div class="pricing">${tiers}</div>
    </section>
  </main>

  <footer>
    <div class="wrap">
      <div class="foot">
        <div class="brand"><span class="mark"></span>${name}</div>
        <div class="tags">${seo}</div>
      </div>
      <p class="made">本页面由 Atoms-Mini 多智能体协作生成 · 产品、研发、运营三方交接产物 · 演示环境</p>
    </div>
  </footer>

  <div id="toast"></div>
  <script>
    (function(){
      var t=document.getElementById('toast'),timer=null;
      function show(msg){t.textContent=msg;t.classList.add('on');clearTimeout(timer);timer=setTimeout(function(){t.classList.remove('on')},2200)}
      document.querySelectorAll('[data-toast]').forEach(function(el){
        el.addEventListener('click',function(){show(el.getAttribute('data-toast')||'已记录')});
      });
      document.querySelectorAll('a[href^="#"]').forEach(function(a){
        a.addEventListener('click',function(e){
          var id=a.getAttribute('href');var el=id.length>1?document.querySelector(id):null;
          if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth',block:'start'})}
        });
      });
    })();
  </script>
</body>
</html>`;
}
