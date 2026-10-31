(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches,pad=n=>String(n).padStart(2,'0');
const C=()=>{const s=getComputedStyle(document.documentElement),g=n=>s.getPropertyValue(n).trim();return{panel:g('--panel'),fg:g('--fg'),muted:g('--muted'),line:g('--line'),accent:g('--accent'),allow:g('--allow'),deny:g('--deny')}};
const FM='"IBM Plex Mono",monospace';
function fit(cv,h){const d=Math.min(devicePixelRatio||1,2),w=Math.max(280,cv.parentElement.clientWidth);cv.width=w*d;cv.height=h*d;cv.style.width=w+'px';cv.style.height=h+'px';const x=cv.getContext('2d');x.setTransform(d,0,0,d,0,0);return[x,w]}
function watch(el,cb){new IntersectionObserver(e=>cb(e[0].isIntersecting)).observe(el)}

/* nav */
(()=>{const M=[['topologies','Topologies',1],['works','Works',1],['achievements','Results',1],['skills','Skills',1],['cloudlab','Cloud expertise',1],['route','Route'],['zones','Landing zone model'],['cloud','Coverage'],['docs','Docs'],['creds','Certifications'],['contact','Contact']];
const ul=$('#menuList'),btn=$('#menuBtn'),menu=$('#site-menu');
M.forEach(m=>ul.insertAdjacentHTML('beforeend',`<li><a class="mi${m[2]?' hot':''}" href="#${m[0]}" tabindex="-1"><span>${m[1]}</span><i style="font-style:normal">→</i></a></li>`));
const set=o=>{menu.classList.toggle('open',o);btn.setAttribute('aria-expanded',o);$$('a',ul).forEach(a=>a.tabIndex=o?0:-1)};
btn.onclick=()=>set(!menu.classList.contains('open'));
ul.onclick=e=>{const a=e.target.closest('a');if(!a)return;e.preventDefault();$(a.getAttribute('href')).scrollIntoView({behavior:RM?'auto':'smooth'});set(false)};
addEventListener('keydown',e=>{if(e.key==='Escape')set(false)});
document.addEventListener('pointerdown',e=>{if(!$('#nav').contains(e.target))set(false)});
const spy=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)$$('a',ul).forEach(a=>a.getAttribute('href')==='#'+e.target.id?a.setAttribute('aria-current','true'):a.removeAttribute('aria-current'))}),{rootMargin:'-45% 0px -50% 0px'});
M.forEach(m=>spy.observe($('#'+m[0])));
const prog=$('#prog');addEventListener('scroll',()=>{const m=document.documentElement.scrollHeight-innerHeight;prog.style.transform='scaleX('+(m>0?Math.min(1,scrollY/m):0)+')'},{passive:true});
const tog=$('#tog'),isL=()=>document.documentElement.dataset.theme?document.documentElement.dataset.theme==='light':matchMedia('(prefers-color-scheme:light)').matches;
if(isL())document.documentElement.dataset.theme='light';
const lab=()=>tog.firstChild.textContent=isL()?'Dark':'Light';lab();
tog.onclick=()=>{document.documentElement.dataset.theme=isL()?'dark':'light';lab()}})();

/* rain */
(()=>{const cv=$('.bg-rain'),x=cv.getContext('2d'),CH='01ABCDEF<>/#$%{}[]=+*',FS=15;let W,H,cols=[],ac='#8FD3FF',t0=0,acc=0,boost=0,ly=scrollY;
function size(){const d=Math.min(devicePixelRatio||1,1.5);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;x.setTransform(d,0,0,d,0,0);cols=Array.from({length:Math.ceil(W/(FS*1.5))},(_,i)=>({x:i*FS*1.5,y:Math.random()*H,s:.6+Math.random()*.9}));x.font='500 '+FS+'px '+FM;ac=C().accent}
size();addEventListener('resize',size);if(RM){x.fillStyle=ac;cols.forEach(c=>{for(let k=0;k<6;k++){x.globalAlpha=.7-k*.11;x.fillText(CH[Math.random()*CH.length|0],c.x,c.y-k*FS)}});return}
const step=n=>{requestAnimationFrame(step);const dt=Math.min(n-t0,100);t0=n;boost=Math.min(8,boost*.92+Math.abs(scrollY-ly)/14);ly=scrollY;acc+=dt*(1+boost);if(acc<70)return;acc=0;ac=C().accent;
x.globalCompositeOperation='destination-out';x.fillStyle='rgba(0,0,0,.12)';x.fillRect(0,0,W,H);x.globalCompositeOperation='source-over';x.fillStyle=ac;x.globalAlpha=.9;
cols.forEach(c=>{x.fillText(CH[Math.random()*CH.length|0],c.x,c.y);c.y+=FS*c.s;if(c.y>H&&Math.random()>.96)c.y=-Math.random()*H*.3})};requestAnimationFrame(step)})();

