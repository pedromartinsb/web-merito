import { Injectable } from "@angular/core";
import { Client, IMessage } from "@stomp/stompjs";
import * as SockJS from "sockjs-client";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  private stompClient: Client;
  private messageSubject: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() {
    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection() {
    this.stompClient = new Client({
      // Define a fábrica de WebSocket para usar SockJS
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      // Função de debug opcional
      debug: (str) => {
        console.log(str);
      },
      // Tempo para reconexão em milissegundos
      reconnectDelay: 5000,
    });

    this.stompClient.onConnect = (frame) => {
      this.stompClient.subscribe("/topic/messages", (message: IMessage) => {
        if (message.body) {
          this.messageSubject.next(JSON.parse(message.body));
        }
      });
    };

    this.stompClient.activate();
  }

  sendMessage(message: any) {
    this.stompClient.publish({
      destination: "/app/chat",
      body: JSON.stringify(message),
    });
  }

  getMessages(): Observable<any> {
    return this.messageSubject.asObservable();
  }
}
