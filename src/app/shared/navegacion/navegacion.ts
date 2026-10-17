import { Component, DOCUMENT, ElementRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Idioma } from '../../core/idioma';
import { Tema } from '../../core/tema';
import { PROYECTOS } from '../../core/proyectos';

/**
 * Menú lateral al estilo de angular.dev: un riel angosto con íconos y, al
 * lado, un panel con el detalle de la sección elegida. En pantallas chicas el
 * riel pasa a ser una barra arriba y el panel se despliega encima del contenido.
 */
@Component({
  selector: 'app-navegacion',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './navegacion.html',
  styleUrl: './navegacion.scss',
  host: {
    '(document:keydown.escape)': 'cerrarSiFlota()',
    '(document:click)': 'alClickAfuera($event)',
  },
})
export class Navegacion {
  protected readonly tema = inject(Tema);
  protected readonly idioma = inject(Idioma);
  protected readonly proyectos = PROYECTOS;

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  /** En pantallas chicas el panel flota sobre el contenido. */
  private readonly angosto = inject(DOCUMENT).defaultView?.matchMedia('(max-width: 720px)');

  /** En escritorio arranca abierto: hoy el menú es solo la lista de proyectos. */
  protected readonly panelAbierto = signal(!this.angosto?.matches);

  protected alternarPanel(): void {
    this.panelAbierto.update((abierto) => !abierto);
  }

  protected cerrarSiFlota(): void {
    if (this.angosto?.matches) {
      this.panelAbierto.set(false);
    }
  }

  protected alClickAfuera(evento: MouseEvent): void {
    if (!this.host.nativeElement.contains(evento.target as Node)) {
      this.cerrarSiFlota();
    }
  }
}
