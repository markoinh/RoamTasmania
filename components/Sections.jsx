function About() {
  return (
    <section id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-photo">
            <span className="ph-badge">Team photo</span>
            Drop in a photo of the RoamTassie crew<br/>with a truck (4:5, ~800×1000px)
          </div>
          <div>
            <span className="eyebrow">About RoamTassie</span>
            <h2>Born in Tassie,<br/>run by locals.</h2>
            <p style={{marginTop: 20, color: 'var(--ink-2)', fontSize: 17, lineHeight: 1.6, maxWidth: 520}}>
              We started RoamTassie in 2013 because every removalist we'd used in Hobart either showed up late,
              broke something, or charged us double at the end. We figured Tasmanians deserved better.
            </p>
            <p style={{marginTop: 16, color: 'var(--muted)', fontSize: 16, lineHeight: 1.6, maxWidth: 520}}>
              Twelve years on, we're a team of 14 movers running six trucks out of Hobart and Launceston.
              We're AFRA-accredited, fully insured, and still family-owned. Every quote we give is the price
              you pay — no fuel levies, no stair surcharges sprung on the day.
            </p>
            <div className="about-points">
              <div className="about-point"><div className="n">12</div><div className="t">Years moving Tasmanians</div></div>
              <div className="about-point"><div className="n">8.4k</div><div className="t">Homes moved since 2013</div></div>
              <div className="about-point"><div className="n">4.9★</div><div className="t">Average Google rating</div></div>
              <div className="about-point"><div className="n">$100k</div><div className="t">Insurance cover as standard</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    { q: "Booked Friday, moved Monday. The lads were early, wrapped everything, and got our 3-bed house from Sandy Bay to Kingston in half a day. Price was exactly the quote.",
      n: 'Meg & Tom H.', l: 'Sandy Bay → Kingston · Mar 2026', stars: 5, initials: 'MH' },
    { q: "Moved Mum into a retirement unit in Launceston. The team were so patient with her, even made her a cup of tea. Can't recommend these guys enough.",
      n: 'Sarah W.', l: 'Devonport → Launceston · Feb 2026', stars: 5, initials: 'SW' },
    { q: "Got three quotes and RoamTassie weren't the cheapest, but they were the only ones who turned up to do a walk-through first. Worth every dollar.",
      n: 'James P.', l: 'Hobart local move · Jan 2026', stars: 5, initials: 'JP' },
  ];
  return (
    <section style={{background: 'var(--bg-alt)'}}>
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">What Tassie says</span>
            <h2>380+ reviews.<br/>Not a bad one in the bunch.</h2>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            <div style={{fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 600, color: 'var(--accent)'}}>4.9</div>
            <div>
              <div style={{color: 'var(--accent)', fontSize: 16, letterSpacing: 2}}>★★★★★</div>
              <div style={{color: 'var(--muted)', fontSize: 13, marginTop: 2}}>Google · 380 reviews</div>
            </div>
          </div>
        </div>
        <div className="testi-grid">
          {items.map((t, i) => (
            <div className="testi" key={i}>
              <div className="stars">{'★'.repeat(t.stars)}</div>
              <p className="q">"{t.q}"</p>
              <div className="who">
                <div className="av">{t.initials}</div>
                <div>
                  <div className="n">{t.n}</div>
                  <div className="l">{t.l}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    { q: "How far in advance should I book?", a: "For local moves in Hobart or Launceston, 1–2 weeks is usually plenty. End of month and school holidays fill up faster — book 3–4 weeks ahead to be safe. Need to move tomorrow? Give us a ring, we often have last-minute slots." },
    { q: "Is the quote really fixed?", a: "Yes — the price you see is the price you pay. We do a quick video walk-through before confirming so there are no surprises. The only way the price changes is if you add items on the day, and we'll tell you the extra cost before lifting a finger." },
    { q: "What's included in the base rate?", a: "Two experienced movers, a fully equipped truck (blankets, trolleys, straps, tools), basic insurance up to $5,000, and fuel. Packing materials, premium insurance, and add-ons like piano moves are quoted separately." },
    { q: "Do you cover all of Tasmania?", a: "We run out of Hobart and Launceston, and cover everywhere on the island — from Smithton to Strahan to St Helens. Remote jobs may have a small travel surcharge which we'll quote upfront." },
    { q: "What if something gets damaged?", a: "In 12 years and 8,400+ moves, it happens very rarely. When it does, we sort it. Every move includes $5k basic cover as standard, and you can add premium cover up to $100k for $60. We handle claims ourselves — no insurance company middleman." },
    { q: "Can you help with packing?", a: "Absolutely. Our packers can do your whole place in a day, wrap fragile items individually, label every box by room, and even unpack at the other end if you like. $85/hr per packer, roughly 4–6 hours for a 2-bed apartment." },
  ];
  return (
    <section>
      <div className="container">
        <div className="section-head" style={{justifyContent: 'center', textAlign: 'center', flexDirection: 'column', alignItems: 'center'}}>
          <span className="eyebrow">Questions, answered</span>
          <h2>The stuff people actually ask.</h2>
        </div>
        <div className="faq-grid">
          {items.map((it, i) => (
            <details key={i} className="faq-item" open={i === 0}>
              <summary>
                <span>{it.q}</span>
                <span className="plus">+</span>
              </summary>
              <p className="a">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" style={{paddingBottom: 48}}>
      <div className="container">
        <div className="cta-banner">
          <div style={{position: 'relative', zIndex: 1}}>
            <span className="eyebrow" style={{color: 'var(--accent)'}}>Ready to roll?</span>
            <h2 style={{marginTop: 12}}>Let's get your move<br/>sorted today.</h2>
            <p style={{marginTop: 16}}>
              Text, call, or fill in the quote form up top. We usually reply within 20 minutes during
              business hours — and always the same day.
            </p>
            <div style={{display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap'}}>
              <a href="#quote" className="btn btn-primary">Get a free quote →</a>
              <a href="mailto:hello@roamtassie.com.au" className="btn btn-ghost" style={{
                borderColor: 'color-mix(in oklab, var(--brand-ink) 30%, transparent)',
                color: 'var(--brand-ink)'
              }}>hello@roamtassie.com.au</a>
            </div>
          </div>
          <div style={{position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 12}}>
            <div className="cta-phone">
              <div className="l">Call us · 7 days</div>
              <div className="num">03 6234 0188</div>
            </div>
            <div className="cta-phone">
              <div className="l">Depot hours</div>
              <div className="num" style={{fontSize: 17, lineHeight: 1.4}}>
                Mon–Sat 7am–6pm<br/>
                <span style={{fontSize: 13, opacity: 0.7, fontFamily: 'var(--font-body)', fontWeight: 500}}>
                  Sunday moves on request
                </span>
              </div>
            </div>
          </div>
          <div className="deco" />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div>
            <Logo size={32} />
            <p style={{marginTop: 14, color: 'var(--muted)', maxWidth: 300, fontSize: 14.5}}>
              Tasmania's friendliest removalists. Local moves, packing and furniture delivery
              done properly — from Burnie to Hobart and everywhere between.
            </p>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <a href="#services">Local Tassie moves</a>
            <a href="#services">Packing & unpacking</a>
            <a href="#services">Furniture delivery</a>
            <a href="#pricing">Fixed-price quote</a>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a href="#about">About us</a>
            <a href="#testimonials">Reviews</a>
            <a href="#faq">FAQ</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-col">
            <h4>Find us</h4>
            <p>Hobart Depot<br/>14 Marine Terrace, Hobart TAS 7000</p>
            <p style={{marginTop: 8}}>Launceston Depot<br/>92 Invermay Rd, Launceston TAS 7248</p>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2026 RoamTassie Pty Ltd · ABN 00 000 000 000 · AFRA Member #TAS014</div>
          <div>Built with care in Hobart</div>
        </div>
      </div>
    </footer>
  );
}

window.About = About;
window.Testimonials = Testimonials;
window.FAQ = FAQ;
window.Contact = Contact;
window.Footer = Footer;
