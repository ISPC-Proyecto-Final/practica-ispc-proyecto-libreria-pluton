import { Component, OnInit, OnDestroy } from '@angular/core';
import { CreateUserDTO, User } from 'src/app/models/user/user-model';
import { UserService } from 'src/app/services/user/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddressFormComponent } from '../address-form/address-form.component';
import { PersonalDataFormComponent } from '../personal-data-form/personal-data-form.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription, catchError, tap } from 'rxjs';
import { Sale } from 'src/app/models/sale/sale-model';
import { Purchase } from 'src/app/models/user/purchase-model';
import { ToastService } from 'src/app/services/utils/toast.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { NavigationService } from 'src/app/services/navigation/navigation.service';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})


export class AccountDetailsComponent implements OnInit, OnDestroy {
  personalData!: CreateUserDTO;
  purchaseData!: Sale[];
  profile: User | null = null;
  userDataSub!: Subscription

  constructor(
    private userService: UserService,
    private modalService: NgbModal,
    private authService: AuthService,
    private toastService: ToastService,
    private cartService : CartService,
    private navigationService : NavigationService
  ) { }


  ngOnInit() {
    this.getUserData();
    this.authService.getProfileListener().subscribe((profile: User | null) => {
      if (profile) {
        this.profile = { ...profile };
        this.loadUserPurchases();
      }
    });
  }

  ngOnDestroy(): void {
    this.userDataSub.unsubscribe();
  }

  getUserData() {
    this.userDataSub = this.authService.getProfileListener()
      .subscribe(user => {
        console.log('Get usuario', user)
        this.profile = user;
      });
  }


  loadUserPurchases() {
    if (this.profile === null) {
      return

    }
    this.authService.getBookPurchases(this.profile.id_user)
      .subscribe((purchases: Sale[]) => {
        this.purchaseData = purchases;
        console.log('Get purchase user', this.purchaseData)
      });
  }

  onEditAddress() {
    const modalRef = this.modalService.open(AddressFormComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.addressData = { ...this.profile };
    console.log('Addres form', this.profile)
    modalRef.componentInstance.addressUpdated.subscribe((updateData: User) => {
      this.profile = { ...updateData };
      console.log('Put address usuario', this.profile)
      this.authService.updateProfileListener(this.profile);
    });
  }

  onEditPersonalData() {
    const modalRef = this.modalService.open(PersonalDataFormComponent, {
      size: 'lg',
      centered: true,
    });
    console.log(this.profile);
    modalRef.componentInstance.data = { ...this.profile };
    modalRef.componentInstance.dataUpdated.subscribe((updateData: User) => {
      this.profile = { ...updateData };
      console.log('Put usuario', this.profile)
      this.authService.updateProfileListener(this.profile);
    });
  }


  onDeleteAccount() {
    this.authService.deleteAccount()
      .pipe(tap(response => {
        console.log('Cuenta dada de baja', response);
        this.toastService.createToast({ type: 'bg-success', delay: 4000, message: 'La cuenta se dio de baja exitosamente' });
        this.logout();
      }), catchError(error => {
          console.log('Error al dar de baja la cuenta', error);
          this.toastService.createToast({ type: 'bg-danger', delay: 4000, message: 'Error al dar de baja la cuenta' });
          throw error;
        })
      ).subscribe();
  }

  logout() {
    this.authService.logoutUser().subscribe((response: boolean) => {
      if (!response) {
        return;
      }
      this.authService.clearProfile();
      this.cartService.clearCart();
      this.navigationService.navigateToHome();
    });
  }
}
