/* @ds-bundle: {"format":3,"namespace":"MamaSpagatDesignSystem_9e61be","components":[],"sourceHashes":{"ui_kits/link_in_bio/components.jsx":"a7ab689936bd","ui_kits/sales_page/blocks.jsx":"717b9d6a5b2c","ui_kits/sales_page/components.jsx":"5b4372d59861"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.MamaSpagatDesignSystem_9e61be = window.MamaSpagatDesignSystem_9e61be || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ui_kits/link_in_bio/components.jsx
try { (() => {
const {
  useState
} = React;

// Sage top bar — "mama.spagat ✓" + personal greeting.
function BioHeader() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--ms-sage)',
      padding: '16px 22px 18px',
      color: 'var(--ms-cream)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/vanessa-avatar.png",
    style: {
      width: 30,
      height: 30,
      borderRadius: 999,
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      fontFamily: 'var(--ms-font-body)',
      fontWeight: 600,
      fontSize: 13
    }
  }, "mama.spagat ", /*#__PURE__*/React.createElement("img", {
    src: "../../assets/verified-badge.png",
    style: {
      width: 14,
      height: 14
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontFamily: 'var(--ms-font-body)',
      fontSize: 13,
      fontWeight: 500,
      opacity: .92
    }
  }, "Hi, ich bin Vanessa \uD83D\uDC4B")));
}

// Headline intro with underlined phrase + INNER SLIM CODE line.
function Intro() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--ms-cream)',
      padding: '26px 24px 22px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--ms-font-body)',
      fontWeight: 800,
      fontSize: 21,
      lineHeight: 1.35,
      color: 'var(--ms-ink)',
      margin: 0
    }
  }, "Ich helfe Mamas beim Abnehmen \u2014 zur\xFCck zu ihrem", ' ', /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ms-terracotta)',
      textDecoration: 'underline',
      textDecorationThickness: 2,
      textUnderlineOffset: 3
    }
  }, "Nat\xFCrlich-Schlanken-Ich"), ' ', "zu finden."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      marginTop: 16,
      padding: '8px 16px',
      borderRadius: 'var(--ms-radius-pill)',
      background: 'var(--ms-white)',
      boxShadow: 'var(--ms-shadow-soft)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u26A1"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--ms-font-body)',
      fontWeight: 700,
      fontSize: 11.5,
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      color: 'var(--ms-charcoal)'
    }
  }, "Energie & Mindset statt Di\xE4t \xB7 The Inner Slim Code")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--ms-font-body)',
      fontSize: 14,
      lineHeight: 1.55,
      color: 'var(--ms-charcoal)',
      margin: '16px auto 0',
      maxWidth: 320
    }
  }, "Erfahre, wie ich ", /*#__PURE__*/React.createElement("strong", null, "16 kg in 80 Tagen"), " verloren habe \u2014 und es seit \xFCber 10 Monaten halte. \uD83D\uDCAA"));
}
function FreebieLabel() {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: 999,
      background: 'var(--ms-sage)',
      color: 'var(--ms-cream)',
      fontFamily: 'var(--ms-font-body)',
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: '.18em',
      textTransform: 'uppercase'
    }
  }, "Kostenlos");
}

// Two free lead-magnets side by side.
function Freebies({
  onOpen
}) {
  const items = [{
    id: 'protein',
    img: '../../assets/protein-falle-cover.png',
    title: 'Die Protein Falle',
    desc: 'Warum dein Protein dich heimlich am Abnehmen hindert.'
  }, {
    id: 'alltag',
    img: '../../assets/alltagsguide-cover.png',
    title: 'Der Alltagsguide',
    desc: 'Dein praktischer Eiweiß-Booster für jeden Tag.'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--ms-cream)',
      padding: '4px 20px 22px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      fontFamily: 'var(--ms-font-body)',
      fontSize: 12.5,
      fontWeight: 700,
      color: 'var(--ms-terracotta)',
      letterSpacing: '.06em',
      marginBottom: 14
    }
  }, "Sichere dir 2 kostenlose Guides \uD83C\uDF81"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12
    }
  }, items.map(it => /*#__PURE__*/React.createElement("button", {
    key: it.id,
    onClick: () => onOpen(it.id),
    style: {
      background: 'var(--ms-white)',
      border: 'none',
      borderRadius: 'var(--ms-radius-lg)',
      padding: 12,
      boxShadow: 'var(--ms-shadow-soft)',
      cursor: 'pointer',
      textAlign: 'center',
      transition: 'transform 200ms var(--ms-ease), box-shadow 250ms var(--ms-ease)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.transform = 'translateY(-3px)';
      e.currentTarget.style.boxShadow = 'var(--ms-shadow-lift)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.boxShadow = 'var(--ms-shadow-soft)';
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: it.img,
    style: {
      width: '100%',
      aspectRatio: '1',
      objectFit: 'cover',
      borderRadius: 'var(--ms-radius-md)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement(FreebieLabel, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--ms-font-display)',
      fontSize: 17,
      color: 'var(--ms-ink)',
      textTransform: 'uppercase',
      letterSpacing: '.01em',
      marginTop: 8,
      lineHeight: 1.05
    }
  }, it.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--ms-font-body)',
      fontSize: 11.5,
      color: 'var(--ms-muted)',
      marginTop: 6,
      lineHeight: 1.4
    }
  }, it.desc)))));
}

