import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  AfterViewChecked,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatgptService } from './chatgpt.service';

@Component({
  standalone: true,
  selector: 'app-door-east-gpt',
  imports: [CommonModule, FormsModule],
  templateUrl: './door-east-gpt.component.html',
  styleUrls: ['./door-east-gpt.component.css'],
})
export class DoorEastGPTComponent
  implements AfterViewChecked, OnInit, OnDestroy
{
  chatOpen = false;
  userInput = '';
  messages: { role: 'user' | 'assistant'; content: string }[] = [];
  loading = false;
  isMobile = false;

  ngOnInit() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile.bind(this));
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.checkMobile.bind(this));
  }

  checkMobile() {
    this.isMobile = window.innerWidth <= 576;
  }

  constructor(private chatService: ChatgptService) {}

  @ViewChild('chatBody') private chatBody!: ElementRef;
  @ViewChild('chatBox') private chatBox!: ElementRef;

  toggleChat() {
    this.chatOpen = !this.chatOpen;
    if (this.chatOpen) {
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  clearChat() {
    this.messages = [];
    this.userInput = '';
  }

  sendMessage() {
    const text = this.userInput.trim();
    if (!text) return;

    this.messages.push({ role: 'user', content: text });
    this.userInput = '';
    this.loading = true;

    this.chatService.sendMessage(text).subscribe({
      next: (res) => {
        const reply = res.choices[0].message.content;
        this.messages.push({ role: 'assistant', content: reply });
        this.loading = false;
        this.scrollToBottom();
      },
      error: (err) => {
        console.error('ChatGPT API error:', err);
        this.messages.push({
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
        });
        this.loading = false;
        this.scrollToBottom();
      },
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      if (this.chatBody) {
        this.chatBody.nativeElement.scrollTop =
          this.chatBody.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error(err);
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    if (this.chatOpen) {
      this.chatOpen = false;
    }
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

  @ViewChild('userInputBox') userInputBox!: ElementRef;
  fillInput(text: string) {
    this.userInput = text;
    setTimeout(() => {
      this.userInputBox.nativeElement.focus();
    }, 0);
  }
}
