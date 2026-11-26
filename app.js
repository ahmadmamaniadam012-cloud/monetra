
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {getAuth,onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,updateProfile,sendPasswordResetEmail,reauthenticateWithCredential,EmailAuthProvider,updatePassword} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {getFirestore,collection,collectionGroup,doc,setDoc,updateDoc,deleteDoc,query,where,onSnapshot,serverTimestamp,addDoc,orderBy,increment,arrayUnion,arrayRemove} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {CONFIG} from "./config.js";

(function(){var sp=document.getElementById('splash');if(!sp)return;try{if(sessionStorage.getItem('splash')==='1'){sp.remove();return}sessionStorage.setItem('splash','1')}catch(e){}})();

var CATS=['Phones & Gadgets','Fashion & Tailoring','Food','Home & Repairs','Beauty','Tutoring','Transport & Delivery','Other'];
var AREAS=['Sabon Gari','Barade','Magami','Mayo Gwoi'];
var CI=[
 '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
 '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.5 8l11 10M8.5 16L20 6"/>',
 '<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10"/><path d="M17 3c-2 2-3 5-3 8h3v10"/>',
 '<path d="M4 20l8-8"/><path d="M10 6l4-3 5 5-3 4z"/>',
 '<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>',
 '<path d="M3 5h8a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H3z"/><path d="M21 5h-8"/><path d="M21 5v13h-8"/>',
 '<rect x="2" y="7" width="12" height="9" rx="1"/><path d="M14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
 '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>'
];
var IC={
 home:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
 chat:'<path d="M4 5h16v11H9l-5 4z"/>',
 admin:'<path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
 saved:'<path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z"/>',
 back:'<path d="M15 5l-7 7 7 7"/>',
 chev:'<path d="M9 5l7 7-7 7"/>',
 svc:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2"/>',
 share:'<circle cx="6" cy="12" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M8.7 10.7l6.6-3.4M8.7 13.3l6.6 3.4"/>',
 lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
 help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7"/><path d="M12 17h.01"/>',
 doc:'<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
 dl:'<path d="M12 4v11"/><path d="M7 11l5 5 5-5"/><path d="M5 20h14"/>',
 edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/>',
 out:'<path d="M9 4H5v16h4"/><path d="M16 8l4 4-4 4M20 12H9"/>',
 find:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
 star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>'
};
function svg(p,s){return '<svg viewBox="0 0 24 24" width="'+(s||22)+'" height="'+(s||22)+'" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>'}
function ci(c,s){var i=CATS.indexOf(c);return svg(CI[i<0?7:i],s||20)}
function heartSvg(on){return '<svg viewBox="0 0 24 24" width="18" height="18" fill="'+(on?'currentColor':'none')+'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z"/></svg>'}
var TICK='<svg viewBox="0 0 24 24" width="15" height="15" aria-label="Verified" role="img"><path fill="currentColor" d="M12 2l2.4 2 3.1-.2 1 3 2.6 1.7-.9 3 .9 3-2.6 1.7-1 3-3.1-.2L12 22l-2.4-2-3.1.2-1-3L2.9 15.5l.9-3-.9-3L5.5 7.8l1-3 3.1.2z"/><path d="M8.5 12l2.5 2.5L15.5 10" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>';

var app=document.getElementById('app');
var configured=CONFIG&&CONFIG.firebase&&CONFIG.firebase.apiKey&&CONFIG.firebase.apiKey.indexOf('PASTE')<0;
var S={view:'home',prev:'home',user:null,authReady:false,approved:[],loaded:false,loadErr:false,all:[],mine:null,chats:[],msgs:[],chatId:null,chatMeta:null,ads:[],reviews:[],favs:[],reports:[],settings:{commission:7,whatsapp:''},q:'',cat:'All',area:'All',sort:'feat',tab:'in',err:'',photo:'',svcId:null,rate:0,delAd:null,anim:false,gridAnim:true,editName:false,installEvt:null};
var ST={};
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function naira(n){return '₦'+Number(n).toLocaleString('en-NG')}
function wa(num,text){var d=String(num||'').replace(/\D/g,'');if(!d)return '';if(d.charAt(0)==='0')d='234'+d.slice(1);else if(d.length===10)d='234'+d;return 'https://wa.me/'+d+(text?'?text='+encodeURIComponent(text):'')}
function tileColor(c){return 'var(--t'+(Math.max(0,CATS.indexOf(c))%5+1)+')'}
function initials(s){return String(s||'?').trim().split(/\s+/).slice(0,2).map(function(w){return w.charAt(0)}).join('').toUpperCase()||'?'}
function toast(m){var t=document.createElement('div');t.className='toast';t.setAttribute('role','status');t.textContent=m;document.body.appendChild(t);setTimeout(function(){t.remove()},3200)}
function isAdmin(){return !!(S.user&&S.user.email&&CONFIG.adminEmail&&S.user.email.toLowerCase()===String(CONFIG.adminEmail).toLowerCase())}
function ms(t){return t&&t.toMillis?t.toMillis():Date.now()}
function setErr(m){S.err=m;var e=document.getElementById('err');if(e){e.style.color='';e.textContent=m}}
function myService(){if(!S.user)return null;return isAdmin()?(S.all.find(function(x){return x.id===S.user.uid})||null):S.mine}
function findSvc(id){return S.approved.find(function(x){return x.id===id})||S.all.find(function(x){return x.id===id})||(S.mine&&S.mine.id===id?S.mine:null)}
function computeStats(){ST={};S.reviews.forEach(function(r){var s=ST[r.serviceId]||(ST[r.serviceId]={sum:0,n:0});s.sum+=Number(r.rating)||0;s.n++})}
function rstat(id){var s=ST[id];return s?{avg:s.sum/s.n,n:s.n}:{avg:0,n:0}}
function ratingHtml(r){return r.n?'<span class="stars">★ '+r.avg.toFixed(1)+'</span> <span class="cnt">('+r.n+')</span>':'<span class="cnt">New</span>'}

