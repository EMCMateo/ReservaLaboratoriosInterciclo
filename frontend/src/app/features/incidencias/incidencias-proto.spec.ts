import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncidenciasProto } from './incidencias-proto';

describe('IncidenciasProto', () => {
  let component: IncidenciasProto;
  let fixture: ComponentFixture<IncidenciasProto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidenciasProto]
    })
      .compileComponents();

    fixture = TestBed.createComponent(IncidenciasProto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
