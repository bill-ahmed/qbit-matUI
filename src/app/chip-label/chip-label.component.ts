import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-chip-label',
  templateUrl: './chip-label.component.html',
  styleUrls: ['./chip-label.component.css']
})
export class ChipLabelComponent implements OnChanges {
  @Input() label: string = '';
  public isDarkTheme: Observable<boolean>;

  constructor(private theme: ThemeService) { }

  ngOnInit(): void {
    this.isDarkTheme = this.theme.getThemeSubscription();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.label)
      this.label = changes.label.currentValue;
  }

}
