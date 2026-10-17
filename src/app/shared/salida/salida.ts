import { Directive, DOCUMENT, ElementRef, inject, input } from '@angular/core';
import { Proyecto } from '../../core/proyectos';

/**
 * Transición al abrir un proyecto. Una view transition de verdad no sirve:
 * cada proyecto vive en su propio subdominio y el navegador solo anima entre
 * páginas del mismo origen. Así que se arma en dos mitades:
 *
 * 1. Acá, un velo con el color de fondo del proyecto crece desde el enlace
 *    hasta cubrir la pantalla, y recién entonces se navega.
 * 2. El proyecto, si llega desde esta página, arranca de ese mismo color y
 *    descubre su contenido (en Momentos: index.html y styles.scss).
 *
 * Con Ctrl/Cmd, clic del medio o movimiento reducido, el enlace se comporta
 * como uno común.
 */
@Directive({
  selector: 'a[appSalida]',
  host: { '(click)': 'alClick($event)' },
})
export class Salida {
  readonly appSalida = input.required<Proyecto>();

  private readonly enlace = inject<ElementRef<HTMLAnchorElement>>(ElementRef).nativeElement;
  private readonly documento = inject(DOCUMENT);

  protected alClick(evento: MouseEvent): void {
    const ventana = this.documento.defaultView;
    const comun =
      evento.button !== 0 || evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey;
    if (!ventana || comun || ventana.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    evento.preventDefault();

    const proyecto = this.appSalida();
    // El proyecto sigue el modo del sistema, no el tema elegido acá.
    const oscuro = ventana.matchMedia('(prefers-color-scheme: dark)').matches;
    const velo = this.documento.createElement('div');
    velo.className = 'velo-salida';
    velo.style.background = oscuro ? proyecto.fondo.oscuro : proyecto.fondo.claro;
    this.documento.body.append(velo);

    // El velo cubre la pantalla desde el principio y se recorta con
    // clip-path: así crece sin recalcular el layout en cada cuadro.
    const r = this.enlace.getBoundingClientRect();
    const radio = getComputedStyle(this.enlace).borderRadius;
    const desde = `inset(${r.top}px ${ventana.innerWidth - r.right}px ${ventana.innerHeight - r.bottom}px ${r.left}px round ${radio})`;
    const animacion = velo.animate(
      [
        { clipPath: desde, opacity: 0 },
        { clipPath: desde, opacity: 1, offset: 0.15 },
        { clipPath: 'inset(0 round 0)', opacity: 1 },
      ],
      { duration: 520, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'forwards' },
    );

    const navegar = () => ventana.location.assign(proyecto.url);
    animacion.finished.then(navegar, navegar);

    // Al volver con "atrás", el navegador puede restaurar esta página tal
    // como quedó (bfcache), con el velo tapándolo todo.
    ventana.addEventListener('pageshow', () => velo.remove(), { once: true });
  }
}
