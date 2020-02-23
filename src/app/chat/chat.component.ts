import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const dialogflowURL = '';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  messages = [];
  loading = false;

  sessionId = Math.random().toString(36).slice(-5);

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.displayBotMessage('Human presence detected 🤖. How can I help you? ');
  }

  handleUserMessage(event) {
    const text = event.message;
    this.displayUserMessage(text);

    this.loading = true;

    this.http.post<any>(
      dialogflowURL,
      {
        sessionId: this.sessionId,
        queryInput: {
          text: {
            text,
            languageCode: 'en-US'
          }
        }
      }
    )
    .subscribe(res => {
      const { fulfillmentText } = res;
      this.displayBotMessage(fulfillmentText);
      this.loading = false;
    });
  }

  displayUserMessage(text) {
    this.messages.push({
      text,
      sender: 'You',
      avatar: '/assets/user.png',
      reply: true,
      date: new Date()
    });
  }

  displayBotMessage(text) {
    this.messages.push({
      text,
      sender: 'Bot',
      avatar: '/assets/bot.png',
      date: new Date()
    });
  }
}
