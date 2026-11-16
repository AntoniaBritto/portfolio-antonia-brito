const root=document.documentElement;
const themeButton=document.getElementById("theme-toggle");
const menuButton=document.getElementById("menu-toggle");
const nav=document.getElementById("nav");
const projectsButton=document.getElementById("projects-toggle");
const dropdown=projectsButton.closest(".dropdown");
let savedTheme;try{savedTheme=localStorage.getItem("portfolio-theme")}catch(e){}
function setTheme(theme){root.dataset.theme=theme;themeButton.textContent=theme==="dark"?"☀":"☾";themeButton.setAttribute("aria-label",theme==="dark"?"Ativar modo claro":"Ativar modo escuro");try{localStorage.setItem("portfolio-theme",theme)}catch(e){}}
setTheme(savedTheme==="dark"?"dark":"light");
themeButton.addEventListener("click",()=>setTheme(root.dataset.theme==="dark"?"light":"dark"));
menuButton.addEventListener("click",()=>{const open=nav.classList.toggle("open");menuButton.setAttribute("aria-expanded",String(open));menuButton.setAttribute("aria-label",open?"Fechar menu":"Abrir menu")});
projectsButton.addEventListener("click",()=>{const open=dropdown.classList.toggle("open");projectsButton.setAttribute("aria-expanded",String(open))});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){dropdown.classList.remove("open");projectsButton.setAttribute("aria-expanded","false");nav.classList.remove("open");menuButton.setAttribute("aria-expanded","false")}});
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menuButton.setAttribute("aria-expanded","false");dropdown.classList.remove("open");projectsButton.setAttribute("aria-expanded","false")}));

// Vitrine: transição suave, controles e respeito à preferência de movimento reduzido.
const gallerySlides=[...document.querySelectorAll('.hero-slide')];
const galleryDots=[...document.querySelectorAll('.gallery-dots .dot')];
const pauseButton=document.getElementById('gallery-pause');
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
let currentSlide=0, galleryTimer=null, galleryPaused=reducedMotion.matches;
function showSlide(index){
 currentSlide=(index+gallerySlides.length)%gallerySlides.length;
 gallerySlides.forEach((slide,i)=>{const active=i===currentSlide;slide.classList.toggle('active',active);slide.setAttribute('aria-hidden',String(!active));slide.tabIndex=active?0:-1;});
 galleryDots.forEach((dot,i)=>{dot.classList.toggle('active',i===currentSlide);if(i===currentSlide)dot.setAttribute('aria-current','true');else dot.removeAttribute('aria-current');});
}
function stopGallery(){if(galleryTimer!==null){clearInterval(galleryTimer);galleryTimer=null;}}
function startGallery(){stopGallery();if(!galleryPaused && !document.hidden)galleryTimer=setInterval(()=>showSlide(currentSlide+1),4000);}
function updatePauseButton(){pauseButton.textContent=galleryPaused?'Reproduzir ▶':'Pausar Ⅱ';pauseButton.setAttribute('aria-label',galleryPaused?'Reproduzir apresentação':'Pausar apresentação');}
galleryDots.forEach((dot,i)=>dot.addEventListener('click',()=>{showSlide(i);startGallery();}));
pauseButton.addEventListener('click',()=>{galleryPaused=!galleryPaused;updatePauseButton();startGallery();});
document.addEventListener('visibilitychange',startGallery);
reducedMotion.addEventListener('change',event=>{galleryPaused=event.matches;updatePauseButton();startGallery();});
const gallery=document.querySelector('.hero-gallery');gallery.addEventListener('mouseenter',stopGallery);gallery.addEventListener('mouseleave',startGallery);gallery.addEventListener('focusin',stopGallery);gallery.addEventListener('focusout',event=>{if(!gallery.contains(event.relatedTarget))startGallery();});
updatePauseButton();showSlide(0);startGallery();

