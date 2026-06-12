import { useMemo, useState } from 'react';
import { CONFIG, formatNaira, makeRef, waLink, itemsLabel } from '../lib/config';
import { createOrder, fetchOrderByRef } from '../lib/api';
import { useToast } from '../components/Toast';

const EMPTY = {
  name: '', phone: '', location: '', notes: '',
  senderPhone: '', recipientName: '', recipientPhone: '',
  recipientLocation: '', giftNote: '',
};

export default function OrderPage() {
  const toast = useToast();
  const [tab, setTab] = useState('order');
  const [step, setStep] = useState(1);
  const [orderType, setOrderType] = useState('normal');
  const [qty, setQty] = useState({});
  const [flavour, setFlavour] = useState('');
  const [campus, setCampus] = useState('');
  const [form, setForm] = useState(EMPTY);
  const [receipt, setReceipt] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [doneRef, setDoneRef] = useState('');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const cart = useMemo(
    () => CONFIG.PRODUCTS.filter(p => (qty[p.id] ?? 0) > 0).map(p => ({
      ...p, qty: qty[p.id], subtotal: qty[p.id] * p.price,
    })),
    [qty],
  );
  const total = cart.reduce((s, i) => s + i.subtotal, 0);
  const needsFlavour = cart.some(i => i.hasFlavour);
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const isGift = orderType === 'gift';

  const bump = (id, d) => setQty(q => ({ ...q, [id]: Math.max(0, (q[id] ?? 0) + d) }));

  function proceed() {
    if (!cart.length) return toast('Add at least one item', true);
    if (needsFlavour && !flavour) return toast('Pick a flavour', true);
    if (!campus) return toast('Select your campus', true);
    setStep(2); scroll(0, 0);
  }

  async function place() {
    if (isGift) {
      if (!form.senderPhone.trim()) return toast('Enter your WhatsApp number', true);
      if (!form.recipientName.trim()) return toast("Enter recipient's name", true);
      if (!form.recipientLocation.trim()) return toast('Enter delivery location', true);
    } else {
      if (!form.name.trim()) return toast('Enter your name', true);
      if (!form.phone.trim()) return toast('Enter your WhatsApp number', true);
      if (!form.location.trim()) return toast('Enter pickup location', true);
    }

    const ref = makeRef();
    const items = cart.map(i => ({
      id: i.id, name: i.name, qty: i.qty,
      price: i.price, subtotal: i.subtotal,
      emoji: i.emoji, flavour: needsFlavour ? flavour : '',
    }));

    try {
      setSubmitting(true);
      await createOrder({
        ref, orderType, status: 'pending',
        name: isGift ? 'Anonymous' : form.name.trim(),
        phone: (isGift ? form.senderPhone : form.phone).trim(),
        location: (isGift ? form.recipientLocation : form.location).trim(),
        campus, items, flavour: needsFlavour ? flavour : '', total,
        notes: form.notes.trim(),
        gift: isGift ? {
          recipient: form.recipientName.trim(),
          recipientPhone: form.recipientPhone.trim(),
          note: form.giftNote.trim(),
        } : undefined,
      });
      setDoneRef(ref); setStep(3); scroll(0, 0);
    } catch {
      toast('Could not place order — check your connection', true);
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setStep(1); setQty({}); setFlavour(''); setCampus('');
    setForm(EMPTY); setReceipt(null); setDoneRef('');
  }

  return (
    <div className="min-h-dvh bg-paper flex flex-col">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur-sm border-b border-paper-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-puff rounded-lg flex items-center justify-center text-white text-sm font-display font-bold">SP</div>
            <span className="font-display font-bold text-ink text-[15px] tracking-tight">Splendid Puff</span>
          </div>
          <div className="flex gap-1 bg-paper-warm rounded-xl p-1">
            {['order', 'track'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold capitalize transition-all ${
                  tab === t ? 'bg-white text-ink shadow-sm' : 'text-paper-muted hover:text-ink-soft'
                }`}
              >{t}</button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto w-full flex-1 px-4 pb-24">
        {tab === 'track' ? <TrackPanel /> : (
          <>
            {step === 1 && (
              <Step1
                orderType={orderType} setOrderType={setOrderType}
                cart={cart} qty={qty} bump={bump}
                flavour={flavour} setFlavour={setFlavour}
                campus={campus} setCampus={setCampus}
                needsFlavour={needsFlavour} totalItems={totalItems}
                total={total} proceed={proceed} isGift={isGift}
              />
            )}
            {step === 2 && (
              <Step2
                form={form} set={set} cart={cart} flavour={flavour}
                total={total} campus={campus} receipt={receipt}
                setReceipt={setReceipt} submitting={submitting}
                place={place} setStep={setStep}
                isGift={isGift} needsFlavour={needsFlavour}
              />
            )}
            {step === 3 && <Step3 doneRef={doneRef} isGift={isGift} reset={reset} />}
          </>
        )}
      </main>
    </div>
  );
}

// ─── Step 1 ───────────────────────────────────────────────────────────────────

function Step1({ orderType, setOrderType, cart, qty, bump, flavour, setFlavour, campus, setCampus, needsFlavour, totalItems, total, proceed, isGift }) {
  return (
    <div className="animate-slide-up pt-6 space-y-6">
      <div>
        <Label>Order type</Label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {[
            ['normal', '🛍', 'For yourself',    'Standard order'],
            ['gift',   '🎁', 'Anonymous gift',  'Surprise someone'],
          ].map(([t, icon, title, sub]) => (
            <button key={t} onClick={() => setOrderType(t)}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                orderType === t ? 'border-puff bg-puff/5' : 'border-paper-border bg-white hover:border-paper-muted'
              }`}
            >
              <span className="text-2xl block mb-2">{icon}</span>
              <p className="font-semibold text-[14px] text-ink">{title}</p>
              <p className="text-[12px] text-paper-muted mt-0.5">{sub}</p>
            </button>
          ))}
        </div>
        {isGift && (
          <div className="mt-3 flex gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100 animate-pop">
            <span className="text-lg shrink-0">🕵️</span>
            <p className="text-[13px] text-amber-800 leading-relaxed">
              <strong>Your name stays hidden.</strong> We only need your WhatsApp to confirm payment — the recipient won't know it's from you.
            </p>
          </div>
        )}
      </div>

      <div>
        <Label>Menu</Label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {CONFIG.PRODUCTS.map(p => (
            <ProductTile key={p.id} product={p} count={qty[p.id] ?? 0} onBump={bump} />
          ))}
        </div>
      </div>

      {needsFlavour && (
        <div className="animate-pop">
          <Label>Flavour <span className="text-red-400">*</span></Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {CONFIG.FLAVOURS.map(f => (
              <Pill key={f} active={flavour === f} onClick={() => setFlavour(f)}>{f}</Pill>
            ))}
          </div>
        </div>
      )}

      <div>
        <Label>Campus <span className="text-red-400">*</span></Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {CONFIG.CAMPUSES.map(c => (
            <Pill key={c} active={campus === c} onClick={() => setCampus(c)}>{c}</Pill>
          ))}
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 inset-x-0 p-4 bg-paper/95 backdrop-blur-sm border-t border-paper-border z-30">
        <div className="max-w-lg mx-auto">
          {cart.length > 0 && (
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[13px] text-paper-muted font-medium">
                {cart.map(i => `${i.emoji} ×${i.qty}`).join('  ')}
              </span>
              <span className="font-display font-bold text-ink text-[16px]">{formatNaira(total)}</span>
            </div>
          )}
          <CTA onClick={proceed} disabled={cart.length === 0}>
            {cart.length === 0
              ? 'Add items to continue'
              : `Continue · ${totalItems} item${totalItems !== 1 ? 's' : ''}`
            }
          </CTA>
        </div>
      </div>
    </div>
  );
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────

