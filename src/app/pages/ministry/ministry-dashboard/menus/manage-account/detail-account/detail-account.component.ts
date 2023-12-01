import {Component, OnInit} from '@angular/core';
import {MerchantModel} from '../../../../../../shared/models';
import {ActivatedRoute, Router} from '@angular/router';
import {
  AuthService,
  MerchantService,
  NotificationService
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
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    const merchantId = this.route.snapshot.paramMap.get('id');

    if (merchantId) {
      this.merchantService.getMerchantById(merchantId).subscribe(
        (merchant) => {
          this.merchant = merchant;
        },
        (error) => {
          console.error('Error fetching merchant:', error);
        }
      );
    }
  }

  approveMerchant(merchant: MerchantModel): void {
    this.merchantService.approveMerchant(merchant._id).subscribe(
      () => {
        this.createMerchantAccount(merchant);
      },
      (error) => {
        this.alert.showErrorMessage('Failed to approve merchant');
        console.error(error);
      }
    );
  }

  private generateRandomPassword = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    const passwordLength = 12;

    let randomPassword = '';

    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomPassword += characters.charAt(randomIndex);
    }

    return randomPassword;
  };

  createMerchantAccount(merchant: MerchantModel) {
    const email = merchant.email;
    const defaultPassword = 'PRS*' + this.generateRandomPassword() + '@';

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
        if (error.status === 400) {
          this.alert.showEmailInUseMessage();
        } else {
          this.alert.showErrorMessage('Merchant account creation failed. Please try again later.');
        }
      }
    );
  }

  sendEmail(templateParams: any) {
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
        this.alert.showSuccessMessage('Merchant account created successfully!');
        this.router.navigate(['/ministry-dashboard/manage-account']);
      },
      (error) => {
        this.alert.showAccountFailedMessage(error.message);
      }
    );
  }

  rejectMerchant(merchant: MerchantModel): void {
    this.merchantService.rejectMerchant(merchant._id).subscribe(
      () => {
        this.router.navigate(['/ministry-dashboard/manage-account']).then(r =>
          this.alert.showSuccessMessage('Merchant rejected successfully!')
        );
      },
      (error) => {
        this.alert.showErrorMessage('Failed to reject merchant');
        console.error(error);
      }
    );
  }
}
