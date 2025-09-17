(() => {
  const NODES = {
    A: { type: 'q', text: '¿Existe déficit sensorial, afectación neurológica?', yes: 'B', no: 'C' },
    B: { type: 'q', text: '¿Explican los trastornos de aprendizaje?', yes: 'Z_NO_CONT', no: 'C' },
    C: { type: 'q', text: '¿Es retraso mental?', yes: 'D', no: 'E' },
    D: { type: 'q', text: '¿Justifica los problemas de aprendizaje?', yes: 'Z_NO_CONT', no: 'E' },
    E: { type: 'q', text: '¿Trastorno profundo del desarrollo?', yes: 'F', no: 'G' },
    F: { type: 'q', text: '¿Justifica los problemas de aprendizaje?', yes: 'Z_NO_CONT', no: 'G' },
    G: { type: 'q', text: '¿TDAH? ¿Dislexia?', yes: 'H', no: 'I' },
    H: { type: 'q', text: '¿Justifica los problemas de aprendizaje?', yes: 'Z_NO_CONT', no: 'I' },
    I: { type: 'q', text: '¿Es el lenguaje adecuado al nivel de desarrollo?', yes: 'K', no: 'J' },
    J: { type: 'q', text: '¿Problemas de articulación?', yes: 'M', no: 'L' },
    L: { type: 'end', title: 'Diagnóstico: trastorno de expresión del lenguaje', tone: 'success' },
    M: { type: 'q', text: '¿Explica el retraso del lenguaje?', yes: 'N', no: 'Z_NO_CONT' },
    N: { type: 'q', text: '¿Explica los problemas de aprendizaje?', yes: 'O', no: 'Z_NO_CONT' },
    O: { type: 'end', title: 'Trastorno de la percepción', tone: 'success' },
    K: { type: 'q', text: '¿Tiene adecuada coordinación?', yes: 'Q', no: 'P' },
    P: { type: 'q', text: '¿Justifica los problemas de aprendizaje?', yes: 'Z_NO_CONT', no: 'Q' },
    Q: { type: 'q', text: '¿Las tareas son adecuadas al desarrollo del niño?', yes: 'R', no: 'S' },
    R: { type: 'end', title: 'Destacar: depresión y/o trastornos de ajuste social o del desarrollo', tone: 'warn' },
    S: { type: 'q', text: '¿Desajuste de resultados escolares con otras actividades?', yes: 'T', no: 'U' },
    U: { type: 'end', title: 'Buscar otras causas de retraso del desarrollo', tone: 'info' },
    T: { type: 'q', text: '¿Escolarización inadecuada?', yes: 'W', no: 'V' },
    V: { type: 'end', title: 'Buscar otros diagnósticos', tone: 'info' },
    W: { type: 'q', text: 'Diagnóstico adecuado de bajo rendimiento escolar justifica el trastorno del aprendizaje', yes: 'Z_FIN_DIAG', no: 'Z_NO_CONT_DIAG' },
    Z_NO_CONT: { type: 'end', title: 'No continuar', tone: 'danger' },
    Z_NO_CONT_DIAG: { type: 'end', title: 'No continuar diagnóstico', tone: 'danger' },
    Z_FIN_DIAG: { type: 'end', title: 'Trastorno del aprendizaje justificado', tone: 'success' }
  };

  const ICONS = {
    success: '✔️',
    danger: '❌',
    warn: '⚠️',
    info: 'ℹ️'
  };

  document.addEventListener('DOMContentLoaded', () => {
    let current = 'A';
    const trail = [{ id: 'A', label: NODES.A.text }];

    const $ = (q) => document.querySelector(q);
    const breadcrumbs = $('#breadcrumbs');
    const view = $('#view');
    const backBtn = $('#backBtn');
    const restartBtn = $('#restartBtn');

    function renderBreadcrumbs() {
      breadcrumbs.innerHTML = '';
      trail.forEach((step, index) => {
        const wrapper = document.createElement('span');
        wrapper.className = 'crumb';

        const pill = document.createElement('span');
        pill.className = 'pill';
        pill.textContent = step.label;
        wrapper.appendChild(pill);

        if (index < trail.length - 1) {
          const arrow = document.createElement('span');
          arrow.className = 'arrow';
          arrow.textContent = '→';
          wrapper.appendChild(arrow);
        }

        breadcrumbs.appendChild(wrapper);
      });

      backBtn.disabled = trail.length <= 1;
    }

    function nodeToneClass(tone) {
      switch (tone) {
        case 'success':
          return 'end success';
        case 'warn':
          return 'end warn';
        case 'danger':
          return 'end danger';
        case 'info':
          return 'end info';
        default:
          return 'end';
      }
    }

    function render() {
      const node = NODES[current];

      view.classList.remove('fade-in');
      void view.offsetWidth;
      view.classList.add('fade-in');

      if (node.type === 'q') {
        view.innerHTML = `
          <div class="card">
            <h2 class="q">${node.text}</h2>
            <div class="answers">
              <button class="yes" id="yesBtn">Sí</button>
              <button class="no" id="noBtn">No</button>
            </div>
          </div>
        `;

        const yesBtn = document.getElementById('yesBtn');
        const noBtn = document.getElementById('noBtn');

        yesBtn?.addEventListener('click', () => answer('yes'));
        noBtn?.addEventListener('click', () => answer('no'));
        return;
      }

      const toneClass = nodeToneClass(node.tone);
      const icon = ICONS[node.tone] ?? 'ℹ️';

      view.innerHTML = `
        <div class="card ${toneClass}">
          <div class="end">
            <span aria-hidden="true">${icon}</span>
            <h2 class="q" style="margin:0">${node.title}</h2>
          </div>
          <p class="muted">Fin de la ruta. Puedes reiniciar o retroceder para explorar otras ramas.</p>
        </div>
      `;
    }

    function answer(option) {
      const node = NODES[current];
      const next = option === 'yes' ? node.yes : node.no;

      if (!next) {
        return;
      }

      const label = `${node.text} → ${option === 'yes' ? 'Sí' : 'No'}`;
      trail.push({ id: next, label });
      current = next;

      renderBreadcrumbs();
      render();
    }

    backBtn.addEventListener('click', () => {
      if (trail.length <= 1) {
        return;
      }

      trail.pop();
      const previous = trail[trail.length - 1];
      current = previous.id;

      renderBreadcrumbs();
      render();
    });

    restartBtn.addEventListener('click', () => {
      current = 'A';
      trail.splice(0, trail.length, { id: 'A', label: NODES.A.text });

      renderBreadcrumbs();
      render();
    });

    renderBreadcrumbs();
    render();
  });
})();