var auth,db,unsubs={},unsubMsgs=null;
function sub(key,q,ok,err){if(unsubs[key]){try{unsubs[key]()}catch(e){}}unsubs[key]=onSnapshot(q,ok,err||function(){})}
function clearSubs(){Object.keys(unsubs).forEach(function(k){try{unsubs[k]()}catch(e){}delete unsubs[k]})}
function refresh(){
  if(S.view==='home')renderGrid();
  else if(S.view==='saved')renderSaved();
  else if(S.view==='service')renderRevs();
  else if(S.view==='admin')renderAdminLists();
}
if(configured){
  var fb=initializeApp(CONFIG.firebase);auth=getAuth(fb);db=getFirestore(fb);
  onSnapshot(query(collection(db,'services'),where('status','==','approved')),function(s){S.approved=s.docs.map(function(d){return Object.assign({id:d.id},d.data({serverTimestamps:'estimate'}))});S.loaded=true;S.loadErr=false;refresh()},function(){S.loaded=true;S.loadErr=true;refresh()});
  onSnapshot(collection(db,'ads'),function(s){S.ads=s.docs.map(function(d){return Object.assign({id:d.id},d.data({serverTimestamps:'estimate'}))});S.ads.sort(function(a,b){return ms(a.createdAt)-ms(b.createdAt)});if(S.view==='home')renderAd();if(S.view==='admin')renderAdminLists()},function(){});
  onSnapshot(doc(db,'settings','main'),function(s){if(s.exists()){S.settings=Object.assign(S.settings,s.data());if(S.view==='home')renderAd()}},function(){});
  onSnapshot(collectionGroup(db,'reviews'),function(s){S.reviews=s.docs.map(function(d){return Object.assign({id:d.id},d.data({serverTimestamps:'estimate'}))});computeStats();refresh()},function(){});
  onAuthStateChanged(auth,function(u){
    S.authReady=true;S.user=u;clearSubs();S.chats=[];S.all=[];S.mine=null;S.favs=[];S.reports=[];
    if(u&&isAdmin()){
      sub('all',collection(db,'services'),function(s){S.all=s.docs.map(function(d){return Object.assign({id:d.id},d.data({serverTimestamps:'estimate'}))});refresh()});
      sub('reports',collection(db,'reports'),function(s){S.reports=s.docs.map(function(d){return Object.assign({id:d.id},d.data({serverTimestamps:'estimate'}))});S.reports.sort(function(a,b){return ms(b.at)-ms(a.at)});if(S.view==='admin')renderAdminLists()});
    }else if(u){
      sub('mine',doc(db,'services',u.uid),function(s){S.mine=s.exists()?Object.assign({id:s.id},s.data()):null;if(S.view==='join'||S.view==='account')render()});
    }
    if(u){
      sub('chats',query(collection(db,'chats'),where('participants','array-contains',u.uid)),function(s){S.chats=s.docs.map(function(d){return Object.assign({id:d.id},d.data({serverTimestamps:'estimate'}))});S.chats.sort(function(a,b){return ms(b.updatedAt)-ms(a.updatedAt)});if(S.view==='inbox')render();var bt=document.querySelector('.nav[data-go="inbox"] .nl');if(bt){var n=unreadCount();bt.textContent='Chats'+(n?' '+n:'')}if(S.view==='service')renderRform()});
      sub('favs',doc(db,'users',u.uid),function(s){S.favs=(s.exists()&&s.data().favs)||[];refreshHearts()});
    }
    render();
  });
}
window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();S.installEvt=e;if(S.view==='account')render()});

function go(v){
  closeSheet();
  if(v!=='chat'&&unsubMsgs){unsubMsgs();unsubMsgs=null}
  S.view=v;S.err='';S.photo='';S.anim=true;S.gridAnim=(v==='home'||v==='saved');S.editName=false;render();window.scrollTo(0,0);
}
function backBtn(label){return '<div class="back"><button class="btn ghost small" data-back="1" type="button">'+svg(IC.back,16)+(label||'Back')+'</button></div>'}

/* ---------- navigation bar ---------- */
function navbar(){
  var v=S.view,n=unreadCount(),items=[];
  function b(attr,k,label,on){return '<button class="nav'+(on?' on':'')+'" type="button" '+attr+'>'+svg(IC[k],22)+'<span class="nl">'+label+'</span></button>'}
  items.push(b('data-go="home"','home','Home',v==='home'||v==='service'));
  items.push(b('data-go="saved"','saved','Saved',v==='saved'));
  items.push(b('data-go="inbox"','chat','Chats'+(n?' '+n:''),v==='inbox'||v==='chat'));
  if(isAdmin())items.push(b('data-go="admin"','admin','Admin',v==='admin'));
  items.push(b('data-go="account"','user','Account',v==='account'||v==='join'||v==='about'||v==='auth'||v==='pass'));
  return '<nav class="navbar" aria-label="Main">'+items.join('')+'</nav>';
}

/* ---------- render ---------- */
function render(){
  if(!configured){app.innerHTML='<div class="wrap"><div class="panel"><h2>Almost ready</h2><p>This app needs its database connected. Open <b>config.js</b> on GitHub and paste your Firebase details.</p></div></div>';return}
  if((S.view==='join'||S.view==='inbox'||S.view==='chat'||S.view==='saved'||S.view==='pass')&&!S.user)S.view='auth';
  if(S.view==='admin'&&!isAdmin())S.view='home';
  if(S.view==='service'&&!S.svcId)S.view='home';
  var v=S.view,h='<div class="wrap'+(S.anim?' enter':'')+'">';S.anim=false;
  if(v==='home')h+=homeView();
  else if(v==='service')h+=serviceView();
  else if(v==='auth')h+=authView();
  else if(v==='join')h+=joinView();
  else if(v==='inbox')h+=inboxView();
  else if(v==='chat')h+=chatView();
  else if(v==='saved')h+=savedView();
  else if(v==='account')h+=accountView();
  else if(v==='about')h+=aboutView();
  else if(v==='pass')h+=passView();
  else if(v==='admin')h+=adminView();
  else h+=homeView();
  app.innerHTML=h+'</div>'+navbar();
  if(v==='home'){renderChips();renderGrid();renderAd()}
  if(v==='service'){renderRevs();renderRform()}
  if(v==='saved')renderSaved();
  if(v==='chat')renderMsgs();
  if(v==='admin')renderAdminLists();
}

