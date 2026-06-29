/* render.js - viser indhold fra data/*.json. Ingen build nodvendig.
   Indholdet redigeres via /admin (Decap CMS). Denne fil overskriver den
   statiske 'fallback'-tekst med den nyeste version fra JSON-filerne. */
(function () {
  "use strict";
  var ICONS = {"oekonomi": "<polyline points=\"23 6 13.5 15.5 8.5 10.5 1 18\"/><polyline points=\"17 6 23 6 23 12\"/>", "forsvar": "<path d=\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\"/>", "klima": "<path d=\"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z\"/><path d=\"M2 21c0-3 1.85-5.36 5.08-6\"/>", "uddannelse": "<path d=\"M22 10L12 5 2 10l10 5 10-5z\"/><path d=\"M6 12v5c3 3 9 3 12 0v-5\"/>", "sundhed": "<path d=\"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z\"/>", "indvandring": "<path d=\"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"/><circle cx=\"9\" cy=\"7\" r=\"4\"/><path d=\"M23 21v-2a4 4 0 0 0-3-3.87\"/><path d=\"M16 3.13a4 4 0 0 1 0 7.75\"/>", "eu": "<circle cx=\"12\" cy=\"12\" r=\"10\"/><line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\"/><path d=\"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z\"/>", "stemmeret": "<polyline points=\"9 11 12 14 22 4\"/><path d=\"M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11\"/>"};
  function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g,function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function qsa(s,r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); }
  function qs(s,r){ return (r||document).querySelector(s); }
  function load(p){ return fetch(p,{cache:"no-store"}).then(function(r){ if(!r.ok) throw 0; return r.json(); }).catch(function(){ return null; }); }
  function setText(sel,val){ if(val==null) return; qsa(sel).forEach(function(el){ el.textContent=val; }); }
  function icon(slug){ var p=ICONS[slug]||'<circle cx="12" cy="12" r="9"/>';
    return '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>'; }
  function iconLg(slug){ return icon(slug).replace('class="ico"','class="ico-lg"'); }

  function maerkCard(i,m){ return '<div class="m-card"><span class="m-num">'+i+'</span><h3>'+esc(m.title)+'</h3><p>'+esc(m.text)+'</p></div>'; }
  function maerkRow(i,m){ var n=i<10?("0"+i):(""+i); return '<div class="ms-row"><div class="ms-num">'+n+'</div><div class="ms-body"><h2>'+esc(m.title)+'</h2><p>'+esc(m.text)+'</p></div></div>'; }
  function policyCard(a){ return '<a class="policy-card" href="politik-'+esc(a.slug)+'.html"><span class="policy-icon">'+icon(a.slug)+'</span><span class="policy-title">'+esc(a.title)+'</span><span class="policy-arrow">Læs mere →</span></a>'; }
  function blockHTML(b){
    var items=b.items||[]; var h='<section class="policy-block"><h2>'+esc(b.heading)+'</h2>';
    if(b.type==="tags"){ h+='<div class="tag-row">'+items.map(function(t){return '<span class="tag">'+esc(t)+'</span>';}).join("")+'</div>'; }
    else { var cls=(b.type==="cross")?"cross-list":"check-list"; h+='<ul class="'+cls+'">'+items.map(function(t){return '<li>'+esc(t)+'</li>';}).join("")+'</ul>'; }
    return h+'</section>';
  }

  Promise.all([load("data/site.json"),load("data/maerkesager.json"),load("data/politik.json")]).then(function(res){
    var site=res[0], maerk=res[1], pol=res[2];

    if(site){
      if(site.logo){ qsa("[data-logo]").forEach(function(img){ img.setAttribute("src", site.logo); }); }
      ["partyName","tagline","heroEyebrow","heroHeading","heroText","ideaHeading","ideaText","pmName","pmText","footerMission","contactEmail","contactAddress"].forEach(function(k){
        setText('[data-site="'+k+'"]', site[k]);
      });
    }

    if(maerk && maerk.items){
      var teaser=qs("#maerkesager-teaser");
      if(teaser){ teaser.innerHTML = maerk.items.map(function(m,i){ return maerkCard(i+1,m); }).join(""); }
      var list=qs("#maerkesager-list");
      if(list){ list.innerHTML = maerk.items.map(function(m,i){ return maerkRow(i+1,m); }).join(""); }
    }

    if(pol && pol.areas){
      qsa("[data-politik-grid]").forEach(function(g){ g.innerHTML = pol.areas.map(policyCard).join(""); });
      var detail=qs("[data-politik-detail]");
      if(detail){
        var slug=detail.getAttribute("data-politik-detail");
        var area=null;
        pol.areas.forEach(function(a){ if(a.slug===slug) area=a; });
        if(area){
          setText("[data-politik-title]", area.title);
          setText("[data-politik-lead]", area.lead);
          var ic=qs("[data-politik-icon]"); if(ic){ ic.innerHTML = iconLg(area.slug); }
          var bw=qs("[data-politik-blocks]"); if(bw){ bw.innerHTML = (area.blocks||[]).map(blockHTML).join(""); }
          document.title = area.title + " | Modernistisk Enevælde";
        }
      }
    }
  });
})();
