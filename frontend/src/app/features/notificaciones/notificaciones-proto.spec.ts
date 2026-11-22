import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificacionesProto } from './notificaciones-proto';

describe('NotificacionesProto', () => {
  let component: NotificacionesProto;
  let fixture: ComponentFixture<NotificacionesProto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificacionesProto]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NotificacionesProto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
