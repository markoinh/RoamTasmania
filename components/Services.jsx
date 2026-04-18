function Services() {
  const services = [
    {
      num: '01',
      title: 'Local Tassie moves',
      desc: 'Door-to-door within Tasmania — from a studio in Sandy Bay to a farmhouse in Scottsdale. Fixed prices, two movers, one truck, no mucking about.',
      price: '$120/hr',
      unit: 'min. 2hr',
      features: ['2 experienced movers', 'Fully equipped truck', 'Blankets & trolleys included', 'Stairs & tight access handled'],
    },
    {
      num: '02',
      title: 'Packing & unpacking',
      desc: 'Let us wrap it. Our team packs your whole place in a day with premium boxes, bubble wrap and a labelling system that actually makes sense at the other end.',
      price: '$85/hr',
      unit: 'per packer',
      features: ['Premium double-walled boxes', 'Fragile items wrapped individually', 'Room-by-room labelling', 'Unpack service available'],
    },
    {
      num: '03',
      title: 'Furniture delivery',
      desc: 'Just bought a couch from Gumtree? We\'ll grab it and drop it off same-day across Hobart and Launceston. Perfect for single-item jobs.',
      price: '$90',
      unit: 'flat fee',
      features: ['Same-day in metro areas', 'Two movers for heavy items', 'Assembly available', 'No minimum charge'],
    },
  ];
  return (
    <section id="services" style={{background: 'var(--bg-alt)'}}>
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">What we do</span>
            <h2>Three services.<br/>Done properly.</h2>
          </div>
          <p className="lead">
            We don't try to be everything to everyone. We do local removals, packing, and furniture delivery —
            and we do each one bloody well.
          </p>
        </div>
        <div className="services-grid">
          {services.map(s => (
            <div className="service" key={s.num}>
              <span className="num">{s.num} / 03</span>
              <h3>{s.title}</h3>
              <p style={{color: 'var(--muted)', fontSize: 15, lineHeight: 1.55}}>{s.desc}</p>
              <ul>{s.features.map(f => <li key={f}>{f}</li>)}</ul>
              <div className="price">
                <span className="amount">{s.price}</span>
                <small>{s.unit}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CalcModal({ total, size, onClose }) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [err, setErr] = React.useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true); setErr('');
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: name.trim(), email: email.trim(), phone: phone.trim() || null,
          from_region: 'hobart', to_region: 'hobart',
          home_size: size, estimate: total, source: 'calculator',
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Something went wrong');
      setDone(true);
    } catch (e) { setErr(e.message); }
    finally { setSubmitting(false); }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(11,37,69,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 200, padding: 20,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'var(--card)', borderRadius: 'var(--radius-lg)', padding: 32,
        width: '100%', maxWidth: 420, boxShadow: 'var(--shadow-lg)',
      }}>
        {done ? (
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: 40, marginBottom: 12}}>✅</div>
            <h3 style={{marginBottom: 8}}>Locked in, {name.split(' ')[0]}!</h3>
            <p style={{color: 'var(--muted)', fontSize: 15}}>
              We'll call or email you to confirm your ${total} booking. See you on moving day!
            </p>
            <button className="btn btn-primary" style={{marginTop: 20, width: '100%', justifyContent: 'center'}} onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
              <h3 style={{margin: 0}}>Lock in your price</h3>
              <button onClick={onClose} style={{border: 0, background: 'transparent', cursor: 'pointer', fontSize: 22, color: 'var(--muted)'}}>×</button>
            </div>
            <div style={{background: 'var(--accent-soft)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 14, color: 'var(--accent)', fontWeight: 600}}>
              Your estimate: ${total} fixed price
            </div>
            <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: 12}}>
              <div className="field"><label>Your name *</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Jane Smith" /></div>
              <div className="field"><label>Email *</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@example.com" /></div>
              <div className="field"><label>Phone (optional)</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="04xx xxx xxx" /></div>
              {err && <div style={{color:'#b91c1c',background:'#fee2e2',borderRadius:8,padding:'8px 12px',fontSize:14}}>{err}</div>}
              <button type="submit" className="btn btn-primary" disabled={submitting}
                style={{marginTop: 4, justifyContent: 'center'}}>
                {submitting ? 'Sending…' : 'Confirm & lock this price →'}
              </button>
              <p style={{fontSize:12,color:'var(--muted)',textAlign:'center',margin:0}}>We'll confirm within 20 min during business hours.</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function Calculator() {
  const [size, setSize] = React.useState('2br');
  const [distance, setDistance] = React.useState(35);
  const [stairs, setStairs] = React.useState(0);
  const [addons, setAddons] = React.useState({ packing: false, unpacking: false, insurance: true, assembly: false });
  const [showModal, setShowModal] = React.useState(false);

  const sizes = [
    { id: 'studio', label: 'Studio / 1 bed', sub: 'Up to 2 tonnes', base: 280 },
    { id: '2br', label: '2 bedrooms', sub: 'Typical apartment', base: 460 },
    { id: '3br', label: '3 bedrooms', sub: 'Family home', base: 720 },
    { id: '4br', label: '4+ bedrooms', sub: 'Large home', base: 1020 },
  ];
  const sz = sizes.find(s => s.id === size);
  const base = sz.base;
  const dist = Math.round(distance * 3.2);
  const stair = stairs * 40;
  const addonPrices = { packing: 280, unpacking: 180, insurance: 60, assembly: 90 };
  const addonsTotal = Object.entries(addons).reduce((sum, [k, v]) => sum + (v ? addonPrices[k] : 0), 0);
  const total = base + dist + stair + addonsTotal;

  const toggle = k => setAddons(a => ({ ...a, [k]: !a[k] }));

  return (
    <>
    <section id="pricing">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Fixed price calculator</span>
            <h2>Work out your move<br/>in 30 seconds.</h2>
          </div>
          <p className="lead">
            No phone tag, no "someone will call you back tomorrow". Drag the sliders, pick your extras,
            and see exactly what your move will cost.
          </p>
        </div>
        <div className="calc">
          <div className="calc-controls">
            <div className="calc-ctrl">
              <label>Home size</label>
              <div className="size-toggle">
                {sizes.map(s => (
                  <button key={s.id} className={size === s.id ? 'active' : ''} onClick={() => setSize(s.id)}>
                    {s.label}
                    <span className="sz-sub">{s.sub}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="calc-ctrl">
              <label>Distance <span className="v">{distance} km</span></label>
              <input type="range" min="1" max="400" value={distance} onChange={e => setDistance(+e.target.value)} />
            </div>
            <div className="calc-ctrl">
              <label>Flights of stairs <span className="v">{stairs}</span></label>
              <input type="range" min="0" max="6" value={stairs} onChange={e => setStairs(+e.target.value)} />
            </div>
            <div className="calc-ctrl">
              <label>Optional extras</label>
              <div className="addons">
                {[
                  { id: 'packing', t: 'Full packing service', p: 280 },
                  { id: 'unpacking', t: 'Unpack at destination', p: 180 },
                  { id: 'insurance', t: 'Premium insurance cover', p: 60 },
                  { id: 'assembly', t: 'Furniture assembly', p: 90 },
                ].map(a => (
                  <div key={a.id} className={`addon ${addons[a.id] ? 'on' : ''}`} onClick={() => toggle(a.id)}>
                    <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
                      <div className="check">{addons[a.id] && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}</div>
                      <span style={{fontSize: 14, fontWeight: 500}}>{a.t}</span>
                    </div>
                    <span className="price">+${a.p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="calc-result">
            <div className="label">Your estimate</div>
            <div className="big"><sup>$</sup>{total}</div>
            <div className="range">Range ${Math.round(total * 0.92)}–${Math.round(total * 1.08)} · fixed at booking</div>
            <div className="breakdown">
              <div className="row"><span>Base rate · {sz.label}</span><span>${base}</span></div>
              <div className="row"><span>Distance · {distance} km</span><span>${dist}</span></div>
              {stair > 0 && <div className="row"><span>Stairs access</span><span>${stair}</span></div>}
              {addonsTotal > 0 && <div className="row"><span>Extras</span><span>${addonsTotal}</span></div>}
            </div>
            <button className="btn btn-primary" style={{marginTop: 16, justifyContent: 'center'}}
              onClick={() => setShowModal(true)}>
              Lock this price in →
            </button>
          </div>
        </div>
      </div>
    </section>
    {showModal && <CalcModal total={total} size={size} onClose={() => setShowModal(false)} />}
    </>
  );
}

window.Services = Services;
window.Calculator = Calculator;