/* ---------- home ---------- */
function homeView(){
  var ao=['<option value="All">All areas</option>'].concat(AREAS.map(function(a){return '<option'+(S.area===a?' selected':'')+'>'+esc(a)+'</option>'})).join('');
  var so=[['feat','Recommended'],['top','Top rated'],['new','Newest'],['price','Lowest price']].map(function(x){return '<option value="'+x[0]+'"'+(S.sort===x[0]?' selected':'')+'>'+x[1]+'</option>'}).join('');
  return '<header class="hero"><div class="brandrow"><span class="logo">M</span><b>Monetra</b></div><h1>Find any service in Jalingo.</h1><p>Tailors, repairers, tutors, riders and more. See the price, then chat inside the app.</p>'+
   '<div class="heroact"><button class="btn pop" data-go="join" type="button">Offer your service</button><span class="sticker">100% free</span></div></header>'+
   '<div class="search"><input id="q" type="search" placeholder="Search: tailor, phone repair, delivery..." aria-label="Search services" autocomplete="off" value="'+esc(S.q)+'"></div>'+
   '<div class="chips" id="chips" role="group" aria-label="Categories"></div>'+
   '<div class="filters"><select id="f_area" aria-label="Area">'+ao+'</select><select id="f_sort" aria-label="Sort">'+so+'</select></div>'+
   '<div id="ad"></div><div class="count" id="count" aria-live="polite"></div><div class="grid" id="grid"></div>'+
   '<footer><span>Meet in a public place and check the work before you pay.</span></footer>';
}
function renderChips(){var el=document.getElementById('chips');if(!el)return;el.innerHTML=['All'].concat(CATS).map(function(c){return '<button type="button" class="chip" style="--c:'+(c==='All'?'var(--surface)':tileColor(c))+'" data-cat="'+esc(c)+'" aria-pressed="'+(c===S.cat)+'">'+(c==='All'?'':ci(c,16))+esc(c)+'</button>'}).join('')}
function renderAd(){
  var el=document.getElementById('ad');if(!el)return;
  var list=S.ads.filter(function(a){return a.active}).slice(0,3);
  if(!list.length){
    var link=wa(S.settings.whatsapp,'Hello, I want to advertise on Monetra.');
    el.innerHTML='<div class="ad"><div><span class="tag">Advertise here</span><b>Your shop here</b><small>Reach people in Jalingo every day. Advertise on Monetra.</small></div>'+(link?'<a class="btn small" href="'+esc(link)+'" target="_blank" rel="noopener">Ask about ads</a>':'')+'</div>';
    return;
  }
  el.innerHTML=list.map(function(a){var l=wa(a.phone,'Hello, I saw your ad on Monetra.');return '<div class="ad"><div><span class="tag">Ad</span><b>'+esc(a.name)+'</b><small>'+esc(a.text)+'</small></div>'+(l?'<a class="btn small" data-ad="'+esc(a.id)+'" href="'+esc(l)+'" target="_blank" rel="noopener">Chat</a>':'')+'</div>'}).join('');
  list.forEach(function(a){countAd(a.id,'views')});
}
function countAd(id,f){
  if(!S.authReady||isAdmin())return;
  if(f==='views'){try{var k='v_'+id;if(sessionStorage.getItem(k))return;sessionStorage.setItem(k,'1')}catch(e){}}
  var u={};u[f]=increment(1);
  updateDoc(doc(db,'ads',id),u).catch(function(){});
}
function listFiltered(src){
  var t=S.q.trim().toLowerCase();
  var l=src.filter(function(x){
    if(S.cat!=='All'&&x.cat!==S.cat)return false;
    if(S.area!=='All'&&x.area!==S.area)return false;
    if(!t)return true;
    return (x.title+' '+x.desc+' '+x.area+' '+x.cat+' '+x.name).toLowerCase().indexOf(t)>-1;
  });
  var s=S.sort;
  l.sort(function(a,b){
    var ra=rstat(a.id),rb=rstat(b.id);
    if(s==='top')return (rb.avg-ra.avg)||(rb.n-ra.n);
    if(s==='new')return ms(b.createdAt)-ms(a.createdAt);
    if(s==='price')return (a.price||1e12)-(b.price||1e12);
    return ((b.featured?1:0)-(a.featured?1:0))||((b.verified?1:0)-(a.verified?1:0))||(rb.avg-ra.avg)||(ms(b.createdAt)-ms(a.createdAt));
  });
  return l;
}
function cardHtml(l,i){
  var r=rstat(l.id),fav=S.favs.indexOf(l.id)>-1;
  var media=l.photo?'<img src="'+esc(l.photo)+'" alt="" loading="lazy">':'<span class="ti">'+ci(l.cat,64)+'</span>';
  return '<article class="card'+(i>=0?' rise':'')+'"'+(i>=0?' style="--i:'+Math.min(i,8)+'"':'')+' data-svc="'+esc(l.id)+'" tabindex="0" role="button" aria-label="'+esc(l.title)+'">'+
   '<div class="tile" style="background:'+tileColor(l.cat)+'">'+(l.featured?'<span class="badge">Featured</span>':'')+'<button class="heart'+(fav?' on':'')+'" type="button" data-fav="'+esc(l.id)+'" aria-label="Save this service">'+heartSvg(fav)+'</button>'+media+'</div>'+
   '<div class="cbody"><div class="price">'+(l.price?'From '+naira(l.price):'Ask price')+'</div><h3>'+esc(l.title)+'</h3><div class="meta">'+esc(l.name)+(l.verified?' <span class="vf">'+TICK+'</span>':'')+' · '+esc(l.area)+'</div><div class="meta">'+ratingHtml(r)+'</div></div></article>';
}
function renderGrid(){
  var g=document.getElementById('grid');if(!g)return;var cnt=document.getElementById('count');
  if(!S.loaded){g.innerHTML='<div class="card sk"></div><div class="card sk"></div><div class="card sk"></div><div class="card sk"></div>';cnt.textContent='Loading...';return}
  if(S.loadErr&&!S.approved.length){g.innerHTML='<div class="empty" style="grid-column:1/-1">Could not load services. Check your data connection and refresh.</div>';cnt.textContent='';return}
  var list=listFiltered(S.approved),filt=S.q.trim()||S.cat!=='All'||S.area!=='All';
  cnt.textContent=list.length+(list.length===1?' service':' services')+(filt?' found':' available');
  if(!list.length){g.innerHTML='<div class="empty" style="grid-column:1/-1">'+(S.approved.length?'Nothing matches. Try a shorter word or another area.':'No services yet. Be the first. It is free to join.')+'</div>';return}
  var anim=S.gridAnim;S.gridAnim=false;
  g.innerHTML=list.map(function(l,i){return cardHtml(l,anim?i:-1)}).join('');
}

/* ---------- saved ---------- */
function savedView(){return '<h2 class="ptitle">Saved</h2><div class="grid" id="sgrid"></div>'}
function renderSaved(){
  var g=document.getElementById('sgrid');if(!g)return;
  var list=S.approved.filter(function(x){return S.favs.indexOf(x.id)>-1});
  if(!list.length){g.innerHTML='<div class="empty" style="grid-column:1/-1">Nothing saved yet. Tap the heart on any service to keep it here.</div>';return}
  var anim=S.gridAnim;S.gridAnim=false;
  g.innerHTML=list.map(function(l,i){return cardHtml(l,anim?i:-1)}).join('');
}
function refreshHearts(){
  document.querySelectorAll('[data-fav]').forEach(function(b){var on=S.favs.indexOf(b.dataset.fav)>-1;b.classList.toggle('on',on);b.innerHTML=heartSvg(on)});
  if(S.view==='saved')renderSaved();
  var dh=document.getElementById('dfav');if(dh){var on2=S.favs.indexOf(S.svcId)>-1;dh.innerHTML=heartSvg(on2)+(on2?'Saved':'Save')}
}
async function toggleFav(id){
  if(!S.user){S.tab='in';go('auth');return}
  var on=S.favs.indexOf(id)>-1;
  S.favs=on?S.favs.filter(function(x){return x!==id}):S.favs.concat([id]);refreshHearts();
  try{await setDoc(doc(db,'users',S.user.uid),{favs:on?arrayRemove(id):arrayUnion(id)},{merge:true})}catch(e){toast('Could not save. Try again.')}
}

