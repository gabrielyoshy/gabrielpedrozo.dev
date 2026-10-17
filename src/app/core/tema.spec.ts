import { TestBed } from '@angular/core/testing';
import { Tema } from './tema';

describe('Tema', () => {
  beforeEach(() => localStorage.clear());

  it('alterna, aplica el modo al documento y lo recuerda', async () => {
    const tema = TestBed.inject(Tema);
    const inicial = tema.modo();

    tema.alternar();
    TestBed.tick();

    const nuevo = inicial === 'oscuro' ? 'claro' : 'oscuro';
    expect(tema.modo()).toBe(nuevo);
    expect(document.documentElement.dataset['tema']).toBe(nuevo);
    expect(localStorage.getItem('tema')).toBe(nuevo);
  });
});
