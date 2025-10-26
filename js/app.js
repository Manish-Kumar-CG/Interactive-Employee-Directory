
// js/app.js
(function () {
  const $list = $('#employeeList');
  const $search = $('#searchInput');
  const $modal = $('#employeeModal');
  const $modalBody = $('#modalBody');
  const $modalTitle = $('#modalTitle');
  let employees = [];
  function getInitials(name) { return name.split(' ').filter(Boolean).map(n => n[0] || '').slice(0, 2).join('').toUpperCase(); }
  function randomColor() { const colors = ['#4F46E5', '#059669', '#DB2777', '#2563EB', '#DC2626', '#F59E0B', '#0EA5E9', '#9333EA']; return colors[Math.floor(Math.random() * colors.length)]; }
  function renderEmployees(list) {
    $list.empty();
    if (!list.length) { $list.html('<p class="empty">No employees found.</p>'); return; }
    list.forEach(emp => {
      const initials = getInitials(emp.name); const bg = emp.avatarColor || randomColor();
      const $card = $(
        `<article class="card" data-id="${emp.id}" tabindex="0" role="button" aria-label="View details for ${emp.name}">
          <div class="avatar" style="--bg:${bg}">${initials}</div>
          <div class="info">
            <h3>${emp.name}</h3>
            <p class="muted">${emp.title} • ${emp.department}</p>
            <p class="email">${emp.email}</p>
          </div>
        </article>`);
      $list.append($card);
    });
  }
  function filterEmployees(query) { const q = (query || '').trim().toLowerCase(); if (!q) return employees.slice(); return employees.filter(e => [e.name, e.title, e.department, e.email].some(v => (v || '').toLowerCase().includes(q))); }
  function showDetails(emp) {
    $modalTitle.text(emp.name);
    const telHref = emp.phone ? emp.phone.replace(/[^+\d]/g, '') : '';
    const html = `
      <div class="modal-grid">
        <div class="avatar xl" style="--bg:${emp.avatarColor || randomColor()}">${getInitials(emp.name)}</div>
        <div>
          <p><strong>${emp.title}</strong> — ${emp.department}</p>
          <p>
            <a href="mailto:${emp.email}">${emp.email}</a>
            ${emp.phone ? ` • <a href="tel:${telHref}">${emp.phone}</a>` : ''}
          </p>
          ${emp.address ? `<p>${emp.address.street}, ${emp.address.city}, ${emp.address.state} ${emp.address.zip}</p>` : ''}
          ${emp.bio ? `<p class="bio">${emp.bio}</p>` : ''}
        </div>
      </div>`;
    $modalBody.html(html);
    $('#modalOverlay').fadeIn(120).attr('aria-hidden', 'false');
    $modal.css({ display: 'block', opacity: 0, transform: 'translate(-50%, 12px)' }).animate({ opacity: 1 }, 180, () => { $modal.css({ transform: 'translate(-50%, 0)' }); });
  }
  function hideModal() { $modal.animate({ opacity: 0 }, 120, () => { $modal.css('display', 'none'); }); $('#modalOverlay').fadeOut(120).attr('aria-hidden', 'true'); }
  function showError(err) { const html = `<div class="error"><p>⚠️ ${err.message}</p><button id="retryBtn" class="btn">Retry</button></div>`; $list.html(html); $('#retryBtn').on('click', async () => { $list.html('<p class="muted">Loading…</p>'); try { employees = await fetchEmployees(); renderEmployees(employees); } catch (e) { showError(e); } }); }

  function fetchEmployees() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < 0.05) {
          reject(new Error('Failed to load employees. Please try again.'));
          return;
        }

        const data = [
          {
            id: 1,
            name: 'Manish Kumar',
            title: 'Senior Software Engineer',
            department: 'Platform',
            email: 'manish.kumar@example.in',
            phone: '+91 98765 43210',
            avatarColor: '#4F46E5',
            address: { street: '101 MG Road', city: 'Bengaluru', state: 'Karnataka', zip: '560001' },
            bio: 'Expert in distributed systems and cloud-native architecture.'
          },
          {
            id: 2,
            name: 'Tanmay Sharma',
            title: 'Product Manager',
            department: 'Growth',
            email: 'tanmay.sharma@example.in',
            phone: '+91 91234 56789',
            avatarColor: '#0EA5E9',
            address: { street: '42 Connaught Place', city: 'New Delhi', state: 'Delhi', zip: '110001' },
            bio: 'Driving product strategy and customer-centric solutions.'
          },
          {
            id: 3,
            name: 'Anshuman Verma',
            title: 'UX Designer',
            department: 'Design',
            email: 'anshuman.verma@example.in',
            avatarColor: '#DB2777',
            address: { street: '9 Park Street', city: 'Kolkata', state: 'West Bengal', zip: '700016' },
            bio: 'Designing intuitive interfaces with a focus on accessibility.'
          },
          {
            id: 4,
            name: 'Darshan Patel',
            title: 'Data Scientist',
            department: 'AI/ML',
            email: 'darshan.patel@example.in',
            phone: '+91 99887 66554',
            avatarColor: '#059669',
            address: { street: '200 SG Highway', city: 'Ahmedabad', state: 'Gujarat', zip: '380015' },
            bio: 'Building predictive models and AI-driven insights.'
          },
          {
            id: 5,
            name: 'Saumya Singh',
            title: 'Security Engineer',
            department: 'Security',
            email: 'saumya.singh@example.in',
            avatarColor: '#2563EB',
            address: { street: '88 Residency Road', city: 'Lucknow', state: 'Uttar Pradesh', zip: '226001' },
            bio: 'Specialist in application security and threat modeling.'
          },
          {
            id: 6,
            name: 'Sukhwinder Kaur',
            title: 'QA Engineer',
            department: 'Quality',
            email: 'sukhwinder.kaur@example.in',
            phone: '+91 98760 12345',
            avatarColor: '#F59E0B',
            address: { street: '12 Sector 17', city: 'Chandigarh', state: 'Punjab', zip: '160017' },
            bio: 'Ensuring quality through automation and rigorous testing.'
          },
          {
            id: 7,
            name: 'Rohan Mehta',
            title: 'DevOps Engineer',
            department: 'Infrastructure',
            email: 'rohan.mehta@example.in',
            avatarColor: '#DC2626',
            address: { street: '1 Marine Drive', city: 'Mumbai', state: 'Maharashtra', zip: '400020' },
            bio: 'Passionate about CI/CD pipelines and cloud infrastructure.'
          },
          {
            id: 8,
            name: 'Yash Gupta',
            title: 'Support Engineer',
            department: 'Customer Success',
            email: 'yash.gupta@example.in',
            phone: '+91 90000 11122',
            avatarColor: '#9333EA',
            address: { street: '50 Anna Salai', city: 'Chennai', state: 'Tamil Nadu', zip: '600002' },
            bio: 'Helping customers achieve success with technical solutions.'
          }
        ];

        resolve(data);
      }, 650);
    });
  }

  $search.on('input', ev => { const value = ev.target.value; const filtered = filterEmployees(value); renderEmployees(filtered); });
  $list.on('click', '.card', ev => { const $t = $(ev.currentTarget); const id = Number($t.data('id')); const emp = employees.find(e => e.id === id); if (emp) showDetails(emp); });
  $list.on('keydown', '.card', ev => { if (ev.key === 'Enter' || ev.key === ' ') { const $t = $(ev.currentTarget); const id = Number($t.data('id')); const emp = employees.find(e => e.id === id); if (emp) showDetails(emp); ev.preventDefault(); } });
  $('#modalClose, #modalOverlay').on('click', hideModal);
  $(document).on('keydown', e => { if (e.key === 'Escape') hideModal(); });
  (async function init() { try { $list.html('<p class="muted">Loading…</p>').attr('aria-busy', 'true'); employees = await fetchEmployees(); renderEmployees(employees); } catch (err) { showError(err); } finally { $list.attr('aria-busy', 'false'); } })();
})();