/* ---------- service details ---------- */
function openService(id){S.svcId=id;S.prev=(S.view==='saved'?'saved':'home');S.rate=0;go('service')}
function serviceView(){
  var l=findSvc(S.svcId);
  if(!l)return backBtn()+'<div class="empty">This service is not available any more.</div>';
  var fav=S.favs.indexOf(l.id)>-1,mine=S.user&&S.user.uid===l.id;
  var media=l.photo?'<img src="'+esc(l.photo)+'" alt="'+esc(l.title)+'">':'<span class="ti big">'+ci(l.cat,96)+'</span>';
  return backBtn()+'<div class="dhero" style="background:'+tileColor(l.cat)+'">'+media+'</div>'+
   '<h1 class="dtitle">'+esc(l.title)+'</h1><div class="price lg">'+(l.price?'From '+naira(l.price):'Ask price')+'</div>'+
   '<div class="prov"><span class="avatar">'+esc(initials(l.name))+'</span><div><b>'+esc(l.name)+'</b>'+(l.verified?' <span class="vf">'+TICK+'</span>':'')+'<br><small class="cnt">'+esc(l.area)+'</small></div></div>'+
   '<div class="tags"><span class="pill">'+esc(l.cat)+'</span>'+(l.verified?'<span class="pill ok">Verified</span>':'')+(l.featured?'<span class="pill">Featured</span>':'')+'</div>'+
   (l.desc?'<p class="ddesc">'+esc(l.desc)+'</p>':'')+
   '<div class="actions">'+(mine?'<span class="btn wa" aria-disabled="true">This is your service</span>':'<button class="btn wa" type="button" data-chat="'+esc(l.id)+'" data-title="'+esc(l.title)+'" data-pname="'+esc(l.name)+'">Chat now</button>')+
   '<button class="btn ghost" type="button" id="dfavBtn" data-fav="'+esc(l.id)+'"><span id="dfav">'+heartSvg(fav)+(fav?'Saved':'Save')+'</span></button>'+
   '<button class="btn ghost" type="button" id="share">Share</button></div>'+
   '<div class="sec"><h2>Reviews</h2><div id="rsum"></div><div id="revs"></div><div id="rform"></div></div>'+
   '<div class="sec"><button class="btn ghost small" type="button" id="rpToggle">Report this service</button><div id="rpt"></div></div>';
}
function renderRevs(){
  var l=findSvc(S.svcId);if(!l)return;
  var sum=document.getElementById('rsum'),el=document.getElementById('revs');if(!sum||!el)return;
  var list=S.reviews.filter(function(r){return r.serviceId===l.id}).sort(function(a,b){return ms(b.at)-ms(a.at)});
  var st=rstat(l.id);
  sum.innerHTML=st.n?'<div class="rsum"><span class="big">'+st.avg.toFixed(1)+'</span><div>'+ratingHtml(st)+'<div class="cnt">'+st.n+(st.n===1?' review':' reviews')+'</div></div></div>':'<div class="note">No reviews yet.</div>';
  el.innerHTML=list.map(function(r){
    var del=S.user&&(isAdmin()||r.id===S.user.uid);
    return '<div class="rev"><div><b>'+esc(r.name||'Customer')+'</b> <span class="stars">'+'★'.repeat(Math.max(0,Math.min(5,r.rating)))+'</span></div>'+(r.text?'<div>'+esc(r.text)+'</div>':'')+(del?'<button class="btn ghost small" type="button" data-rvdel="'+esc(r.id)+'">Delete</button>':'')+'</div>';
  }).join('');
  renderRform();
}
function renderRform(){
  var l=findSvc(S.svcId),el=document.getElementById('rform');if(!l||!el)return;
  if(document.getElementById('rv_text')&&document.activeElement===document.getElementById('rv_text'))return;
  if(!S.user){el.innerHTML='<div class="note">Sign in to leave a review.</div><button class="btn small" data-go="auth" type="button">Sign in</button>';return}
  if(S.user.uid===l.id){el.innerHTML='';return}
  var chatted=S.chats.some(function(c){return c.id===l.id+'_'+S.user.uid});
  if(!chatted){el.innerHTML='<div class="note">Chat with this provider first, then you can leave a review.</div>';return}
  var mine=S.reviews.find(function(r){return r.serviceId===l.id&&r.reviewerUid===S.user.uid});
  if(!S.rate&&mine)S.rate=mine.rating;
  var keep=document.getElementById('rv_text'),val=keep?keep.value:(mine?mine.text:'');
  el.innerHTML='<div class="rform"><div class="note">'+(mine?'Your review':'Rate this provider')+'</div><div class="starpick" id="starpick">'+[1,2,3,4,5].map(function(i){return '<button type="button" class="st'+(i<=S.rate?' on':'')+'" data-rate="'+i+'" aria-label="'+i+' stars">★</button>'}).join('')+'</div><textarea id="rv_text" rows="3" maxlength="300" placeholder="Tell others about your experience">'+esc(val)+'</textarea><div class="err" id="err" role="alert"></div><button class="btn" type="button" id="rvSend">'+(mine?'Update review':'Post review')+'</button></div>';
}
function setRate(n){S.rate=n;document.querySelectorAll('#starpick .st').forEach(function(b,i){b.classList.toggle('on',i<n)})}
async function sendReview(){
  var l=findSvc(S.svcId);if(!l||!S.user)return;var ta=document.getElementById('rv_text');
  if(!S.rate){setErr('Tap the stars to rate.');return}
  try{await setDoc(doc(db,'services',l.id,'reviews',S.user.uid),{serviceId:l.id,reviewerUid:S.user.uid,name:S.user.displayName||'Customer',rating:S.rate,text:((ta&&ta.value)||'').trim().slice(0,300),at:serverTimestamp()});toast('Thanks for your review.');setErr('')}
  catch(e){setErr('Could not post the review. You can review after you chat with this provider.')}
}
function openReport(){
  var el=document.getElementById('rpt');if(!el)return;
  if(!S.user){S.tab='in';go('auth');return}
  if(el.innerHTML){el.innerHTML='';return}
  el.innerHTML='<div class="rform"><select id="rp_reason"><option>Looks like a scam</option><option>Wrong or fake information</option><option>Offensive or unsafe</option><option>Other</option></select><textarea id="rp_text" rows="2" maxlength="300" placeholder="Tell us more (optional)"></textarea><div class="err" id="err" role="alert"></div><button class="btn danger" type="button" id="rpSend">Send report</button></div>';
}
async function sendReport(){
  var l=findSvc(S.svcId);if(!l||!S.user)return;
  try{await addDoc(collection(db,'reports'),{serviceId:l.id,serviceTitle:l.title,reporterUid:S.user.uid,reason:document.getElementById('rp_reason').value,text:(document.getElementById('rp_text').value||'').trim().slice(0,300),status:'open',at:serverTimestamp()});document.getElementById('rpt').innerHTML='<div class="note">Thank you. We will look into it.</div>'}
  catch(e){setErr('Could not send the report. Try again.')}
}
async function shareApp(){
  var url=location.href.split('#')[0];
  if(navigator.share){try{await navigator.share({title:'Monetra',text:'Find any service in Jalingo on Monetra. Free to use.',url:url})}catch(e){}return}
  try{await navigator.clipboard.writeText(url);toast('Link copied. Paste it in WhatsApp.')}catch(e){toast(url)}
}

/* ---------- auth ---------- */
function authView(){
  var up=S.tab==='up';
  return '<div class="authbox"><div class="logo big">M</div><h1>'+(up?'Create your account':'Welcome back')+'</h1><p class="note">'+(up?'Free for everyone. Chat with providers and offer your own service.':'Sign in to chat, save services and manage yours.')+'</p></div>'+
   '<div class="panel"><div class="tabs"><button class="chip" data-tab="in" aria-pressed="'+!up+'" type="button">Sign in</button><button class="chip" data-tab="up" aria-pressed="'+up+'" type="button">Create account</button></div>'+
   '<div class="form">'+(up?'<label class="full">Your name<input id="a_name" maxlength="40" autocomplete="name"></label>':'')+'<label class="full">Email<input id="a_email" type="email" autocomplete="email" inputmode="email"></label><label class="full">Password (6 or more characters)<input id="a_pass" type="password" autocomplete="'+(up?'new-password':'current-password')+'"></label>'+
   '<div class="full err" id="err" role="alert">'+esc(S.err)+'</div><div class="full"><button class="btn" id="authGo" type="button">'+(up?'Create account':'Sign in')+'</button> <button class="btn ghost" data-go="home" type="button">Back</button>'+(up?'':' <button class="btn ghost" id="forgot" type="button">Forgot password?</button>')+'</div>'+
   (up?'<div class="full note">By creating an account you agree to the <button class="linkbtn" data-go="about" type="button">terms and privacy</button>.</div>':'')+'</div></div>';
}
function authErr(e){var c=e&&e.code||'';if(c.indexOf('invalid-email')>-1)return 'That email does not look right.';if(c.indexOf('weak-password')>-1)return 'Use a password with at least 6 characters.';if(c.indexOf('email-already')>-1)return 'This email already has an account. Tap Sign in.';if(c.indexOf('invalid-credential')>-1||c.indexOf('wrong-password')>-1||c.indexOf('user-not-found')>-1)return 'Wrong email or password.';if(c.indexOf('network')>-1)return 'No connection. Check your data and try again.';return 'Something went wrong. Try again.'}