// Terracotta-outlined highlight: Vitalstoff-Berater quiz.
function VitalstoffCard({
  onOpen
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--ms-cream)',
      padding: '4px 20px 22px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '2px solid var(--ms-terracotta)',
      borderRadius: 'var(--ms-radius-lg)',
      background: 'var(--ms-white)',
      padding: '22px 20px',
      textAlign: 'center',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--ms-font-display)',
      fontSize: 19,
      color: 'var(--ms-ink)',
      textTransform: 'uppercase'
    }
  }, "Vitalstoff-Berater"), /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '3px 9px',
      borderRadius: 999,
      background: 'var(--ms-orange)',
      color: 'var(--ms-white)',
      fontFamily: 'var(--ms-font-body)',
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: '.16em'
    }
  }, "NEU")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--ms-font-body)',
      fontSize: 13.5,
      lineHeight: 1.5,
      color: 'var(--ms-charcoal)',
      margin: '0 0 16px'
    }
  }, "Finde in unter 1 Minute heraus, warum du nicht abnimmst \u2014 und welcher Vitalstoff deinem K\xF6rper fehlt."), /*#__PURE__*/React.createElement("button", {
    onClick: () => onOpen('vitalstoff'),
    className: "ms-btn ms-btn-primary",
    style: {
      width: '100%',
      fontSize: 12.5,
      padding: '13px 16px',
      lineHeight: 1.3
    }
  }, "Vitalstoff-Check starten")));
}

// Large product tile with a rezepte badge disc.
function ProductTile({
  img,
  badgeNum,
  badgeLabel,
  title,
  kicker,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      display: 'block',
      width: '100%',
      border: 'none',
      background: 'transparent',
      padding: '4px 20px 16px',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      borderRadius: 'var(--ms-radius-lg)',
      overflow: 'hidden',
      boxShadow: 'var(--ms-shadow-card)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: img,
    style: {
      width: '100%',
      aspectRatio: '1.1',
      objectFit: 'cover',
      display: 'block'
    }
  }), badgeNum && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 14,
      right: 14,
      width: 74,
      height: 74,
      borderRadius: 999,
      background: 'var(--ms-terracotta)',
      color: 'var(--ms-white)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: 'var(--ms-shadow-lift)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--ms-font-display)',
      fontSize: 26,
      lineHeight: 1
    }
  }, badgeNum), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--ms-font-body)',
      fontWeight: 700,
      fontSize: 8.5,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      marginTop: 2
    }
  }, badgeLabel))), title && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'left',
      marginTop: 10
    }
  }, kicker && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--ms-font-body)',
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'var(--ms-terracotta)'
    }
  }, kicker), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--ms-font-display)',
      fontSize: 19,
      color: 'var(--ms-ink)',
      textTransform: 'uppercase',
      marginTop: 3
    }
  }, title)));
}

// Press / video testimonial block.
function VideoBlock({
  onOpen
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 20px 18px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--ms-white)',
      borderRadius: 'var(--ms-radius-lg)',
      overflow: 'hidden',
      boxShadow: 'var(--ms-shadow-card)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: '16/10',
      background: 'var(--ms-sage)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/vanessa-essen.jpg",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      opacity: .95
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(12,17,20,.18)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 58,
      height: 58,
      borderRadius: 999,
      background: 'var(--ms-white)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: 'var(--ms-shadow-hero)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20,
      color: 'var(--ms-terracotta)',
      marginLeft: 3
    }
  }, "\u25B6")))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 16px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--ms-font-body)',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      color: 'var(--ms-muted)'
    }
  }, "Berliner Morgenpost"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--ms-font-body)',
      fontSize: 13.5,
      lineHeight: 1.45,
      color: 'var(--ms-charcoal)',
      margin: '6px 0 14px'
    }
  }, "\u201EVanessa nahm 16 kg in 80 Tagen ab \u2014 und isst jetzt mehr und wiegt weniger.\u201C"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onOpen('video'),
    className: "ms-btn ms-btn-primary",
    style: {
      width: '100%',
      fontSize: 12.5,
      padding: '13px 16px'
    }
  }, "Jetzt Video ansehen"))));
}

