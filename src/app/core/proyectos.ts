export interface Proyecto {
  /** Identificador; la descripción se busca en i18n como `proyectos.<id>`. */
  id: string;
  nombre: string;
  url: string;
  /**
   * Color de fondo del proyecto en cada modo. Lo usa la transición de salida
   * (shared/salida) para terminar en el mismo color con que arranca el
   * proyecto. Si el proyecto cambia su fondo, hay que actualizarlo acá.
   */
  fondo: { claro: string; oscuro: string };
}

/** Índice de proyectos. Al sumar uno nuevo, agregarlo acá y en public/i18n/. */
export const PROYECTOS: readonly Proyecto[] = [
  {
    id: 'momentos',
    nombre: 'Momentos',
    url: 'https://momentos.gabrielpedrozo.dev',
    // --bg en momentos/frontend/src/styles.scss.
    fondo: { claro: '#fdfaf7', oscuro: '#17141a' },
  },
];

/** La URL sin protocolo, para mostrarla. */
export function dominio(url: string): string {
  return url.replace(/^https?:\/\//, '');
}
