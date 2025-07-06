import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface Message {
  id: number;
  senderId: string;
  receiverId: string;
  content: string;
  sentAt: string;
}

interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // página atual
}

@Injectable({ providedIn: "root" })
export class ChatService {
  constructor(private http: HttpClient) {}

  getConversation(userA: string, userB: string, page: number, size: number): Observable<Page<Message>> {
    return this.http.get<Page<Message>>(`/api/messages/conversation`, {
      params: { userA, userB, page: page.toString(), size: size.toString() },
    });

    // return this.http.get<Page<Message>>("/api/messages/conversation", {
    //   params: {
    //     userA: "user123",
    //     userB: "user456",
    //     page: 0,
    //     size: 20,
    //   },
    // });
  }
}
