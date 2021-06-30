import { Component } from '@angular/core';
import { ProductService } from './productservice';
import { Product } from './product';
import { FilterUtils } from 'primeng/utils';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { log } from 'util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [MessageService],
  styles: [
    `
      :host ::ng-deep .p-cell-editing {
        padding-top: 0 !important;
        padding-bottom: 0 !important;
      }
    `
  ]
})
export class AppComponent {
  products2: Product[];

  statuses: SelectItem[];

  items: MenuItem[];

  clonedProducts: { [s: string]: Product } = {};

  constructor(
    private productService: ProductService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.productService
      .getProductsSmall()
      .then(data => (this.products2 = data));

    this.statuses = [
      { label: 'In Stock', value: 'INSTOCK' },
      { label: 'Low Stock', value: 'LOWSTOCK' },
      { label: 'Out of Stock', value: 'OUTOFSTOCK' }
    ];

    this.items = [
      {
        label: 'Options',
        items: [
          {
            label: 'Update',
            icon: 'pi pi-refresh',
            command: (event) => {
             console.log(event);
            }
          },
          {
            label: 'Delete',
            icon: 'pi pi-times',
            command: () => {
              this.delete();
            }
          }
        ]
      },
      {
        label: 'Navigate',
        items: [
          {
            label: 'Angular',
            icon: 'pi pi-external-link',
            url: 'http://angular.io'
          },
          {
            label: 'Router',
            icon: 'pi pi-upload',
            routerLink: '/fileupload'
          }
        ]
      }
    ];
  }

  onRowEditInit(product: Product) {
    this.clonedProducts[product.id] = { ...product };
  }

  onRowEditSave(product: Product) {
    if (product.price > 0) {
      delete this.clonedProducts[product.id];
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Product is updated'
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid Price'
      });
    }
  }

  onRowEditCancel(product: Product, index: number) {
    this.products2[index] = this.clonedProducts[product.id];
    delete this.products2[product.id];
  }

  update() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Data Updated'
    });
  }

  delete() {
    this.messageService.add({
      severity: 'warn',
      summary: 'Delete',
      detail: 'Data Deleted'
    });
  }
}
