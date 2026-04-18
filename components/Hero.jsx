function TasMap({ from, to, onPick }) {
  const mode = from ? (to ? 'done' : 'to') : 'from';
  return (
    <div className="map-wrap">
      <svg viewBox="60 70 330 290" xmlns="http://www.w3.org/2000/svg" aria-label="Tasmania quote map">
        <defs>
          <pattern id="waves" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
            <path d="M0 9 Q 4.5 4, 9 9 T 18 9" stroke="var(--line)" strokeWidth="0.5" fill="none" />
          </pattern>
        </defs>
        <rect x="60" y="70" width="330" height="290" fill="url(#waves)" opacity="0.6" />
        {TAS_REGIONS.map(r => {
          const cls = ['map-region'];
          if (from === r.id) cls.push('from');
          if (to === r.id) cls.push('to');
          return (
            <g key={r.id}>
              <path d={r.path} className={cls.join(' ')} onClick={() => onPick(r.id)}>
                <title>{r.name}</title>
              </path>
            </g>
          );
        })}
        {TAS_REGIONS.map(r => {
          const pos = {
            'north-west': [155, 125], 'launceston': [270, 135],
            'east-coast': [335, 225], 'midlands': [250, 215],
            'hobart': [265, 305], 'west-coast': [150, 230],
          }[r.id];
          const active = from === r.id || to === r.id;
          return (
            <text key={r.id + '-t'} x={pos[0]} y={pos[1]}
              textAnchor="middle" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="600"
              fill={active ? 'white' : 'var(--ink-2)'}
              pointerEvents="none" style={{letterSpacing: '-0.01em'}}>
              {r.name}
            </text>
          );
        })}
        {from && to && (() => {
          const positions = {
            'north-west': [155, 125], 'launceston': [270, 135],
            'east-coast': [335, 225], 'midlands': [250, 215],
            'hobart': [265, 305], 'west-coast': [150, 230],
          };
          const [fx, fy] = positions[from];
          const [tx, ty] = positions[to];
          return (
            <g>
              <path d={`M${fx} ${fy} Q ${(fx+tx)/2} ${Math.min(fy,ty)-30}, ${tx} ${ty}`}
                stroke="var(--accent)" strokeWidth="2" fill="none" strokeDasharray="4 4">
                <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1s" repeatCount="indefinite" />
              </path>
            </g>
          );
        })()}
      </svg>
      <div className="map-legend">
        <span><span className="sw" style={{background: 'var(--brand)'}}/>From</span>
        <span><span className="sw" style={{background: 'var(--accent)'}}/>To</span>
        <span style={{marginLeft: 'auto', color: 'var(--accent)', fontWeight: 600}}>
          {mode === 'from' ? 'Tap your pickup region →' : mode === 'to' ? 'Now tap the drop-off →' : '✓ Route set'}
        </span>
      </div>
    </div>
  );
}