/* ---------- account ---------- */
function li(icon,label,sub,attr){return '<button class="li" type="button" '+attr+'><span class="lic">'+svg(IC[icon],20)+'</span><span class="lit">'+label+(sub?'<small>'+sub+'</small>':'')+'</span>'+svg(IC.chev,18)+'</button>'}
function accountView(){
  var help=wa(S.settings.whatsapp,'Hello, I need help with Monetra.');
  var common=(S.installEvt?li('dl','Install Monetra','Add the app to your home screen','id="install"'):'')+li('share','Invite friends','Share the app on WhatsApp','id="share"')+(help?'<a class="li" href="'+esc(help)+'" target="_blank" rel="noopener"><span class="lic">'+svg(IC.help,20)+'</span><span class="lit">Help and contact<small>Chat with us on WhatsApp</small></span>'+svg(IC.chev,18)+'</a>':'')+li('doc','Terms and privacy','','data-go="about"');
  if(!S.user)return '<h2 class="ptitle">Account</h2><div class="panel"><h2>Join Monetra</h2><p class="note">Sign in to chat with providers, save services, leave reviews and offer your own service for free.</p><div class="actions"><button class="btn" type="button" data-go="auth" id="toSignIn">Sign in</button><button class="btn ghost" type="button" id="toSignUp">Create account</button></div></div>'+common;
  var me=myService(),st=me&&me.status;
  var nm=S.user.displayName||'Your name';
  var head=S.editName?'<div class="form"><label class="full">Your name<input id="n_name" maxlength="40" value="'+esc(S.user.displayName||'')+'"></label><div class="full"><button class="btn" id="saveName" type="button">Save</button> <button class="btn ghost" id="cancelName" type="button">Cancel</button></div></div>':'<div class="prof"><span class="avatar">'+esc(initials(nm))+'</span><div><b>'+esc(nm)+'</b><br><small class="cnt">'+esc(S.user.email)+'</small></div></div>';
  return '<h2 class="ptitle">Account</h2><div class="panel">'+head+'</div>'+
   li('svc',me?'My service':'Offer your service',me?('Status: '+(st==='approved'?'Live':st==='pending'?'Waiting for approval':'Removed')):'Free to join','data-go="join"')+
   li('saved','Saved services',S.favs.length+' saved','data-go="saved"')+
   li('edit','Edit my name','','id="editName"')+
   li('lock','Change password','Use your current password','data-go="pass"')+
   common+
   li('out','Sign out','','id="out"');
}

function passView(){
  return '<div class="back"><button class="btn ghost small" data-go="account" type="button">'+svg(IC.back,16)+'Account</button></div><div class="panel"><h2>Change password</h2><p class="note">For your safety, type your current password first. Use a new password nobody can guess, and do not share it.</p>'+
   '<div class="form"><label class="full">Current password<input id="p_old" type="password" autocomplete="current-password"></label><label class="full">New password (6 or more characters)<input id="p_new" type="password" autocomplete="new-password"></label><label class="full">Type the new password again<input id="p_new2" type="password" autocomplete="new-password"></label>'+
   '<label class="full check" style="flex-direction:row;gap:8px;font-size:.9rem"><input id="p_show" type="checkbox" style="width:auto"> <span>Show passwords</span></label>'+
   '<div class="full err" id="err" role="alert"></div><div class="full"><button class="btn" id="passGo" type="button">Save new password</button> <button class="btn ghost" id="passForgot" type="button">I forgot my current password</button></div></div></div>';
}
async function changePass(btn){
  var o=document.getElementById('p_old').value,n=document.getElementById('p_new').value,n2=document.getElementById('p_new2').value;
  if(!o||!n||!n2){setErr('Fill in all three boxes.');return}
  if(n.length<6){setErr('The new password needs at least 6 characters.');return}
  if(n===o){setErr('The new password must be different from the current one.');return}
  if(n!==n2){setErr('The two new passwords do not match.');return}
  btn.disabled=true;
  try{
    var cred=EmailAuthProvider.credential(S.user.email,o);
    await reauthenticateWithCredential(auth.currentUser,cred);
    await updatePassword(auth.currentUser,n);
    toast('Password changed.');go('account');
  }catch(e){
    var c=(e&&e.code)||'';
    setErr(c.indexOf('wrong-password')>-1||c.indexOf('invalid-credential')>-1?'Your current password is wrong.':c.indexOf('too-many')>-1?'Too many tries. Wait a few minutes and try again.':c.indexOf('weak')>-1?'Choose a stronger password.':c.indexOf('network')>-1?'No connection. Check your data.':'Could not change it. Try again.');
    btn.disabled=false;
  }
}

/* ---------- offer / edit service ---------- */
function joinView(){
  var d=myService()||{},st=d.status,c=S.settings.commission;
  var opts=CATS.map(function(x){return '<option'+(x===d.cat?' selected':'')+'>'+esc(x)+'</option>'}).join('');
  var dl=AREAS.map(function(x){return '<option value="'+esc(x)+'">'}).join('');
  var prev=(S.photo||d.photo)?'<img src="'+esc(S.photo||d.photo)+'" alt="Your photo">':'<span>No photo yet</span>';
  return backBtn()+'<div class="panel"><h2>'+(d.id?'Your service':'Offer your service')+'</h2>'+
   (st?'<p>Status: <span class="pill '+(st==='approved'?'ok':st==='removed'?'bad':'')+'">'+(st==='approved'?'Live':st==='pending'?'Waiting for approval':'Removed')+'</span></p>':'<p class="note">It is free. We check every service before it goes live, then customers can find you and chat with you here.</p>')+
   '<div class="form"><label class="full">What do you do? (example: Phone screen repair)<input id="j_title" maxlength="80" value="'+esc(d.title)+'"></label>'+
   '<label>Your name<input id="j_name" maxlength="40" value="'+esc(d.name||(S.user&&S.user.displayName)||'')+'"></label><label>Starting price (₦)<input id="j_price" inputmode="numeric" value="'+esc(d.price||'')+'"></label>'+
   '<label>Category<select id="j_cat">'+opts+'</select></label><label>Area<input id="j_area" list="areas" maxlength="40" value="'+esc(d.area)+'"></label><datalist id="areas">'+dl+'</datalist>'+
   '<label class="full">About your service<textarea id="j_desc" rows="3" maxlength="200">'+esc(d.desc)+'</textarea></label>'+
   '<label class="full">Photo<input id="j_photo" type="file" accept="image/*"></label><div class="full photoprev" id="j_prev">'+prev+'</div>'+
   '<div class="full agree"><label class="check" style="flex-direction:row;gap:8px;color:var(--ink);font-size:.9rem"><input id="j_agree" type="checkbox" style="width:auto"'+(d.agreed?' checked':'')+'> <span>I agree that Monetra takes <b>'+esc(c)+'%</b> of the payment for jobs paid through the app. It is free to join.</span></label></div>'+
   '<div class="full err" id="err" role="alert">'+esc(S.err)+'</div><div class="full"><button class="btn" id="joinGo" type="button">'+(d.id?'Save changes':'Send for approval')+'</button>'+(d.id?' <button class="btn danger" id="delMine" type="button">Delete my service</button>':'')+'</div></div></div>';
}

