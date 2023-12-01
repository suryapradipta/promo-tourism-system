import {Component, OnInit} from '@angular/core';
import {MerchantModel} from '../../../../../../shared/models';
import {ActivatedRoute, Router} from '@angular/router';
import {
  AuthService,
  MerchantService,
  NotificationService
} from '../../../../../../shared/services';
import emailjs from "@emailjs/browser";

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
    console.log(defaultPassword);


    this.authService.createUser(email, defaultPassword, 'merchant').subscribe(
      () => {
        this.alert.showSuccessMessage('Merchant account created successfully!');
        this.router.navigate(['/ministry-dashboard/manage-account']);
      },
      (error) => {
        if (error.status === 400) {
          this.alert.showEmailInUseMessage();
        } else {
          this.alert.showErrorMessage('Merchant account creation failed. Please try again later.');
        }
      }
    );


    const templateParams = {
      merchant_name: merchant.name,
      role: 'Merchant',
      contact_number: merchant.contact_number,
      default_password: defaultPassword,
      to_email: email,
      email_address: email,
    };




    /*emailjs
      .send(
        'service_boieepv',
        'template_eucbozs',
        templateParams,
        'gNO_gcVs2TvsZSaJK'
      )
      .then(
        (response) => {
          this.alert.showAccountCreatedMessage();
        },
        (err) => {
          this.alert.showAccountFailedMessage(err.message);
        }
      );*/
  }
  sendEmail() {
    const to = 'promotourism.system@gmail.com';
    const subject = 'Subject of the Email';
    const html = '<p>Content of the Email</p>';

    this.merchantService.sendEmail(to, subject, html).subscribe(
      (response) => {
        console.log('Email sent successfully:', response);
      },
      (error) => {
        console.error('Error sending email:', error);
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
