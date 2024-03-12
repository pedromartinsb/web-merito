import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Output() openForm = new EventEmitter<void>();
  @Output() validateFields = new EventEmitter<void>();

  title: string = "";
  subtitle: string = "";
  content: string = "";
  modelId: string = "";

  constructor() { }

  ngOnInit(): void {
  }

}
