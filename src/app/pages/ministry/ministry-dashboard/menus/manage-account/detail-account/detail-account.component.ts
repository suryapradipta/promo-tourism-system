import { Component, OnInit } from '@angular/core';
import { MerchantModel } from '../../../../../../shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AuthService,
  LoadingService,
  MerchantService,
  NotificationService,
} from '../../../../../../shared/services';

@Component({
  selector: 'app-detail-account',
  templateUrl: './detail-account.component.html',
  styleUrls: ['./detail-account.component.css'],
})
export class DetailAccountComponent implements OnInit {
  merchant: MerchantModel | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private merchantService: MerchantService,
    private alert: NotificationService,
    private authService: AuthService,
    private loading: LoadingService
  ) {}

  ngOnInit(): void {
    const merchantId = this.route.snapshot.paramMap.get('id');

    if (merchantId) {
      this.loading.show();
      this.merchantService.getMerchantById(merchantId).subscribe(
        (merchant: MerchantModel) => {
          this.loading.hide();
          this.merchant = merchant;
        },
        (error) => {
          this.loading.hide();
          console.error('Error fetching merchant:', error);
        }
      );
    }
  }

  approveMerchant(merchant: MerchantModel): void {
    this.loading.show();
    this.merchantService.approveMerchant(merchant._id).subscribe(
      () => {
        this.createMerchantAccount(merchant);
      },
      (error) => {
        this.loading.hide();
        console.error('Error while approving merchant:', error);
        if (error.status === 400) {
          this.alert.showErrorMessage('Invalid merchant ID');
        } else if (error.status === 404) {
          this.alert.showErrorMessage('Merchant not found');
        } else {
          const errorMessage =
            error.error?.message || 'Failed to approve merchant';
          this.alert.showErrorMessage(errorMessage);
        }
      }
    );
  }

  private generateRandomPassword = () => {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    const passwordLength = 12;

    let randomPassword = '';

    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomPassword += characters.charAt(randomIndex);
    }

    return randomPassword;
  };

  createMerchantAccount(merchant: MerchantModel): void {
    const email = merchant.email;
    const defaultPassword = 'PRS*' + this.generateRandomPassword() + '@';
    console.log(defaultPassword);

    this.authService.createUser(email, defaultPassword, 'merchant').subscribe(
      () => {
        const templateParams = {
          merchant_name: merchant.name,
          role: 'Merchant',
          contact_number: merchant.contact_number,
          default_password: defaultPassword,
          to_email: email,
        };
        this.sendEmail(templateParams);
      },
      (error) => {
        this.loading.hide();
        if (error.status === 400 || error.status === 422) {
          this.alert.showErrorMessage(error.error.message);
        } else if (error.status === 409) {
          this.alert.showEmailInUseMessage();
        } else {
          this.alert.showErrorMessage(
            'Merchant account creation failed. Please try again later.'
          );
        }
      }
    );
  }

  sendEmail(templateParams: any): void {
    const to = templateParams.to_email;
    const subject = 'Your New Merchant Account';
    const html = `
    <p>Dear ${templateParams.merchant_name},</p>
      <p>We are delighted to inform you that your new merchant account has been successfully created. You can now access your account using the following details:</p>
      <ul>
        <li>Login Email: ${templateParams.to_email}</li>
        <li>Default Password: ${templateParams.default_password}</li>
      </ul>
      <p>Please make sure to change your default password after your initial login to enhance the security of your account.</p>
      <p>Here are some important details about your new account:</p>
      <ul>
        <li>Account Type: ${templateParams.role}</li>
        <li>Company Name: ${templateParams.merchant_name}</li>
        <li>Contact Information: ${templateParams.contact_number}</li>
      </ul>
      <p>To access your account, please visit our website and log in using your email address and the provided default password.</p>
      <p>Best regards,<br>PromoTourism System team</p>
    `;

    this.merchantService.sendEmail(to, subject, html).subscribe(
      () => {
        this.loading.hide();

        this.router
          .navigate(['/ministry-dashboard/manage-account'])
          .then(() =>
            this.alert.showSuccessMessage(
              'Merchant account created successfully!'
            )
          );
      },
      (error) => {
        this.loading.hide();

        this.alert.showErrorMessage(
          error.error?.message || 'An unexpected error occurred'
        );
      }
    );
  }

  rejectMerchant(merchant: MerchantModel): void {
    this.loading.show();
    this.merchantService.rejectMerchant(merchant._id).subscribe(
      (response) => {
        this.loading.hide();

        this.router
          .navigate(['/ministry-dashboard/manage-account'])
          .then(() => this.alert.showSuccessMessage(response.message));
      },
      (error) => {
        this.loading.hide();

        console.error('Error while rejecting merchant:', error);

        if (error.status === 400) {
          this.alert.showErrorMessage('Invalid merchant ID');
        } else if (error.status === 404) {
          this.alert.showErrorMessage('Merchant not found');
        } else {
          this.alert.showErrorMessage(
            error.error?.message || 'Failed to reject merchant'
          );
        }
      }
    );
  }
}
