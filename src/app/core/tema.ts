import {
  ApplicationRef,
  DOCUMENT,
  Injectable,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';

export type Modo = 'claro' | 'oscuro';

const CLAVE = 'tema';
const DURACION_MS = 650;

/**
 * Modo claro u oscuro de la página. Sigue al sistema hasta que el usuario
 * elige uno; desde ahí se recuerda. El script de index.html aplica el mismo
 * criterio antes de que arranque Angular.
 */
@Injectable({ providedIn: 'root' })
export class Tema {
  private readonly documento = inject(DOCUMENT);
  private readonly app = inject(ApplicationRef);
  private readonly ventana = this.documento.defaultView;
  private readonly consulta = this.ventana?.matchMedia('(prefers-color-scheme: dark)');

  /** Lo que eligió el usuario; null mientras se sigue al sistema. */
  private readonly elegido = signal<Modo | null>(leerGuardado());
  private readonly delSistema = signal<Modo>(this.consulta?.matches ? 'oscuro' : 'claro');

  readonly modo = computed(() => this.elegido() ?? this.delSistema());

  constructor() {
    this.consulta?.addEventListener('change', (e) =>
      this.delSistema.set(e.matches ? 'oscuro' : 'claro'),
    );
    effect(() => {
      this.documento.documentElement.dataset['tema'] = this.modo();
    });
  }

  /**
   * Cambia de modo. Si se pasa el elemento que lo disparó, el modo nuevo se
   * abre en círculo desde ahí hasta cubrir la pantalla.
   */
  alternar(origen?: HTMLElement): void {
    const siguiente: Modo = this.modo() === 'oscuro' ? 'claro' : 'oscuro';
    const aplicar = () => {
      this.elegido.set(siguiente);
      // Dentro de la transición el DOM tiene que quedar listo ya: el
      // navegador saca la foto del estado nuevo apenas vuelve esta función.
      this.documento.documentElement.dataset['tema'] = siguiente;
      this.app.tick();
    };

    const raiz = this.documento.documentElement;
    const sinMovimiento = this.ventana?.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!origen || !this.documento.startViewTransition || sinMovimiento) {
      aplicar();
    } else {
      const { x, y } = centro(origen);
      const { innerWidth: ancho, innerHeight: alto } = this.ventana!;
      // Hasta la esquina más lejana, para que el círculo tape todo.
      const radio = Math.hypot(Math.max(x, ancho - x), Math.max(y, alto - y));

      raiz.classList.add('cambiando-tema');
      const transicion = this.documento.startViewTransition(aplicar);
      transicion.ready.then(() =>
        raiz.animate(
          {
            clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radio}px at ${x}px ${y}px)`],
          },
          {
            duration: DURACION_MS,
            easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
            pseudoElement: '::view-transition-new(root)',
          },
        ),
      );
      transicion.finished.finally(() => raiz.classList.remove('cambiando-tema'));
    }

    try {
      localStorage.setItem(CLAVE, siguiente);
    } catch {
      // Sin almacenamiento (modo privado, cookies bloqueadas) el cambio
      // vale igual para esta visita.
    }
  }
}

function centro(elemento: HTMLElement): { x: number; y: number } {
  const caja = elemento.getBoundingClientRect();
  return { x: caja.left + caja.width / 2, y: caja.top + caja.height / 2 };
}

function leerGuardado(): Modo | null {
  try {
    const valor = localStorage.getItem(CLAVE);
    return valor === 'claro' || valor === 'oscuro' ? valor : null;
  } catch {
    return null;
  }
}
