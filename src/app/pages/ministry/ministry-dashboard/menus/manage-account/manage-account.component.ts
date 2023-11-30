import {Component, OnInit} from '@angular/core';
import {MerchantModel} from '../../../../../shared/models';
import {Router} from '@angular/router';
import {MerchantService} from '../../../../../shared/services';
import {map} from "rxjs";

@Component({
  selector: 'app-manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.css'],
})
export class ManageAccountComponent implements OnInit {
  pendingApplications: MerchantModel[] = [];

  constructor(
    private merchantService: MerchantService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.merchantService.getPendingApplications()
      .pipe(
        map((merchants: MerchantModel[]) => {
          return merchants.map((merchant: any) => ({
            id: merchant._id,
            name: merchant.name,
            contact_number: merchant.contact_number,
            email: merchant.email,
            company_description: merchant.company_description,
            documents: merchant.documents,
            document_description: merchant.document_description,
            status: merchant.status,
          }));
        })
      ).subscribe(
      (merchants: MerchantModel[]) => {
        this.pendingApplications = merchants;
        console.log(this.pendingApplications);
      },
      (error) => {
        console.error('Error fetching pending applications:', error);
      }
    );
  }

  previewMerchant(merchant: MerchantModel) {
      this.router.navigate(['/ministry-dashboard/merchant', merchant.id]);
  }
}
