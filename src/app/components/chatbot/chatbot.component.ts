import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  loading?: boolean;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Floating toggle button -->
    <button class="chat-toggle" (click)="toggle()" [class.open]="isOpen" title="Ask about Shivam">
      <span class="toggle-icon">{{ isOpen ? '✕' : '🤖' }}</span>
      <span class="toggle-label" *ngIf="!isOpen">Ask me anything</span>
    </button>

    <!-- Chat window -->
    <div class="chat-window" [class.visible]="isOpen">
      <div class="chat-header">
        <div class="chat-avatar">🤖</div>
        <div>
          <div class="chat-title">Shivam's AI Assistant</div>
          <div class="chat-sub">Powered by Llama 3.1 · NVIDIA NIM</div>
        </div>
        <div class="chat-status"><span class="status-dot"></span> Online</div>
      </div>

      <div class="chat-messages" #messagesContainer>
        <div class="msg-wrap" *ngFor="let msg of messages" [class.user]="msg.role === 'user'">
          <div class="msg" [class.user-msg]="msg.role === 'user'" [class.ai-msg]="msg.role === 'assistant'">
            <div *ngIf="msg.loading" class="typing-dots">
              <span></span><span></span><span></span>
            </div>
            <span *ngIf="!msg.loading">{{ msg.content }}</span>
          </div>
        </div>
      </div>

      <!-- Quick suggestions -->
      <div class="suggestions" *ngIf="messages.length <= 1">
        <button class="sug-btn" *ngFor="let s of suggestions" (click)="sendSuggestion(s)">{{ s }}</button>
      </div>

      <div class="chat-input-row">
        <input
          #inputRef
          type="text"
          class="chat-input"
          placeholder="Ask about skills, projects, experience..."
          [(ngModel)]="inputText"
          (keydown.enter)="send()"
          [disabled]="loading"
        />
        <button class="send-btn" (click)="send()" [disabled]="loading || !inputText.trim()">
          {{ loading ? '⏳' : '➤' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    /* Toggle button matching dark diorama glass styling */
    .chat-toggle {
      position: fixed;
      bottom: 32px; right: 32px;
      z-index: 10100;
      display: flex; align-items: center; gap: 10px;
      padding: 14px 20px;
      background: var(--glass-bg);
      border: 1px solid var(--cyan-light);
      border-radius: 50px;
      color: var(--cyan-light); font-size: 14px; font-weight: 700;
      cursor: pointer;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      box-shadow: 0 0 15px rgba(0, 212, 255, 0.15);
      transition: all 0.3s var(--ease);
    }
    .chat-toggle:hover {
      transform: translateY(-3px);
      box-shadow: 0 0 25px rgba(0, 212, 255, 0.3);
      background: rgba(245, 240, 232, 0.06);
    }
    .chat-toggle.open {
      padding: 14px 18px;
      background: rgba(245, 240, 232, 0.08);
      color: var(--surface-white);
      border-color: rgba(245, 240, 232, 0.2);
      box-shadow: none;
    }
    .toggle-icon { font-size: 18px; }
    .toggle-label { white-space: nowrap; }

    /* Chat window */
    .chat-window {
      position: fixed;
      bottom: 104px; right: 32px;
      width: 380px;
      max-height: 520px;
      border-radius: 18px;
      z-index: 10090;
      display: flex; flex-direction: column;
      background: rgba(13, 13, 13, 0.92);
      border: 1px solid rgba(245, 240, 232, 0.1);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
      opacity: 0; pointer-events: none;
      transform: translateY(20px) scale(0.95);
      transition: all 0.3s var(--ease);
      overflow: hidden;
    }
    .chat-window.visible {
      opacity: 1; pointer-events: all;
      transform: translateY(0) scale(1);
    }

    /* Header */
    .chat-header {
      display: flex; align-items: center; gap: 12px;
      padding: 16px 18px;
      background: rgba(0, 212, 255, 0.04);
      border-bottom: 1px solid rgba(245, 240, 232, 0.08);
    }
    .chat-avatar {
      width: 36px; height: 36px;
      background: rgba(0, 212, 255, 0.08);
      border: 1px solid rgba(0, 212, 255, 0.3);
      border-radius: 50%; display: flex; align-items: center;
      justify-content: center; font-size: 18px; flex-shrink: 0;
    }
    .chat-title { font-size: 14px; font-weight: 700; color: var(--surface-white); font-family: var(--font-display); }
    .chat-sub { font-size: 10px; color: rgba(245, 240, 232, 0.4); margin-top: 1px; font-family: var(--font-mono); }
    .chat-status { margin-left: auto; display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--cyan-light); font-family: var(--font-mono); }
    .status-dot { width: 6px; height: 6px; background: var(--cyan-light); border-radius: 50%; animation: pulse-dot 2s infinite; box-shadow: 0 0 6px var(--cyan-light); }

    /* Messages */
    .chat-messages {
      flex: 1; overflow-y: auto; padding: 16px;
      display: flex; flex-direction: column; gap: 10px;
      max-height: 300px;
      scrollbar-width: thin; scrollbar-color: rgba(0, 212, 255, 0.2) transparent;
    }
    .chat-messages::-webkit-scrollbar { width: 3px; }
    .chat-messages::-webkit-scrollbar-thumb { background: rgba(0, 212, 255, 0.2); border-radius: 2px; }
    .msg-wrap { display: flex; }
    .msg-wrap.user { justify-content: flex-end; }
    .msg {
      max-width: 80%; padding: 10px 14px;
      border-radius: 14px; font-size: 13px; line-height: 1.55;
    }
    .user-msg {
      background: rgba(0, 212, 255, 0.1);
      border: 1px solid rgba(0, 212, 255, 0.25);
      color: var(--surface-white); border-bottom-right-radius: 4px;
    }
    .ai-msg {
      background: rgba(245, 240, 232, 0.05);
      border: 1px solid rgba(245, 240, 232, 0.08);
      color: rgba(245, 240, 232, 0.85); border-bottom-left-radius: 4px;
    }

    /* Typing dots */
    .typing-dots { display: flex; gap: 4px; padding: 2px 0; }
    .typing-dots span {
      width: 6px; height: 6px;
      background: rgba(0, 212, 255, 0.5); border-radius: 50%;
      animation: typingBounce 1.2s infinite;
    }
    .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
    .typing-dots span:nth-child(3) { animation-delay: 0.4s; }

    /* Suggestions */
    .suggestions {
      padding: 8px 14px; display: flex; flex-wrap: wrap; gap: 6px;
      border-top: 1px solid rgba(245, 240, 232, 0.06);
    }
    .sug-btn {
      padding: 5px 12px;
      background: rgba(0, 212, 255, 0.04);
      border: 1px solid rgba(0, 212, 255, 0.2);
      border-radius: 20px; font-size: 11px; color: var(--cyan-light);
      cursor: pointer; transition: all 0.2s;
      font-family: var(--font-mono);
    }
    .sug-btn:hover { background: rgba(0, 212, 255, 0.1); transform: translateY(-1px); }

    /* Input */
    .chat-input-row {
      display: flex; gap: 8px; padding: 12px 14px;
      border-top: 1px solid rgba(245, 240, 232, 0.08);
      background: rgba(13, 13, 13, 0.95);
    }
    .chat-input {
      flex: 1; padding: 10px 14px;
      background: rgba(245, 240, 232, 0.03);
      border: 1px solid rgba(245, 240, 232, 0.1);
      border-radius: 10px; color: var(--surface-white); font-size: 13px;
      outline: none; transition: border-color 0.3s;
      font-family: var(--font-sans);
    }
    .chat-input:focus { border-color: rgba(0, 212, 255, 0.4); }
    .chat-input::placeholder { color: rgba(245, 240, 232, 0.25); }
    .chat-input:disabled { opacity: 0.5; }
    .send-btn {
      width: 40px; height: 40px;
      background: transparent;
      border: 1px solid var(--cyan-light);
      border-radius: 10px; color: var(--cyan-light);
      font-size: 16px; cursor: pointer; transition: all 0.3s;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 0 10px rgba(0, 212, 255, 0.05);
    }
    .send-btn:hover:not(:disabled) { transform: scale(1.05); background: var(--cyan-light); color: #000; }
    .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    @keyframes typingBounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-6px); }
    }
    @keyframes pulse-dot {
      0%, 100% { box-shadow: 0 0 0 0 rgba(0, 212, 255, 0.4); }
      50% { box-shadow: 0 0 0 5px rgba(0, 212, 255, 0); }
    }

    @media (max-width: 768px) {
      .chat-toggle {
        bottom: 24px;
        right: 24px;
      }
      .chat-window {
        bottom: 96px;
        right: 24px;
      }
    }

    @media (max-width: 480px) {
      .chat-window { width: calc(100vw - 32px); right: 16px; bottom: 80px; }
      .chat-toggle { right: 16px; bottom: 16px; }
      .toggle-label { display: none; }
    }
  `]
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('messagesContainer') private msgContainer!: ElementRef;

  isOpen = false;
  loading = false;
  inputText = '';

  messages: Message[] = [
    { role: 'assistant', content: "Hi! 👋 I'm Shivam's AI assistant. Ask me anything about his skills, experience, or projects!" }
  ];

  suggestions = ['What are his top skills?', 'Tell me about BBPS project', 'Is he available to hire?', 'What tech stack does he use?'];

  constructor(private http: HttpClient) {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  sendSuggestion(text: string) {
    this.inputText = text;
    this.send();
  }

  send() {
    const text = this.inputText.trim();
    if (!text || this.loading) return;

    this.messages.push({ role: 'user', content: text });
    this.inputText = '';
    this.loading = true;

    // Add loading placeholder
    const loadingMsg: Message = { role: 'assistant', content: '', loading: true };
    this.messages.push(loadingMsg);

    const history = this.messages
      .filter(m => !m.loading)
      .map(m => ({ role: m.role, content: m.content }));

    this.http.post<{ reply: string }>('/api/chat', { messages: history }).subscribe({
      next: (res) => {
        const idx = this.messages.indexOf(loadingMsg);
        if (idx !== -1) {
          this.messages[idx] = { role: 'assistant', content: res.reply };
        }
        this.loading = false;
      },
      error: () => {
        const idx = this.messages.indexOf(loadingMsg);
        if (idx !== -1) {
          this.messages[idx] = { role: 'assistant', content: "Sorry, I'm having trouble connecting right now. Please try again!" };
        }
        this.loading = false;
      }
    });
  }

  private scrollToBottom() {
    try {
      this.msgContainer.nativeElement.scrollTop = this.msgContainer.nativeElement.scrollHeight;
    } catch (e) {}
  }
}