// 7-Tage Challenge — terracotta highlight block.
function ChallengeBlock({
  onOpen
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 20px 20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--ms-terracotta)',
      borderRadius: 'var(--ms-radius-lg)',
      padding: '26px 22px',
      textAlign: 'center',
      color: 'var(--ms-white)',
      boxShadow: 'var(--ms-shadow-lift)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--ms-font-display)',
      fontSize: 52,
      lineHeight: .9,
      letterSpacing: '.01em'
    }
  }, "7 TAGE"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--ms-font-display)',
      fontSize: 30,
      lineHeight: 1,
      textTransform: 'uppercase',
      opacity: .96
    }
  }, "Protein Challenge"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--ms-font-body)',
      fontSize: 13,
      lineHeight: 1.5,
      margin: '14px auto 18px',
      maxWidth: 280,
      opacity: .94
    }
  }, "7 Tage Online-Kurs mit Live-Begleitung via Telegram \u2014 f\xFCr Frauen 35+, ohne Sport-Wahnsinn."), /*#__PURE__*/React.createElement("button", {
    onClick: () => onOpen('challenge'),
    style: {
      width: '100%',
      background: 'var(--ms-ink)',
      color: 'var(--ms-cream)',
      border: 'none',
      borderRadius: 'var(--ms-radius-md)',
      padding: '14px 16px',
      fontFamily: 'var(--ms-font-body)',
      fontWeight: 700,
      fontSize: 13,
      textTransform: 'uppercase',
      letterSpacing: '.04em',
      cursor: 'pointer'
    }
  }, "Jetzt anmelden & sofort starten")));
}

// Sage footer — 1:1 call booking with avatar + mini form.
function CallFooter() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [ok, setOk] = useState(false);
  const inputStyle = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '13px 16px',
    borderRadius: 'var(--ms-radius-md)',
    border: 'none',
    fontFamily: 'var(--ms-font-body)',
    fontSize: 14,
    color: 'var(--ms-ink)',
    background: 'var(--ms-white)',
    outline: 'none'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--ms-sage)',
      padding: '34px 24px 30px',
      color: 'var(--ms-cream)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/vanessa-avatar.png",
    style: {
      width: 64,
      height: 64,
      borderRadius: 999,
      objectFit: 'cover',
      boxShadow: 'var(--ms-shadow-lift)'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--ms-font-body)',
      fontSize: 14.5,
      lineHeight: 1.5,
      margin: '14px auto 4px',
      maxWidth: 300
    }
  }, "Du m\xF6chtest eine individuelle Begleitung oder hast Fragen zu meinen Programmen?"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--ms-font-display)',
      fontSize: 20,
      textTransform: 'uppercase',
      margin: '8px 0 18px',
      lineHeight: 1.15
    }
  }, "Buch dir deinen kostenlosen 1:1-Call"), ok ? /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(239,231,221,.14)',
      borderRadius: 'var(--ms-radius-md)',
      padding: '18px',
      fontFamily: 'var(--ms-font-body)',
      fontSize: 14
    }
  }, "\uD83E\uDDE1 Danke, ", name || 'du', "! Ich melde mich f\xFCr deinen Termin.") : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      maxWidth: 320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("input", {
    style: inputStyle,
    placeholder: "Dein Vorname",
    value: name,
    onChange: e => setName(e.target.value)
  }), /*#__PURE__*/React.createElement("input", {
    style: inputStyle,
    placeholder: "Deine beste E-Mail-Adresse",
    type: "email",
    value: email,
    onChange: e => setEmail(e.target.value)
  }), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 8,
      fontFamily: 'var(--ms-font-body)',
      fontSize: 11,
      textAlign: 'left',
      opacity: .9
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    style: {
      marginTop: 2
    }
  }), " Ich akzeptiere die Datenschutzbestimmungen."), /*#__PURE__*/React.createElement("button", {
    onClick: () => setOk(true),
    className: "ms-btn ms-btn-primary",
    style: {
      width: '100%',
      fontSize: 12.5,
      padding: '14px 16px',
      lineHeight: 1.3
    }
  }, "Kostenlosen 15-min Call mit Vanessa buchen")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 26,
      display: 'flex',
      gap: 16,
      justifyContent: 'center',
      fontFamily: 'var(--ms-font-body)',
      fontSize: 11.5,
      opacity: .8
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'var(--ms-cream)'
    }
  }, "Impressum"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'var(--ms-cream)'
    }
  }, "Datenschutz")));
}
Object.assign(window, {
  BioHeader,
  Intro,
  Freebies,
  VitalstoffCard,
  ProductTile,
  VideoBlock,
  ChallengeBlock,
  CallFooter
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/link_in_bio/components.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sales_page/blocks.jsx
try { (() => {
// Reusable trust & conversion blocks for the Mama.Spagat sales page.
// Loaded before components.jsx — exports to window.

const {
  useState
} = React;
function Stars({
  size = 16,
  color = 'var(--ms-orange)'
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      gap: 2,
      color,
      fontSize: size,
      lineHeight: 1
    }
  }, '★★★★★');
}
function AvatarStack({
  size = 40
}) {
  const tints = ['#D8A790', '#C8A77A', '#B7977E'];
  const names = ['S', 'B', 'C'];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex'
    }
  }, tints.map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      width: size,
      height: size,
      borderRadius: 999,
      background: t,
      border: '2px solid var(--ms-white)',
      marginLeft: i ? -size * 0.32 : 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--ms-font-body)',
      fontWeight: 700,
      fontSize: size * 0.4,
      color: 'var(--ms-white)',
      boxShadow: 'var(--ms-shadow-soft)'
    }
  }, names[i])));
}

