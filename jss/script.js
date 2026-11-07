/* ============================================================
   Quadraê — app completo (pagamento apenas simulado)
   ============================================================ */

   const DB = {
    users: 'quadrae_users',
    session: 'quadrae_session',
    bookings: 'quadrae_bookings',
    pending: 'quadrae_pending'
  };
  
  const read = (k, fb) => {
    try { return JSON.parse(localStorage.getItem(k)) ?? fb; } catch { return fb; }
  };
  const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  
  /* ---------- Catálogo ---------- */
  const COURTS = [
    {
      id: 'arena-sul-1',
      imagem: 'img/fut/ftu4.jpg',
      imagens: ['img/fut/ftu4.jpg', 'img/fut/fut3.jpg', 'img/fut/fut2.jpg', 'img/fut/fut1.jpg'],
      nome: 'Arena Sul — Quadra 1',
      esporte: 'Futebol society',
      endereco: 'Rua Bela Vista, 240',
      bairro: 'Bela Vista',
      distancia: '1,2 km',
      preco: 90,
      tipo: 'Society',
      jogadores: 'Até 10',
      tamanho: '40x20m',
      sobre: 'Quadra de gramado sintético com iluminação de LED para jogos noturnos, rede nova e traves oficiais. Piso com amortecimento, ideal para futebol society e treinos de alta intensidade.',
      comodidades: ['Vestiário', 'Estacionamento', 'Iluminação LED', 'Wi-Fi', 'Bebedouro', 'Cobertura'],
      ocupados: ['20:00', '22:00']
    },
    {
      id: 'beach-zone-2',
      imagem: 'img/tenis/tenis1.jpg',
      imagens: ['img/tenis/tenis1.jpg', 'img/tenis/tenis4.jpg', 'img/tenis/tenis3.jpg', 'img/tenis/tenis2.jpg'],
      nome: 'Beach Zone — Areia 2',
      esporte: 'Beach tennis',
      endereco: 'Av. Atlântica, 88',
      bairro: 'Jardins',
      distancia: '850 m',
      preco: 80,
      tipo: 'Areia',
      jogadores: 'Até 4',
      tamanho: '16x8m',
      sobre: 'Quadra de areia fina peneirada, com rede oficial de beach tennis e iluminação para jogos noturnos. Areia tratada diariamente.',
      comodidades: ['Vestiário', 'Ducha', 'Iluminação LED', 'Bebedouro'],
      ocupados: ['17:00', '21:00']
    },
    {
      id: 'club-norte-3',
      imagem: 'img/baska/baska1.webp',
      imagens: ['img/baska/baska1.webp', 'img/baska/baska.webp', 'img/baska/baska2.jpg', 'img/baska/baska3.jpg'],
      nome: 'Club Norte — Quadra 3',
      esporte: 'Tênis',
      endereco: 'Rua das Acácias, 1200',
      bairro: 'Santana',
      distancia: '3,4 km',
      preco: 110,
      tipo: 'Saibro',
      jogadores: 'Até 4',
      tamanho: '23x11m',
      sobre: 'Quadra de saibro com piso nivelado e rede profissional. Ambiente tranquilo, ideal para treinos e aulas particulares.',
      comodidades: ['Vestiário', 'Estacionamento', 'Iluminação LED', 'Lanchonete'],
      ocupados: ['18:00', '19:00']
    },
    {
      id: 'praca-volei-4',
      imagem: 'img/volei/volei1.jpg',
      imagens: ['img/volei/volei1.jpg', 'img/volei/volei2.jpg', 'img/volei/volei3.jpg', 'img/volei/1000245810.jpg'],
      nome: 'Praça Central — Vôlei 4',
      esporte: 'Vôlei',
      endereco: 'Praça Central, s/n',
      bairro: 'Centro',
      distancia: '2,1 km',
      preco: 70,
      tipo: 'Quadra dura',
      jogadores: 'Até 12',
      tamanho: '18x9m',
      sobre: 'Quadra poliesportiva descoberta, com piso antiderrapante e rede ajustável. Boa para vôlei de quadra e recreação.',
      comodidades: ['Bebedouro', 'Estacionamento', 'Iluminação LED'],
      ocupados: ['20:00']
    }
  ];
  
  const HORARIOS = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
  
  /* ---------- Helpers ---------- */
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const money = n => `R$ ${Number(n).toFixed(2).replace('.', ',')}`;
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  
  function toast(msg) {
    const el = $('#toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('is-visible');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('is-visible'), 2800);
  }
  
  function fmtDate(iso) {
    if (!iso) return '—';
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
  }
  
  function fmtDateLong(iso) {
    if (!iso) return '—';
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
  }
  
  function todayISO() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  
  function proximaHora(h) {
    const [hh] = h.split(':').map(Number);
    return `${String(hh + 1).padStart(2, '0')}:00`;
  }
  
  /* ---------- Sessão ---------- */
  function getSession() {
    const id = read(DB.session, null);
    if (!id) return null;
    return read(DB.users, []).find(u => u.id === id) || null;
  }
  
  function setSession(id) {
    if (id) write(DB.session, id);
    else localStorage.removeItem(DB.session);
  }
  
  function renderHeader() {
    const box = $('#headerActions');
    if (!box) return;
    const user = getSession();
    const page = document.body.dataset.page;
  
    $$('#mainNav a').forEach(a => {
      const href = a.getAttribute('href');
      if (href === `${page}.html`) a.classList.add('is-active');
    });
  
    if (user) {
      box.innerHTML = `
        <span class="user-chip"><span class="avatar">${user.nome.charAt(0).toUpperCase()}</span>${user.nome.split(' ')[0]}</span>
        <button class="btn btn-ghost btn-sm" id="btnSair" type="button">Sair</button>
      `;
      $('#btnSair').addEventListener('click', () => {
        setSession(null);
        toast('Você saiu da conta.');
        renderHeader();
        if (document.body.dataset.page === 'reservas') renderReservas();
      });
    } else {
      box.innerHTML = `<button class="btn btn-ghost" data-open="modal-auth" type="button">Entrar</button>`;
    }
  }
  
  /* ---------- Auth ---------- */
  function openAuth(tab = 'login') {
    const modal = $('#modal-auth');
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    switchAuthTab(tab);
  }
  
  function closeAuth() {
    const modal = $('#modal-auth');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }
  
  function switchAuthTab(tab) {
    $$('.auth-tab').forEach(t => t.classList.toggle('is-active', t.dataset.authTab === tab));
    $('#formLogin').hidden = tab !== 'login';
    $('#formSignup').hidden = tab !== 'signup';
    $('#loginError').hidden = true;
    $('#signupError').hidden = true;
  }
  
  function showError(sel, msg) {
    const el = $(sel);
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
  }
  
  function initAuth() {
    $$('.auth-tab').forEach(t => {
      t.addEventListener('click', () => switchAuthTab(t.dataset.authTab));
    });
  
    $('#formLogin')?.addEventListener('submit', e => {
      e.preventDefault();
      const email = $('#loginEmail').value.trim().toLowerCase();
      const senha = $('#loginSenha').value;
  
      if (!email || !senha) return showError('#loginError', 'Preencha e-mail e senha.');
  
      const user = read(DB.users, []).find(u => u.email === email);
      if (!user || user.senha !== senha) {
        return showError('#loginError', 'E-mail ou senha incorretos.');
      }
  
      setSession(user.id);
      closeAuth();
      toast(`Bem-vindo, ${user.nome.split(' ')[0]}!`);
      renderHeader();
      if (document.body.dataset.page === 'reservas') renderReservas();
      if (document.body.dataset.page === 'resumo') renderResumo();
    });
  
    $('#formSignup')?.addEventListener('submit', e => {
      e.preventDefault();
      const nome = $('#signupNome').value.trim();
      const email = $('#signupEmail').value.trim().toLowerCase();
      const telefone = $('#signupTelefone').value.trim();
      const senha = $('#signupSenha').value;
  
      if (nome.length < 3) return showError('#signupError', 'Informe seu nome completo.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showError('#signupError', 'Informe um e-mail válido.');
      if (telefone.replace(/\D/g, '').length < 10) return showError('#signupError', 'Informe um telefone válido com DDD.');
      if (senha.length < 6) return showError('#signupError', 'A senha precisa ter ao menos 6 caracteres.');
  
      const users = read(DB.users, []);
      if (users.some(u => u.email === email)) {
        return showError('#signupError', 'Este e-mail já está cadastrado. Faça login.');
      }
  
      const user = { id: uid(), nome, email, telefone, senha, criadoEm: new Date().toISOString() };
      users.push(user);
      write(DB.users, users);
      setSession(user.id);
  
      closeAuth();
      toast(`Conta criada. Bem-vindo, ${nome.split(' ')[0]}!`);
      renderHeader();
      if (document.body.dataset.page === 'reservas') renderReservas();
      if (document.body.dataset.page === 'resumo') renderResumo();
    });
  }
  
  /* ---------- Reservas ---------- */
  function getBookings() {
    return read(DB.bookings, []);
  }
  
  function isSlotTaken(courtId, date, hora) {
    return getBookings().some(b =>
      b.courtId === courtId && b.data === date && b.hora === hora && b.status !== 'cancelada'
    );
  }
  
  function slotStatus(court, date, hora) {
    if (isSlotTaken(court.id, date, hora)) return 'ocupado';
    if (court.ocupados.includes(hora)) return 'ocupado';
    return 'livre';
  }
  
  function createBooking(payload) {
    const bookings = getBookings();
    const booking = {
      id: uid(),
      ...payload,
      status: 'confirmada',
      criadoEm: new Date().toISOString()
    };
    bookings.push(booking);
    write(DB.bookings, bookings);
    return booking;
  }
  
  /* ---------- Home ---------- */
  let filtro = { esporte: '', data: '', hora: '', local: '' };
  
  function popularBairros() {
    const select = $('#f-local');
    if (!select) return;
    const bairros = [...new Set(COURTS.map(c => c.bairro))].sort();
    select.innerHTML = '<option value="">Todos os bairros</option>' +
      bairros.map(b => `<option value="${b}">${b}</option>`).join('');
  }
  
  function renderCourts() {
    const grid = $('#courtGrid');
    if (!grid) return;
  
    const lista = COURTS.filter(c => {
      if (filtro.esporte && c.esporte !== filtro.esporte) return false;
      if (filtro.local && c.bairro !== filtro.local) return false;
      if (filtro.hora && slotStatus(c, filtro.data || todayISO(), filtro.hora) !== 'livre') return false;
      return true;
    });
  
    const label = $('#resultsLabel');
    if (label) {
      label.textContent = lista.length === 1
        ? '1 quadra encontrada'
        : `${lista.length} quadras encontradas`;
    }
  
    $('#emptyCourts').hidden = lista.length > 0;
    grid.hidden = lista.length === 0;
  
    const data = filtro.data || todayISO();
  
    grid.innerHTML = lista.map(c => {
      const chips = ['18:00', '19:00', '20:00'].map(h => {
        const st = slotStatus(c, data, h);
        return `<button class="time-chip ${st === 'ocupado' ? 'is-busy' : ''}"
                  ${st === 'ocupado' ? 'disabled' : ''}
                  data-court="${c.id}" data-hora="${h}" type="button">${h}</button>`;
      }).join('');
  
      return `
        <article class="court-card">
          <div class="photo court-photo" style="background-image: url('${c.imagem}')" role="img" aria-label="Foto de ${c.nome}"></div>
          <div class="court-body">
            <div class="court-top">
              <div>
                <h3 class="court-name">${c.nome}</h3>
                <p class="court-addr">${c.endereco} · ${c.bairro} · ${c.distancia}</p>
              </div>
            </div>
            <span class="badge badge-ok">Disponível hoje</span>
            <div class="time-chips">${chips}</div>
            <div class="court-foot">
              <span class="court-price">${money(c.preco)}<small>/h</small></span>
              <button class="btn btn-primary btn-sm" data-reservar="${c.id}" type="button">Reservar</button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }
  
  function renderSlots() {
    const box = $('#slotsCard');
    if (!box) return;
  
    const data = todayISO();
    const linhas = [];
  
    COURTS.forEach(c => {
      HORARIOS.forEach(h => {
        if (slotStatus(c, data, h) === 'livre') linhas.push({ court: c, hora: h });
      });
    });
  
    const primeiras = linhas.slice(0, 4);
  
    box.innerHTML = primeiras.length
      ? primeiras.map(({ court, hora }) => `
          <div class="slot-row">
            <span class="slot-court">${court.nome}</span>
            <span class="slot-when">${fmtDate(data)} · ${hora} — ${proximaHora(hora)}</span>
            <span class="slot-price">${money(court.preco)}</span>
            <button class="btn btn-outline btn-sm" data-reservar="${court.id}" data-hora="${hora}" type="button">Reservar</button>
          </div>
        `).join('')
      : `<div class="slot-row"><span class="slot-court">Nenhum horário livre hoje</span><span class="slot-when">Tente outra data</span><span class="slot-price">—</span><span></span></div>`;
  
    const badge = $('#heroFreeCount');
    if (badge) badge.textContent = `${linhas.length} horários livres`;
  }
  
  function initHome() {
    popularBairros();
  
    const dataInput = $('#f-data');
    if (dataInput) {
      dataInput.value = todayISO();
      dataInput.min = todayISO();
    }
  
    const label = $('#todayLabel');
    if (label) label.textContent = fmtDateLong(todayISO());
  
    $('#statCourts').textContent = COURTS.length;
    $('#statSports').textContent = new Set(COURTS.map(c => c.esporte)).size;
  
    $('#searchForm')?.addEventListener('submit', e => {
      e.preventDefault();
      filtro = {
        esporte: $('#f-esporte').value,
        data: $('#f-data').value,
        hora: $('#f-hora').value,
        local: $('#f-local').value
      };
      renderCourts();
      renderSlots();
      document.getElementById('quadras').scrollIntoView({ behavior: 'smooth' });
      toast('Busca aplicada.');
    });
  
    const limpar = () => {
      filtro = { esporte: '', data: todayISO(), hora: '', local: '' };
      $('#f-esporte').value = '';
      $('#f-hora').value = '';
      $('#f-local').value = '';
      $('#f-data').value = todayISO();
      renderCourts();
      renderSlots();
    };
  
    $('#btnLimparBusca')?.addEventListener('click', () => { limpar(); toast('Busca limpa.'); });
    $('#btnResetEmpty')?.addEventListener('click', () => { limpar(); toast('Filtros removidos.'); });
  
    renderCourts();
    renderSlots();
  }
  
  /* ---------- Detalhe ---------- */
  let detalheState = { court: null, data: null, hora: null };
  
  function getCourtFromURL() {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    return COURTS.find(c => c.id === id) || COURTS[0];
  }
  
  function renderDetalhe() {
    const court = detalheState.court;
    if (!court) return;
  
    document.title = `Quadraê — ${court.nome}`;
    $('#crumbName').textContent = court.nome;
    $('#courtTitle').textContent = court.nome;
    $('#courtAddress').textContent = `${court.endereco} — ${court.bairro}, São Paulo`;
    $('#courtPrice').textContent = money(court.preco);
    $('#courtAbout').textContent = court.sobre;

    // Preenche a galeria com as fotos da modalidade selecionada.
    const fotos = court.imagens || [court.imagem, court.imagem, court.imagem, court.imagem];
    const fotoPrincipal = $('.photo-main');
    if (fotoPrincipal) {
      fotoPrincipal.style.backgroundImage = `url('${fotos[0]}')`;
      fotoPrincipal.setAttribute('aria-label', `Foto principal de ${court.nome}`);
    }
    $$('.photo-thumb').forEach((foto, indice) => {
      foto.style.backgroundImage = `url('${fotos[indice + 1] || fotos[0]}')`;
      foto.setAttribute('aria-label', `Foto ${indice + 2} de ${court.nome}`);
    });
  
    $('#infoRow').innerHTML = `
      <div class="info-card"><span class="info-icon">🏅</span><div><strong>${court.tipo}</strong><small>Tipo de campo</small></div></div>
      <div class="info-card"><span class="info-icon">👥</span><div><strong>${court.jogadores}</strong><small>Jogadores</small></div></div>
      <div class="info-card"><span class="info-icon">📐</span><div><strong>${court.tamanho}</strong><small>Tamanho</small></div></div>
    `;
  
    $('#courtChips').innerHTML = court.comodidades
      .map(c => `<span class="chip chip-ok">✓ ${c}</span>`).join('');
  
    renderDayStrip();
    renderTimeGrid();
  }
  
  function renderDayStrip() {
    const strip = $('#dayStrip');
    if (!strip) return;
  
    const base = new Date();
    const dias = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      return {
        iso,
        dia: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').toUpperCase(),
        num: String(d.getDate()).padStart(2, '0')
      };
    });
  
    if (!detalheState.data) detalheState.data = dias[0].iso;
  
    strip.innerHTML = dias.map(d => `
      <button class="day ${d.iso === detalheState.data ? 'is-active' : ''}" data-date="${d.iso}" type="button">
        ${d.dia}<strong>${d.num}</strong>
      </button>
    `).join('');
  
    $$('.day', strip).forEach(btn => {
      btn.addEventListener('click', () => {
        detalheState.data = btn.dataset.date;
        detalheState.hora = null;
        renderDayStrip();
        renderTimeGrid();
      });
    });
  }
  
  function renderTimeGrid() {
    const grid = $('#timeGrid');
    if (!grid) return;
  
    const court = detalheState.court;
    const data = detalheState.data;
  
    grid.innerHTML = HORARIOS.map(h => {
      const st = slotStatus(court, data, h);
      const sel = detalheState.hora === h && st === 'livre';
      return `
        <button class="slot ${st === 'ocupado' ? 'is-busy' : ''} ${sel ? 'is-selected' : ''}"
                ${st === 'ocupado' ? 'disabled' : ''}
                data-hora="${h}" type="button">${h}</button>
      `;
    }).join('');
  
    $$('.slot', grid).forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('is-busy')) return;
        detalheState.hora = btn.dataset.hora;
        renderTimeGrid();
      });
    });
  }
  
  function initDetalhe() {
    detalheState.court = getCourtFromURL();
    detalheState.data = todayISO();
  
    const horaURL = new URLSearchParams(location.search).get('hora');
    if (horaURL && HORARIOS.includes(horaURL)) detalheState.hora = horaURL;
  
    renderDetalhe();
  
    $('#btnReservar')?.addEventListener('click', () => {
      if (!detalheState.hora) {
        return toast('Selecione um horário disponível.');
      }
      if (slotStatus(detalheState.court, detalheState.data, detalheState.hora) === 'ocupado') {
        return toast('Este horário não está mais disponível.');
      }
      if (!getSession()) {
        toast('Faça login para reservar.');
        return openAuth('login');
      }
  
      write(DB.pending, {
        courtId: detalheState.court.id,
        data: detalheState.data,
        hora: detalheState.hora,
        preco: detalheState.court.preco
      });
      location.href = 'index2.html';
    });
  }
  
  /* ---------- Resumo ---------- */
  function renderResumo() {
    const pending = read(DB.pending, null);
    const box = $('#resumoArena');
    if (!box) return;
  
    if (!pending) {
      $('#resumoArena').textContent = 'Nenhuma reserva em andamento';
      $('#resumoData').textContent = '—';
      $('#resumoHora').textContent = '—';
      $('#resumoPreco').textContent = money(0);
      $('#resumoTotal').textContent = money(0);
      $('#btnConfirmar').disabled = true;
      $('#btnConfirmar').textContent = 'Escolha um horário';
      return;
    }
  
    const court = COURTS.find(c => c.id === pending.courtId);
    if (!court) return;
  
    const resumoFoto = $('#resumoFoto');
    if (resumoFoto) {
      resumoFoto.src = court.imagem;
      resumoFoto.alt = `Foto de ${court.nome}`;
    }
    const resumoFotoFundo = $('.photo-resumo');
    if (resumoFotoFundo && resumoFotoFundo.tagName !== 'IMG') {
      resumoFotoFundo.style.backgroundImage = `url('${court.imagem}')`;
      resumoFotoFundo.setAttribute('aria-label', `Foto de ${court.nome}`);
    }

    $('#resumoArena').textContent = court.nome;
    $('#resumoData').textContent = fmtDateLong(pending.data);
    $('#resumoHora').textContent = `${pending.hora} — ${proximaHora(pending.hora)}`;
    $('#resumoPreco').textContent = money(pending.preco);
    $('#resumoTotal').textContent = money(pending.preco);
  
    const btn = $('#btnConfirmar');
    btn.disabled = false;
    btn.textContent = 'Confirmar reserva';
  }
  
  function initResumo() {
    renderResumo();
  
    $('#btnConfirmar')?.addEventListener('click', () => {
      const pending = read(DB.pending, null);
      if (!pending) return toast('Nenhuma reserva em andamento.');
  
      if (!getSession()) {
        toast('Faça login para confirmar.');
        return openAuth('login');
      }
  
      if (isSlotTaken(pending.courtId, pending.data, pending.hora)) {
        toast('Este horário acabou de ser ocupado. Escolha outro.');
        return;
      }
  
      location.href = 'index3.html';
    });
  }
  
  /* ---------- Pagamento (simulado) ---------- */
  let pixInterval = null;
  
  function initPagamento() {
    const pending = read(DB.pending, null);
    const valor = $('#pixValor');
  
    if (!pending) {
      if (valor) valor.textContent = money(0);
      $('#btnSimularPix').disabled = true;
      $('#btnSimularPix').textContent = 'Nenhuma reserva pendente';
      return;
    }
  
    if (valor) valor.textContent = money(pending.preco);
  
    let restante = 15 * 60;
    const timer = $('#pixTimer');
    clearInterval(pixInterval);
    pixInterval = setInterval(() => {
      restante = Math.max(0, restante - 1);
      const m = String(Math.floor(restante / 60)).padStart(2, '0');
      const s = String(restante % 60).padStart(2, '0');
      if (timer) timer.textContent = `${m}:${s}`;
      if (restante === 0) clearInterval(pixInterval);
    }, 1000);
  
    $('#btnCopiar')?.addEventListener('click', async () => {
      const code = $('#pixCode').textContent.trim();
      try {
        await navigator.clipboard.writeText(code);
        toast('Código Pix copiado.');
      } catch {
        toast('Não foi possível copiar automaticamente.');
      }
    });
  
    $('#btnSimularPix')?.addEventListener('click', () => {
      const user = getSession();
      if (!user) {
        toast('Faça login para concluir.');
        return openAuth('login');
      }
  
      if (isSlotTaken(pending.courtId, pending.data, pending.hora)) {
        toast('Este horário não está mais disponível.');
        return;
      }
  
      createBooking({
        userId: user.id,
        courtId: pending.courtId,
        data: pending.data,
        hora: pending.hora,
        preco: pending.preco
      });
  
      localStorage.removeItem(DB.pending);
      clearInterval(pixInterval);
      toast('Reserva confirmada!');
      setTimeout(() => { location.href = 'reservas.html'; }, 700);
    });
  }
  
  /* ---------- Minhas reservas ---------- */
  function renderReservas() {
    const lista = $('#reservasLista');
    if (!lista) return;
  
    const user = getSession();
    const empty = $('#emptyReservas');
    const sub = $('#reservasSub');
  
    if (!user) {
      lista.innerHTML = '';
      empty.hidden = false;
      empty.querySelector('strong').textContent = 'Entre para ver suas reservas.';
      empty.querySelector('.muted').textContent = 'Crie uma conta ou faça login para acompanhar seus horários.';
      const cta = empty.querySelector('.btn');
      cta.textContent = 'Entrar';
      cta.setAttribute('href', '#');
      cta.onclick = e => { e.preventDefault(); openAuth('login'); };
      if (sub) sub.textContent = 'Você não está logado';
      return;
    }
  
    const minhas = getBookings()
      .filter(b => b.userId === user.id)
      .sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));
  
    if (sub) sub.textContent = `${minhas.length} reserva(s) na sua conta`;
  
    if (!minhas.length) {
      lista.innerHTML = '';
      empty.hidden = false;
      empty.querySelector('strong').textContent = 'Você ainda não tem reservas.';
      empty.querySelector('.muted').textContent = 'Escolha uma quadra e garanta seu horário.';
      const cta = empty.querySelector('.btn');
      cta.textContent = 'Ver quadras';
      cta.setAttribute('href', 'index.html#quadras');
      cta.onclick = null;
      return;
    }
  
    empty.hidden = true;
  
    lista.innerHTML = minhas.map(b => {
      const court = COURTS.find(c => c.id === b.courtId);
      const nome = court ? court.nome : 'Quadra';
      const cancelada = b.status === 'cancelada';
      return `
        <article class="reserva-card">
          <div class="reserva-info">
            <strong>${nome}</strong>
            <p class="reserva-meta">${fmtDateLong(b.data)} · ${b.hora} — ${proximaHora(b.hora)}</p>
            <p class="reserva-meta">${money(b.preco)} · Reserva #${b.id.slice(-6).toUpperCase()}</p>
          </div>
          <div class="reserva-actions">
            <span class="badge ${cancelada ? 'badge-off' : 'badge-ok'}">${cancelada ? 'Cancelada' : 'Confirmada'}</span>
            ${cancelada ? '' : `<button class="btn btn-danger btn-sm" data-cancelar="${b.id}" type="button">Cancelar</button>`}
          </div>
        </article>
      `;
    }).join('');
  
    $$('[data-cancelar]', lista).forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.cancelar;
        const bookings = getBookings();
        const b = bookings.find(x => x.id === id);
        if (!b) return;
  
        if (!confirm('Cancelar esta reserva? O horário volta a ficar disponível.')) return;
  
        b.status = 'cancelada';
        write(DB.bookings, bookings);
        toast('Reserva cancelada.');
        renderReservas();
      });
    });
  }
  
  /* ---------- Delegação global ---------- */
  document.addEventListener('click', e => {
    const openBtn = e.target.closest('[data-open]');
    if (openBtn) {
      e.preventDefault();
      openAuth('login');
      return;
    }
  
    const closeBtn = e.target.closest('[data-close]');
    if (closeBtn) {
      closeAuth();
      return;
    }
  
    if (e.target.classList.contains('modal')) closeAuth();
  
    const chip = e.target.closest('.time-chip');
    if (chip && !chip.disabled) {
      const group = chip.parentElement;
      $$('.time-chip', group).forEach(c => c.classList.remove('is-selected'));
      chip.classList.add('is-selected');
    }
  
    const reservar = e.target.closest('[data-reservar]');
    if (reservar) {
      const courtId = reservar.dataset.reservar;
      const hora = reservar.dataset.hora || '';
      const url = new URL('index1.html', location.href);
      url.searchParams.set('id', courtId);
      if (hora) url.searchParams.set('hora', hora);
      location.href = url.toString();
    }
  });
  
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAuth();
  });
  
  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    initAuth();
  
    const page = document.body.dataset.page;
    if (page === 'home') initHome();
    if (page === 'detalhe') initDetalhe();
    if (page === 'resumo') initResumo();
    if (page === 'pagamento') initPagamento();
    if (page === 'reservas') renderReservas();
  });