/* ---------- chat ---------- */
function getSeen(id){try{return Number(localStorage.getItem('seen_'+id))||0}catch(e){return 0}}
function markSeen(id){try{localStorage.setItem('seen_'+id,String(Date.now()))}catch(e){}}
function isUnread(c){return !!S.user&&!!c.lastFrom&&c.lastFrom!==S.user.uid&&ms(c.updatedAt)>getSeen(c.id)}
function unreadCount(){return S.chats.filter(isUnread).length}
function otherName(c){return S.user&&S.user.uid===c.providerUid?(c.buyerName||'Customer'):(c.providerName||'Provider')}
function inboxView(){
  var rows=S.chats.map(function(c){return '<button class="li" type="button" data-open="'+esc(c.id)+'"><span class="avatar">'+esc(initials(otherName(c)))+'</span><span class="lit"><b>'+esc(otherName(c))+'</b>'+(isUnread(c)?' <span class="pill ok">New</span>':'')+'<small>'+esc(c.serviceTitle||'')+(c.lastText?' · '+esc(c.lastText):'')+'</small></span>'+svg(IC.chev,18)+'</button>'}).join('');
  return '<h2 class="ptitle">Chats</h2>'+(rows||'<div class="empty">No chats yet. Open a service and tap Chat now.</div>');
}
function chatView(){
  var c=S.chatMeta||S.chats.find(function(x){return x.id===S.chatId})||{};
  return '<div class="back"><button class="btn ghost small" data-go="inbox" type="button">'+svg(IC.back,16)+'Chats</button></div><div class="panel"><div class="prof"><span class="avatar">'+esc(initials(otherName(c)))+'</span><div><b>'+esc(otherName(c))+'</b><br><small class="cnt">'+esc(c.serviceTitle||'')+'</small></div></div><div class="msgs" id="msgs" aria-live="polite"></div><div class="sendrow"><input id="m_in" maxlength="1000" placeholder="Type a message" autocomplete="off"><button class="btn" id="sendBtn" type="button">Send</button></div><div class="note">Agree the price and details here.</div></div>';
}
function renderMsgs(){
  var el=document.getElementById('msgs');if(!el)return;
  el.innerHTML=S.msgs.length?S.msgs.map(function(m){return '<div class="b'+(S.user&&m.from===S.user.uid?' me':'')+'">'+esc(m.text)+'</div>'}).join(''):'<div class="note">Say hello. Write what you need and the price you can pay.</div>';
  el.scrollTop=el.scrollHeight;
}
function showChat(id){
  if(unsubMsgs){unsubMsgs();unsubMsgs=null}
  S.chatId=id;S.msgs=[];S.chatMeta=S.chats.find(function(x){return x.id===id})||S.chatMeta;
  markSeen(id);S.view='chat';S.anim=true;render();window.scrollTo(0,0);
  unsubMsgs=onSnapshot(query(collection(db,'chats',id,'messages'),orderBy('at')),function(s){S.msgs=s.docs.map(function(d){return d.data({serverTimestamps:'estimate'})});markSeen(id);renderMsgs()},function(){toast('Could not load messages.')});
}
async function openChat(pid,title,pname){
  if(!S.user){S.tab='in';go('auth');return}
  if(pid===S.user.uid){toast('This is your own service.');return}
  var id=pid+'_'+S.user.uid;
  var meta={providerUid:pid,buyerUid:S.user.uid,participants:[pid,S.user.uid],providerName:pname||'Provider',buyerName:S.user.displayName||'Customer',serviceTitle:title||''};
  try{await setDoc(doc(db,'chats',id),meta,{merge:true})}catch(e){toast('Could not open the chat. Try again.');return}
  S.chatMeta=Object.assign({id:id},meta);showChat(id);
}
async function sendMsg(){
  var inp=document.getElementById('m_in');if(!inp||!S.user||!S.chatId)return;
  var txt=inp.value.trim().slice(0,1000);if(!txt)return;inp.value='';
  try{
    await addDoc(collection(db,'chats',S.chatId,'messages'),{from:S.user.uid,text:txt,at:serverTimestamp()});
    await updateDoc(doc(db,'chats',S.chatId),{lastText:txt.slice(0,80),lastFrom:S.user.uid,updatedAt:serverTimestamp()});
  }catch(e){inp.value=txt;toast('Message not sent. Check your connection.')}
}

/* ---------- terms ---------- */
function aboutView(){
  var c=S.settings.commission;
  return backBtn()+'<div class="panel legal"><h2>Terms and privacy</h2><p class="note">A plain-language summary.</p>'+
   '<h3>What Monetra is</h3><p>Monetra helps people in Jalingo find service providers and chat with them. Monetra does not do the work and is not a party to the deals you make. Meet in a public place and check the work before you pay.</p>'+
   '<h3>What we keep</h3><p>Your name and email, the service you list (name, price, area, description, photo), your reviews, saved services and chats. A live service and its reviews are public. Chats are meant to be private between the two people in them. The app owner can technically access stored data and will only look at it to deal with a report or abuse.</p>'+
   '<h3>Rules</h3><p>No scams, fake services, illegal goods or harassment. We can remove a service or an account that breaks these rules.</p>'+
   '<h3>Fees</h3><p>It is free to join and to use. When payments through the app start, Monetra takes '+esc(c)+'% of paid jobs. Providers agree to this before listing.</p>'+
   '<h3>Your data</h3><p>To delete your account or your data, contact us from the Account screen.</p></div>';
}