// Avatars + rating + "5.000 Frauen" social-proof line
function SocialProof({
  center = true
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: center ? 'center' : 'flex-start',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(AvatarStack, null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Stars, {
    size: 15
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--ms-font-body)',
      fontWeight: 700,
      fontSize: 13,
      color: 'var(--ms-ink)'
    }
  }, "4,9 von 5,0")))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--ms-font-body)',
      fontSize: 13.5,
      color: 'var(--ms-charcoal)',
      textAlign: center ? 'center' : 'left'
    }
  }, "Bereits von \xFCber ", /*#__PURE__*/React.createElement("strong", null, "5.000 Frauen"), " geliebt"));
}
function PaymentRow() {
  const methods = ['PayPal', 'VISA', 'AMEX', 'Klarna'];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      color: 'var(--ms-muted)',
      fontFamily: 'var(--ms-font-body)',
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '.04em'
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\uD83D\uDD12"), " Sichere Bezahlung mit"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      justifyContent: 'center'
    }
  }, methods.map(m => /*#__PURE__*/React.createElement("span", {
    key: m,
    style: {
      padding: '5px 11px',
      borderRadius: 6,
      background: 'var(--ms-white)',
      border: '1px solid var(--ms-border)',
      fontFamily: 'var(--ms-font-body)',
      fontWeight: 700,
      fontSize: 11,
      color: 'var(--ms-charcoal)',
      letterSpacing: '.02em',
      boxShadow: 'var(--ms-shadow-soft)'
    }
  }, m))));
}

// The conversion engine: price anchor + email capture + CTA + reassurance.
function PriceBox({
  onBuy
}) {
  const [email, setEmail] = useState('');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--ms-white)',
      borderRadius: 'var(--ms-radius-lg)',
      padding: 28,
      boxShadow: 'var(--ms-shadow-lift)',
      border: '1px solid var(--ms-border)',
      maxWidth: 460,
      width: '100%',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 12,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--ms-font-display)',
      fontSize: 52,
      fontWeight: 400,
      color: 'var(--ms-terracotta)',
      lineHeight: 1,
      whiteSpace: 'nowrap'
    }
  }, "19\u2009\u20AC"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--ms-font-body)',
      fontSize: 14,
      color: 'var(--ms-charcoal)',
      fontWeight: 600
    }
  }, "Nur 0,27\xA0\u20AC pro Rezept"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--ms-font-body)',
      fontSize: 13,
      color: 'var(--ms-muted)'
    }
  }, "inkl. MwSt \xB7 statt ", /*#__PURE__*/React.createElement("s", null, "39\xA0\u20AC")))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      padding: '8px 14px',
      borderRadius: 'var(--ms-radius-pill)',
      background: 'var(--ms-blush)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\uD83C\uDF89"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--ms-font-body)',
      fontWeight: 700,
      fontSize: 13,
      color: 'var(--ms-terracotta-deep)'
    }
  }, "Gl\xFCckwunsch! Du sparst heute 20\xA0\u20AC")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--ms-font-body)',
      fontSize: 13.5,
      color: 'var(--ms-charcoal)',
      margin: '18px 0 10px',
      lineHeight: 1.5
    }
  }, "Trag jetzt deine E-Mail ein und sichere dir ", /*#__PURE__*/React.createElement("strong", null, "5\xA0% extra Rabatt")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      border: '1.5px solid var(--ms-sand)',
      borderRadius: 'var(--ms-radius-md)',
      padding: '4px 4px 4px 14px',
      background: 'var(--ms-white)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      opacity: .6
    }
  }, "\u2709\uFE0F"), /*#__PURE__*/React.createElement("input", {
    value: email,
    onChange: e => setEmail(e.target.value),
    placeholder: "du@beispiel.de",
    type: "email",
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'var(--ms-font-body)',
      fontSize: 15,
      color: 'var(--ms-ink)',
      minWidth: 0
    }
  })), /*#__PURE__*/React.createElement("button", {
    onClick: onBuy,
    className: "ms-btn ms-btn-primary",
    style: {
      width: '100%',
      marginTop: 12,
      fontSize: 15,
      padding: '16px 20px'
    }
  }, "70 Rezepte mit 5 % Rabatt sichern"), /*#__PURE__*/React.createElement("button", {
    onClick: onBuy,
    style: {
      width: '100%',
      marginTop: 8,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--ms-font-body)',
      fontSize: 13,
      color: 'var(--ms-muted)',
      textDecoration: 'underline',
      textUnderlineOffset: 3
    }
  }, "Ohne extra Rabatt sichern"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      marginTop: 14,
      color: 'var(--ms-sage)',
      fontFamily: 'var(--ms-font-body)',
      fontSize: 12.5,
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u26A1"), " Sofortiger Download nach Zahlungsbest\xE4tigung"));
}

