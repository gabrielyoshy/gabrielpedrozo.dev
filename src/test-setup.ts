// jsdom no trae matchMedia. Este reemplazo responde siempre "no coincide":
// pantalla ancha y sistema en modo claro.
window.matchMedia ??= (query: string) =>
  ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }) as unknown as MediaQueryList;
