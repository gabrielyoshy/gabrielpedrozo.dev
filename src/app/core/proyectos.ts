export interface Proyecto {
  /** Identificador; la descripción se busca en i18n como `proyectos.<id>`. */
  id: string;
  nombre: string;
  url: string;
}

/** Índice de proyectos. Al sumar uno nuevo, agregarlo acá y en public/i18n/. */
export const PROYECTOS: readonly Proyecto[] = [
  { id: 'momentos', nombre: 'Momentos', url: 'https://momentos.gabrielpedrozo.dev' },
];

/** La URL sin protocolo, para mostrarla. */
export function dominio(url: string): string {
  return url.replace(/^https?:\/\//, '');
}
