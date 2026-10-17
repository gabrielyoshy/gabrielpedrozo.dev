import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navegacion } from './shared/navegacion/navegacion';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navegacion],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
