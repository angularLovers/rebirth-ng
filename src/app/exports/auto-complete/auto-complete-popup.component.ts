import { Component, Input, TemplateRef, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RebirthNGConfig } from '../rebirth-ng.config';
import { AnimationEvent } from '@angular/animations';
import { SCALE_ANIMATIONS } from '../utils/animation-utils';

@Component({
  selector: 're-auto-complete-popup',
  templateUrl: './auto-complete-popup.component.html',
  host: {
    '[class]': '"dropdown-menu "  +  (cssClass ? cssClass : "")',
    '[style.display]': 'isOpen && (source?.length || noResultItemTemplate) ? "inline-block" : "none"',
    '[@state]': "animateState",
    '(@state.done)': "afterVisibilityAnimation($event)"
  },
  styleUrls: ['./auto-complete-popup.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AutoCompletePopupComponent),
    multi: true
  }],
  animations: SCALE_ANIMATIONS
})
export class AutoCompletePopupComponent implements ControlValueAccessor {
  activeIndex = 0;
  @Input() cssClass: string;
  @Input() disabled: boolean;
  @Input() source: any[];
  @Input() isOpen: boolean;
  @Input() term: string;
  @Input() itemTemplate: TemplateRef<any>;
  @Input() noResultItemTemplate: TemplateRef<any>;
  @Input() formatter: (item: any) => string;
  animateState = 'initial';

  private value: any;
  private onChange = (_: any) => null;
  private onTouched = () => null;

  constructor(private rebirthUIConfig: RebirthNGConfig) {
    this.formatter = rebirthUIConfig.autoComplete.formatter;
  }

  writeValue(obj: any): void {
    this.value = obj;
  }

  show() {
    if (!this.isOpen) {
      this.isOpen = true;
      this.animateState = 'visible';
    }
  }

  hide() {
    if (this.isOpen) {
      this.animateState = 'hidden';
    }
  }

  afterVisibilityAnimation(e: AnimationEvent) {
    if (e.toState === 'hidden' && this.isOpen) {
      this.isOpen = false;
    }
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onSelect(item: any) {
    this.value = item;
    this.onTouched();
    this.onChange(this.value);
  }

  selectCurrentItem() {
    if (this.source && this.source.length) {
      this.onSelect(this.source[this.activeIndex]);
    }
  }

  onActiveIndexChange(index) {
    this.activeIndex = index;
  }

  reset() {
    this.activeIndex = 0;
  }

  next() {
    if (this.isOpen && this.source && this.source.length) {
      if (this.activeIndex === this.source.length - 1) {
        this.activeIndex = 0;
        return;
      }
      this.activeIndex = this.activeIndex + 1;
    }
  }

  prev() {
    if (this.isOpen && this.source && this.source.length) {
      if (this.activeIndex === 0) {
        this.activeIndex = this.source.length - 1;
        return;
      }
      this.activeIndex = this.activeIndex - 1;
    }
  }
}