/* hero topology */
(()=>{const N=[['internet','INTERNET','perimeter and WAF',-90,'The perimeter. Application Gateway with WAF publishes enterprise applications, and anything without a rule is denied.'],
['azure','ON-PREM','VPN · ExpressRoute',-45,'Hybrid links over VPN Gateway and ExpressRoute, with the Active Directory and Windows Server estates behind them.'],
['aks','AKS','Azure CNI · ACR',0,'Clusters with Azure CNI, node pools, autoscaler and Kubernetes RBAC, with ACR attached through Managed Identity.'],
['app','APP SERVICES','App Insights',45,'App Services published behind Application Gateway and monitored with Application Insights and Azure Alerts.'],
['ml','AZURE AI','Foundry · OpenAI',90,'Azure AI Foundry, Azure OpenAI, Translator and AI Vision, reached over Private Endpoints with Managed Identities.'],
['kv','KEY VAULT','Managed Identity',135,'Secrets and keys, reached through Managed Identities instead of stored credentials.'],
['storage','STORAGE','private endpoint',180,'Blob and file storage with lifecycle policies, SAS control and secure data access.'],
['bastion','BASTION','no public IPs',-135,'Admin access to virtual machines without public IP addresses, through Azure Bastion.']];
N[1][1]='ON-PREM';const ID=N.map(n=>n[0]);
const F=[['azure','aks','ipsec-esp','a','hybrid-vpn'],['internet','app','tcp/443','a','appgw-waf'],['ml','storage','tcp/443','a','private-endpoint'],['internet','storage','tcp/443','d','public-access-off'],['aks','kv','tcp/443','a','managed-identity'],['internet','bastion','tcp/22','d','no-public-ssh'],['azure','bastion','tcp/443','a','bastion-host'],['internet','ml','any','d','private-endpoint'],['app','kv','tcp/443','a','managed-identity'],['aks','storage','tcp/443','a','private-endpoint'],['internet','aks','tcp/6443','d','default-deny'],['ml','kv','tcp/443','a','managed-identity']];
const cv=$('#topo'),chips=$('#topoChips'),log=$('#log');let sel=null,P=[{f:F[0],ph:0,p:.55},{f:F[3],ph:0,p:.72},{f:F[2],ph:1,p:.4}],B=[],pos={},fw={},W,H,ctx,vis=true,t=0,last=0,spawnIn=.6,ev=[];
const nm=id=>N[ID.indexOf(id)][1];
N.forEach(n=>{const b=document.createElement('button');b.type='button';b.className='chip';b.textContent=n[1];b.setAttribute('aria-pressed','false');b.onclick=()=>pick(n[0]);chips.append(b)});
function pick(id){sel=sel===id?null:id;$$('.chip',chips).forEach((c,i)=>c.setAttribute('aria-pressed',ID[i]===sel));const n=N[ID.indexOf(sel)];$('#nodeTitle').textContent=n?n[1]:'Firewall core';$('#nodeText').textContent=n?n[4]:'Every path crosses one inspection point. Select a node to see what I have run there and to bias the traffic toward it.'}
function addLog(f,when){ev=ev.slice(-7).concat([[when||new Date(),f]]);log.innerHTML=ev.map(e=>{const d=e[0],f=e[1],a=f[3]==='a';return`<li><span class="ts">${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}</span><span class="${a?'a':'d'}">${a?'✓ ALLOW':'✕ DROP'}</span><span>${nm(f[0])} → ${nm(f[1])} <em>${f[2]} · ${f[4]}</em></span></li>`}).join('')}
F.slice(0,7).forEach((f,i)=>addLog(f,new Date(Date.now()-(8-i)*1300)));
function layout(){[ctx,W]=fit(cv,innerWidth<520?410:innerWidth<820?450:490);H=parseInt(cv.style.height);const cx=W/2,cy=H/2,rx=Math.min(W*.37,430),ry=H*.33;fw={x:cx,y:cy};N.forEach(n=>{const a=n[3]*Math.PI/180;pos[n[0]]={x:cx+rx*Math.cos(a),y:cy+ry*Math.sin(a)}})}
function draw(){const c=C();ctx.clearRect(0,0,W,H);ctx.lineWidth=1;ctx.strokeStyle=c.line;ctx.setLineDash([2,5]);ctx.beginPath();ID.forEach((id,i)=>i?ctx.lineTo(pos[id].x,pos[id].y):ctx.moveTo(pos[id].x,pos[id].y));ctx.closePath();ctx.stroke();ctx.setLineDash([]);
ID.forEach(id=>{ctx.strokeStyle=sel===id?c.accent:c.line;ctx.lineWidth=sel===id?1.8:1;ctx.beginPath();ctx.moveTo(pos[id].x,pos[id].y);ctx.lineTo(fw.x,fw.y);ctx.stroke()});
P.forEach(p=>{const a=p.ph?fw:pos[p.f[0]],b=p.ph?pos[p.f[1]]:fw,x=a.x+(b.x-a.x)*p.p,y=a.y+(b.y-a.y)*p.p,k=p.ph?c.allow:c.accent,tp=Math.max(0,p.p-.1);ctx.globalAlpha=.35;ctx.strokeStyle=k;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(a.x+(b.x-a.x)*tp,a.y+(b.y-a.y)*tp);ctx.lineTo(x,y);ctx.stroke();ctx.globalAlpha=1;ctx.fillStyle=k;ctx.beginPath();ctx.arc(x,y,3.6,0,7);ctx.fill()});
N.forEach(n=>{const q=pos[n[0]],on=sel===n[0],up=Math.sin(n[3]*Math.PI/180)<-.6,ly=up?q.y-17:q.y+23;ctx.fillStyle=c.panel;ctx.strokeStyle=on?c.accent:c.fg;ctx.lineWidth=on?2:1.2;ctx.beginPath();ctx.rect(q.x-8,q.y-8,16,16);ctx.fill();ctx.stroke();ctx.fillStyle=on?c.accent:c.muted;ctx.fillRect(q.x-2.5,q.y-2.5,5,5);ctx.textAlign='center';ctx.fillStyle=on?c.accent:c.fg;ctx.font='500 10px '+FM;ctx.fillText(n[1],q.x,ly);if(W>=560){ctx.fillStyle=c.muted;ctx.font='400 9px '+FM;ctx.fillText(n[2],q.x,up?ly-12:ly+12)}});
B.forEach(b=>{const k=b.d?c.deny:c.allow;ctx.globalAlpha=Math.max(0,1-b.age);ctx.strokeStyle=k;ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(fw.x,fw.y,24+b.age*58,0,7);ctx.stroke();if(b.d)for(let i=0;i<6;i++){const a=i*Math.PI/3+.4,r1=18+b.age*30;ctx.beginPath();ctx.moveTo(fw.x+Math.cos(a)*r1,fw.y+Math.sin(a)*r1);ctx.lineTo(fw.x+Math.cos(a)*(r1+10),fw.y+Math.sin(a)*(r1+10));ctx.stroke()}ctx.globalAlpha=1});
ctx.save();ctx.translate(fw.x,fw.y);ctx.strokeStyle=c.accent;ctx.lineWidth=1.3;ctx.setLineDash([6,6]);ctx.rotate(t*.6);ctx.beginPath();ctx.arc(0,0,40,0,7);ctx.stroke();ctx.rotate(-t*.6);ctx.setLineDash([]);ctx.fillStyle=c.panel;ctx.lineWidth=1.6;ctx.beginPath();ctx.rect(-14,-14,28,28);ctx.fill();ctx.stroke();ctx.fillStyle=c.accent;ctx.font='600 8px '+FM;ctx.textAlign='center';ctx.fillText('AZ FW',0,3);ctx.fillStyle=c.muted;ctx.font='400 9px '+FM;ctx.fillText('FIREWALL',0,58);ctx.restore()}
function step(n){requestAnimationFrame(step);if(!vis){last=n;return}const dt=Math.min((n-last)/1000,.05);last=n;t+=dt;spawnIn-=dt;
if(spawnIn<=0){if(P.length<10){let pool=F;if(sel&&Math.random()<.75){const f=F.filter(x=>x[0]===sel||x[1]===sel);if(f.length)pool=f}P.push({f:pool[Math.random()*pool.length|0],ph:0,p:0})}spawnIn=.6+Math.random()*.7}
for(let i=P.length-1;i>=0;i--){const p=P[i];p.p+=dt/1.05;if(p.p>=1){if(!p.ph){B.push({d:p.f[3]==='d',age:0});addLog(p.f);if(p.f[3]==='a'){p.ph=1;p.p=0}else P.splice(i,1)}else P.splice(i,1)}}
B=B.filter(b=>(b.age+=dt*1.5)<1);draw()}
function near(e){const r=cv.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;let b=null,bd=1156;ID.forEach(id=>{const d=(pos[id].x-x)**2+(pos[id].y-y)**2;if(d<bd){bd=d;b=id}});return b}
cv.onpointermove=e=>cv.style.cursor=near(e)?'pointer':'default';cv.onclick=e=>{const i=near(e);if(i)pick(i)};
layout();draw();addEventListener('resize',()=>{layout();draw()});if(!RM){watch(cv,v=>vis=v);last=performance.now();requestAnimationFrame(step)}})();