// Carrossel independente da seção Sobre mim: 4 segundos por foto.
const aboutSlides=[...document.querySelectorAll('.about-slide')];
const aboutDots=[...document.querySelectorAll('.about-dot')];
const aboutPause=document.querySelector('.about-pause');
const aboutGallery=document.querySelector('.about-gallery');
let aboutIndex=0,aboutTimer=null,aboutPaused=reducedMotion.matches;
function aboutShow(index){aboutIndex=(index+aboutSlides.length)%aboutSlides.length;aboutSlides.forEach((slide,i)=>{const on=i===aboutIndex;slide.classList.toggle('active',on);slide.setAttribute('aria-hidden',String(!on));});aboutDots.forEach((dot,i)=>{const on=i===aboutIndex;dot.classList.toggle('active',on);dot.setAttribute('aria-current',String(on));});}
function aboutStop(){clearInterval(aboutTimer);aboutTimer=null;}
function aboutStart(){aboutStop();if(!aboutPaused&&!document.hidden)aboutTimer=setInterval(()=>aboutShow(aboutIndex+1),4000);}
function aboutButton(){aboutPause.textContent=aboutPaused?'Reproduzir ▶':'Pausar Ⅱ';aboutPause.setAttribute('aria-label',aboutPaused?'Reproduzir fotos':'Pausar fotos');}
aboutDots.forEach((dot,i)=>dot.addEventListener('click',()=>{aboutShow(i);aboutStart();}));
aboutPause.addEventListener('click',()=>{aboutPaused=!aboutPaused;aboutButton();aboutStart();});
document.addEventListener('visibilitychange',aboutStart);
reducedMotion.addEventListener('change',e=>{aboutPaused=e.matches;aboutButton();aboutStart();});
aboutGallery.addEventListener('mouseenter',aboutStop);aboutGallery.addEventListener('mouseleave',aboutStart);
aboutGallery.addEventListener('focusin',aboutStop);aboutGallery.addEventListener('focusout',e=>{if(!aboutGallery.contains(e.relatedTarget))aboutStart();});
aboutShow(0);aboutButton();aboutStart();


// Navegação única e consistente para as seções Sobre mim e Formação.
// Usa a altura real do menu fixo, inclusive em telas menores.
(function () {
  const header=document.querySelector('.header');
  const sections=['sobre','formacao','projetos'];
  if(!header)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  function positionSection(id,smooth){
    const section=document.getElementById(id);
    if(!section)return;
    const headerHeight=Math.ceil(header.getBoundingClientRect().height);
    const available=Math.max(0,window.innerHeight-headerHeight);
    const sectionHeight=section.getBoundingClientRect().height;
    const sectionTop=section.getBoundingClientRect().top+window.scrollY;
    // Centraliza a composição na área visível quando cabe; caso contrário,
    // começa logo abaixo do cabeçalho para não cortar o conteúdo.
    const offset=sectionHeight<=available ? Math.max(0,(available-sectionHeight)/2) : 0;
    const destination=Math.max(0,sectionTop-headerHeight-offset);
    window.scrollTo({top:destination,behavior:smooth&&!reduced.matches?'smooth':'instant'});
  }
  sections.forEach(id=>{
    document.querySelectorAll('a[href="#'+id+'"]').forEach(link=>{
      link.addEventListener('click',event=>{
        event.preventDefault();
        history.replaceState(null,'','#'+id);
        // Após o menu móvel fechar, medir a altura correta do cabeçalho.
        requestAnimationFrame(()=>positionSection(id,true));
      });
    });
  });
  window.addEventListener('load',()=>{
    const id=decodeURIComponent(location.hash.slice(1));
    if(sections.includes(id))requestAnimationFrame(()=>positionSection(id,false));
  });
  window.addEventListener('hashchange',()=>{
    const id=decodeURIComponent(location.hash.slice(1));
    if(sections.includes(id))positionSection(id,false);
  });
})();

/* V14 — tooltips acessíveis: mouse, teclado e toque */
(()=>{
 const triggers=[...document.querySelectorAll('#formacao .tool-trigger')];
 if(!triggers.length)return;
 const tip=document.createElement('div');tip.className='tool-floating-tooltip';tip.id='tool-floating-tooltip';tip.setAttribute('role','tooltip');tip.hidden=true;document.body.appendChild(tip);
 let active=null;let pinned=false;
 function place(el){const r=el.getBoundingClientRect();const w=tip.offsetWidth,h=tip.offsetHeight;let left=Math.max(12,Math.min(innerWidth-w-12,r.left+r.width/2-w/2));let top=r.top-h-10;if(top<12)top=Math.min(innerHeight-h-12,r.bottom+10);tip.style.left=left+'px';tip.style.top=Math.max(12,top)+'px'}
 function close(){if(active)active.setAttribute('aria-expanded','false');active=null;pinned=false;tip.hidden=true}
 function show(el,pin=false){if(active&&active!==el)active.setAttribute('aria-expanded','false');active=el;pinned=pin;tip.textContent=el.dataset.tooltip;tip.hidden=false;el.setAttribute('aria-expanded','true');place(el)}
 triggers.forEach(el=>{
  el.setAttribute('aria-describedby',tip.id);
  el.addEventListener('mouseenter',()=>{if(!pinned)show(el)});
  el.addEventListener('mouseleave',()=>{if(!pinned&&active===el&&document.activeElement!==el)close()});
  el.addEventListener('focus',()=>show(el));
  el.addEventListener('blur',()=>{if(!pinned&&active===el)close()});
  el.addEventListener('click',e=>{e.stopPropagation();if(active===el&&pinned)close();else show(el,true)});
  el.addEventListener('keydown',e=>{if(e.key==='Escape'){close();el.blur()}});
 });
 document.addEventListener('pointerdown',e=>{if(active&&!active.contains(e.target))close()});
 window.addEventListener('scroll',()=>{if(active)place(active)},{passive:true});
 window.addEventListener('resize',()=>{if(active)place(active)});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
})();

