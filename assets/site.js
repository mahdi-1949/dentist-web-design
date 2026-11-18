'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const header=$('.site-header-v2'),nav=$('#mainNavV2'),panel=$('#servicesPanelV2'),trigger=$('#servicesToggleV2'),mobile=$('#mobileToggleV2'),backdrop=$('#headerBackdropV2');
const icon=(close)=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="'+(close?'m6 6 12 12M6 18 18 6':'M4 7h16M4 12h16M4 17h16')+'"/></svg>';
function sync(){backdrop?.classList.toggle('is-open',panel?.classList.contains('is-open')||nav?.classList.contains('mobile-open'))}
function services(open){panel?.classList.toggle('is-open',open);trigger?.setAttribute('aria-expanded',String(open));sync()}
function menu(open){nav?.classList.toggle('mobile-open',open);mobile?.setAttribute('aria-expanded',String(open));mobile?.setAttribute('aria-label',open?'بستن منوی اصلی':'باز کردن منوی اصلی');if(mobile)mobile.innerHTML=icon(open);if(!open)services(false);sync()}
trigger?.addEventListener('click',()=>services(!panel.classList.contains('is-open')));
mobile?.addEventListener('click',()=>menu(!nav.classList.contains('mobile-open')));
backdrop?.addEventListener('click',()=>{services(false);menu(false)});
document.addEventListener('click',e=>{if(header&&!e.composedPath().includes(header)){services(false);menu(false)}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&(panel?.classList.contains('is-open')||nav?.classList.contains('mobile-open'))){const isMobile=nav.classList.contains('mobile-open');services(false);menu(false);(isMobile?mobile:trigger).focus()}});
header?.addEventListener('focusout',()=>setTimeout(()=>{if(!header.contains(document.activeElement)){services(false);menu(false)}},0));
const desktop=matchMedia('(min-width:951px)');desktop.addEventListener('change',()=>{menu(false);services(false)});
window.addEventListener('scroll',()=>header?.classList.toggle('is-scrolled',scrollY>15),{passive:true});
// Keep the mobile navigation compact when following an in-page link.
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{menu(false);services(false)}));
const normalize=s=>s.replace(/ي/g,'ی').replace(/ك/g,'ک').replace(/[‌\s]+/g,' ').trim().toLowerCase();
const faqRoot=$('#faqResults');
if(faqRoot){
const faqNodes=$$('.faq-item',faqRoot).map((node,i)=>({node:node.cloneNode(true),category:i<4?'visit':i<8?'booking':i<12?'treatment':i<15?'cost':i<18?'care':'site'}));
let category='all';const search=$('#faqSearch');
function draw(){let q=normalize(search.value);const found=faqNodes.filter(x=>(category==='all'||x.category===category)&&(!q||normalize(x.node.textContent).includes(q)));faqRoot.replaceChildren(...found.map(x=>x.node.cloneNode(true)));if(!found.length){const empty=document.createElement('div');empty.className='faq-empty';empty.innerHTML='<h3>پاسخی با این عبارت پیدا نشد.</h3><p>عبارت کوتاه‌تری بنویسید یا همهٔ موضوع‌ها را انتخاب کنید.</p>';faqRoot.append(empty)}$('#faqCount').textContent=found.length+' پاسخ';$('#faqHeading').textContent=$('[data-category="'+category+'"] span').textContent}
search.addEventListener('input',draw);
$$('[data-category]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.category;$$('[data-category]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b))});draw()}));
$$('[data-search]').forEach(b=>b.addEventListener('click',()=>{search.value=b.dataset.search;$('[data-category="all"]').click();search.focus()}));
$('#faqExpand').addEventListener('click',()=>$$('.faq-item',faqRoot).forEach(x=>x.open=true));
$('#faqCollapse').addEventListener('click',()=>$$('.faq-item',faqRoot).forEach(x=>x.open=false));
draw();
}
const filters=$$('[data-topic-filter]');
filters.forEach(b=>b.addEventListener('click',()=>{filters.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));const items=$$('.journal-item');let count=0;items.forEach(x=>{x.hidden=b.dataset.topicFilter!=='all'&&x.dataset.topic!==b.dataset.topicFilter;if(!x.hidden)count++});$('#journalCount').textContent=count+' نوشته'}));
const wizard=$('#bookingWizard');
if(wizard){
const names={consult:'مشاورهٔ اولیه',implant:'ایمپلنت دندان',smile:'طراحی لبخند',ortho:'ارتودنسی',repair:'ترمیم و درمان ریشه',kids:'دندانپزشکی کودکان',care:'مراقبت و پیشگیری'};
let step=0;const steps=$$('.wizard-step',wizard),progress=$$('.wizard-progress li',wizard),error=$('#wizardError'),next=$('#wizardNext'),back=$('#wizardBack');
const localDate=new Date();localDate.setMinutes(localDate.getMinutes()-localDate.getTimezoneOffset());$('#preferredDate').min=localDate.toISOString().slice(0,10);
const selected=new URLSearchParams(location.search).get('service');if(names[selected]){const field=$('input[name="service"][value="'+selected+'"]');if(field)field.checked=true}
const digits=s=>s.replace(/[۰-۹]/g,c=>String('۰۱۲۳۴۵۶۷۸۹'.indexOf(c))).replace(/[٠-٩]/g,c=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(c)));
function summary(target){target.replaceChildren();const data=new FormData(wizard),rows=[['خدمت',names[data.get('service')]],['تاریخ پیشنهادی',data.get('date')],['بازهٔ دلخواه',data.get('time')]];for(const [label,value] of rows){const row=document.createElement('div'),strong=document.createElement('b'),span=document.createElement('span');strong.textContent=label;span.textContent=value||'انتخاب نشده';row.append(strong,span);target.append(row)}}
function show(){steps.forEach((s,i)=>s.hidden=i!==step);progress.forEach((s,i)=>{if(i===step)s.setAttribute('aria-current','step');else s.removeAttribute('aria-current');s.classList.toggle('done',i<step)});back.hidden=step===0;next.textContent=step===2?'نمایش پیش‌نمایش درخواست':'مرحلهٔ بعد';error.textContent='';if(step===2)summary($('#bookingSummary'));$('h2',steps[step]).focus()}
function valid(){let fields=$$('input,select',steps[step]);for(const f of fields)if(!f.checkValidity()){error.textContent=step===0?'لطفاً یک خدمت انتخاب کنید.':'لطفاً اطلاعات این مرحله را کامل و درست وارد کنید.';f.reportValidity();return false}if(step===1&&$('#preferredDate').value<$('#preferredDate').min){error.textContent='تاریخ پیشنهادی باید امروز یا پس از آن باشد.';$('#preferredDate').focus();return false}if(step===2){const phone=digits($('#bookingPhone').value).replace(/[\s()-]/g,'');if(!/^\+?\d{8,15}$/.test(phone)){error.textContent='شمارهٔ تماس را با ۸ تا ۱۵ رقم وارد کنید.';$('#bookingPhone').focus();return false}if($('#bookingName').value.trim().length<2){error.textContent='نام را کامل‌تر وارد کنید.';$('#bookingName').focus();return false}}return true}
next.addEventListener('click',()=>{if(!valid())return;if(step<2){step++;show()}else{summary($('#successSummary'));wizard.hidden=true;$('#bookingSuccess').hidden=false;$('#bookingSuccess').focus();wizard.reset()}});
back.addEventListener('click',()=>{if(step>0){step--;show()}});
wizard.addEventListener('submit',e=>{e.preventDefault();next.click()});
$('#bookingRestart').addEventListener('click',()=>{$('#bookingSuccess').hidden=true;wizard.hidden=false;step=0;show()});
}
$('#contactMessageForm')?.addEventListener('submit',e=>{e.preventDefault();$('#contactStatus').textContent='فرم بررسی شد؛ این نسخه نمایشی است و پیامی ارسال یا ذخیره نشده است.'});
// Progressive enhancement: content stays visible without JavaScript.
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('motion-visible');observer.unobserve(e.target)}}),{threshold:.06});$$('main>.section,main>.home-new>.section').forEach(x=>{x.classList.add('motion-ready');observer.observe(x)})}