// Full reassurance cluster used after every PriceBox in the real page.
function ConversionBlock({
  onBuy
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement(PriceBox, {
    onBuy: onBuy
  }), /*#__PURE__*/React.createElement(SocialProof, null), /*#__PURE__*/React.createElement(PaymentRow, null));
}
function SectionLabel({
  children,
  kicker
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 40
    }
  }, kicker && /*#__PURE__*/React.createElement("div", {
    className: "ms-eyebrow",
    style: {
      marginBottom: 12
    }
  }, kicker), /*#__PURE__*/React.createElement("h2", {
    className: "ms-h1",
    style: {
      fontSize: 40,
      maxWidth: 760,
      margin: '0 auto',
      lineHeight: 1.12
    }
  }, children));
}
function DownArrow({
  color = 'var(--ms-terracotta)'
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      padding: '8px 0'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 28,
      color,
      lineHeight: 1
    },
    "aria-hidden": "true"
  }, "\u2193"));
}
function VerifiedBadge({
  size = 16
}) {
  return /*#__PURE__*/React.createElement("img", {
    src: "../../assets/verified-badge.png",
    alt: "verifiziert",
    style: {
      width: size,
      height: size,
      display: 'inline-block',
      verticalAlign: 'middle'
    }
  });
}

// The real signature wordmark. variant: 'dark' (for light bg) | 'light' (for dark bg).
function Logo({
  height = 40,
  variant = 'dark'
}) {
  const src = variant === 'light' ? '../../assets/logo-script-light.png' : '../../assets/logo-script.png';
  return /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "Mama Spagat",
    style: {
      height,
      width: 'auto',
      display: 'block'
    }
  });
}

// Handle lockup used in headers: "mama.spagat ✓".
function Handle({
  color = 'var(--ms-ink)',
  size = 15
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--ms-font-body)',
      fontWeight: 600,
      fontSize: size,
      color
    }
  }, "mama.spagat ", /*#__PURE__*/React.createElement(VerifiedBadge, {
    size: size + 1
  }));
}
Object.assign(window, {
  Stars,
  AvatarStack,
  SocialProof,
  PaymentRow,
  PriceBox,
  ConversionBlock,
  SectionLabel,
  DownArrow,
  VerifiedBadge,
  Logo,
  Handle
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sales_page/blocks.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sales_page/components.jsx
try { (() => {
// Mama.Spagat — emotional, trust-loaded sales page sections.
// Depends on blocks.jsx (loaded first): ConversionBlock, SocialProof, Stars, SectionLabel, DownArrow.

const {
  useState
} = React;
function AnnounceBar() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--ms-ink)',
      color: 'var(--ms-cream)',
      fontFamily: 'var(--ms-font-body)',
      fontSize: 12.5,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      textAlign: 'center',
      padding: '9px 16px',
      fontWeight: 600,
      display: 'flex',
      gap: 22,
      justifyContent: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\u26A1 Sofort-Download"), /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .4
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, "5.000+ Frauen"), /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .4
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, "\u2605 4,9 / 5,0"));
}
function Header() {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 56px',
      background: 'var(--ms-cream)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      borderBottom: '1px solid var(--ms-border)'
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    height: 42
  }), /*#__PURE__*/React.createElement("button", {
    className: "ms-btn ms-btn-primary",
    style: {
      padding: '10px 20px',
      fontSize: 12
    }
  }, "Jetzt sichern"));
}

// Emotional, personal hero — "Hi, ich bin Vanessa", -16 Kilo, inline reviews, book + price.
function Hero({
  onBuy
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--ms-cream)',
      padding: '56px 56px 80px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.05fr .95fr',
      gap: 64,
      alignItems: 'center',
      maxWidth: 1180,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '7px 14px',
      borderRadius: 999,
      background: 'var(--ms-white)',
      boxShadow: 'var(--ms-shadow-soft)',
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/vanessa-avatar.png",
    style: {
      width: 26,
      height: 26,
      borderRadius: 999,
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement(Handle, {
    size: 13
  })), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--ms-font-display)',
      fontWeight: 400,
      fontSize: 60,
      lineHeight: 1.0,
      color: 'var(--ms-ink)',
      textTransform: 'uppercase',
      letterSpacing: '.005em',
      margin: 0
    }
  }, "Wie ich ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ms-terracotta)'
    }
  }, "\u221216\xA0Kilo"), " abgenommen habe"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--ms-font-body)',
      fontSize: 19,
      lineHeight: 1.55,
      color: 'var(--ms-charcoal)',
      maxWidth: 480,
      marginTop: 20
    }
  }, "\u2026 in nur 80 Tagen \u2014 ohne Hungern, ohne Verzicht, ohne Sport-Wahnsinn. Mit genau den ", /*#__PURE__*/React.createElement("strong", null, "70 Rezepten"), ", die du in diesem Kochbuch findest."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      marginTop: 26
    }
  }, /*#__PURE__*/React.createElement(Stars, {
    size: 20
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--ms-font-body)',
      fontSize: 14,
      color: 'var(--ms-charcoal)'
    }
  }, /*#__PURE__*/React.createElement("strong", null, "4,9 / 5,0"), " \xB7 \xFCber 5.000 Frauen")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginTop: 24,
      flexWrap: 'wrap'
    }
  }, [['„Endlich Rezepte, die schmecken UND schlank machen.“', '— Maria K.'], ['„−7 Kilo in 6 Wochen. Ich bin sprachlos.“', '— Sindy R.']].map(([q, a]) => /*#__PURE__*/React.createElement("div", {
    key: a,
    style: {
      flex: 1,
      minWidth: 200,
      background: 'var(--ms-white)',
      borderRadius: 'var(--ms-radius-md)',
      padding: '14px 16px',
      boxShadow: 'var(--ms-shadow-soft)'
    }
  }, /*#__PURE__*/React.createElement(Stars, {
    size: 12
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--ms-font-body)',
      fontSize: 13.5,
      color: 'var(--ms-charcoal)',
      margin: '6px 0 6px',
      lineHeight: 1.4
    }
  }, q), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--ms-font-body)',
      fontSize: 12,
      color: 'var(--ms-muted)',
      fontWeight: 600
    }
  }, a))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/kochbuch-cover.png",
    style: {
      width: 380,
      transform: 'rotate(-2deg)',
      filter: 'drop-shadow(0 24px 36px rgba(12,17,20,0.22))'
    }
  })), /*#__PURE__*/React.createElement(PriceBox, {
    onBuy: onBuy
  }))));
}

