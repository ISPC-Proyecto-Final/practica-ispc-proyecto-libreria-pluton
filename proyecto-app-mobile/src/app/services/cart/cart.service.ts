import { Injectable } from '@angular/core';
import { Book, SelectedBookDto } from 'src/app/models/book/book-model';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Coupon } from 'src/app/models/coupon/coupon-model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private totalItems: number = 0;
  private totalCost: number = 0;
  private cart: SelectedBookDto[] = [];
  private cartUpdated = new BehaviorSubject<SelectedBookDto[]>([]);
  private totalItemsUpdated = new BehaviorSubject<number>(0);
  private totalCostUpdated = new BehaviorSubject<number>(0);

  private apiUrl = `${environment.API_URL}`;

  constructor(
    private http: HttpClient
  ) { }

  addBook(book: Book | SelectedBookDto) {
    let selectedBook: SelectedBookDto = {
      id_book: book.id_book,
      isbn: book.isbn,
      title: book.title,
      author: book.author,
      book_cover: book.book_cover,
      price: book.price,
      selectedAmount: 0,
    };

    selectedBook = this.cart.find((item) => item.isbn === book.isbn) || selectedBook;
    const subscription = this.cart.find((item) => item.id_book === book.id_book);

    if (selectedBook.id_book === -1 && subscription) {
      return;
    }

    if (selectedBook.selectedAmount > 0) {
      selectedBook.selectedAmount += 1;
    } else {
      selectedBook.selectedAmount += 1;
      this.cart.push(selectedBook);
    }

    this.updatetTotalQuantity();
    this.updatedTotalCost();
    this.cartUpdated.next([...this.cart]);
  }

  removeCopy(isbn: string) {
    let selectedBook = this.cart.find((item) => item.isbn === isbn);

    if (!selectedBook) {
      return;
    }

    selectedBook.selectedAmount -= 1;

    if (!selectedBook.selectedAmount) {
      this.cart = this.cart.filter((item) => item.isbn !== isbn);
    }
    this.updatetTotalQuantity();
    this.updatedTotalCost();
    this.cartUpdated.next([...this.cart]);
  }

  removeBook(isbn: string) {
    let selectedBook = this.cart.find((item) => item.isbn === isbn);

    if (!selectedBook) {
      return;
    }

    this.cart = this.cart.filter((item) => item.isbn !== isbn);

    this.updatetTotalQuantity();
    this.updatedTotalCost();
    this.cartUpdated.next([...this.cart]);
  }

  clearCart() {
    this.cart = [];
    this.updatetTotalQuantity();
    this.updatedTotalCost();
    this.cartUpdated.next([...this.cart]);
  }

  updatetTotalQuantity() {
    this.totalItems = this.cart.reduce((partialSum, book) => {
      return partialSum + book.selectedAmount;
    }, 0);

    this.totalItemsUpdated.next(this.totalItems);
  }

  updatedTotalCost() {
    this.totalCost = parseFloat(this.cart.reduce((partialSum, book) => {
      return partialSum + Number(book.price) * book.selectedAmount;
    }, 0).toFixed(3));

    this.totalCostUpdated.next(this.totalCost);
  }

  makeDiscount(discountPercent: number) {
    this.totalCost = parseFloat(this.cart.reduce((partialSum, book) => {
      return partialSum + Number(book.price) * book.selectedAmount;
    }, 0).toFixed(3));

    const discount = discountPercent / 100;
    const discountedCost = this.totalCost * (1 - discount);

    this.totalCost = discountedCost;

    this.totalCostUpdated.next(this.totalCost);
  }

  getcartUpdatedListener() {
    return this.cartUpdated.asObservable();
  }

  getTotalItemsListener() {
    return this.totalItemsUpdated.asObservable();
  }

  getTotalCostListener() {
    return this.totalCostUpdated.asObservable();
  }

  getAllCoupons() {
    const url = `${this.apiUrl}/coupons/`;
    return this.http.get<Coupon[]>(url);
  }
}
