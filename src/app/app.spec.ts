import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes), provideTranslateService()],
    }).compileComponents();
  });

  it('muestra el menú con el acceso a Momentos', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const enlace = (fixture.nativeElement as HTMLElement).querySelector<HTMLAnchorElement>(
      '#panel-proyectos a',
    );
    expect(enlace?.href).toContain('momentos.gabrielpedrozo.dev');
  });
});
