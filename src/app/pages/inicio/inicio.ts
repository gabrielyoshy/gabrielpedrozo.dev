import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PROYECTOS, dominio } from '../../core/proyectos';

@Component({
  selector: 'app-inicio',
  imports: [TranslatePipe],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
})
export class Inicio {
  protected readonly proyectos = PROYECTOS;
  protected readonly dominio = dominio;
}