/* cloud lab */
(()=>{const Z=(x,y,w,h,l)=>({x,y,w,h,l});
const S=(n,sub,nodes,links,steps,zones)=>({n,sub,nodes,links,steps,zones:zones||[]});
const TABS=[
{n:'Networking',f:[
S('Private Endpoint','Private Link',[['vm','APP VM',.12,.6,'s'],['dns','PRIV DNS',.26,.24,'h'],['pe','PRIV EP',.4,.6,'c'],['sv','STORAGE',.86,.42,'s'],['net','INTERNET',.86,.88,'c']],[['vm','pe'],['vm','dns'],['pe','sv',1],['net','sv',1]],
[['i',['vm','dns'],'The app looks up the storage account name. Private DNS answers with the endpoint’s private IP, not the public one.'],['a',['vm','pe','sv'],'Traffic goes to that private IP and crosses Private Link over the Microsoft backbone to the storage account.'],['d',['net','sv'],'With public network access turned off on the account, a request from the internet is refused.']],[Z(.02,.06,.5,.88,'YOUR VNET')]),
S('Application Gateway','WAF and routing',[['usr','CLIENT',.08,.28,'u'],['bot','ATTACKER',.08,.8,'c'],['agw','APP GW',.42,.5,'f'],['pool','BACKEND',.9,.5,'s']],[['usr','agw'],['bot','agw'],['agw','pool']],
[['i',['agw','pool'],'Health probes and HTTP settings tell the gateway which backend pool members are healthy.'],['a',['usr','agw','pool'],'A listener with an SSL certificate accepts the request, and a routing rule sends it to a healthy backend.'],['d',['bot','agw'],'WAF policy rules block SQL injection and cross-site scripting before they reach the application.']]),
S('Azure Firewall','rules and NAT',[['vm','SPOKE VM',.1,.5,'s'],['fw','AZ FW',.46,.5,'f'],['net','INTERNET',.9,.2,'c'],['usr','USER',.9,.8,'u']],[['vm','fw'],['fw','net'],['fw','usr']],
[['a',['vm','fw','net'],'An application rule allows the destination FQDN over HTTPS. SNAT swaps in the firewall’s public address.'],['d',['vm','fw'],'Traffic with no matching rule is dropped at the firewall, and the attempt is logged.'],['a',['usr','fw','vm'],'For inbound traffic, a DNAT rule translates the public IP and port to the VM’s private address.']])]},
{n:'Platform',f:[
S('Terraform pipeline','IaC through environments',[['git','GIT REPO',.07,.5,'s'],['ado','AZ DEVOPS',.3,.5,'c'],['tf','TERRAFORM',.53,.5,'c'],['st','STATE',.53,.12,'h'],['az','AZURE',.92,.5,'s']],[['git','ado'],['ado','tf'],['tf','st',1],['tf','az']],
[['i',['git','ado'],'A pull request runs the YAML pipeline: format, validate and plan against remote state.'],['i',['tf','st'],'State lives in a remote backend, so every run sees the same record of what exists.'],['a',['ado','tf','az'],'After approval, apply promotes the same module code through Development, Test and Production.']]),
S('AKS and ACR','keyless image pulls',[['dev','PIPELINE',.08,.5,'c'],['acr','ACR',.36,.5,'s'],['aks','AKS',.7,.5,'s'],['pod','PODS',.93,.5,'s'],['bad','NO IDENTITY',.36,.9,'c']],[['dev','acr'],['acr','aks'],['aks','pod'],['bad','acr',1]],
[['a',['dev','acr'],'The pipeline builds the image and pushes it to Azure Container Registry.'],['a',['aks','acr','aks','pod'],'The cluster pulls the image using its Managed Identity. No registry password is stored.'],['d',['bad','acr'],'A caller with no identity and no role assignment cannot pull from the registry.']]),
S('Logic Apps approval','VM start by email',[['usr','REQUESTER',.07,.5,'u'],['mbx','MAILBOX',.27,.5,'s'],['apv','APPROVER',.47,.5,'u'],['la','LOGIC APP',.7,.5,'c'],['vm','AZURE VM',.93,.5,'s']],[['usr','mbx'],['mbx','apv'],['apv','la'],['la','vm']],
[['i',['usr','mbx','apv'],'A user emails a request to start a VM. It reaches the approver as an email with Approve and Deny buttons.'],['a',['apv','la','vm'],'On Approve, the request hits the Logic App, which starts the VM and emails the requester.'],['d',['apv','la'],'On Deny, the Logic App takes no start action, the VM stays stopped, and the requester is told.']]),
S('Backup and Site Recovery','RPO and RTO',[['vm','PRIMARY VM',.1,.5,'s'],['rsv','RECOVERY VAULT',.5,.2,'h'],['asr','SITE RECOVERY',.5,.8,'c'],['dr','DR REGION',.9,.5,'s']],[['vm','rsv'],['vm','asr'],['asr','dr',1]],
[['a',['vm','rsv'],'Azure Backup writes scheduled restore points into the Recovery Services Vault.'],['i',['vm','asr','dr'],'Site Recovery replicates the VM to a second region, so recovery targets can be met.'],['a',['dr'],'On failover, the replica starts in the DR region and traffic follows.']])]},
{n:'Azure AI',f:[
S('Azure AI Foundry','build and manage AI apps',[['dev','DEVELOPER',.08,.5,'u'],['hub','AI FOUNDRY',.4,.5,'s'],['mdl','MODELS',.9,.2,'s'],['kv','KEY VAULT',.9,.5,'s'],['st','STORAGE',.9,.8,'s']],[['dev','hub'],['hub','mdl'],['hub','kv'],['hub','st']],
[['i',['dev','hub'],'A developer opens a project in Azure AI Foundry, the shared place to pick models and build AI apps.'],['a',['hub','mdl'],'The project connects to deployed models, such as an Azure OpenAI deployment.'],['i',['hub','kv'],'Secrets stay in Key Vault and data in storage, reached through Managed Identities instead of stored keys.']]),
S('Azure OpenAI','private model access',[['app','APP',.1,.5,'s'],['pe','PRIV EP',.4,.5,'c'],['ai','OPENAI',.8,.5,'s'],['net','INTERNET',.1,.9,'c']],[['app','pe'],['pe','ai'],['net','ai',1]],
[['a',['app','pe','ai'],'The app calls its Azure OpenAI deployment through a Private Endpoint, so traffic stays on the private network.'],['i',['app','ai'],'A Managed Identity and RBAC authorise the call, so no shared key sits in the code.'],['d',['net','ai'],'With public network access turned off, a request from the internet is refused.']],[Z(.02,.06,.5,.88,'YOUR VNET')]),
S('Azure Translator','text translation',[['usr','USER',.08,.5,'u'],['app','APP',.38,.5,'s'],['tr','TRANSLATOR',.7,.5,'s'],['kv','KEY VAULT',.7,.12,'s']],[['usr','app'],['app','tr'],['app','kv',1]],
[['a',['usr','app','tr'],'The app sends the text to Azure Translator with the source and target languages.'],['a',['tr','app','usr'],'The translated text comes back and is returned to the user.'],['i',['app','kv'],'The app reads its credentials from Key Vault instead of keeping them in code.']]),
S('Azure AI Vision','image analysis',[['img','IMAGE',.08,.5,'u'],['app','APP',.36,.5,'s'],['vis','AI VISION',.66,.5,'s'],['res','RESULT',.92,.5,'s']],[['img','app'],['app','vis'],['vis','res',1]],
[['a',['img','app','vis'],'An image is sent to Azure AI Vision for analysis.'],['i',['vis','app'],'Vision returns tags, captions or extracted text as JSON.'],['a',['app','res'],'The app stores or shows the result alongside the image.']])]}];
let ti=0,fi=0,si=0,jump=null;const cv=$('#lab'),G={a:'✓',d:'✕',i:'i'},K={a:'allow',d:'deny',i:'info'};
const tabs=$('#ctabs'),chips=$('#labChips'),ol=$('#steps');
TABS.forEach((t,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('role','tab');b.className='ctab';b.innerHTML=t.n+'<small>'+t.f.length+' features</small>';b.onclick=()=>{ti=i;fi=0;si=0;jump=null;build()};tabs.append(b)});
function build(){const t=TABS[ti],f=t.f[fi];$$('.ctab',tabs).forEach((b,i)=>b.setAttribute('aria-selected',i===ti));chips.innerHTML='';t.f.forEach((x,i)=>{const b=document.createElement('button');b.type='button';b.className='chip';b.textContent=x.n;b.setAttribute('aria-pressed',i===fi);b.onclick=()=>{fi=i;si=0;jump=null;build()};chips.append(b)});
$('#labTitle').innerHTML='Azure '+f.n+'<small>'+f.sub+'</small>';ol.innerHTML='';f.steps.forEach((s,i)=>{const li=document.createElement('li'),b=document.createElement('button');b.type='button';b.className='stp'+(i===si?' on':'');b.innerHTML=`<span class="g g-${K[s[0]]}" aria-hidden="true">${G[s[0]]}</span><span>${s[2]}</span>`;b.onclick=()=>{jump=i;si=i;mark()};li.append(b);ol.append(li)});
cv.setAttribute('aria-label','Animated diagram of Azure '+f.n+': '+f.steps.map(s=>s[2]).join(' '));start()}
const mark=()=>$$('.stp',ol).forEach((b,i)=>b.classList.toggle('on',i===si));
let raf=0,vis=true,idx=0,tt=0,last=0,P={},W,H,ctx,sc;
function start(){sc=TABS[ti].f[fi];idx=0;tt=0;lay();draw()}
function lay(){[ctx,W]=fit(cv,innerWidth<520?290:330);H=parseInt(cv.style.height);if(sc)sc.nodes.forEach(n=>P[n[0]]={x:34+n[2]*(W-68),y:30+n[3]*(H-64)})}
function shape(k,x,y){ctx.beginPath();if(k==='c')ctx.arc(x,y,10,0,7);else if(k==='h'){for(let i=0;i<6;i++){const a=Math.PI/3*i;ctx[i?'lineTo':'moveTo'](x+11*Math.cos(a),y+11*Math.sin(a))}ctx.closePath()}else ctx.rect(x-8,y-8,16,16)}
const TR=.95,dur=s=>Math.max(1,s[1].length-1)*TR+1.2;
function draw(){const c=C(),st=sc.steps[idx],path=st[1],ns=path.length-1,pr=RM?ns:Math.min(ns,tt/TR),burst=RM?.4:Math.max(0,(tt-ns*TR)/.9),kc=st[0]==='d'?c.deny:st[0]==='a'?c.allow:c.accent;ctx.clearRect(0,0,W,H);
sc.zones.forEach(z=>{const x=34+z.x*(W-68)-10,y=30+z.y*(H-64)-8,w=z.w*(W-68)+20,h=z.h*(H-64)+16;ctx.setLineDash([5,5]);ctx.strokeStyle=c.line;ctx.lineWidth=1;ctx.strokeRect(x,y,w,h);ctx.setLineDash([]);ctx.fillStyle=c.muted;ctx.textAlign='left';ctx.font='400 9px '+FM;ctx.fillText(z.l,x+6,y+13)});
sc.links.forEach(l=>{const a=P[l[0]],b=P[l[1]];ctx.strokeStyle=c.line;ctx.lineWidth=1.2;ctx.setLineDash(l[2]?[4,4]:[]);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()});ctx.setLineDash([]);
if(ns>0){ctx.globalAlpha=.4;ctx.strokeStyle=kc;ctx.lineWidth=3.5;ctx.beginPath();path.forEach((id,i)=>ctx[i?'lineTo':'moveTo'](P[id].x,P[id].y));ctx.stroke();ctx.globalAlpha=1}
sc.nodes.forEach(n=>{const q=P[n[0]],pi=path.indexOf(n[0]),re=pi>=0&&pr>=pi-.02,k=re?(pi===ns&&st[0]==='d'?c.deny:kc):c.fg;ctx.lineWidth=re?2:1.3;ctx.strokeStyle=k;ctx.fillStyle=c.panel;ctx.setLineDash(n[4]==='c'?[3,3]:[]);
if(n[4]==='f'){[[-4,-4],[4,4]].forEach(o=>{ctx.beginPath();ctx.rect(q.x+o[0]-8,q.y+o[1]-8,16,16);ctx.fill();ctx.stroke()})}else{shape(n[4],q.x,q.y);ctx.fill();ctx.stroke()}ctx.setLineDash([]);ctx.fillStyle=k;ctx.textAlign='center';ctx.font='500 '+(W<520?9:10)+'px '+FM;ctx.fillText(n[1],q.x,q.y+26)});
if(ns>0&&(RM||tt<ns*TR+.25)){const sg=Math.min(ns-1,pr|0),f=pr-sg,a=P[path[sg]],b=P[path[sg+1]],x=a.x+(b.x-a.x)*f,y=a.y+(b.y-a.y)*f;ctx.fillStyle=kc;ctx.beginPath();ctx.arc(x,y,4.2,0,7);ctx.fill()}
const e=P[path[ns]];if(burst>0&&burst<1){ctx.globalAlpha=1-burst;ctx.strokeStyle=kc;ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(e.x,e.y,14+burst*26,0,7);ctx.stroke();ctx.globalAlpha=1}
if(st[0]==='d'&&pr>=ns-.02){ctx.fillStyle=c.deny;ctx.textAlign='center';ctx.font='700 15px '+FM;ctx.fillText('✕',e.x+17,e.y-9)}}
function loop(n){requestAnimationFrame(loop);if(!vis){last=n;return}const dt=Math.min((n-last)/1000,.05);last=n;if(jump!=null){idx=jump;jump=null;tt=0}tt+=dt;if(tt>=dur(sc.steps[idx])){idx=(idx+1)%sc.steps.length;tt=0;si=idx;mark()}draw()}
addEventListener('resize',()=>{lay();draw()});build();
if(!RM){watch(cv,v=>vis=v);last=performance.now();requestAnimationFrame(loop)}else setInterval(()=>{if(jump!=null){idx=jump;jump=null;draw()}},150)})();