function QuoteWidget() {
  const [tab, setTab] = React.useState('map');
  const [from, setFrom] = React.useState(null);
  const [to, setTo] = React.useState(null);
  const [date, setDate] = React.useState('');
  const [size, setSize] = React.useState('2br');

  // contact fields
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');

  const [step, setStep] = React.useState('route');   // 'route' | 'details' | 'success' | 'error'
  const [submitting, setSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');

  const pick = (id) => {
    if (!from) setFrom(id);
    else if (!to && id !== from) setTo(id);
    else { setFrom(id); setTo(null); }
  };
  const reset = () => { setFrom(null); setTo(null); setStep('route'); };

  const sizeMult = { studio: 0.7, '1br': 1, '2br': 1.5, '3br': 2.1, '4br': 2.8 }[size];
  const estimate = from && to ? Math.round(320 * sizeMult) : null;

  const fromName = from ? TAS_REGIONS.find(r => r.id === from)?.name : '—';
  const toName   = to   ? TAS_REGIONS.find(r => r.id === to  )?.name : '—';

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          from_region: from,
          to_region: to,
          move_date: date || null,
          home_size: size,
          estimate,
          source: 'quote_widget',
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Something went wrong');
      setStep('success');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (step === 'success') {
    return (
      <div className="quote-widget" style={{padding: '36px 28px', textAlign: 'center'}}>
        <div style={{fontSize: 44, marginBottom: 12}}>✅</div>
        <h3 style={{marginBottom: 8}}>You're on our list, {name.split(' ')[0]}!</h3>
        <p style={{color: 'var(--muted)', fontSize: 15}}>
          We'll be in touch within 20 minutes during business hours.
          Check your inbox — a confirmation is on its way.
        </p>
        <p style={{marginTop: 20, fontWeight: 600}}>
          Or call us now: <a href="tel:0362340188" style={{color: 'var(--accent)'}}>03 6234 0188</a>
        </p>
      </div>
    );
  }

  return (
    <div className="quote-widget">
      <div className="quote-tabs">
        <button className={`quote-tab ${tab === 'map' ? 'active' : ''}`} onClick={() => setTab('map')}>
          📍 Map picker
        </button>
        <button className={`quote-tab ${tab === 'form' ? 'active' : ''}`} onClick={() => setTab('form')}>
          📝 Quick form
        </button>
      </div>
      <div className="quote-body">
        {step === 'route' && (
          <>
            {tab === 'map' ? (
              <TasMap from={from} to={to} onPick={pick} />
            ) : (
              <div style={{display: 'grid', gap: 12}}>
                <div className="field">
                  <label>From</label>
                  <select value={from || ''} onChange={e => setFrom(e.target.value || null)}>
                    <option value="">Pick your pickup suburb</option>
                    {TAS_REGIONS.map(r => <option key={r.id} value={r.id}>{r.name} — {r.city}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>To</label>
                  <select value={to || ''} onChange={e => setTo(e.target.value || null)}>
                    <option value="">Where to, mate?</option>
                    {TAS_REGIONS.map(r => <option key={r.id} value={r.id}>{r.name} — {r.city}</option>)}
                  </select>
                </div>
              </div>
            )}

            <div className="field-row">
              <div className="field">
                <label>Move date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <div className="field">
                <label>Home size</label>
                <select value={size} onChange={e => setSize(e.target.value)}>
                  <option value="studio">Studio</option>
                  <option value="1br">1 bedroom</option>
                  <option value="2br">2 bedrooms</option>
                  <option value="3br">3 bedrooms</option>
                  <option value="4br">4+ bedrooms</option>
                </select>
              </div>
            </div>

            <div className="quote-footer">
              <div className="price">
                {estimate ? (
                  <><small>from</small>${estimate}</>
                ) : (
                  <span style={{fontSize: 14, color: 'var(--muted)', fontFamily: 'var(--font-body)', fontWeight: 400}}>
                    {fromName} → {toName}
                  </span>
                )}
              </div>
              <div style={{marginLeft: 'auto', display: 'flex', gap: 8}}>
                {(from || to) && (
                  <button className="btn btn-ghost btn-sm" onClick={reset}>Reset</button>
                )}
                <button
                  className="btn btn-primary btn-sm"
                  disabled={!from || !to}
                  onClick={() => setStep('details')}
                >
                  Get my quote →
                </button>
              </div>
            </div>
          </>
        )}

        {step === 'details' && (
          <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: 12}}>
            <div style={{
              background: 'var(--accent-soft)', borderRadius: 10, padding: '10px 14px',
              fontSize: 14, color: 'var(--accent)', fontWeight: 500,
            }}>
              📍 {fromName} → {toName} · {size} · {estimate ? `from $${estimate}` : ''}
            </div>

            <div className="field">
              <label>Your name *</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)}
                placeholder="Jane Smith" />
            </div>
            <div className="field">
              <label>Email *</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="jane@example.com" />
            </div>
            <div className="field">
              <label>Phone (optional)</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="04xx xxx xxx" />
            </div>

            {errorMsg && (
              <div style={{color: '#b91c1c', background: '#fee2e2', borderRadius: 8, padding: '8px 12px', fontSize: 14}}>
                {errorMsg} — please try again or call 03 6234 0188.
              </div>
            )}

            <div style={{display: 'flex', gap: 8, marginTop: 4}}>
              <button type="button" className="btn btn-ghost btn-sm"
                onClick={() => { setStep('route'); setErrorMsg(''); }}>
                ← Back
              </button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}
                style={{flex: 1, justifyContent: 'center'}}>
                {submitting ? 'Sending…' : 'Send quote request →'}
              </button>
            </div>
            <p style={{fontSize: 12, color: 'var(--muted)', textAlign: 'center', margin: 0}}>
              We reply within 20 minutes during business hours.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

function Hero({ variant = 'classic' }) {
  const trust = [
    { icon: '🛡', t: 'Fully insured', s: 'Up to $100k cover' },
    { icon: '★', t: '4.9 from 380+', s: 'Google reviews' },
    { icon: '🏠', t: 'Tassie-owned', s: 'Family business' },
    { icon: '📅', t: 'Flexible booking', s: 'Free reschedule' },
  ];

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          <div>
            <span className="tag"><span className="dot"/> Tasmania's friendliest removalists</span>
            {variant === 'bold' ? (
              <h1 style={{marginTop: 20}}>Moving <span className="accent">across Tassie?</span><br/>We'll sort it.</h1>
            ) : variant === 'quiet' ? (
              <h1 style={{marginTop: 20}}>Your move,<br/><span className="underline">handled with care.</span></h1>
            ) : (
              <h1 style={{marginTop: 20}}>Fair-dinkum moves<br/><span className="underline">across Tasmania.</span></h1>
            )}
            <p className="hero-sub">
              Local removalists who treat your gear like our own. Get a fixed-price quote in under a minute —
              no dodgy surprises, no hidden fees, just a smooth move from Burnie to Hobart (and everywhere between).
            </p>
            <div style={{display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap'}}>
              <a href="#quote" className="btn btn-primary btn-lg">Get a free quote →</a>
              <a href="#how" className="btn btn-ghost btn-lg">See how it works</a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><div className="n">12 yrs</div><div className="l">In Tassie since 2013</div></div>
              <div className="hero-stat"><div className="n">8,400+</div><div className="l">Homes moved</div></div>
              <div className="hero-stat"><div className="n">AFRA</div><div className="l">Accredited member</div></div>
            </div>
          </div>
          <div id="quote">
            <QuoteWidget />
          </div>
        </div>

        <div className="trust-strip">
          {trust.map((t, i) => (
            <div className="trust-item" key={i}>
              <div className="trust-icon" style={{fontSize: 18}}>{t.icon}</div>
              <div>
                <div className="t">{t.t}</div>
                <div className="s">{t.s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

window.Hero = Hero;
window.QuoteWidget = QuoteWidget;
