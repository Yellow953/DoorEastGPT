import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyCardComponent } from './property-card/property-card.component';
import { AgencyCardComponent } from './agency-card/agency-card.component';

@Component({
  standalone: true,
  selector: 'app-door-east-gpt',
  imports: [
    CommonModule,
    FormsModule,
    PropertyCardComponent,
    AgencyCardComponent,
  ],
  templateUrl: './door-east-gpt.component.html',
  styleUrls: ['./door-east-gpt.component.css'],
})
export class DoorEastGPTComponent {
  chatOpen = false;
  userInput = '';

  @ViewChild('chatBox') chatBox!: ElementRef;

  toggleChat() {
    this.chatOpen = !this.chatOpen;
  }

  clearChat() {
    this.userInput = '';
  }

  sendMessage() {
    // Your send logic here
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (
      this.chatOpen &&
      this.chatBox &&
      !this.chatBox.nativeElement.contains(event.target)
    ) {
      this.chatOpen = false;
    }
  }
}