/* V15 Rev 03: cartão Headcount abre estudo de caso existente. */
document.querySelectorAll('[data-case-link]').forEach(card => {
  const openCase = () => {
    const target = document.getElementById(card.dataset.caseLink);
    if (!target) return;
    // Abre o estudo com seu título e introdução visíveis, sem corte pelo cabeçalho fixo.
    const heading = target;
    const header = document.querySelector('header');
    const headerHeight = header ? header.getBoundingClientRect().height : 110;
    const top = Math.max(0, window.scrollY + heading.getBoundingClientRect().top - headerHeight - 22);
    window.scrollTo({top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  };
  card.addEventListener('click', openCase);
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCase(); } });
});


// V17 revisão 04: itens do submenu usam a mesma navegação dos cartões.
document.querySelectorAll('[data-project-menu-link]').forEach(link => {
  link.addEventListener('click', event => {
    const card = document.getElementById(link.dataset.projectMenuLink);
    if (!card || !card.hasAttribute('data-case-link')) return;
    event.preventDefault();
    card.click();
  });
});

/* V17 Revisão 12: visualizador acessível de imagens demonstrativas. */
(() => {
 const viewer=document.getElementById('report-viewer');
 const content=document.getElementById('report-viewer-content');
 const title=document.getElementById('report-viewer-title');
 const back=document.getElementById('report-viewer-back');
 const header=document.querySelector('.header');
 let trigger=null;
 function close(){viewer.hidden=true;document.body.classList.remove('report-viewer-open');content.replaceChildren();if(trigger)trigger.focus();}
 document.querySelectorAll('[data-preview]').forEach(button=>button.addEventListener('click',()=>{
   trigger=button;
   const article=document.getElementById(button.dataset.preview);
   title.textContent=article?.querySelector('h4')?.textContent||'Visualização do projeto';
   content.replaceChildren();
   const img=button.querySelector('img');
   if(button.dataset.preview==='case-dash'||button.dataset.preview==='case-absenteismo'){
     const frame=document.createElement('iframe');
     frame.src=button.dataset.preview==='case-dash'?'dashboard-headcount.html':'dashboard-absenteismo.html';
     frame.title=button.dataset.preview==='case-dash'?'Dashboard interativo de Headcount e Orçamento — dados fictícios':'Dashboard interativo de Absenteísmo — dados fictícios';
     frame.className='hc-dashboard-frame';
     frame.setAttribute('loading','eager');
     content.append(frame);
   }else if(img){const enlarged=document.createElement('img');enlarged.src=img.currentSrc||img.src;enlarged.alt=img.alt;content.append(enlarged);}
   else {const placeholder=document.createElement('div');placeholder.className='report-viewer-placeholder';placeholder.textContent='Dashboard em construção — espaço reservado para futura visualização interativa.';content.append(placeholder);}
   document.documentElement.style.setProperty('--viewer-top',Math.max(0,header?.getBoundingClientRect().bottom||80)+'px');
   viewer.hidden=false;document.body.classList.add('report-viewer-open');back.focus();
 }));
 back.addEventListener('click',close);
 // A navegação principal permanece operável enquanto o relatório está ampliado.
 // Ao selecionar outra seção, fecha-se o visualizador e o link continua navegando.
 document.querySelectorAll('.header a[href], .header nav a[href]').forEach(link=>{
   link.addEventListener('click',()=>{
     if(!viewer.hidden) {
       viewer.hidden=true;
       document.body.classList.remove('report-viewer-open');
       content.replaceChildren();
       // Não restaurar foco ao botão da prévia: o destino da navegação tem prioridade.
     }
   });
 });
 document.addEventListener('keydown',e=>{if(viewer.hidden)return;if(e.key==='Escape'){e.preventDefault();close();}else if(e.key==='Tab' && !content.querySelector('iframe')){e.preventDefault();back.focus();}});
})();

/* Atualiza o espaço útil quando a janela muda de tamanho. */
window.addEventListener('resize',()=>{
 const viewer=document.getElementById('report-viewer');
 if(viewer && !viewer.hidden){
  const header=document.querySelector('.header');
  document.documentElement.style.setProperty('--viewer-top',Math.max(0,header?.getBoundingClientRect().bottom||80)+'px');
 }
});
