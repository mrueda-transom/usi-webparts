import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialPopoverComponent } from './social-popover.component';

describe('SocialPopoverComponent', () => {
  let component: SocialPopoverComponent;
  let fixture: ComponentFixture<SocialPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
