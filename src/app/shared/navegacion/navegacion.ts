import { Component, DOCUMENT, ElementRef, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CodigoIdioma, IDIOMAS, Idioma, NOMBRES } from '../../core/idioma';
import { Tema } from '../../core/tema';
import { PROYECTOS } from '../../core/proyectos';
import { Salida } from '../salida/salida';

/**
 * Menú lateral al estilo de angular.dev: un riel angosto con íconos y, al
 * lado, un panel con el detalle de la sección elegida. En pantallas chicas el
 * riel pasa a ser una barra arriba y el panel se despliega encima del contenido.
 */
@Component({
  selector: 'app-navegacion',
  imports: [RouterLink, TranslatePipe, Salida],
  templateUrl: './navegacion.html',
  styleUrl: './navegacion.scss',
  host: {
    '(document:keydown.escape)': 'alEscape()',
    '(document:click)': 'alClickAfuera($event)',
  },
})
export class Navegacion {
  protected readonly tema = inject(Tema);
  protected readonly idioma = inject(Idioma);
  protected readonly proyectos = PROYECTOS;
  protected readonly idiomas = IDIOMAS;
  protected readonly nombres = NOMBRES;

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  /** En pantallas chicas el panel flota sobre el contenido. */
  private readonly angosto = inject(DOCUMENT).defaultView?.matchMedia('(max-width: 720px)');

  /** En escritorio arranca abierto: hoy el menú es solo la lista de proyectos. */
  protected readonly panelAbierto = signal(!this.angosto?.matches);

  protected readonly idiomaAbierto = signal(false);
  private readonly selectorIdioma = viewChild.required<ElementRef<HTMLElement>>('selectorIdioma');
  private readonly botonIdioma = viewChild.required<ElementRef<HTMLButtonElement>>('botonIdioma');

  protected alternarPanel(): void {
    this.panelAbierto.update((abierto) => !abierto);
  }

  protected alternarIdioma(): void {
    this.idiomaAbierto.update((abierto) => !abierto);
  }

  protected elegirIdioma(codigo: CodigoIdioma): void {
    this.idiomaAbierto.set(false);
    void this.idioma.elegir(codigo);
  }

  /** Esc cierra primero la lista de idiomas, que es lo que está más arriba. */
  protected alEscape(): void {
    if (this.idiomaAbierto()) {
      this.idiomaAbierto.set(false);
      this.botonIdioma().nativeElement.focus();
      return;
    }
    this.cerrarSiFlota();
  }

  protected alClickAfuera(evento: MouseEvent): void {
    const destino = evento.target as Node;
    if (!this.selectorIdioma().nativeElement.contains(destino)) {
      this.idiomaAbierto.set(false);
    }
    if (!this.host.nativeElement.contains(destino)) {
      this.cerrarSiFlota();
    }
  }

  private cerrarSiFlota(): void {
    if (this.angosto?.matches) {
      this.panelAbierto.set(false);
    }
  }
}
