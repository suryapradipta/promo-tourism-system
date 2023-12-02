import {Component, OnInit} from '@angular/core';
import {ProductModel} from '../../../../../../shared/models';
import {ActivatedRoute, Router} from '@angular/router';
import {
  AuthService,
  MerchantService,
  NotificationService,
} from '../../../../../../shared/services';
import {NgForm} from '@angular/forms';
import {
  ProductService
} from "../../../../../../shared/services/product.service";

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.css'],
})
export class AddEditProductComponent implements OnInit {
  // Object to hold product data
  product: ProductModel = {
    category: undefined,
    description: '',
    _id: '',
    image: null,
    name: '',
    price: 0,
    reviews: [],
    merchantId: '',
  };
  imageFile: File | null = null;

  previewImage: string | ArrayBuffer | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alert: NotificationService,
    private authService: AuthService,
    private productService: ProductService,
    private merchantService: MerchantService
  ) {
  }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductById(productId).subscribe(
        (product) => {
          this.product = product;
          this.loadImagePreview();
        },
        (error) => {
          console.error('Error fetching product:', error);
        }
      );
    }

    const email = this.authService.getCurrentUserJson().email;
    this.merchantService.getMerchantIdByEmail(email)
      .subscribe((data) => {
          this.product.merchantId = data.merchantId;
          console.log(this.product.merchantId);
        },
        (error) => {
          console.error('Error fetching merchant ID:', error);
        }
      );


  }

  handleImageUpload(event: any) {
    this.imageFile = event.target.files[0];
    this.loadImagePreview(this.imageFile);
  }

  loadImagePreview(file?: File) {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImage = e.target?.result;
      };
      reader.readAsDataURL(file);
    } else if (this.product.image) {
      this.previewImage = `http://localhost:3000/api/merchants/server/src/uploads/${this.product.image}`;
    }
  }

  saveProduct(form: NgForm): void {
    if (form.invalid) {
      this.alert.showErrorMessage(
        'Your product data invalid. Please check your information.'
      );
      return;
    }

    if (!this.imageFile) {
      this.alert.showErrorMessage(
        'Image file is required'
      );
      return;
    }


    if (this.product._id) {
      this.alert.showSuccessMessage('Update product successful!');
      this.productService.editProduct(this.product._id, this.product, this.imageFile).subscribe(
        (response) => {
          console.log(response.message);
          this.router.navigate(['/ministry-dashboard/manage-product'])
        },
        (error) => {
          console.error('Error updating product:', error);
        }
      );
    } else {
      this.productService.addProduct(this.product, this.imageFile)
        .subscribe(
          () => {
            this.router.navigate(['/ministry-dashboard/manage-product']).then(r =>
              this.alert.showSuccessMessage('Add product successful!')
            );
          },
          () => {
            this.alert.showErrorMessage('Add product failed. Please try again later.');
          }
        );
    }

  }
}
