
// ts/app.ts

declare const $: any;

interface Address { street: string; city: string; state: string; zip: string; }
interface Employee {
  id: number;
  name: string;
  title: string;
  department: string;
  email: string;
  phone?: string;
  avatarColor?: string;
  address?: Address;
  bio?: string;
}

class EmployeeDirectory {
  private employees: Employee[] = [];
  private readonly $list = $('#employeeList');
  private readonly $search = $('#searchInput');
  private readonly $modal = $('#employeeModal');
  private readonly $modalBody = $('#modalBody');
  private readonly $modalTitle = $('#modalTitle');

  constructor() { this.attachEventHandlers(); }

  public async init(): Promise<void> {
    try {
      this.$list.html('<p class="muted">Loading…</p>').attr('aria-busy', 'true');
      this.employees = await this.fetchEmployees();
      this.renderEmployees(this.employees);
    } catch (err) {
      this.showError(err as Error);
    } finally {
      this.$list.attr('aria-busy', 'false');
    }
  }

  private async fetchEmployees(): Promise<Employee[]> {
    return new Promise<Employee[]>((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < 0.05) { reject(new Error('Failed to load employees. Please try again.')); return; }
        const data: Employee[] = [
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

  private renderEmployees(list: Employee[]): void {
    this.$list.empty();
    if (!list.length) { this.$list.html('<p class="empty">No employees found.</p>'); return; }
    list.forEach((emp: Employee) => {
      const initials: string = this.getInitials(emp.name);
      const bg: string = emp.avatarColor || this.randomColor();
      const $card = $(`
        <article class="card" data-id="${emp.id}" tabindex="0" role="button" aria-label="View details for ${emp.name}">
          <div class="avatar" style="--bg:${bg}">${initials}</div>
          <div class="info">
            <h3>${emp.name}</h3>
            <p class="muted">${emp.title} • ${emp.department}</p>
            <p class="email">${emp.email}</p>
          </div>
        </article>
      `);
      this.$list.append($card);
    });
  }

  private filter(query: string): Employee[] {
    const q: string = (query || '').trim().toLowerCase();
    if (!q) return [...this.employees];
    return this.employees.filter((e: Employee) => [e.name, e.title, e.department, e.email].some((v: string) => (v || '').toLowerCase().includes(q)));
  }

  private attachEventHandlers(): void {
    this.$search.on('input', (ev: Event) => {
      const value = (ev.target as HTMLInputElement).value;
      const filtered = this.filter(value);
      this.renderEmployees(filtered);
    });

    this.$list.on('click', '.card', (ev: Event) => {
      const $target = $(ev.currentTarget as HTMLElement);
      const id = Number($target.data('id'));
      const emp = this.employees.find(e => e.id === id);
      if (emp) this.showDetails(emp);
    });

    this.$list.on('keydown', '.card', (ev: KeyboardEvent) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        const $target = $(ev.currentTarget as HTMLElement);
        const id = Number($target.data('id'));
        const emp = this.employees.find(e => e.id === id);
        if (emp) this.showDetails(emp);
        ev.preventDefault();
      }
    });

    $('#modalClose, #modalOverlay').on('click', () => this.hideModal());
    $(document).on('keydown', (e: KeyboardEvent) => { if (e.key === 'Escape') this.hideModal(); });
  }

  private showDetails(emp: Employee): void {
    this.$modalTitle.text(emp.name);
    const telHref = emp.phone ? emp.phone.replace(/[^+\d]/g, '') : '';
    const bodyHtml: string = `
      <div class="modal-grid">
        <div class="avatar xl" style="--bg:${emp.avatarColor || this.randomColor()}">${this.getInitials(emp.name)}</div>
        <div>
          <p><strong>${emp.title}</strong> — ${emp.department}</p>
          <p>
            <a href="mailto:${emp.email}">${emp.email}</a>
            ${emp.phone ? ` • <a href="tel:${telHref}">${emp.phone}</a>` : ''}
          </p>
          ${emp.address ? `<p>${emp.address.street}, ${emp.address.city}, ${emp.address.state} ${emp.address.zip}</p>` : ''}
          ${emp.bio ? `<p class="bio">${emp.bio}</p>` : ''}
        </div>
      </div>
    `;
    this.$modalBody.html(bodyHtml);
    $('#modalOverlay').fadeIn(120).attr('aria-hidden', 'false');
    this.$modal.css({ display: 'block', opacity: 0, transform: 'translate(-50%, 12px)' }).animate({ opacity: 1 }, 180, () => {
      this.$modal.css({ transform: 'translate(-50%, 0)' });
    });
  }

  private hideModal(): void {
    this.$modal.animate({ opacity: 0 }, 120, () => { this.$modal.css('display', 'none'); });
    $('#modalOverlay').fadeOut(120).attr('aria-hidden', 'true');
  }

  private showError(err: Error): void {
    const html = `
      <div class="error">
        <p>⚠️ ${err.message}</p>
        <button id="retryBtn" class="btn">Retry</button>
      </div>
    `;
    this.$list.html(html);
    $('#retryBtn').on('click', async () => {
      this.$list.html('<p class="muted">Loading…</p>');
      try {
        this.employees = await this.fetchEmployees();
        this.renderEmployees(this.employees);
      } catch (e) {
        this.showError(e as Error);
      }
    });
  }

  private getInitials(name: string): string {
    return name.split(' ').filter(Boolean).map(n => n[0] || '').slice(0, 2).join('').toUpperCase();
  }

  private randomColor(): string { const colors: string[] = ['#4F46E5', '#059669', '#DB2777', '#2563EB', '#DC2626', '#F59E0B', '#0EA5E9', '#9333EA']; return colors[Math.floor(Math.random() * colors.length)]; }
}

$(async function initApp() { const directory: EmployeeDirectory = new EmployeeDirectory(); await directory.init(); });