/* ---------- admin ---------- */
function adminView(){
  var s=S.settings;
  return '<h2 class="ptitle">Admin</h2>'+
   '<div class="panel"><h2>Reports</h2><div class="rows" id="adm_rep"></div></div>'+
   '<div class="panel"><h2>Waiting for approval</h2><div class="rows" id="adm_p"></div></div>'+
   '<div class="panel"><h2>Live services</h2><div class="rows" id="adm_l"></div></div>'+
   '<div class="panel"><h2>Ads</h2><div class="note">Up to 3 live ads show on the home page. Show shops these numbers when you sell them a spot. Counts can be inflated by someone tapping repeatedly, so treat them as a guide.</div><div class="note" id="adm_tot"></div><div class="rows" id="adm_ads"></div>'+
   '<div class="form" style="margin-top:12px"><label class="full">Shop or business name<input id="ad_name" maxlength="40"></label><label class="full">Short message<input id="ad_text" maxlength="90"></label><label class="full">Their WhatsApp number<input id="ad_phone" inputmode="tel" placeholder="08012345678"></label><div class="full"><button class="btn" id="addAd" type="button">Add ad</button></div></div></div>'+
   '<div class="panel"><h2>Your settings</h2><div class="form"><label>Commission (%)<input id="s_comm" inputmode="numeric" value="'+esc(s.commission)+'"></label><label>Your WhatsApp<input id="s_wa" inputmode="tel" value="'+esc(s.whatsapp)+'"></label><div class="full"><button class="btn" id="saveSet" type="button">Save settings</button></div></div></div>';
}
function row(title,sub,acts){return '<div class="row"><div class="nm"><b>'+title+'</b><br><small>'+sub+'</small></div><div class="acts">'+acts+'</div></div>'}
function renderAdminLists(){
  var p=S.all.filter(function(x){return x.status==='pending'}),a=S.all.filter(function(x){return x.status==='approved'});
  var open=S.reports.filter(function(r){return r.status==='open'});
  var E=function(t){return '<div class="empty">'+t+'</div>'};
  var el=document.getElementById('adm_rep');if(el)el.innerHTML=open.map(function(r){return row(esc(r.serviceTitle||'Service'),esc(r.reason)+(r.text?' · '+esc(r.text):''),'<button class="btn ghost small" type="button" data-rp="view" data-id="'+esc(r.serviceId)+'">View</button><button class="btn danger small" type="button" data-rp="remove" data-id="'+esc(r.serviceId)+'" data-rid="'+esc(r.id)+'">Remove service</button><button class="btn ghost small" type="button" data-rp="close" data-rid="'+esc(r.id)+'">Dismiss</button>')}).join('')||E('No open reports.');
  el=document.getElementById('adm_p');if(el)el.innerHTML=p.map(function(x){return row(esc(x.title),esc(x.name)+' · '+esc(x.area),'<button class="btn small" type="button" data-act="approve" data-id="'+esc(x.id)+'">Approve</button><button class="btn danger small" type="button" data-act="remove" data-id="'+esc(x.id)+'">Reject</button>')}).join('')||E('Nothing waiting.');
  el=document.getElementById('adm_l');if(el)el.innerHTML=a.map(function(x){return row(esc(x.title)+(x.verified?' '+TICK:''),esc(x.name)+' · '+esc(x.area),'<button class="btn ghost small" type="button" data-act="feat" data-id="'+esc(x.id)+'">'+(x.featured?'Unfeature':'Feature')+'</button><button class="btn ghost small" type="button" data-act="verify" data-id="'+esc(x.id)+'">'+(x.verified?'Unverify':'Verify')+'</button><button class="btn danger small" type="button" data-act="remove" data-id="'+esc(x.id)+'">Remove</button>')}).join('')||E('No live services yet.');
  var tv=0,tc=0;S.ads.forEach(function(x){tv+=x.views||0;tc+=x.clicks||0});
  el=document.getElementById('adm_tot');if(el)el.textContent='Total seen: '+tv+' · Total taps: '+tc;
  el=document.getElementById('adm_ads');if(el)el.innerHTML=S.ads.map(function(x){var v=x.views||0,c=x.clicks||0,r=v?Math.round(c*1000/v)/10:0;return row(esc(x.name)+' <span class="pill '+(x.active?'ok':'')+'">'+(x.active?'Live':'Paused')+'</span>',esc(x.text)+'<br>Seen '+v+' times · Tapped '+c+' times · '+r+'%','<button class="btn ghost small" type="button" data-aact="pause" data-aid="'+esc(x.id)+'">'+(x.active?'Pause':'Resume')+'</button><button class="btn danger small" type="button" data-aact="del" data-aid="'+esc(x.id)+'">'+(S.delAd===x.id?'Tap again to delete':'Delete')+'</button>')}).join('')||E('No ads yet. Add your first shop below.');
}

/* ---------- photo ---------- */
function resize(file){return new Promise(function(res,rej){var r=new FileReader();r.onerror=rej;r.onload=function(){var im=new Image();im.onerror=rej;im.onload=function(){var m=520,s=Math.min(1,m/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);c.getContext('2d').drawImage(im,0,0,c.width,c.height);var q=.72,u=c.toDataURL('image/jpeg',q);while(u.length>140000&&q>.3){q-=.1;u=c.toDataURL('image/jpeg',q)}res(u)};im.src=r.result};r.readAsDataURL(file)})}

/* ---------- custom picker sheet (replaces the plain white native dropdown) ---------- */
function closeSheet(){var s=document.getElementById('sheet');if(s)s.remove()}
function openSheet(sel){
  closeSheet();
  var lb=sel.closest('label'),title=sel.getAttribute('aria-label')||(lb&&lb.firstChild&&lb.firstChild.textContent.trim())||'Choose';
  var opts=[].slice.call(sel.options),ov=document.createElement('div');ov.id='sheet';
  ov.innerHTML='<div class="sh-bg"></div><div class="sh" role="listbox" aria-label="'+esc(title)+'"><div class="sh-grab"></div><div class="sh-t">'+esc(title)+'</div>'+opts.map(function(o,i){return '<button type="button" class="sh-o'+(o.selected?' on':'')+'" role="option" aria-selected="'+o.selected+'" data-i="'+i+'"><span>'+esc(o.text)+'</span>'+(o.selected?svg('<path d="M5 12l5 5 9-10"/>',20):'')+'</button>'}).join('')+'</div>';
  ov.addEventListener('click',function(e){
    if(e.target.classList.contains('sh-bg')){closeSheet();return}
    var b=e.target.closest('.sh-o');if(!b)return;
    sel.selectedIndex=Number(b.dataset.i);sel.dispatchEvent(new Event('change',{bubbles:true}));closeSheet();
  });
  document.body.appendChild(ov);
}
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeSheet()});
app.addEventListener('mousedown',function(e){if(e.target.tagName==='SELECT')e.preventDefault()});
app.addEventListener('click',function(e){if(e.target.tagName==='SELECT'){e.preventDefault();openSheet(e.target)}});
app.addEventListener('keydown',function(e){if(e.target.tagName==='SELECT'&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openSheet(e.target)}});