// "Vanessa erklärt warum dieses Buch anders ist" — video + recipe fly-through.
function VideoSection() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--ms-white)',
      padding: '88px 56px'
    }
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    kicker: "2 Minuten von mir an dich"
  }, "Warum dieses Rezeptbuch anders ist"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.3fr 1fr',
      gap: 32,
      maxWidth: 1080,
      margin: '0 auto',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      borderRadius: 'var(--ms-radius-lg)',
      overflow: 'hidden',
      boxShadow: 'var(--ms-shadow-lift)',
      aspectRatio: '16/10',
      background: 'var(--ms-sage)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/vanessa-essen.jpg",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      opacity: .96
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(12,17,20,.18)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 76,
      height: 76,
      borderRadius: 999,
      background: 'var(--ms-white)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: 'var(--ms-shadow-hero)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 26,
      color: 'var(--ms-terracotta)',
      marginLeft: 4
    }
  }, "\u25B6")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/kochbuch-anim.gif",
    style: {
      width: '100%',
      borderRadius: 'var(--ms-radius-lg)',
      boxShadow: 'var(--ms-shadow-card)'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--ms-font-body)',
      fontSize: 13.5,
      color: 'var(--ms-muted)',
      marginTop: 12,
      textAlign: 'center'
    }
  }, "Ein kleiner Vorgeschmack auf deine 70 Rezepte \uD83C\uDF7D\uFE0F"))));
}

// "Das erwartet dich" — 6 warm feature cards with emoji.
function WhatYouGet() {
  const items = [['👪', 'Familientauglich', 'Rezepte, die deine Kinder UND dein Mann lieben — kein zweites Kochen.'], ['⏰', 'In 15 Minuten', 'Schnell gekocht, weil dein Tag schon voll genug ist.'], ['📖', '70 Rezepte', 'Frühstück, Mittag, Abend, Snacks & Süßes — alles dabei.'], ['🍱', 'Meal-Prep-fähig', 'Vorkochen für die ganze Woche, perfekt fürs Büro.'], ['🙌', 'Ohne Hungern', 'Portionen, die satt machen. Verzicht hat noch nie funktioniert.'], ['🎁', 'Sofort-Download', 'Direkt nach dem Kauf in deinem Postfach — leg heute noch los.']];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--ms-blush)',
      padding: '88px 56px'
    }
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    kicker: "Das erwartet dich"
  }, "Alles, was du f\xFCr deinen Neustart brauchst"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 22,
      maxWidth: 1080,
      margin: '0 auto'
    }
  }, items.map(([e, t, b]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      background: 'var(--ms-white)',
      borderRadius: 'var(--ms-radius-lg)',
      padding: 30,
      boxShadow: 'var(--ms-shadow-card)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 34,
      lineHeight: 1
    },
    "aria-hidden": "true"
  }, e), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--ms-font-display)',
      fontWeight: 400,
      fontSize: 23,
      color: 'var(--ms-ink)',
      textTransform: 'uppercase',
      letterSpacing: '.02em',
      margin: '16px 0 8px'
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--ms-font-body)',
      fontSize: 14,
      lineHeight: 1.55,
      color: 'var(--ms-charcoal)',
      margin: 0
    }
  }, b)))));
}

// "Perfekt für dich, wenn…" checklist + tablet showcase.
function PerfectForYou() {
  const points = ['du schon 1.000 Diäten probiert hast und nichts blieb', 'du keine Zeit für stundenlanges Kochen hast', 'du satt werden willst, statt Kalorien zu zählen', 'du Rezepte suchst, die die ganze Familie isst', 'du endlich dauerhaft abnehmen willst — ohne Jojo'];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--ms-white)',
      padding: '88px 56px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 64,
      maxWidth: 1080,
      margin: '0 auto',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/kochbuch-tablet.png",
    style: {
      width: '100%',
      borderRadius: 'var(--ms-radius-lg)',
      boxShadow: 'var(--ms-shadow-hero)'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ms-eyebrow",
    style: {
      marginBottom: 12
    }
  }, "Perfekt f\xFCr dich, wenn \u2026"), /*#__PURE__*/React.createElement("h2", {
    className: "ms-h1",
    style: {
      fontSize: 36,
      marginBottom: 26
    }
  }, "Kommt dir das bekannt vor?"), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, points.map(p => /*#__PURE__*/React.createElement("li", {
    key: p,
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0,
      width: 26,
      height: 26,
      borderRadius: 999,
      background: 'var(--ms-sage)',
      color: 'var(--ms-white)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 14,
      marginTop: 1
    }
  }, "\u2713"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--ms-font-body)',
      fontSize: 16,
      lineHeight: 1.5,
      color: 'var(--ms-charcoal)'
    }
  }, p)))))));
}