/* gantt */
(()=>{const mi=(y,m)=>(y-2018)*12+m-1,T=108,R=[['Tech Mahindra',mi(2025,9),mi(2026,1)+1,1],['Encora',mi(2022,9),mi(2025,9)+1],['Accenture',mi(2021,10),mi(2022,9)+1],['Yash Technologies',mi(2018,11),mi(2021,10)+1]],g=$('#gantt');
R.forEach(r=>g.insertAdjacentHTML('beforeend',`<div class="g-label">${r[0]}</div><div class="g-track"><div class="g-bar${r[3]?' now':''}" style="left:${r[1]/T*100}%;width:${(r[2]-r[1])/T*100}%"></div></div>`));
let a='<div></div><div class="g-axis">';for(let y=2018;y<=2026;y++)a+=`<span style="left:${(y-2018)*12/T*100}%">’${String(y).slice(2)}</span>`;g.insertAdjacentHTML('beforeend',a+'</div>')})();

/* matrix */
(()=>{const Zs=[['internet','Internet'],['onprem','On-prem'],['hub','Hub'],['prod','Prod spoke'],['nonprod','Non-prod spoke'],['ml','AI services']],
M={internet:'NDDCDD',onprem:'ANACCC',hub:'AACCCC',prod:'ACACDC',nonprod:'ACADCC',ml:'ACACCC'},ST={A:'allow',C:'cond',D:'deny',N:'na'},GL={allow:'✓',cond:'IF',deny:'✕',na:'–'},VT={allow:'✓ Allow',cond:'Allow if',deny:'✕ Deny'},
CT={allow:['Azure Firewall','Route tables','Logging'],cond:['NSG','Private Endpoint','RBAC','Azure Policy'],deny:['Default deny','Azure Policy','Logging']},
O={'internet>prod':'Only published endpoints. HTTPS to Application Gateway with WAF in front of the application, and nothing else.','internet>ml':'AI services are private. There is no public endpoint to reach.','prod>nonprod':'Production never depends on non-production. Peering and firewall rules keep the two apart.','nonprod>prod':'No path from test into production. Releases are promoted by the pipeline, not over the network.','internet>onprem':'No unsolicited inbound traffic. Only replies to sessions started from inside come back.','onprem>hub':'Hybrid traffic over VPN Gateway or ExpressRoute lands in the hub, then passes the firewall.','prod>hub':'Spokes reach shared services in the hub, such as DNS, firewall and monitoring.','prod>ml':'Applications call the AI endpoints over private networking, on the ports they need.','ml>prod':'AI services answer requests. They do not start connections into production.'},
mx=$('#mx'),cells=[];let cur=['onprem','prod'];
mx.insertAdjacentHTML('beforeend','<div class="mx-corner">From ↓<br>To →</div>'+Zs.map(z=>`<div class="mx-h col">${z[1].replace(' spoke','').replace('AI services','AI')}</div>`).join(''));
Zs.forEach((s,i)=>{mx.insertAdjacentHTML('beforeend',`<div class="mx-h">${s[1].replace(' spoke','').replace('AI services','AI')}</div>`);Zs.forEach((d,j)=>{const st=ST[M[s[0]][j]],b=document.createElement('button');b.type='button';b.className='cell '+st;b.textContent=GL[st];b.disabled=st==='na';b.setAttribute('aria-label',s[1]+' to '+d[1]+': '+(VT[st]||'not applicable'));b.setAttribute('aria-pressed','false');b.onclick=()=>{cur=[s[0],d[0]];show()};b.dataset.k=s[0]+'>'+d[0];mx.append(b)})});
function show(){const k=cur.join('>'),i=Zs.findIndex(z=>z[0]===cur[0]),j=Zs.findIndex(z=>z[0]===cur[1]),st=ST[M[cur[0]][j]];$$('.cell',mx).forEach(b=>b.setAttribute('aria-pressed',b.dataset.k===k));
$('#laneA').textContent=Zs[i][1].replace(' spoke','');$('#laneB').textContent=Zs[j][1].replace(' spoke','');const p=$('#pkt');p.className='pkt '+st;p.style.animation='none';p.offsetWidth;p.style.animation='';
const v=$('#verdict');v.className='verdict '+st;v.textContent=VT[st];$('#pairTitle').textContent=Zs[i][1]+' → '+Zs[j][1];
$('#reason').textContent=O[k]||{allow:'Permitted through the hub firewall, matched on application and not just port.',cond:'Allowed only for named services, on the ports they need, with identity or private endpoints in the path.',deny:'No path. The firewall and policy deny it by default.'}[st];
$('#ctl').innerHTML=CT[st].map(c=>`<span class="tag">${c}</span>`).join('')}show()})();

