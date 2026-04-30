// Nexus AI Horizon — interactions
// Split-scroll, horizontal scroll-jack, flow node clicks, counters, terminal type, ticker.
(function () {
  // ----- Mobile menu --------------------------------------------------
  const burger = document.querySelector('.mast-burger');
  const closer = document.querySelector('.mob-close');
  const menu   = document.querySelector('.mobile-menu');
  const open  = () => {
    document.body.classList.add('menu-open');
    if (burger) burger.setAttribute('aria-expanded', 'true');
    if (menu)   menu.setAttribute('aria-hidden', 'false');
  };
  const close = () => {
    document.body.classList.remove('menu-open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    if (menu)   menu.setAttribute('aria-hidden', 'true');
  };
  if (burger) burger.addEventListener('click', open);
  if (closer) closer.addEventListener('click', close);
  document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', close));

  // ----- Reveal on scroll ---------------------------------------------
  const revealIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); }
    }
  }, { threshold: 0.10 });
  document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));

  // ----- Live clock in hero stamp ------------------------------------
  const ts = document.querySelector('[data-live-ts]');
  if (ts) {
    const tick = () => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2,'0');
      const m = String(d.getMinutes()).padStart(2,'0');
      // EDT in DST (Mar–Nov), EST otherwise. Cheap UTC-offset check from the user's clock.
      const tz = -new Date().getTimezoneOffset() / 60 === -4 ? 'EDT' : 'EST';
      ts.textContent = `${h}:${m} ${tz}`;
    };
    tick(); setInterval(tick, 30000);
  }

  // ----- Counters (with prefix/suffix; commas via toLocaleString) ----
  const counterIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target;
      const target = Number(el.dataset.count || 0);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const dur = 1800;
      const start = performance.now();
      const ease = (t) => 1 - Math.pow(1 - t, 3);
      const step = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const v = Math.round(target * ease(t));
        el.textContent = `${prefix}${v.toLocaleString()}${suffix}`;
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      counterIO.unobserve(el);
    }
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-count]').forEach(el => counterIO.observe(el));

  // ----- Live ticker (rotates strings) -------------------------------
  const ticker = document.querySelector('[data-ticker]');
  if (ticker) {
    let items = [];
    try { items = JSON.parse(ticker.dataset.ticker || '[]'); } catch (_) {}
    let i = 0;
    if (items.length) {
      ticker.textContent = items[0];
      setInterval(() => { i = (i + 1) % items.length; ticker.textContent = items[i]; }, 2400);
    }
  }

  // ----- Live "calls answered today" counter — slowly ticks up -------
  const liveBarCounter = document.querySelector('.live-bar [data-count]');
  if (liveBarCounter) {
    // After the count-up finishes, keep nudging it +1 every few seconds
    setTimeout(() => {
      let n = Number(liveBarCounter.dataset.count || 0);
      setInterval(() => {
        n += Math.floor(Math.random() * 3) + 1;
        liveBarCounter.textContent = n.toLocaleString();
      }, 4000 + Math.random() * 3000);
    }, 2200);
  }

  // ----- Flow diagram: click a node, swap detail ---------------------
  const FLOW = [
    { step: 'Step 01 · Ring',     title: 'Your line. Your number. Your brand.',
      copy: 'No port. No replacement. Nexus runs underneath the line you already publish — your customer dials the number on your truck and hears the voice you trained.',
      demo: '<span class="ts">02:14:03 EST</span><br>&gt; <span class="you">Inbound · 718-555-0142</span><br>&gt; <span class="ai">Caller-id · "Marcus T. (existing customer)"</span><br>&gt; <span class="ai">Routing rule · after-hours · P1 emergency only</span><br>&gt; <span class="ai">Answer · 1.8s</span>' },
    { step: 'Step 02 · Answer',   title: 'Picks up before the second ring.',
      copy: 'Custom voice trained on your brand. Knows your services, pricing, service area, and after-hours rules. Sounds like a person, never a tree of options.',
      demo: '<span class="ai">Nexus &gt;</span> <span class="you">"Hi, this is Mara at Acme Plumbing — sounds urgent.</span><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="you">Tell me what\'s happening?"</span><br>&gt; <span class="ai">Answered in 1.8s · custom voice "Mara v3"</span>' },
    { step: 'Step 03 · Qualify',  title: 'Triages by symptom in 30 seconds.',
      copy: 'Symptom-based routing. Knows the difference between a leaky faucet and a flooded basement. Knows when to escalate to a human and when to book.',
      demo: '<span class="ts">+0:24</span><br>&gt; <span class="ai">Symptom · "water on floor, ceiling above"</span><br>&gt; <span class="ai">Severity · P1 (escalating water damage)</span><br>&gt; <span class="ai">Route · on-call dispatch · plumbing</span>' },
    { step: 'Step 04 · Book',     title: 'Writes to your CRM. Not a spreadsheet.',
      copy: 'ServiceTitan, Housecall Pro, Jobber, AppFolio, Wealthbox, Salesforce. Job lands as a clean record with full transcript and severity tag.',
      demo: '<span class="ts">+0:48</span><br>&gt; <span class="ai">CRM · ServiceTitan · job created #41872</span><br>&gt; <span class="ai">Tech · Marcus T. · ETA 23 min</span><br>&gt; <span class="ai">Notes · attached transcript + customer history</span>' },
    { step: 'Step 05 · Confirm',  title: 'Customer SMS within 60 seconds.',
      copy: 'Confirmation message with tech name, ETA, and a one-tap reschedule link. Customers stop calling back to ask "are they coming?"',
      demo: '<span class="ts">+0:58</span><br>&gt; <span class="ai">SMS sent · Acme Plumbing</span><br>&gt; <span class="you">"Marcus is on his way — ETA 23 min.</span><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="you">Reply RESCHEDULE if you need a different time."</span>' },
    { step: 'Step 06 · Follow up', title: '4-touch sequence. Ends or books.',
      copy: 'Day 0, 1, 3, 5. Stops the moment they reply, book, or unsubscribe. No drip-campaign noise. Sequences hand-tuned for your industry.',
      demo: '<span class="ts">Day 1 · 09:00</span><br>&gt; <span class="ai">SMS · review request · 5-star CTA</span><br><br><span class="ts">Day 3 · 17:00</span><br>&gt; <span class="ai">SMS · maintenance offer · seasonal</span>' },
  ];
  const flow = document.querySelector('[data-flow]');
  if (flow) {
    const detail = document.querySelector('[data-flow-detail]');
    const stepEl = detail.querySelector('[data-detail-step]');
    const titleEl = detail.querySelector('[data-detail-title]');
    const copyEl = detail.querySelector('[data-detail-copy]');
    const demoEl = detail.querySelector('[data-detail-demo]');
    flow.querySelectorAll('.flow-node').forEach(node => {
      node.addEventListener('click', () => {
        flow.querySelectorAll('.flow-node').forEach(n => n.classList.remove('active'));
        node.classList.add('active');
        const i = Number(node.dataset.node);
        const data = FLOW[i];
        if (!data) return;
        stepEl.textContent = data.step;
        titleEl.textContent = data.title;
        copyEl.textContent = data.copy;
        demoEl.innerHTML = data.demo;
      });
    });
  }

  // ----- Cost-of-silence split scroll --------------------------------
  // The list translates upward as the section scrolls past.
  const costList = document.querySelector('[data-cost-list]');
  if (costList) {
    const section = document.querySelector('.cost-track');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) {
      const totalShift = () => {
        // shift list by (its own height) - (visible viewport list area) so it scrolls fully
        const visible = costList.parentElement.clientHeight;
        return Math.max(0, costList.scrollHeight - visible + 80);
      };
      let shift = totalShift();
      window.addEventListener('resize', () => { shift = totalShift(); });
      const update = () => {
        const rect = section.getBoundingClientRect();
        const total = section.offsetHeight - window.innerHeight;
        const progress = Math.min(1, Math.max(0, -rect.top / total));
        costList.style.transform = `translateY(${-shift * progress}px)`;
        requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    }
  }

  // ----- Industries horizontal scroll-jack --------------------------
  const indSection = document.querySelector('.industries-section');
  const indTrack = document.querySelector('[data-ind-track]');
  const indRail  = document.querySelector('[data-ind-rail]');
  const indBar   = document.querySelector('[data-ind-bar]');
  const indStacked = indSection && indSection.hasAttribute('data-stacked');
  if (!indStacked && indTrack && indRail && window.matchMedia('(min-width: 901px)').matches) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) {
      const update = () => {
        const rect = indTrack.getBoundingClientRect();
        const total = indTrack.offsetHeight - window.innerHeight;
        const progress = Math.min(1, Math.max(0, -rect.top / total));
        // 4 panels, rail is 400% wide → translate up to -75%
        indRail.style.transform = `translate3d(${-progress * 75}%, 0, 0)`;
        if (indBar) indBar.style.width = (progress * 100) + '%';
        requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    }
  }

  // ----- Closing form: light validation -----------------------------
  document.querySelectorAll('.cta-form').forEach(f => {
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = f.querySelector('input[type="email"]');
      const btn = f.querySelector('button');
      if (!input.value || !/.+@.+\..+/.test(input.value)) { input.focus(); return; }
      btn.textContent = 'Sent ✓';
      input.value = '';
      setTimeout(() => { btn.textContent = 'Start →'; }, 2400);
    });
  });
})();