// Before / After transformation — emotional proof.
function BeforeAfter() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--ms-sage)',
      padding: '88px 56px',
      color: 'var(--ms-cream)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '.8fr 1.2fr',
      gap: 64,
      maxWidth: 1080,
      margin: '0 auto',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/vanessa-portrait.png",
    style: {
      width: '100%',
      aspectRatio: '3/4',
      objectFit: 'cover',
      borderRadius: 'var(--ms-radius-lg)',
      boxShadow: 'var(--ms-shadow-hero)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: -18,
      left: -14,
      background: 'var(--ms-terracotta)',
      color: 'var(--ms-white)',
      padding: '14px 20px',
      borderRadius: 'var(--ms-radius-md)',
      boxShadow: 'var(--ms-shadow-lift)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--ms-font-display)',
      fontSize: 30,
      lineHeight: 1
    }
  }, "\u221216 kg"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--ms-font-body)',
      fontSize: 11,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      marginTop: 4,
      opacity: .9
    }
  }, "in 80 Tagen"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ms-eyebrow",
    style: {
      color: 'var(--ms-blush)',
      marginBottom: 14
    }
  }, "Meine Geschichte"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--ms-font-display)',
      fontWeight: 400,
      fontSize: 34,
      textTransform: 'uppercase',
      letterSpacing: '.01em',
      margin: '0 0 22px',
      color: 'var(--ms-cream)',
      lineHeight: 1.12
    }
  }, "86 Kilo. Und dann die Wende."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--ms-font-body)',
      fontSize: 17,
      lineHeight: 1.65,
      color: 'var(--ms-cream)',
      opacity: .94,
      margin: '0 0 16px'
    }
  }, "Ich stand mit 86 Kilo vorm Spiegel und hatte \xFCber ", /*#__PURE__*/React.createElement("strong", null, "315 Di\xE4ten"), " hinter mir. Jede hat mich hungrig, frustriert und schwerer zur\xFCckgelassen als vorher."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--ms-font-body)',
      fontSize: 17,
      lineHeight: 1.65,
      color: 'var(--ms-cream)',
      opacity: .94,
      margin: 0
    }
  }, "Was mich befreit hat, waren nicht ", /*#__PURE__*/React.createElement("em", null, "weniger"), " Mahlzeiten \u2014 sondern die ", /*#__PURE__*/React.createElement("em", null, "richtigen"), ". Genau die gebe ich dir in diesem Kochbuch weiter. \uD83E\uDDE1"))));
}

// WhatsApp-style chat testimonials.
function ChatTestimonials() {
  const msgs = [{
    side: 'in',
    name: 'Sarah',
    text: 'Vanessa, ich MUSS dir schreiben 😭 −5 Kilo und mein Mann fragt nach Nachschlag!'
  }, {
    side: 'out',
    text: 'Ahhh das macht mich so glücklich! 🧡 Welches Rezept ist euer Liebling?'
  }, {
    side: 'in',
    name: 'Sarah',
    text: 'Die Protein-Pancakes. Jeden Sonntag Pflicht 🥞 Danke, dass du das gemacht hast.'
  }, {
    side: 'in',
    name: 'Bianca',
    text: 'Erste Woche durch, 2,3 kg weg und ich hatte NIE Hunger. Wie geht das bitte 🤍'
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--ms-cream)',
      padding: '88px 56px'
    }
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    kicker: "Echte Nachrichten"
  }, "Das schreiben mir Frauen jeden Tag"), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 560,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, msgs.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      justifyContent: m.side === 'out' ? 'flex-end' : 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: '78%',
      padding: '12px 16px',
      borderRadius: 18,
      borderBottomLeftRadius: m.side === 'in' ? 4 : 18,
      borderBottomRightRadius: m.side === 'out' ? 4 : 18,
      background: m.side === 'out' ? 'var(--ms-terracotta)' : 'var(--ms-white)',
      color: m.side === 'out' ? 'var(--ms-white)' : 'var(--ms-charcoal)',
      boxShadow: 'var(--ms-shadow-soft)'
    }
  }, m.name && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--ms-font-body)',
      fontWeight: 700,
      fontSize: 12,
      color: 'var(--ms-sage)',
      marginBottom: 3
    }
  }, m.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--ms-font-body)',
      fontSize: 14.5,
      lineHeight: 1.45
    }
  }, m.text))))));
}

