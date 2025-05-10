import { Component, OnInit } from "@angular/core";
import { ChatService } from "../services/chat.service";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"],
})
export class ChatComponent implements OnInit {
  messages: any[] = [];
  messageText: string = "";
  username: string = "User"; // Você pode customizar ou capturar o username de outra forma

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.getMessages().subscribe((message) => {
      if (message) {
        this.messages.push(message);
      }
    });
  }

  sendMessage() {
    if (this.messageText.trim() !== "") {
      const message = {
        username: this.username,
        content: this.messageText,
        timestamp: new Date().toLocaleTimeString(),
      };
      this.chatService.sendMessage(message);
      this.messageText = "";
    }
  }

  simulateConversation() {
    const conversation = [
      { username: "Alice", content: "Oi, Bob!", timestamp: new Date().toLocaleTimeString() },
      { username: "Bob", content: "Olá, Alice! Tudo bem?", timestamp: new Date().toLocaleTimeString() },
      { username: "Alice", content: "Tudo sim, e com você?", timestamp: new Date().toLocaleTimeString() },
      { username: "Bob", content: "Também, obrigado!", timestamp: new Date().toLocaleTimeString() },
    ];

    conversation.forEach((msg, index) => {
      setTimeout(() => {
        this.chatService.sendMessage(msg);
      }, index * 2000); // Envia uma mensagem a cada 2 segundos
    });
  }
}
