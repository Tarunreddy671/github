import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const dialogflowURL = 'https://us-central1-pizza-bot-lqrjjy.cloudfunctions.net/dialogflowGateway';

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
    this.displayBotMessage('Welcome to Yo Yo Pizza. You can either place an ORDER or know the STATUS of your order. :)');
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
