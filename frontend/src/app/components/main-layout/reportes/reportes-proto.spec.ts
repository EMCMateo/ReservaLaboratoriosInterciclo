import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportesProto } from './reportes-proto';

describe('ReportesProto', () => {
  let component: ReportesProto;
  let fixture: ComponentFixture<ReportesProto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportesProto]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ReportesProto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