// Long emotional founder story + stat band.
function AboutAuthor() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--ms-white)',
      padding: '88px 56px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '.85fr 1.15fr',
      gap: 72,
      maxWidth: 1120,
      margin: '0 auto',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/vanessa-essen.jpg",
    style: {
      width: '100%',
      aspectRatio: '4/5',
      objectFit: 'cover',
      borderRadius: 'var(--ms-radius-lg)',
      boxShadow: 'var(--ms-shadow-hero)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "ms-script",
    style: {
      position: 'absolute',
      bottom: -18,
      right: -10,
      background: 'var(--ms-white)',
      padding: '10px 22px',
      borderRadius: 999,
      fontSize: 24,
      color: 'var(--ms-terracotta)',
      boxShadow: 'var(--ms-shadow-lift)',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/vanessa-avatar.png",
    style: {
      width: 28,
      height: 28,
      borderRadius: 999,
      objectFit: 'cover'
    }
  }), " Deine Vanessa")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ms-eyebrow",
    style: {
      marginBottom: 12
    }
  }, "\xDCber die Autorin"), /*#__PURE__*/React.createElement("h2", {
    className: "ms-h1",
    style: {
      fontSize: 38,
      marginBottom: 20
    }
  }, "Ich war da, wo du vielleicht gerade stehst."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--ms-font-body)',
      fontSize: 16,
      lineHeight: 1.7,
      color: 'var(--ms-charcoal)',
      marginBottom: 16
    }
  }, "Zwei Kinder, ein voller Kopf und ein K\xF6rper, in dem ich mich nicht mehr wohlgef\xFChlt habe. 315 Di\xE4ten, jede einzelne gescheitert. Bis ich aufgeh\xF6rt habe, gegen meinen Hunger zu k\xE4mpfen \u2014 und angefangen habe, ", /*#__PURE__*/React.createElement("strong", null, "richtig"), " zu essen."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--ms-font-body)',
      fontSize: 16,
      lineHeight: 1.7,
      color: 'var(--ms-charcoal)',
      marginBottom: 28
    }
  }, "Heute helfe ich tausenden Mamas, denselben Weg zu gehen. Ohne Verzicht, ohne schlechtes Gewissen, mit Rezepten, die ins echte Leben passen."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 36,
      flexWrap: 'wrap'
    }
  }, [['−16 kg', 'in 80 Tagen'], ['5.000+', 'Frauen begleitet'], ['2', 'Bücher geschrieben']].map(([n, l]) => /*#__PURE__*/React.createElement("div", {
    key: l
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--ms-font-display)',
      fontSize: 40,
      fontWeight: 400,
      color: 'var(--ms-terracotta)',
      lineHeight: 1
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--ms-font-body)',
      fontSize: 13,
      color: 'var(--ms-muted)',
      marginTop: 6
    }
  }, l)))))));
}
function FinalCTA({
  onBuy
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--ms-blush)',
      padding: '96px 56px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 36
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ms-eyebrow",
    style: {
      marginBottom: 12
    }
  }, "Dein Neustart beginnt heute"), /*#__PURE__*/React.createElement("h2", {
    className: "ms-h1",
    style: {
      fontSize: 44,
      maxWidth: 680,
      margin: '0 auto'
    }
  }, "Schenk dir die n\xE4chsten 80 Tage."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--ms-font-body)',
      fontSize: 17,
      color: 'var(--ms-charcoal)',
      maxWidth: 520,
      margin: '16px auto 0',
      lineHeight: 1.6
    }
  }, "70 Rezepte. Ein Preis. Sofort-Download. Und die Sicherheit, dass du es diesmal nicht allein machst.")), /*#__PURE__*/React.createElement(ConversionBlock, {
    onBuy: onBuy
  }));
}
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--ms-ink)',
      color: 'var(--ms-sand)',
      padding: '56px 56px',
      fontFamily: 'var(--ms-font-body)',
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 28,
      maxWidth: 1120,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Logo, {
    height: 40,
    variant: "light"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      maxWidth: 320,
      lineHeight: 1.6,
      opacity: .8
    }
  }, "Nachhaltig abnehmen f\xFCr Mamas, die keine Zeit f\xFCr Di\xE4ten haben.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 48
    }
  }, [['Rechtliches', ['Impressum', 'Datenschutz', 'AGB']], ['Kontakt', ['hello@mamaspagat.de', 'Instagram', 'FAQ']]].map(([h, its]) => /*#__PURE__*/React.createElement("div", {
    key: h
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textTransform: 'uppercase',
      letterSpacing: '.16em',
      fontSize: 11,
      color: 'var(--ms-cream)',
      fontWeight: 600,
      marginBottom: 12
    }
  }, h), its.map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      marginBottom: 6,
      opacity: .8
    }
  }, i)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginTop: 40,
      fontSize: 11,
      opacity: .6,
      letterSpacing: '.1em',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6
    }
  }, "\xA9 2026 Vanessa Reinthaller \xB7 mama.spagat ", /*#__PURE__*/React.createElement(VerifiedBadge, {
    size: 12
  })));
}
Object.assign(window, {
  AnnounceBar,
  Header,
  Hero,
  VideoSection,
  WhatYouGet,
  PerfectForYou,
  BeforeAfter,
  ChatTestimonials,
  AboutAuthor,
  FinalCTA,
  Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sales_page/components.jsx", error: String((e && e.message) || e) }); }

})();
