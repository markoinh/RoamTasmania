function TweaksPanel({ state, setState }) {
  const [open, setOpen] = React.useState(false);
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    const onMsg = (e) => {
      if (e.data?.type === '__activate_edit_mode') { setEnabled(true); setOpen(true); }
      if (e.data?.type === '__deactivate_edit_mode') { setEnabled(false); setOpen(false); }
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const persist = (patch) => {
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*');
  };
  const set = (patch) => { setState(s => ({ ...s, ...patch })); persist(patch); };

  if (!enabled) return null;

  const palettes = [
    { id: 'default', name: 'Navy + Coral', sw: ['#0B2545', '#F26B3A'] },
    { id: 'forest',  name: 'Forest + Ochre', sw: ['#1C3A2E', '#D08A3C'] },
    { id: 'ocean',   name: 'Ocean + Sand', sw: ['#0E3A5C', '#D9A05B'] },
    { id: 'charcoal',name: 'Charcoal + Yellow', sw: ['#1A1A1A', '#F4C430'] },
  ];

  return (
    <div className={`tweaks-panel ${open ? 'open' : ''}`}>
      <h5>
        Tweaks
        <button onClick={() => setOpen(o => !o)} style={{
          border: 0, background: 'transparent', cursor: 'pointer', color: 'var(--muted)', fontSize: 16
        }}>—</button>
      </h5>

      <div className="tweak-group">
        <div className="lbl">Palette</div>
        <div className="swatch-row">
          {palettes.map(p => (
            <div key={p.id}
              className={`swatch ${state.palette === p.id ? 'active' : ''}`}
              style={{background: `linear-gradient(135deg, ${p.sw[0]} 50%, ${p.sw[1]} 50%)`}}
              onClick={() => set({palette: p.id})}
              title={p.name}
            />
          ))}
        </div>
      </div>

      <div className="tweak-group">
        <div className="lbl">Logo style</div>
        <div className="seg">
          {['default', 'badge', 'monogram'].map(v => (
            <button key={v} className={state.logo === v ? 'active' : ''} onClick={() => set({logo: v})}>
              {v === 'default' ? 'R-mark' : v[0].toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="tweak-group">
        <div className="lbl">Hero headline</div>
        <div className="seg">
          {['classic', 'bold', 'quiet'].map(v => (
            <button key={v} className={state.hero === v ? 'active' : ''} onClick={() => set({hero: v})}>
              {v[0].toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="tweak-group">
        <div className="lbl">Theme</div>
        <div className="seg">
          {['light', 'dark'].map(v => (
            <button key={v} className={state.theme === v ? 'active' : ''} onClick={() => set({theme: v})}>
              {v[0].toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

window.TweaksPanel = TweaksPanel;
