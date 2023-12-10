import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelavePostComponent } from './relave-post.component';

describe('RelavePostComponent', () => {
  let component: RelavePostComponent;
  let fixture: ComponentFixture<RelavePostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RelavePostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RelavePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