function Step2({ form, set, cart, flavour, total, campus, receipt, setReceipt, submitting, place, setStep, isGift, needsFlavour }) {
  return (
    <div className="animate-slide-up pt-5 space-y-5 pb-8">
      <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-[13px] text-paper-muted hover:text-ink font-medium transition-colors">
        ← Back to items
      </button>

      {isGift ? (
        <>
          <Section title="🕵️ Your contact" subtitle="Only used to confirm payment — never shared with recipient">
            <Field label="Your WhatsApp number">
              <Input type="tel" placeholder="080..." value={form.senderPhone} onChange={set('senderPhone')} />
            </Field>
          </Section>
          <Section title="🎁 Recipient details" subtitle="Who is receiving this?">
            <Field label="Recipient's name">
              <Input placeholder="Their name" value={form.recipientName} onChange={set('recipientName')} />
            </Field>
            <Field label="WhatsApp number" optional>
              <Input type="tel" placeholder="080... (for delivery notification)" value={form.recipientPhone} onChange={set('recipientPhone')} />
            </Field>
            <Field label="Delivery location">
              <Input placeholder="Where should we deliver?" value={form.recipientLocation} onChange={set('recipientLocation')} />
            </Field>
            <Field label="A secret note" optional>
              <Textarea placeholder="Write something for them 🧡" value={form.giftNote} onChange={set('giftNote')} />
            </Field>
          </Section>
        </>
      ) : (
        <Section title="Your details">
          <Field label="Full name">
            <Input placeholder="Your name" autoComplete="name" value={form.name} onChange={set('name')} />
          </Field>
          <Field label="WhatsApp number">
            <Input type="tel" placeholder="080..." autoComplete="tel" value={form.phone} onChange={set('phone')} />
          </Field>
          <Field label="Pickup location">
            <Input placeholder="e.g. Faculty of Science, Block A" value={form.location} onChange={set('location')} />
          </Field>
          <Field label="Note for us" optional>
            <Textarea placeholder="Any special instructions..." value={form.notes} onChange={set('notes')} />
          </Field>
        </Section>
      )}

      {/* Receipt-style summary */}
      <div>
        <Label>Order summary</Label>
        <div className="mt-2 bg-white border-2 border-dashed border-paper-border rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-dashed border-paper-border flex items-center justify-between">
            <span className="font-mono text-[11px] text-paper-muted uppercase tracking-widest">Order</span>
            <span className="font-mono text-[11px] text-paper-muted uppercase tracking-widest">{campus}</span>
          </div>
          {cart.map((i, idx) => (
            <div key={i.id} className={`flex items-center justify-between px-4 py-3 ${idx < cart.length - 1 ? 'border-b border-paper-border/50' : ''}`}>
              <div>
                <span className="text-[14px] font-medium text-ink">{i.emoji} {i.name}</span>
                {i.hasFlavour && flavour && <span className="text-[12px] text-paper-muted ml-2">— {flavour}</span>}
                <span className="ml-2 font-mono text-[12px] text-paper-muted">×{i.qty}</span>
              </div>
              <span className="font-mono text-[14px] font-medium text-ink">{formatNaira(i.subtotal)}</span>
            </div>
          ))}
          <div className="cut-line mx-4" />
          <div className="flex items-center justify-between px-4 py-3">
            <span className="font-display font-bold text-[13px] uppercase tracking-wider text-ink">Total</span>
            <span className="font-mono font-bold text-[20px] text-puff">{formatNaira(total)}</span>
          </div>
        </div>
      </div>

      {/* Bank details */}
      <div>
        <Label>Pay by transfer</Label>
        <div className="mt-2 bg-night rounded-2xl p-5 text-white">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40 mb-3">Bank account</p>
          <p className="font-mono text-[28px] font-medium tracking-wider text-white leading-none">{CONFIG.BANK.accountNumber}</p>
          <p className="mt-2 text-[14px] text-white/70">{CONFIG.BANK.bankName} · {CONFIG.BANK.accountName}</p>
          <div className="mt-4 rounded-xl bg-white/8 border border-white/10 px-4 py-3">
            <p className="text-[12.5px] text-white/70 leading-relaxed">
              📌 Use <strong className="text-white">your WhatsApp number</strong> as the transfer narration so we can match your payment.
            </p>
          </div>
        </div>
      </div>

      {/* Receipt upload */}
      <div>
        <Label>Upload receipt</Label>
        <label className={`mt-2 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-8 px-4 text-center cursor-pointer transition-all ${
          receipt ? 'border-green-400 bg-green-50' : 'border-paper-border bg-white hover:border-puff/40 hover:bg-puff/[0.03]'
        }`}>
          <span className="text-3xl">{receipt ? '✅' : '📎'}</span>
          <div>
            <p className="text-[14px] font-semibold text-ink">{receipt ? receipt.name : 'Tap to upload transfer screenshot'}</p>
            {!receipt && <p className="text-[12px] text-paper-muted mt-0.5">Image or PDF</p>}
          </div>
          <input type="file" accept="image/*,application/pdf" className="hidden" onChange={e => setReceipt(e.target.files?.[0] ?? null)} />
        </label>
      </div>

      <div className="fixed bottom-0 inset-x-0 p-4 bg-paper/95 backdrop-blur-sm border-t border-paper-border z-30">
        <div className="max-w-lg mx-auto">
          <CTA onClick={place} disabled={submitting}>
            {submitting
              ? <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Placing order…
                </span>
              : <span className="flex items-center justify-between w-full">
                  <span>Place order</span>
                  <span className="font-mono">{formatNaira(total)}</span>
                </span>
            }
          </CTA>
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: Success ──────────────────────────────────────────────────────────

function Step3({ doneRef, isGift, reset }) {
  return (
    <div className="animate-pop pt-16 pb-10 text-center">
      <div className="inline-flex w-20 h-20 items-center justify-center rounded-full bg-puff text-white text-3xl mb-5">🎉</div>
      <h1 className="font-display font-bold text-[28px] text-ink">{isGift ? 'Gift queued!' : 'Order placed!'}</h1>
      <p className="mt-2 text-[14px] text-paper-muted max-w-[260px] mx-auto leading-relaxed">
        {isGift
          ? "We've got it. We'll confirm payment and handle the surprise delivery."
          : "We'll confirm on WhatsApp shortly. Get ready for something good."
        }
      </p>

      {/* Ticket */}
      <div className="mt-8 mx-auto max-w-[240px] bg-white border-2 border-dashed border-paper-border rounded-2xl overflow-hidden">
        <div className="px-5 pt-5 pb-3 border-b border-dashed border-paper-border">
          <p className="font-mono text-[10px] text-paper-muted uppercase tracking-widest mb-1">Reference</p>
          <p className="font-mono font-bold text-[32px] text-ink tracking-wider leading-none">{doneRef}</p>
        </div>
        <div className="px-5 py-3">
          <p className="font-mono text-[11px] text-paper-muted">splendidpuff.campus</p>
        </div>
      </div>
      <p className="mt-3 text-[12px] text-paper-muted">Screenshot this to track your order</p>

      <div className="mt-8 space-y-3 max-w-xs mx-auto">
        <a href={waLink(CONFIG.WHATSAPP_NUMBER, `Hi! I just placed order ${doneRef} 🍩`)} target="_blank" rel="noreferrer">
          <CTA className="!bg-[#25D366] hover:!bg-[#1da851]">💬 Message us on WhatsApp</CTA>
        </a>
        <button onClick={reset} className="w-full py-3.5 rounded-2xl border border-paper-border text-[14px] font-semibold text-paper-muted hover:text-ink hover:border-paper-muted transition-colors">
          Place another order
        </button>
      </div>
    </div>
  );
}

// ─── Track panel ──────────────────────────────────────────────────────────────

const TRACK_STEPS = ['pending', 'confirmed', 'ready', 'completed'];
const TRACK_META = {
  pending:   { icon: '📥', label: 'Received',   sub: 'Your order is in the queue.' },
  confirmed: { icon: '✅', label: 'Confirmed',   sub: 'Payment confirmed, preparing now.' },
  ready:     { icon: '🍩', label: 'Ready',       sub: 'Come pick it up or delivery is on the way.' },
  completed: { icon: '🎉', label: 'Done',        sub: 'Hope you enjoyed it! 🧡' },
};

function TrackPanel() {
  const toast = useToast();
  const [ref, setRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function lookUp() {
    if (!ref.trim()) return toast('Enter your order reference', true);
    try {
      setLoading(true);
      setResult(await fetchOrderByRef(ref.trim()) ?? 'notfound');
    } catch {
      toast("Couldn't reach the server — try again shortly.", true);
    } finally {
      setLoading(false);
    }
  }

  const idx = result && result !== 'notfound' ? TRACK_STEPS.indexOf(result.status) : -1;

  return (
    <div className="animate-slide-up pt-6 space-y-4">
      <div>
        <Label>Order reference</Label>
        <div className="flex gap-2 mt-2">
          <input
            className="flex-1 rounded-xl border border-paper-border bg-white px-4 py-3 font-mono text-[15px] uppercase tracking-widest text-ink placeholder:text-paper-muted/50 outline-none focus:border-puff focus:ring-2 focus:ring-puff/15 transition"
            placeholder="SP-0000"
            value={ref}
            onChange={e => setRef(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && lookUp()}
          />
          <button onClick={lookUp} disabled={loading}
            className="px-5 py-3 rounded-xl bg-ink text-white font-semibold text-[14px] hover:bg-ink-soft transition disabled:opacity-50 shrink-0">
            {loading ? '…' : 'Track'}
          </button>
        </div>
      </div>

      {result === 'notfound' && (
        <div className="animate-pop rounded-2xl border border-paper-border bg-white p-6 text-center">
          <p className="text-2xl mb-2">🔍</p>
          <p className="font-semibold text-ink">No order found</p>
          <p className="text-[13px] text-paper-muted mt-1">Check the reference number from your confirmation screen.</p>
        </div>
      )}

      {result && result !== 'notfound' && (
        <div className="animate-pop bg-white border-2 border-dashed border-paper-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-dashed border-paper-border flex items-start justify-between">
            <div>
              <p className="font-mono font-bold text-[22px] text-ink">{result.ref}</p>
              <p className="text-[13px] text-paper-muted mt-0.5">
                {itemsLabel(result.items)} · {formatNaira(result.total)}
              </p>
            </div>
            <StatusBadge status={result.status} />
          </div>
          <div className="px-5 py-5">
            {TRACK_STEPS.map((s, i) => {
              const done = i <= idx;
              const active = i === idx;
              const meta = TRACK_META[s];
              return (
                <div key={s} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] shrink-0 transition-all ${done ? 'bg-puff text-white' : 'bg-paper-warm text-paper-muted'}`}>
                      {done ? (active ? meta.icon : '✓') : '○'}
                    </div>
                    {i < TRACK_STEPS.length - 1 && (
                      <div className={`w-0.5 flex-1 min-h-[20px] my-1 ${i < idx ? 'bg-puff/40' : 'bg-paper-border'}`} />
                    )}
                  </div>
                  <div className="pt-1 pb-5">
                    <p className={`text-[14px] font-semibold ${done ? 'text-ink' : 'text-paper-muted'}`}>{meta.label}</p>
                    {active && <p className="text-[12px] text-paper-muted mt-0.5">{meta.sub}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function Label({ children }) {
  return <p className="text-[11px] font-bold uppercase tracking-widest text-paper-muted">{children}</p>;
}

function Section({ title, subtitle, children }) {
  return (
    <div className="rounded-2xl border border-paper-border bg-white p-5">
      <p className="font-semibold text-[15px] text-ink">{title}</p>
      {subtitle && <p className="text-[12.5px] text-paper-muted mt-0.5 mb-4">{subtitle}</p>}
      {!subtitle && <div className="mb-4" />}
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, optional, children }) {
  return (
    <label className="block">
      <span className="block text-[12.5px] font-semibold text-ink mb-1.5">
        {label} {optional && <span className="font-normal text-paper-muted">(optional)</span>}
      </span>
      {children}
    </label>
  );
}

const inputBase = "w-full rounded-xl border border-paper-border bg-paper px-4 py-3 text-[14px] text-ink placeholder:text-paper-muted/50 outline-none focus:border-puff focus:ring-2 focus:ring-puff/15 transition";

function Input(props) {
  return <input className={inputBase} {...props} />;
}

function Textarea(props) {
  return <textarea className={`${inputBase} min-h-[80px] resize-none`} {...props} />;
}

function Pill({ active, onClick, children }) {
  return (
    <button type="button" onClick={onClick}
      className={`px-4 py-2 rounded-full border text-[13px] font-medium transition-all active:scale-95 ${
        active
          ? 'bg-ink border-ink text-white'
          : 'bg-white border-paper-border text-paper-muted hover:border-ink-soft hover:text-ink'
      }`}
    >{children}</button>
  );
}

function CTA({ children, onClick, disabled, className = '' }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className={`w-full bg-puff hover:bg-puff-dim text-white font-display font-bold text-[15px] py-4 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none shadow-lg shadow-puff/20 ${className}`}
    >{children}</button>
  );
}

function ProductTile({ product: p, count, onBump }) {
  return (
    <div className={`relative bg-white rounded-2xl border-2 p-4 transition-all ${count > 0 ? 'border-puff' : 'border-paper-border hover:border-paper-muted'}`}>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 w-6 h-6 bg-puff text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow animate-pop">
          {count}
        </span>
      )}
      <div className="w-10 h-10 rounded-xl bg-paper flex items-center justify-center text-xl mb-2.5">{p.emoji}</div>
      <p className="font-semibold text-[13px] text-ink min-h-[2.2rem] leading-snug">{p.name}</p>
      <p className="font-mono font-bold text-[14px] text-puff mt-0.5">{formatNaira(p.price)}</p>
      {count > 0 ? (
        <div className="flex items-center justify-between mt-3 bg-paper rounded-xl px-1 py-0.5">
          <button onClick={() => onBump(p.id, -1)} className="w-7 h-7 rounded-lg bg-white text-ink font-bold text-[16px] flex items-center justify-center hover:bg-puff hover:text-white transition">−</button>
          <span className="font-mono font-bold text-[14px]">{count}</span>
          <button onClick={() => onBump(p.id, 1)} className="w-7 h-7 rounded-lg bg-puff text-white font-bold text-[16px] flex items-center justify-center hover:bg-puff-dim transition">+</button>
        </div>
      ) : (
        <button onClick={() => onBump(p.id, 1)} className="w-full mt-3 py-1.5 rounded-xl border border-paper-border text-[13px] font-semibold text-paper-muted hover:border-puff hover:text-puff transition">Add</button>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending: 'bg-amber-100 text-amber-700', confirmed: 'bg-blue-100 text-blue-700',
    ready: 'bg-orange-100 text-orange-700', completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-zinc-100 text-zinc-500',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${map[status] ?? 'bg-zinc-100 text-zinc-500'}`}>
      {status}
    </span>
  );
}
