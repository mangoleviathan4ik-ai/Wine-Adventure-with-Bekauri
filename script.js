const IMG={mtsvane:"images/mtsvane.jpg",mtsvaneq:"images/mtsvaneq.jpg",amber:"images/amber.jpg",mukuzani:"images/mukuzani.jpg",saperavi:"images/saperavi.jpg",alazani:"images/alazani.jpg"};
const W=[
{id:"mtsvane",n:"Mtsvane",b:"Kopisa",d:"Сухое белое · 14% · Mtsvane. Зелёное яблоко, лимонная цедра",c:"#dfe49a",img:1},
{id:"mtsvaneq",n:"Mtsvane Qvevri",b:"Borbalo",d:"Сухое белое · 13% · Mtsvane. Цитрус, травяные ноты",c:"#c9d27a",img:1},
{id:"amber",n:"Traditional Amber",b:"Kvetera",d:"Сухое янтарное · 13.5% · Rkatsiteli. Курага, грецкий орех, мёд",c:"#d9922f",img:1},
{id:"mukuzani",n:"Mukuzani",b:"Borbalo",d:"Сухое красное · 13% · Saperavi. Тёмные ягоды, табак, кедр",c:"#7a1230",img:1},
{id:"saperavi",n:"Saperavi Qvevri",b:"Borbalo",d:"Сухое красное · 13% · Saperavi. Ежевика, слива, минеральность",c:"#5a0e26",img:1},
{id:"alazani",n:"Alazani Valley White",b:"Kopisa",d:"Полусладкое белое · 12% · Rkatsiteli. Персик, груша, цветы",c:"#e6d27a",img:1}];
const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const LS={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
let me={name:LS.get("wn")||"",r:JSON.parse(LS.get("wr")||"{}"),c:JSON.parse(LS.get("wc")||"{}"),saved:JSON.parse(LS.get("ws")||"{}")};
let all=[],tab="v",uid=null,col=null,mode="local";
const store={async init(){try{const [db,u]=await Promise.all([claude.use("db"),claude.use("user")]);if(!db||!u)return;uid=await u.id();if(!uid)return;col=db.collection("votes");mode="live";col.onSnapshot(s=>{all=s.docs.map(d=>d.data()).filter(Boolean);if(tab==="r")renderRes()},()=>{});render()}catch(e){}},
async save(){const doc={name:me.name,r:me.saved,c:me.c,t:Date.now()};
 // публикуем только сохранённые оценки
 doc.r={};doc.cc={};for(const k in me.saved){doc.r[k]=me.r[k];doc.cc[k]=me.c[k]||""}delete doc.c;
 if(col&&uid)await col.doc(uid).set(doc);else{all=[{...doc,_me:1}];}}};
function glass(i,on,c){return `<svg viewBox="0 0 40 60"><defs><clipPath id="cp${i}${c}"><path d="M5 4h30l-3 28c-.6 6-6 10-12 10S8.6 38 8 32z"/></clipPath></defs><g clip-path="url(#cp${i}${c})"><rect class="lv" x="0" y="12" width="40" height="46" fill="${c}" style="transform:translateY(${on?0:32}px)"/></g><path d="M5 4h30l-3 28c-.6 6-6 10-12 10S8.6 38 8 32z" fill="none" stroke="#e8d9cf" stroke-width="1.8"/><path d="M20 42v12M12 56h16" stroke="#e8d9cf" stroke-width="1.8" fill="none"/></svg>`}
const bottleSvg=c=>`<svg viewBox="0 0 40 120"><rect x="15" y="2" width="10" height="26" rx="3" fill="${c}"/><path d="M15 26h10c8 12 10 20 10 36v50a6 6 0 0 1-6 6H11a6 6 0 0 1-6-6V62c0-16 2-24 10-36z" fill="${c}" stroke="#0004"/><rect x="9" y="68" width="22" height="30" rx="3" fill="#f6ece4" opacity=".85"/></svg>`;
const words=["","Не моё","Скромно","Хорошо","Отлично","Восторг!"];
function card(w){const r=me.r[w.id]||0,c=w.c;
return `<div class="card" id="c-${w.id}"><div class="top">${w.img?`<img src="${IMG[w.id]}" alt="">`:bottleSvg(c).replace("<svg","<svg style='width:64px;height:120px'")}<div><small>${w.b}</small><h3>${w.n}</h3><span>${w.d}</span></div></div>
<div class="glasses">${[1,2,3,4,5].map(i=>`<button class="g" data-w="${w.id}" data-i="${i}" aria-label="${i}">${glass(w.id+i,i<=r,c)}<div class="bot">${bottleSvg(c).replace("<svg","<svg style='width:34px;height:62px'")}</div><div class="st"></div></button>`).join("")}</div>
<div class="lbl">${r?r+" / 5 · "+words[r]:"Нажмите на бокал"}</div>
<textarea data-n="${w.id}" placeholder="Что вы чувствуете в аромате? (необязательно)">${esc(me.c[w.id]||"")}</textarea>
<button class="bt sv ${me.saved[w.id]?"done":""}" data-s="${w.id}">${me.saved[w.id]?"✓ Сохранено — обновить":"Сохранить оценку"}</button></div>`}
function render(){const a=$("#app");
if(!me.name||!me.ok){a.innerHTML=`<div class="hero"><div style="font-size:54px">🍷</div><h1>Винное путешествие<br>с Bekauri</h1><p>Оцените 6 вин Bekauri и узнайте, какое понравилось гостям больше всего</p><input id="nm" placeholder="Как вас зовут?" value="${esc(me.name)}" maxlength="30"><button class="bt" id="go">Начать дегустацию</button></div>`;
 $("#go").onclick=()=>{const v=$("#nm").value.trim();if(!v){$("#nm").focus();return}me.name=v;me.ok=1;LS.set("wn",v);LS.set("wok","1");render()};return}
a.innerHTML=`<div class="tabs"><button data-t="v" class="${tab=="v"?"on":""}">🍷 Дегустация</button><button data-t="r" class="${tab=="r"?"on":""}">🏆 Рейтинг</button></div>`+(mode==="local"?`<div class="note">Режим без общего сервера: оценки видны только на этом телефоне. Откройте ссылку в приложении Claude с входом, чтобы голоса объединялись.</div>`:"")+`<div id="v" class="${tab=="v"?"":"hid"}">${W.map(card).join("")}<button class="bt s" data-t="r">Посмотреть результаты</button></div><div id="r" class="${tab=="r"?"":"hid"}"></div>`;
if(tab==="r")renderRes();bind()}
me.ok=LS.get("wok")==="1";
function bind(){document.querySelectorAll("[data-t]").forEach(b=>b.onclick=()=>{tab=b.dataset.t;render();scrollTo(0,0)});
document.querySelectorAll(".g").forEach(g=>g.onclick=()=>{const id=g.dataset.w,i=+g.dataset.i,card=$("#c-"+id);me.r[id]=i;LS.set("wr",JSON.stringify(me.r));
 const gs=card.querySelectorAll(".g"),w=W.find(x=>x.id===id);gs.forEach((x,k)=>{x.classList.remove("pour");x.querySelector("svg").outerHTML=glass(id+(k+1),k<i&&false,w.c);});
 gs.forEach((x,k)=>{if(k<i){x.querySelector(".lv").style.transform="translateY(32px)"}});void card.offsetWidth;
 gs[i-1].classList.add("pour");
 gs.forEach((x,k)=>{const lv=x.querySelector(".lv"),d=k===i-1?700:0;if(k<i)setTimeout(()=>lv.style.transform="translateY(0)",d+30)});
 card.querySelector(".lbl").textContent=i+" / 5 · "+words[i];const s=card.querySelector(".sv");s.classList.remove("done");s.textContent="Сохранить оценку";});
document.querySelectorAll("textarea").forEach(t=>t.oninput=()=>{me.c[t.dataset.n]=t.value;LS.set("wc",JSON.stringify(me.c))});
document.querySelectorAll("[data-s]").forEach(b=>b.onclick=async()=>{const id=b.dataset.s;if(!me.r[id]){b.textContent="Сначала выберите бокалы 🍷";return}
 me.saved[id]=1;LS.set("ws",JSON.stringify(me.saved));b.disabled=true;try{await store.save()}catch(e){}b.disabled=false;b.classList.add("done");b.textContent="✓ Сохранено — обновить"})}
function renderRes(){const el=$("#r");if(!el)return;
 const rows=W.map(w=>{let s=0,n=0;const cm=[];all.forEach(v=>{const x=v.r&&v.r[w.id];if(x){s+=x;n++;const t=v.cc&&v.cc[w.id];if(t&&t.trim())cm.push({n:v.name,t,w:w.n,ts:v.t||0})}});return{w,avg:n?s/n:0,n,cm}}).sort((a,b)=>b.avg-a.avg);
 const cms=rows.flatMap(r=>r.cm).sort((a,b)=>b.ts-a.ts).slice(0,15),voters=all.length;
 el.innerHTML=`<div class="card"><h2 style="color:var(--gold)">Живой рейтинг</h2><small style="color:var(--mut);font-family:system-ui">Участников: ${voters}</small>`+rows.map((r,i)=>`<div class="rk"><b>${i+1}</b><div class="n">${esc(r.w.n)}<i>${r.w.b} · голосов: ${r.n}</i><div class="bar"><u style="width:${r.avg/5*100}%"></u></div></div><div class="sc">${r.n?r.avg.toFixed(1):"–"}${i===0&&r.n?" ❤️":""}</div></div>`).join("")+`</div><div class="card"><h2 style="color:var(--gold)">Что говорят гости</h2>`+(cms.length?cms.map(c=>`<div class="cm">«${esc(c.t)}»<br><small>${esc(c.n)} · ${esc(c.w)}</small></div>`).join(""):`<p style="color:var(--mut)">Комментариев пока нет</p>`)+`</div>`}
render();store.init();
