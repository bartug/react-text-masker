# react-text-masker

> Mask **every** text node in your React app until the user is authorised.  
> Perfect for demos, screenshots, or zero‑trust layouts.

---

## ✨ Features

- **Global masking** – walks the entire DOM and obfuscates each text node.
- **Instant toggle** – flip one boolean (`authorized`) and the original text re‑appears.
- **Configurable** – choose the mask character and how many leading chars remain visible.
- **Tiny & tree‑shakable** – TypeScript, ESM + CJS bundles, no external deps except React.

---

## 🔧 Installation

```bash
npm install react-text-masker
# or
yarn add react-text-masker
```

---

## ⚡ Quick start

```tsx
import React, { useState } from 'react';
import { TextMaskProvider } from 'react-text-masker';

function App() {
  const [isAuth, setIsAuth] = useState(false);

  return (
    <div>
      <button onClick={() => setIsAuth(!isAuth)}>
        Toggle Auth (Current: {isAuth ? 'Authorized' : 'Not Authorized'})
      </button>

      {/* Everything inside the provider is masked until authorised */}
      <TextMaskProvider authorized={isAuth} maskChar="#" visibleChars={2}>
        <h1>Bu başlıkta maskelenecek mi?</h1>
        <p>Sayfadaki tüm textler maskelenecek.</p>
      </TextMaskProvider>
    </div>
  );
}

export default App;
```

---

## 📚 API

| Prop          | Type      | Default | Description                                                              |
| ------------- | --------- | ------- | ------------------------------------------------------------------------ |
| `authorized`  | `boolean` | —       | `false` masks text, `true` restores the original content.                |
| `maskChar`    | `string`  | `"*"`   | Character used to replace hidden letters.                                |
| `visibleChars`| `number`  | `0`     | How many leading characters remain visible **per text node**.            |

---

## 🛠 Local development

```bash
git clone https://github.com/<your‑user>/react-text-masker.git
cd react-text-masker
npm install          # install dev deps (tsup, typescript, @types/react)
npm run build        # outputs CJS + ESM bundles and .d.ts into /dist
```

### Linking into another app

```bash
# in react-text-masker/
npm link

# in your test React project
npm link react-text-masker
```

Now you can import the provider and live‑reload changes while you hack on the library.

---

## ⚠️ Caveats

* The provider walks **every** text node; on huge, highly‑dynamic pages you may see a small performance hit.
* SVG `<text>` nodes aren’t affected.
* Masking happens client‑side only; never ship secrets in server‑rendered HTML.

---

## 📄 License

MIT © Bartuğ Sevindik
