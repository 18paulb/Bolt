import {Component} from '@angular/core';
import {lastValueFrom} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-abandoned-cart-builder',
  templateUrl: './abandoned-cart-builder.component.html',
  styleUrls: ['./abandoned-cart-builder.component.css']
})
export class AbandonedCartBuilderComponent {

  constructor(private http: HttpClient) {
  }

  async sendAbandonedCart() {
    await lastValueFrom(this.http.post("http://localhost:3000/sendAbandonedCart", {}))
  }
}


interface CartItem {
  name: string,
  price: number,
  image: string
}