/* ---------- events ---------- */
app.addEventListener('keydown',function(e){
  if(e.target.id==='m_in'&&e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMsg()}
  if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('.card[data-svc]')){e.preventDefault();openService(e.target.dataset.svc)}
});
app.addEventListener('input',function(e){if(e.target.id==='q'){S.q=e.target.value;renderGrid()}});
app.addEventListener('change',function(e){
  if(e.target.id==='p_show'){['p_old','p_new','p_new2'].forEach(function(i){var f=document.getElementById(i);if(f)f.type=e.target.checked?'text':'password'})}
  if(e.target.id==='f_area'){S.area=e.target.value;renderGrid()}
  if(e.target.id==='f_sort'){S.sort=e.target.value;renderGrid()}
  if(e.target.id==='j_photo'){var f=e.target.files&&e.target.files[0];if(!f)return;resize(f).then(function(d){S.photo=d;var p=document.getElementById('j_prev');if(p)p.innerHTML='<img src="'+d+'" alt="Your photo">';toast('Photo ready')}).catch(function(){toast('Could not read that photo.')})}
});
app.addEventListener('click',async function(e){
  var t=e.target.closest('button,a');
  if(!t){var c=e.target.closest('[data-svc]');if(c)openService(c.dataset.svc);return}
  var d=t.dataset,id=t.id;
  if(d.fav){toggleFav(d.fav);return}
  if(d.ad){countAd(d.ad,'clicks');return}
  if(d.chat){openChat(d.chat,d.title,d.pname);return}
  if(d.open){showChat(d.open);return}
  if(d.back){go(S.prev||'home');return}
  if(d.go){go(d.go);return}
  if(d.cat){S.cat=d.cat;renderChips();renderGrid();return}
  if(d.tab){S.tab=d.tab;S.err='';render();return}
  if(d.rate){setRate(Number(d.rate));return}
  if(d.rvdel){try{await deleteDoc(doc(db,'services',S.svcId,'reviews',d.rvdel));toast('Review deleted.')}catch(x){toast('Could not delete the review.')}return}
  if(d.aact){
    var aid=d.aid,ad=S.ads.find(function(x){return x.id===aid});if(!ad)return;
    try{
      if(d.aact==='pause'){await updateDoc(doc(db,'ads',aid),{active:!ad.active})}
      if(d.aact==='del'){if(S.delAd!==aid){S.delAd=aid;renderAdminLists();return}S.delAd=null;await deleteDoc(doc(db,'ads',aid))}
    }catch(y){toast('Could not update the ad.')}return}
  if(d.act){
    var sid=d.id,x=S.all.find(function(y){return y.id===sid});if(!x)return;var patch={};
    if(d.act==='approve')patch.status='approved';if(d.act==='remove')patch.status='removed';if(d.act==='feat')patch.featured=!x.featured;if(d.act==='verify')patch.verified=!x.verified;
    try{await updateDoc(doc(db,'services',sid),patch)}catch(y){toast('Could not update.')}return}
  if(d.rp){
    try{
      if(d.rp==='view'){openService(d.id);return}
      if(d.rp==='remove'){await updateDoc(doc(db,'services',d.id),{status:'removed'});await updateDoc(doc(db,'reports',d.rid),{status:'closed'})}
      if(d.rp==='close'){await updateDoc(doc(db,'reports',d.rid),{status:'closed'})}
    }catch(y){toast('Could not update the report.')}return}
  if(id==='out'){try{await signOut(auth)}catch(x){}S.view='home';go('home');return}
  if(id==='toSignUp'){S.tab='up';go('auth');return}
  if(id==='toSignIn'){S.tab='in';return}
  if(id==='share'){shareApp();return}
  if(id==='install'){if(S.installEvt){S.installEvt.prompt();S.installEvt=null;render()}return}
  if(id==='editName'){S.editName=true;render();return}
  if(id==='cancelName'){S.editName=false;render();return}
  if(id==='saveName'){var nn=(document.getElementById('n_name').value||'').trim();if(!nn){toast('Type your name.');return}try{await updateProfile(auth.currentUser,{displayName:nn});S.user=auth.currentUser;S.editName=false;render();toast('Name saved.')}catch(x){toast('Could not save your name.')}return}
  if(id==='passGo'){changePass(t);return}
  if(id==='passForgot'){try{await sendPasswordResetEmail(auth,S.user.email);setErr('');var e2=document.getElementById('err');if(e2){e2.style.color='var(--brand)';e2.textContent='We sent a reset link to '+S.user.email+'. Check your inbox and spam.'}}catch(x){setErr('Could not send. Try again.')}return}
  if(id==='rpToggle'){openReport();return}
  if(id==='rpSend'){sendReport();return}
  if(id==='rvSend'){sendReview();return}
  if(id==='sendBtn'){sendMsg();return}
  if(id==='forgot'){
    var em2=(document.getElementById('a_email').value||'').trim();
    if(!em2){setErr('Type your email above first, then tap Forgot password.');return}
    try{await sendPasswordResetEmail(auth,em2);var e1=document.getElementById('err');if(e1){e1.style.color='var(--brand)';e1.textContent='If this email has an account, we sent a reset link to '+em2+'. Check your inbox and your spam folder.'}}
    catch(x){setErr(x&&x.code&&x.code.indexOf('invalid-email')>-1?'That email does not look right.':'Could not send. Check your email and your connection.')}
    return}
  if(id==='authGo'){
    var em=document.getElementById('a_email').value.trim(),pw=document.getElementById('a_pass').value;
    if(!em||!pw){setErr('Enter your email and password.');return}
    t.disabled=true;
    try{
      if(S.tab==='up'){var nm=(document.getElementById('a_name').value||'').trim();if(!nm){setErr('Enter your name.');t.disabled=false;return}var cr=await createUserWithEmailAndPassword(auth,em,pw);try{await updateProfile(cr.user,{displayName:nm})}catch(z){}}
      else await signInWithEmailAndPassword(auth,em,pw);
      S.view='home';S.anim=true;
    }catch(x){setErr(authErr(x));t.disabled=false}
    return}
  if(id==='joinGo'){
    var g=function(i){return document.getElementById(i).value.trim()};
    var title=g('j_title'),name=g('j_name');
    if(!title||!name){setErr('Fill in what you do and your name.');return}
    if(!document.getElementById('j_agree').checked){setErr('Please tick the box to agree to the commission.');return}
    var dd=myService()||{},price=parseInt(g('j_price').replace(/\D/g,''),10)||0;
    var data={ownerUid:S.user.uid,title:title,name:name,price:price,cat:document.getElementById('j_cat').value,area:g('j_area')||'Jalingo',desc:g('j_desc'),photo:S.photo||dd.photo||'',agreed:true,commission:Number(S.settings.commission)||7,featured:!!dd.featured,verified:!!dd.verified,status:dd.id?(dd.status==='approved'?'pending':dd.status):'pending'};
    if(!dd.id)data.createdAt=serverTimestamp();
    t.disabled=true;try{await setDoc(doc(db,'services',S.user.uid),data,{merge:true});toast(dd.id?'Saved.':'Sent. We will approve it soon.');S.photo='';go('account')}catch(x){setErr('Could not save. Check your connection and try again.');t.disabled=false}return}
  if(id==='delMine'){if(t.dataset.sure!=='1'){t.dataset.sure='1';t.textContent='Tap again to delete';return}try{await deleteDoc(doc(db,'services',S.user.uid));toast('Deleted.');go('account')}catch(x){setErr('Could not delete.')}return}
  if(id==='addAd'){
    var an=document.getElementById('ad_name').value.trim(),at=document.getElementById('ad_text').value.trim(),ap=document.getElementById('ad_phone').value.trim();
    if(!an||!at||!ap){toast('Fill in the name, message and WhatsApp number.');return}
    try{await addDoc(collection(db,'ads'),{name:an,text:at,phone:ap,active:true,views:0,clicks:0,createdAt:serverTimestamp()});['ad_name','ad_text','ad_phone'].forEach(function(k){document.getElementById(k).value=''});toast('Ad added.')}catch(y){toast('Could not add the ad.')}return}
  if(id==='saveSet'){
    var v=function(i){return document.getElementById(i).value.trim()};
    try{await setDoc(doc(db,'settings','main'),{commission:Math.min(30,Math.max(0,parseInt(v('s_comm'),10)||7)),whatsapp:v('s_wa')},{merge:true});toast('Saved.')}catch(y){toast('Could not save.')}return}
});

/* ---------- first-time intro ---------- */
(function(){
  var done=false;try{done=localStorage.getItem('onb')==='1'}catch(e){}
  if(done)return;
  var slides=[[IC.find,'Find any service','Tailors, repairers, tutors, riders and more. All in Jalingo, all in one place.'],[IC.chat,'Chat inside the app','See the price, then message the provider here. No need to share your phone number.'],[IC.svc,'Offer your service','It is free to join. Get found by customers every day.']];
  var i=0,el=document.createElement('div');el.id='onb';
  function paint(){
    var s=slides[i];
    el.innerHTML='<div class="oi">'+svg(s[0],48)+'</div><h2>'+s[1]+'</h2><p>'+s[2]+'</p><div class="dots">'+slides.map(function(_,k){return '<i class="'+(k===i?'on':'')+'"></i>'}).join('')+'</div><div class="actions"><button class="btn" type="button" id="onbNext">'+(i===slides.length-1?'Get started':'Next')+'</button></div>'+(i<slides.length-1?'<button class="linkbtn" type="button" id="onbSkip">Skip</button>':'');
  }
  function close(){try{localStorage.setItem('onb','1')}catch(e){}el.remove()}
  el.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;if(b.id==='onbSkip'){close();return}if(b.id==='onbNext'){if(i>=slides.length-1){close();return}i++;paint()}});
  paint();document.body.appendChild(el);
})();

if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js').catch(function(){})}
render();

