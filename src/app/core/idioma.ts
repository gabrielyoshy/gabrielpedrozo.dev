import { DOCUMENT, Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

export const IDIOMAS = ['es', 'de'] as const;
export type CodigoIdioma = (typeof IDIOMAS)[number];

const POR_DEFECTO: CodigoIdioma = 'es';
const CLAVE = 'idioma';

@Injectable({ providedIn: 'root' })
export class Idioma {
  private readonly traductor = inject(TranslateService);
  private readonly documento = inject(DOCUMENT);

  readonly actual = signal<CodigoIdioma>(POR_DEFECTO);

  /**
   * Corre una vez al arrancar. Angular espera la promesa antes del primer
   * render, así no se ven las claves crudas por un instante.
   *
   * Prioridad: lo que eligió el usuario > idioma del navegador > español.
   */
  async iniciar(): Promise<void> {
    this.traductor.addLangs([...IDIOMAS]);
    this.traductor.setFallbackLang(POR_DEFECTO);
    await this.usar(leerGuardado() ?? normalizar(this.traductor.getBrowserLang()), false);
  }

  /** Con dos idiomas, el botón del menú simplemente pasa al otro. */
  alternar(): Promise<void> {
    return this.usar(this.actual() === 'es' ? 'de' : 'es');
  }

  private async usar(codigo: CodigoIdioma, recordar = true): Promise<void> {
    await firstValueFrom(this.traductor.use(codigo));
    this.actual.set(codigo);
    // El lang del documento sigue al idioma real: lo usan los lectores de
    // pantalla, la separación en sílabas y el traductor del navegador.
    this.documento.documentElement.lang = codigo;
    if (recordar) {
      guardar(codigo);
    }
  }
}

/** "de-AT" → "de". Lo que no está soportado cae al idioma por defecto. */
function normalizar(valor: string | undefined): CodigoIdioma {
  const base = (valor ?? '').slice(0, 2).toLowerCase();
  return esSoportado(base) ? base : POR_DEFECTO;
}

function esSoportado(valor: string): valor is CodigoIdioma {
  return (IDIOMAS as readonly string[]).includes(valor);
}

function leerGuardado(): CodigoIdioma | null {
  try {
    const valor = localStorage.getItem(CLAVE);
    return valor && esSoportado(valor) ? valor : null;
  } catch {
    return null;
  }
}

function guardar(codigo: CodigoIdioma): void {
  try {
    localStorage.setItem(CLAVE, codigo);
  } catch {
    // Sin almacenamiento, la elección dura lo que la pestaña.
  }
}