/* text, reveal, counters, ticker, copy */
(()=>{const GLY='01ABCDEF<>/#$%&*+=?';
function scr(el,ms){if(RM)return;cancelAnimationFrame(el._s);const ws=[],tw=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n;while(n=tw.nextNode()){if(n._o===undefined)n._o=n.data;ws.push(n)}const tot=ws.reduce((a,x)=>a+x._o.length,0),t0=performance.now();
const f=now=>{const p=Math.min(1,(now-t0)/ms),r=Math.floor(p*tot);let i=0;ws.forEach(n=>{let o='';for(const c of n._o){o+=(i<r||c===' ')?c:GLY[Math.random()*GLY.length|0];i++}n.data=o});if(p<1)el._s=requestAnimationFrame(f);else ws.forEach(n=>n.data=n._o)};el._s=requestAnimationFrame(f)}
const sel='.sec-head > *, .stat, .hop, .cloud, .cred, .doc-list li, .kit-row, .crow, .edu div, .work, .medal, .metric, .recog li, .skillcard, .mx-wrap > *, .gantt';
const els=$$(sel);els.forEach(e=>{e.setAttribute('data-rv','');e.style.setProperty('--i',[...e.parentNode.children].indexOf(e)%6)});
const io=new IntersectionObserver(es=>es.forEach(en=>{const e=en.target;if(en.isIntersecting){e.classList.add('in-view');if(e.matches('h2,.eyebrow'))scr(e,720);const c=$('.cnt',e);if(c&&!RM)cnt(c)}else e.classList.remove('in-view')}),{rootMargin:'0px 0px -5% 0px'});
if(!RM)els.forEach(e=>io.observe(e));else els.forEach(e=>e.classList.add('in-view'));
function cnt(c){const to=+c.dataset.to,t0=performance.now(),f=n=>{const k=Math.min(1,(n-t0)/1300);c.textContent=Math.round(to*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)}
const h1=$('#name');(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(()=>setTimeout(()=>scr(h1,950),150));
const tk=$$('.ticker-in');const upd=()=>tk.forEach(t=>{const half=t.scrollWidth/2,s=(scrollY*.6)%half,d=+t.dataset.tk;t.style.transform=`translate3d(${d>0?-s:s-half}px,0,0)`});upd();if(!RM){addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd)}
$$('.copy').forEach(b=>b.onclick=()=>{const v=b.previousElementSibling.textContent;try{navigator.clipboard.writeText(v)}catch(e){}b.textContent='Copied';setTimeout(()=>b.textContent='Copy',1400)})})();

/* extra topologies */
(()=>{
const loop=(cv,step,draw)=>{let vis=true,last=performance.now();watch(cv,v=>vis=v);const f=n=>{requestAnimationFrame(f);if(!vis){last=n;return}const dt=Math.min((n-last)/1000,.05);last=n;step(dt);draw()};if(!RM)requestAnimationFrame(f)};
const hms=d=>pad(d.getHours())+':'+pad(d.getMinutes())+':'+pad(d.getSeconds());
const lab=(ctx,t,x,y,col,s,a)=>{ctx.fillStyle=col;ctx.textAlign=a||'center';ctx.font='500 '+(s||10)+'px '+FM;ctx.fillText(t,x,y)};
function sq(ctx,c,x,y,col,fill){ctx.fillStyle=fill||c.panel;ctx.strokeStyle=col;ctx.lineWidth=1.6;ctx.beginPath();ctx.rect(x-8,y-8,16,16);ctx.fill();ctx.stroke();ctx.fillStyle=col;ctx.fillRect(x-2.5,y-2.5,5,5)}
function dot(ctx,x,y,col,r){ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y,r||3.8,0,7);ctx.fill()}
function ring(ctx,x,y,a,col){ctx.globalAlpha=Math.max(0,1-a);ctx.strokeStyle=col;ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(x,y,12+a*30,0,7);ctx.stroke();ctx.globalAlpha=1}

/* high availability across zones */
(()=>{const cv=$('#haCanvas'),chips=$('#haChips'),LOG=$('#haLog'),ZY=[.2,.5,.8];let ctx,W,H=380,fail=-1,P=[],B=[],rr=0,sp=.3,pb=.8,wf=2.5,t=0,cnt=[0,0,0],ev=[];
['All healthy','Fail zone 1','Fail zone 2','Fail zone 3'].forEach((o,i)=>{const b=document.createElement('button');b.type='button';b.className='chip';b.textContent=o;b.setAttribute('aria-pressed',i===0);b.onclick=()=>{fail=i-1;$$('.chip',chips).forEach((c,j)=>c.setAttribute('aria-pressed',j===i));info()};chips.append(b)});
function info(){$('#haTitle').textContent=fail<0?'All zones healthy':'Zone '+(fail+1)+' down';
$('#haText').textContent=fail<0?'A zone-redundant Application Gateway with WAF takes the traffic, and a load balancer spreads it across VMs in three Availability Zones. Each zone has its own power, cooling and network, so one fault cannot take them all.':'The gateway’s health probe marks the VM in zone '+(fail+1)+' unhealthy and stops sending it traffic. Gateway instances in the other zones keep serving, so users notice nothing. Site Recovery covers a full-region outage.';
$('#haStat').textContent='Serving '+(fail<0?3:2)+' of 3 zones · requests: Z1 '+cnt[0]+' · Z2 '+cnt[1]+' · Z3 '+cnt[2]}
const K={o:['a','✓ ROUTE'],p:['d','✕ PROBE'],w:['d','✕ WAF']};
function add(k,txt,em){ev=ev.slice(-7).concat([[new Date(),k,txt,em]]);LOG.innerHTML=ev.map(e=>`<li><span class="ts">${hms(e[0])}</span><span class="${K[e[1]][0]}">${K[e[1]][1]}</span><span>${e[2]} <em>${e[3]}</em></span></li>`).join('');info()}
const pos=()=>({cl:[W*.06,H/2],ag:[W*.2,H/2],ai:ZY.map(z=>[W*.2,H*z]),lb:[W*.35,H/2],vm:ZY.map(z=>[W*.62,H*z]),dr:[W*.915,H/2]});
function layout(){[ctx,W]=fit(cv,H)}
function draw(){const c=C(),p=pos(),sm=W<520;ctx.clearRect(0,0,W,H);
ctx.setLineDash([6,5]);ctx.strokeStyle=c.line;ctx.lineWidth=1;ctx.strokeRect(W*.43,H*.03,W*.37,H*.94);ctx.setLineDash([]);lab(ctx,'PRIMARY REGION',W*.44,H*.03+13,c.muted,9,'left');
ZY.forEach((z,i)=>{const bad=fail===i,y=H*z-H*.1;if(bad){ctx.globalAlpha=.12;ctx.fillStyle=c.deny;ctx.fillRect(W*.45,y,W*.33,H*.2);ctx.globalAlpha=1}ctx.setLineDash([4,4]);ctx.strokeStyle=bad?c.deny:c.line;ctx.lineWidth=1;ctx.strokeRect(W*.45,y,W*.33,H*.2);ctx.setLineDash([]);lab(ctx,'ZONE '+(i+1),W*.46,y+13,bad?c.deny:c.muted,9,'left')});
ctx.strokeStyle=c.line;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(...p.cl);ctx.lineTo(...p.ag);ctx.moveTo(...p.ag);ctx.lineTo(...p.lb);ctx.stroke();
p.vm.forEach((v,i)=>{ctx.setLineDash(fail===i?[3,4]:[]);ctx.strokeStyle=fail===i?c.deny:c.line;ctx.beginPath();ctx.moveTo(...p.lb);ctx.lineTo(...v);ctx.stroke();ctx.setLineDash([])});
ctx.setLineDash([2,5]);ctx.strokeStyle=c.accent;ctx.globalAlpha=.5;ctx.beginPath();p.vm.forEach(v=>{ctx.moveTo(...v);ctx.lineTo(...p.dr)});ctx.stroke();ctx.globalAlpha=1;ctx.setLineDash([]);
ctx.setLineDash([6,5]);ctx.strokeStyle=c.line;ctx.strokeRect(W*.84,H*.3,W*.15,H*.4);ctx.setLineDash([]);lab(ctx,'DR REGION',W*.85,H*.3+13,c.muted,9,'left');lab(ctx,'ASR',W*.82,H*.5-24,c.accent,9);
ctx.fillStyle=c.panel;ctx.strokeStyle=c.accent;ctx.lineWidth=2;ctx.beginPath();ctx.rect(W*.2-8,H*.16,16,H*.68);ctx.fill();ctx.stroke();
p.ai.forEach((a,i)=>{const bad=fail===i;sq(ctx,c,a[0],a[1],bad?c.deny:c.accent)});lab(ctx,sm?'APP GW':'APP GATEWAY',W*.2,H*.16-20,c.accent,sm?8:10);lab(ctx,'WAF · zone-redundant',W*.2,H*.16-8,c.muted,8);
sq(ctx,c,p.cl[0],p.cl[1],c.fg);lab(ctx,'CLIENT',p.cl[0],p.cl[1]+25,c.fg,sm?8:10);
ctx.fillStyle=c.panel;ctx.strokeStyle=c.accent;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p.lb[0],p.lb[1]-14);ctx.lineTo(p.lb[0]+14,p.lb[1]);ctx.lineTo(p.lb[0],p.lb[1]+14);ctx.lineTo(p.lb[0]-14,p.lb[1]);ctx.closePath();ctx.fill();ctx.stroke();lab(ctx,'LB',p.lb[0],p.lb[1]+28,c.accent,10);
p.vm.forEach((v,i)=>{const bad=fail===i,k=bad?c.deny:c.allow;sq(ctx,c,v[0],v[1],k);lab(ctx,'VM '+(i+1),v[0],v[1]+25,bad?c.deny:c.fg,10);if(bad)lab(ctx,'✕',v[0]+20,v[1]-6,c.deny,15)});
sq(ctx,c,p.dr[0],p.dr[1],c.muted);lab(ctx,'REPLICA',p.dr[0],p.dr[1]+25,c.muted,sm?8:10);
P.forEach(q=>{let a,b,k=c.accent;if(q.k==='x'){a=p.ai[q.z];b=p.vm[q.z];k=c.deny}else if(q.k==='w'){a=p.cl;b=p.ag;k=c.deny}else if(q.ph===0){a=p.cl;b=p.ag}else if(q.ph===1){a=p.ag;b=p.lb}else{a=p.lb;b=p.vm[q.z];k=c.allow}const x=a[0]+(b[0]-a[0])*q.p,y=a[1]+(b[1]-a[1])*q.p,tp=Math.max(0,q.p-.12);ctx.globalAlpha=.35;ctx.strokeStyle=k;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(a[0]+(b[0]-a[0])*tp,a[1]+(b[1]-a[1])*tp);ctx.lineTo(x,y);ctx.stroke();ctx.globalAlpha=1;dot(ctx,x,y,k)});
B.forEach(b=>{const at=b.w?p.ag:p.vm[b.z];ring(ctx,at[0],at[1],b.a,b.d?c.deny:c.allow)})}
function step(dt){t+=dt;sp-=dt;if(sp<=0){if(P.length<12)P.push({k:'r',ph:0,p:0});sp=.45+Math.random()*.35}
pb-=dt;if(fail>=0&&pb<=0){P.push({k:'x',p:0,z:fail});pb=1.3}
wf-=dt;if(wf<=0){P.push({k:'w',p:0});wf=3.5+Math.random()*2}
for(let i=P.length-1;i>=0;i--){const q=P[i];q.p+=dt/(q.k==='r'&&q.ph<2?.7:1);
if(q.k==='x'){if(q.p>=.55){B.push({z:q.z,d:1,a:0});add('p','APP GW → ZONE '+(q.z+1)+' VM','health probe failed · removed from pool');P.splice(i,1)}continue}
if(q.k==='w'){if(q.p>=.9){B.push({w:1,d:1,a:0});add('w','CLIENT → APP GW','sql-injection · blocked by WAF');P.splice(i,1)}continue}
if(q.p>=1){if(q.ph<2){if(q.ph===1){const ok=[0,1,2].filter(z=>z!==fail);q.z=ok[rr++%ok.length]}q.ph++;q.p=0}else{cnt[q.z]++;B.push({z:q.z,d:0,a:0});add('o','LB → ZONE '+(q.z+1)+' VM','tcp/443 · probe ok');P.splice(i,1)}}}
B=B.filter(b=>(b.a+=dt*1.5)<1)}
layout();info();for(let i=0;i<5;i++)add('o','LB → ZONE '+(i%3+1)+' VM','tcp/443 · probe ok');draw();addEventListener('resize',()=>{layout();draw()});loop(cv,step,draw)})();

/* email approval VM start and stop */
(()=>{const cv=$('#emCanvas'),chips=$('#emChips'),LOG=$('#emLog'),OL=$('#emSteps'),VS=$('#emVm');let ctx,W,H=400,mode='alt',run='approve',idx=0,tt=0,pause=0,vm='stopped',ev=[],jump=null;
const N={req:['REQUESTER',.07,.5],mbx:['MAILBOX',.26,.5],apv:['APPROVER',.46,.5],la:['LOGIC APP',.68,.5],vm:['AZURE VM',.92,.5],ntf:['NOTIFY MAIL',.4,.86]};
const S0=[['i',['req','mbx'],'A user emails a request to start a VM, for example “Start VM-APP-01”. Nobody has to log in to the portal.','Request email received',1],['i',['mbx','apv'],'The request reaches the approver as an email with Approve and Deny buttons.','Approval email delivered',1]];
const S={approve:S0.concat([['a',['apv','la'],'The approver clicks Approve. The request hits the Logic App.','Approved · Logic App triggered',1],['a',['la','vm'],'The Logic App starts the VM, so the server boots without anyone opening the portal.','VM start called',0],['a',['la','ntf','req'],'A notification email tells the requester the VM has started.','Requester notified: started',1]]),
deny:S0.concat([['d',['apv','la'],'The approver clicks Deny. The Logic App gets the decision and takes no start action.','Denied',1],['d',['la','vm'],'No start call is made, so the VM stays stopped.','VM start skipped',0],['i',['la','ntf','req'],'A notification email tells the requester the request was denied.','Requester notified: denied',1]])};
const TR=.9,dur=s=>(s[1].length-1)*TR+1.1,G={a:'✓',d:'✕',i:'i'},KN={a:'allow',d:'deny',i:'info'};
[['alt','Alternate'],['approve','Approve'],['deny','Deny']].forEach(([m,l])=>{const b=document.createElement('button');b.type='button';b.className='chip';b.textContent=l;b.setAttribute('aria-pressed',m===mode);b.onclick=()=>{mode=m;$$('.chip',chips).forEach(x=>x.setAttribute('aria-pressed',x.textContent===l));if(m!=='alt'&&m!==run){newRun(m)}};chips.append(b)});
function setVm(s){vm=s;VS.textContent='VM status: '+s.toUpperCase()+' · VM-APP-01'}
function buildList(){OL.innerHTML='';S[run].forEach((s,i)=>{const li=document.createElement('li'),b=document.createElement('button');b.type='button';b.className='stp'+(i===idx?' on':'');b.innerHTML=`<span class="g g-${KN[s[0]]}" aria-hidden="true">${G[s[0]]}</span><span>${s[2]}</span>`;b.onclick=()=>{jump=i};li.append(b);OL.append(li)})}
const mark=()=>$$('.stp',OL).forEach((b,i)=>b.classList.toggle('on',i===idx));
const LK={a:['a','✓ OK'],d:['d','✕ NO'],i:['ts','✉ MAIL']};
function add(s){ev=ev.slice(-7).concat([[new Date(),s]]);LOG.innerHTML=ev.map(e=>`<li><span class="ts">${hms(e[0])}</span><span class="${LK[e[1][0]][0]}">${LK[e[1][0]][1]}</span><span>${e[1][3]}</span></li>`).join('')}
function begin(i){idx=i;tt=0;const s=S[run][i];mark();if(run==='approve'){if(i===3)setVm('starting');if(i===4)setVm('running');if(i<3)setVm('stopped')}else setVm('stopped');add(s)}
function newRun(m){run=m;buildList();pause=0;begin(0)}
function layout(){[ctx,W]=fit(cv,H)}
const P=k=>[W*N[k][1],H*N[k][2]];
function env(x,y,k){ctx.fillStyle=C().panel;ctx.strokeStyle=k;ctx.lineWidth=1.5;ctx.beginPath();ctx.rect(x-9,y-6,18,12);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(x-9,y-6);ctx.lineTo(x,y+1);ctx.lineTo(x+9,y-6);ctx.stroke()}
function draw(){const c=C(),cond=getComputedStyle(document.documentElement).getPropertyValue('--cond').trim(),st=S[run][idx],path=st[1],ns=path.length-1,pr=RM?ns:Math.min(ns,tt/TR),kc=st[0]==='d'?c.deny:st[0]==='a'?c.allow:c.accent;ctx.clearRect(0,0,W,H);
[['req','mbx'],['mbx','apv'],['apv','la'],['la','vm'],['la','ntf'],['ntf','req']].forEach(l=>{const a=P(l[0]),b=P(l[1]);ctx.strokeStyle=c.line;ctx.lineWidth=1.2;ctx.setLineDash(l[0]==='ntf'||l[1]==='ntf'?[4,4]:[]);ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.stroke()});ctx.setLineDash([]);
ctx.globalAlpha=.4;ctx.strokeStyle=kc;ctx.lineWidth=3.5;ctx.beginPath();path.forEach((id,i)=>{const q=P(id);if(i===0)ctx.moveTo(...q);else if(i<=pr||RM)ctx.lineTo(...q)});ctx.stroke();ctx.globalAlpha=1;
Object.keys(N).forEach(k=>{const q=P(k),pi=path.indexOf(k),re=pi>=0&&pr>=pi-.02,col=k==='vm'?(vm==='running'?c.allow:vm==='starting'?cond:c.muted):(re?kc:c.fg);sq(ctx,c,q[0],q[1],col);lab(ctx,N[k][0],q[0],q[1]+25,col,W<520?8:10);if(k==='vm')lab(ctx,vm.toUpperCase(),q[0],q[1]+37,col,9);if(k==='la'){ctx.strokeStyle=col;ctx.lineWidth=1.3;ctx.beginPath();ctx.arc(q[0],q[1],17,0,7);ctx.stroke()}});
if(ns>0){const sg=Math.min(ns-1,pr|0),f=pr-sg,a=P(path[sg]),b=P(path[sg+1]),denyLast=st[0]==='d'&&!st[4]&&sg===ns-1,ff=denyLast?Math.min(f,.6):f,x=a[0]+(b[0]-a[0])*ff,y=a[1]+(b[1]-a[1])*ff;if(tt<ns*TR+.3||RM){if(st[4])env(x,y,kc);else dot(ctx,x,y,kc,5)}
if(st[0]==='d'&&!st[4]&&pr>=ns-.02){const e=P(path[ns]),a2=P(path[ns-1]),xx=a2[0]+(e[0]-a2[0])*.6,yy=a2[1]+(e[1]-a2[1])*.6;ctx.fillStyle=c.deny;ctx.textAlign='center';ctx.font='700 18px '+FM;ctx.fillText('✕',xx,yy-10)}}}
function step(dt){if(jump!=null){run===run;begin(jump);jump=null;pause=0}
if(pause>0){pause-=dt;if(pause<=0){const nx=mode==='alt'?(run==='approve'?'deny':'approve'):mode;newRun(nx)}return}
tt+=dt;if(tt>=dur(S[run][idx])){if(idx<S[run].length-1)begin(idx+1);else pause=2}}
layout();buildList();setVm('stopped');
if(RM){run='approve';idx=4;setVm('running');mark();draw();[0,1,2,3,4].forEach(i=>add(S.approve[i]));OL.onclick=()=>setTimeout(()=>{if(jump!=null){begin(jump);jump=null}draw()},0)}else{begin(0)}
draw();addEventListener('resize',()=>{layout();draw()});loop(cv,step,draw)})();

/* global AI translator */
(()=>{const L={en:['English','Hello, how are you?'],hi:['Hindi','नमस्ते, आप कैसे हैं?'],te:['Telugu','నమస్కారం, మీరు ఎలా ఉన్నారు?'],fr:['French','Bonjour, comment allez-vous ?'],ja:['Japanese','こんにちは、お元気ですか？'],pt:['Portuguese','Olá, como você está?'],de:['German','Hallo, wie geht es Ihnen?'],es:['Spanish','Hola, ¿cómo estás?']};
const U=[['INDIA','te',-90],['FRANCE','fr',-30],['JAPAN','ja',30],['BRAZIL','pt',90],['GERMANY','de',150],['SPAIN','es',-150]];
const cv=$('#trCanvas'),sc=$('#trSrcChips'),tc=$('#trTgtChips'),LOG=$('#trLog');let ctx,W,H=420,sel=0,tg='en',P=[],B=[],sp=.4,t=0,ev=[];
const TG=['en','hi','te','fr'];
const tgt=u=>U[u][1]===tg?'en':tg;
[...U.map(u=>u[0]),'MIXED'].forEach((n,i)=>{const b=document.createElement('button');b.type='button';b.className='chip';b.textContent=n;b.setAttribute('aria-pressed',i===0);b.onclick=()=>{sel=i<U.length?i:-1;$$('.chip',sc).forEach((c,j)=>c.setAttribute('aria-pressed',j===i));info()};sc.append(b)});
TG.forEach(k=>{const b=document.createElement('button');b.type='button';b.className='chip';b.textContent=L[k][0];b.setAttribute('aria-pressed',k===tg);b.onclick=()=>{tg=k;$$('.chip',tc).forEach((c,j)=>c.setAttribute('aria-pressed',TG[j]===k));info()};tc.append(b)});
function info(){const u=sel<0?0:sel,s=U[u][1],o=tgt(u);$('#trTitle').textContent=U[u][0].charAt(0)+U[u][0].slice(1).toLowerCase()+' · '+L[s][0]+' → '+L[o][0];$('#trSrc').textContent=L[s][1];$('#trOut').textContent=L[o][1]}
function add(u,o){ev=ev.slice(-7).concat([[new Date(),u,o]]);LOG.innerHTML=ev.map(e=>`<li><span class="ts">${hms(e[0])}</span><span class="a">✓ OK</span><span>${U[e[1]][0]} <em>${U[e[1]][1]} → ${e[2]} · translated</em></span></li>`).join('')}
const hub=()=>[W/2,H/2],up=i=>{const a=U[i][2]*Math.PI/180,rx=Math.min(W*.38,420),ry=H*.34;return[W/2+rx*Math.cos(a),H/2+ry*Math.sin(a)]};
function layout(){[ctx,W]=fit(cv,H)}
function draw(){const c=C(),h=hub();ctx.clearRect(0,0,W,H);
ctx.strokeStyle=c.line;ctx.lineWidth=1;ctx.globalAlpha=.7;ctx.beginPath();ctx.arc(h[0],h[1],78,0,7);ctx.stroke();ctx.beginPath();ctx.ellipse(h[0],h[1],30,78,0,0,7);ctx.stroke();ctx.beginPath();ctx.ellipse(h[0],h[1],78,26,0,0,7);ctx.stroke();ctx.beginPath();ctx.moveTo(h[0]-78,h[1]);ctx.lineTo(h[0]+78,h[1]);ctx.moveTo(h[0],h[1]-78);ctx.lineTo(h[0],h[1]+78);ctx.stroke();ctx.globalAlpha=1;
U.forEach((u,i)=>{const p=up(i),on=sel===i;ctx.strokeStyle=on?c.accent:c.line;ctx.lineWidth=on?1.8:1;ctx.setLineDash([3,4]);ctx.beginPath();ctx.moveTo(...p);ctx.lineTo(...h);ctx.stroke();ctx.setLineDash([])});
P.forEach(q=>{const a=q.ph?h:up(q.u),b=q.ph?up(q.u):h,k=q.ph?c.allow:c.accent,x=a[0]+(b[0]-a[0])*q.p,y=a[1]+(b[1]-a[1])*q.p,tp=Math.max(0,q.p-.12);ctx.globalAlpha=.35;ctx.strokeStyle=k;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(a[0]+(b[0]-a[0])*tp,a[1]+(b[1]-a[1])*tp);ctx.lineTo(x,y);ctx.stroke();ctx.globalAlpha=1;dot(ctx,x,y,k);lab(ctx,(q.ph?q.o:U[q.u][1]).toUpperCase(),x,y-9,k,9)});
B.forEach(b=>ring(ctx,h[0],h[1],b.a,C().allow));
ctx.save();ctx.translate(...h);ctx.strokeStyle=c.accent;ctx.lineWidth=1.3;ctx.setLineDash([6,6]);ctx.rotate(t*.6);ctx.beginPath();ctx.arc(0,0,44,0,7);ctx.stroke();ctx.restore();ctx.setLineDash([]);
ctx.fillStyle=c.panel;ctx.strokeStyle=c.accent;ctx.lineWidth=1.8;ctx.beginPath();ctx.rect(h[0]-28,h[1]-18,56,36,0);ctx.fill();ctx.stroke();lab(ctx,'AI',h[0],h[1]-2,c.accent,10);lab(ctx,'TRANSLATOR',h[0],h[1]+11,c.accent,7.5);lab(ctx,'global endpoint',h[0],h[1]+60,c.muted,9);
U.forEach((u,i)=>{const p=up(i),on=sel===i,k=on?c.accent:c.fg;sq(ctx,c,p[0],p[1],k);const upp=Math.sin(u[2]*Math.PI/180)<-.6;lab(ctx,u[0],p[0],upp?p[1]-18:p[1]+24,k,10);lab(ctx,L[u[1]][0],p[0],upp?p[1]-30:p[1]+36,c.muted,9)})}
function step(dt){t+=dt;sp-=dt;if(sp<=0){if(P.length<8){const u=sel>=0?sel:Math.random()*U.length|0;P.push({u,ph:0,p:0,o:tgt(u)})}sp=.7+Math.random()*.5}
for(let i=P.length-1;i>=0;i--){const q=P[i];q.p+=dt/1.1;if(q.p>=1){if(!q.ph){q.ph=1;q.p=0;B.push({a:0});add(q.u,q.o)}else P.splice(i,1)}}B=B.filter(b=>(b.a+=dt*1.5)<1)}
layout();info();for(let i=0;i<5;i++)add(i,tgt(i));draw();addEventListener('resize',()=>{layout();draw()});loop(cv,step,draw)})();
})();
})();
