<template>
  <LoadingOverlay v-if="loading" />

  <div class="container-fluid">
    <h2>Danh sách sản phẩm</h2>
    <button @click="resetData" data-toggle="modal" data-target="#AddProduct"
            class="btn btn-success p-1 rounded mr-3 mb-1 float-left"><i class="fa-solid fa-square-plus"></i>
      Thêm mới
    </button>
    <div class="table-responsive">
      <table class="table table-bordered" id="getListItems">
        <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Image</th>
          <th scope="col">Tên sản phẩm</th>
          <th scope="col">Danh mục</th>
          <th scope="col">Thương hiệu</th>
          <th scope="col">Nhà cung cấp</th>
          <th scope="col">Giá sản phẩm</th>
          <th scope="col">Số lượng</th>
          <th scope="col">Hành động</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(productMain, index) in products" :key="index">
          <td>{{ index + 1 }}</td>
          <td>
            <img :src="productMain.product.imageProduct" alt="Product Image" style="width: 60px;"/>
          </td>
          <td>{{ productMain.product.productName }}</td>
          <td>
            {{ productMain.product.categoryProducts.categoryName }}
          </td>
          <td>
            {{ productMain.product.brandProducts.brandName }}
          </td>
          <td>
            {{ productMain.product.supplierProducts.supplierName }}
          </td>
          <td>
            <p class="text-success">Giá chính: {{ formatCurrency(productMain.product.price) }}</p>
            <p class="text-success">Giá giảm: {{ formatCurrency(productMain.product.price_discount) }}</p>
          </td>
          <td>
            {{ productMain.product.quantity }}
          </td>
          <td>
            <button @click="getDetailsProduct(productMain.product.productID)" class="btn btn-primary p-1 rounded mr-1"
                    data-toggle="modal" data-target="#EditProduct">
              <i class="fa-solid fa-pen-to-square"></i>
              Edit
            </button>
            |
            <button class="btn btn-danger p-1 rounded ml-1" @click="deleteProduct(productMain.product.productID)">
              <i class="fa-regular fa-trash-can"></i>
              Delete
            </button>

          </td>
        </tr>

        </tbody>
      </table>
    </div>


  </div>
  <!-- Modal -->
  <div class="modal fade" data-bs-backdrop="static" id="EditProduct" tabindex="-1" role="dialog"
       aria-labelledby="EditProductLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="EditProductLabel">Sửa sản phẩm</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true" v-on:click="resetData">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-12 col-md-6 col-sm-6 col-lg-6">
              <div class="form-group mb-3">
                <label for="NameProducts">Tên sản phẩm</label>
                <input type="text" v-model="ProductName" class="form-control" id="NameProducts" required
                       @blur="generateSlug">
              </div>
              <div class="form-group mb-3">
                <label>Slug sản phẩm</label>
                <input type="text" v-model="Slug" class="form-control" required>
              </div>
              <div class="form-group mb-3">
                <label for="Price">Giá sản phẩm</label>
                <input type="number" v-model="Price" class="form-control" id="Price" required>
              </div>
              <div class="form-group mb-3">
                <label for="Price">Giá giảm</label>
                <input type="number" v-model="Price_discount" class="form-control" id="Price" required>
              </div>
            </div>
            <div class="col-12 col-md-6 col-sm-6 col-lg-6">

              <div class="form-group mb-3">
                <label for="CateId">Tên danh mục</label>
                <select class="form-control" v-model="CategoryID">
                  <option v-for="cate in categories" :value="cate.categoryID">{{ cate.categoryName }}</option>
                </select>
              </div>
              <div class="form-group mb-3">
                <label for="Stock">Thương hiệu</label>
                <select class="form-control" v-model="BrandID">
                  <option v-for="brand in brands" :value="brand.brandID">{{ brand.brandName }}</option>
                </select>
              </div>
              <div class="form-group mb-3">
                <label for="isSeller">Nhà cung cấp</label>
                <select class="form-control" v-model="SupplierID">
                  <option v-for="supplier in suppliers" :value="supplier.supplierID">{{ supplier.supplierName }}
                  </option>
                </select>
              </div>
              <h4 class="text-center text-black mt-3">Tùy biến sản phẩm</h4>
              <div class="add-variant mb-3">
                <button class="btn btn-success" v-on:click="addVariantEdit">+</button>
              </div>
              <div class="container-variant">
                <div class="row" v-for="(items, index) in ProductSizeVM" :key="index">
                  <div class="col-12 col-md-5">
                    <div class="mb-3">
                      <label class="form-label">Chọn size</label>
                      <select class="form-control" v-model="items.Size_Id" @change="handleSizeChange(index)">
                        <option v-for="size in sizes" :value="size.sizesID">{{ size.sizeName }}</option>

                      </select>
                    </div>

                  </div>
                  <div class="col-12 col-md-5">
                    <div class="mb-3">
                      <label class="form-label">Số lượng </label>
                      <input type="number" placeholder="Số lượng " class="form-control"
                             v-model="items.Quantity_in_stock"/>
                    </div>

                  </div>
                  <div class="col-12 col-md-2">
                    <div class="mb-3" @click="deleteVariantEdit(items, index)">
                      <div style="cursor: pointer;" class="text-danger">Xóa</div>
                    </div>

                  </div>
                </div>
              </div>


            </div>
            <div class="col-12">
              <div class="form-group mb-3">
                <label for="Details">Mô tả ngắn</label> <br>
                <textarea class="form-control" rows="5" cols="75" v-model="ShortDescription"></textarea>

              </div>
              <div class="form-group mb-3">
                <label for="Details">Mô tả chi tiết</label>
                <ckeditor :editor="editor" v-model="Details" :config="editorConfig"></ckeditor>
              </div>
            </div>
            <div class="col-12 ">
              <div class="row">
                <div class="col-md-12 d-flex flex-column align-items-center">
                  <img :src="ImageProduct" style="width: 50%"/>
                  <p class="text-center">Ảnh đang có</p>
                </div>
                <div class="col-md-12 d-flex flex-column align-items-center">
                  <label>
                    Chọn ảnh
                  </label>
                  <input type="file" ref="image2" v-on:change="onFileChange" accept="image/*">
                  <img :src="previewImage" alt="" style="width:50%"/>
                  <p class="text-center">Ảnh mới</p>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal" v-on:click="resetData">Close</button>
          <button type="button" class="btn btn-primary" v-on:click="editProducts()">Lưu thay đổi</button>
        </div>

      </div>
    </div>
  </div>
  <!--   add product-->
  <div class="modal fade" data-bs-backdrop="static" id="AddProduct" tabindex="-1" role="dialog"
       aria-labelledby="AddProductLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="AddProductLabel">Thêm sản phẩm</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-12 col-md-6 col-sm-6 col-lg-6">
              <div class="form-group mb-3">
                <label for="NameProducts">Tên sản phẩm</label>
                <input type="text" v-model="ProductName" class="form-control" id="NameProducts" required
                       @blur="generateSlug">
              </div>
              <div class="form-group mb-3">
                <label>Slug sản phẩm</label>
                <input type="text" v-model="Slug" class="form-control" required>
              </div>
              <div class="form-group mb-3">
                <label for="Price">Giá sản phẩm</label>
                <input type="number" v-model="Price" class="form-control" id="Price" required>
              </div>
              <div class="form-group mb-3">
                <label for="Price">Giá giảm</label>
                <input type="number" v-model="Price_discount" class="form-control" id="Price" required>
              </div>
            </div>
            <div class="col-12 col-md-6 col-sm-6 col-lg-6">

              <div class="form-group mb-3">
                <label for="CateId">Tên danh mục</label>
                <select class="form-control" v-model="CategoryID">
                  <option v-for="cate in categories" :value="cate.categoryID">{{ cate.categoryName }}</option>
                </select>
              </div>
              <div class="form-group mb-3">
                <label for="Stock">Thương hiệu</label>
                <select class="form-control" v-model="BrandID">
                  <option v-for="brand in brands" :value="brand.brandID">{{ brand.brandName }}</option>
                </select>
              </div>
              <div class="form-group mb-3">
                <label for="isSeller">Nhà cung cấp</label>
                <select class="form-control" v-model="SupplierID">
                  <option v-for="supplier in suppliers" :value="supplier.supplierID">{{ supplier.supplierName }}
                  </option>
                </select>
              </div>
              <h4 class="text-center text-black mt-3">Tùy biến sản phẩm</h4>
              <div class="add-variant mb-3">
                <button class="btn btn-success" v-on:click="addVariant">+</button>
              </div>
              <div class="container-variant">
                <div class="row" v-for="(items, index) in ProductSizeVM" :key="index">
                  <div class="col-12 col-md-5">
                    <div class="mb-3">
                      <label class="form-label">Chọn size</label>
                      <select class="form-control" v-model="items.Size_Id" @change="handleSizeChange(index)">
                        <option v-for="size in sizes" :value="size.sizesID">{{ size.sizeName }}</option>

                      </select>
                    </div>

                  </div>
                  <div class="col-12 col-md-5">
                    <div class="mb-3">
                      <label class="form-label">Số lượng </label>
                      <input type="number" placeholder="Số lượng " class="form-control"
                             v-model="items.Quantity_in_stock"/>
                    </div>

                  </div>
                  <div class="col-12 col-md-2">
                    <div class="mb-3" @click="deleteVariant(index)">
                      <div style="cursor: pointer;" class="text-danger">Xóa</div>
                    </div>

                  </div>
                </div>
              </div>


            </div>
            <div class="col-12">
              <div class="form-group mb-3">
                <label for="Details">Mô tả ngắn</label> <br>
                <textarea class="form-control" rows="5" cols="100" v-model="ShortDescription"></textarea>

              </div>
              <div class="form-group mb-3">
                <label for="Details">Mô tả chi tiết</label>
                <ckeditor :editor="editor" v-model="Details" :config="editorConfig"></ckeditor>


              </div>
            </div>
            <div class="col-12 ">
              <div class="row">
                <div class="col-md-12 d-flex flex-column align-items-center" v-if="ImageProduct">
                  <img :src="ImageProduct" style="width: 50%"/>
                  <p class="text-center">Ảnh đang có</p>
                </div>
                <div class="col-md-12 d-flex flex-column align-items-center">
                  <label>
                    Chọn ảnh
                  </label>
                  <input type="file" ref="image2" v-on:change="onFileChange" accept="image/*" required>
                  <img :src="previewImage" alt="" style="width:50%"/>
                  <p class="text-center">Ảnh mới</p>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" @click="addProducts()">Lưu</button>
        </div>
      </div>
    </div>
  </div>


</template>

<style>
.btn {
  font-size: 16px;
}

.dataTables_filter {
  float: right;
}

th,
td {
  text-wrap: nowrap;
}
</style>

<script>
import Swal from "sweetalert2";
import axios from '@/axios.js';
import CKEditor from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import LoadingOverlay from "@/components/Loading.vue";

export default {
  components: {
    LoadingOverlay,
    ckeditor: CKEditor.component
  },
  data() {
    return {
      loading: false,
      editor: ClassicEditor,

      editorConfig: {
        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote'],
        heading: {
          options: [
            {model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph'},
            {model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1'},
            {model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2'}
          ]
        },
        image: {
          toolbar: ['imageTextAlternative', '|', 'imageStyle:full', 'imageStyle:side'],
          styles: [
            'full',
            'side'
          ]
        },
      },
      products: [],
      categories: [],

      productId: null,
      NameProducts: null,
      Details: null,
      Stock: null,
      isSeller: null,
      CateId: null,
      image: null,
      cateName: null,
      imageFile: null,
      previewImage: null,
      uploadedImage: null,
      userApi: [],

      ProductSizeVM: [],
      brands: [],
      sizes: [],
      suppliers: [],

      ProductID: 0,
      ProductName: null,
      Slug: null,
      ImageProduct: null,
      Price: null,
      Quantity: null,
      ShortDescription: null,
      Description: null,
      Price_discount: null,
      CategoryID: null,
      BrandID: null,
      SupplierID: null,

    };
  },

  created() {
    this.loadDataProducts();
  },
  mounted() {
    axios.get('/admin/get-all-category').then((response) => {
      this.categories = response.data.data;
    });
    axios.get('/admin/get-all-brand').then((response) => {
      this.brands = response.data.data;
    });
    axios.get('/admin/get-all-size').then((response) => {
      this.sizes = response.data.data;
    });
    axios.get('/admin/get-all-supplier').then((response) => {
      this.suppliers = response.data.data;
    });
  },
  methods: {
    handleSizeChange(index) {
      const currentSizeId = this.ProductSizeVM[index].Size_Id;

      const isDuplicate = this.ProductSizeVM.some((item, i) => i !== index && item.Size_Id === currentSizeId);

      if (isDuplicate) {
        const closestAvailableSize = this.findClosestAvailableSize(index, currentSizeId);
        this.ProductSizeVM[index].Size_Id = closestAvailableSize.sizesID;
        alert('Size đã được chọn trong biến thể khác. Vui lòng chọn một Size khác.');
      }
    },
    findClosestAvailableSize(index, currentSizeId) {
      const availableSizes = this.sizes.filter(size => size.sizesID !== currentSizeId);
      return availableSizes.length > 0
          ? availableSizes.reduce((closest, size) =>
              Math.abs(size.sizesID - currentSizeId) < Math.abs(closest.sizesID - currentSizeId)
                  ? size
                  : closest
          )
          : null;
    },
    loadDataProducts() {
  this.loading = true;
      axios.get('/admin/get-all-products').then((response) => {
        this.products = response.data.data;
      })
          .then(() => {
            $("#getListItems").DataTable({
              ...this.$globalConfig.createDataTableConfig(),

              'columnDefs': [{
                'targets': [-1],
                'orderable': false,
              }],
              searching: true,
              iDisplayLength: 6,
              "ordering": false,
              lengthChange: false,
              aaSorting: [[0, "desc"]],
              aLengthMenu: [
                [5, 10, 25, 50, 100, -1],

                ["5 dòng", "10 dòng", "25 dòng", "50 dòng", "100 dòng", "Tất cả"],
              ],
            });
          }).finally(() => {
        this.loading = false;
      });
    },

    addVariant() {
      this.ProductSizeVM.push({
        Size_Id: 0,
        Quantity_in_stock: 0,
      });
    },
    addVariantEdit() {
      this.ProductSizeVM.push({
        ProductSizeID: 0,
        ProductID: 0,
        Size_Id: 0,
        Quantity_in_stock: 0,
      });
    },
    deleteVariant(index) {
      this.ProductSizeVM.splice(index, 1);
    },
    deleteVariantEdit(items, index) {
      this.loading = true;

      const formData = new FormData();
      formData.append('ProductSizeID', items.productSizeID);
      axios.post(`/admin/product-size/delete`, formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then((response) => {
        if (response.data.code == 200) {
          this.ProductSizeVM.splice(index, 1);
        } else {
          alert("Xảy ra lỗi");
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    generateSlug() {
      let str = this.ProductName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const replacements = {
        "đ": "d",
        "Đ": "D"
      };

      str = str
          .replace(/đ/g, 'd')
          .replace(/Đ/g, 'D')
          .toLowerCase()
          .replace(/ /g, '-')
          .replace(/[^\w-]+/g, '');
      this.Slug = str;
      this.Slug = this.Slug.replace(/^\-+|\-+$/g, '');


    },
    onFileChange(event) {
      this.imageFile = event.target.files[0];
      this.previewImage = URL.createObjectURL(this.imageFile);
      this.uploadedImage = null;
    },
    formatCurrency(value) {
      const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      });
      return formatter.format(value);
    },
    getCategoryName(categoryId) {
      const category = this.categories.find((c) => c.id === categoryId);
      return category ? category.name : 'Unknown';
    },
    deleteProduct(productId) {
      Swal.fire({
        title: 'Bạn có chắc chắn?',
        text: "Sản phẩm này sẽ bị xóa!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Đồng ý!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.loading = true;
          const formData = new FormData();
          formData.append('ProductID', productId);
          axios.post('/admin/products/delete', formData, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).then(response => {
            if (response.data.code == 200) {
              Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Đã thành công',
                confirmButtonText: 'OK',
              }).then((result) => {
                if (result.isConfirmed) {
                  window.location.reload();
                }
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: `${response.data.message}`,
                confirmButtonText: 'OK'
              }).then((result) => {
                if (result.isConfirmed) {
                  return;
                }
              });
            }


          }).catch(error => {
            Swal.fire({
              icon: 'error',
              title: 'Lỗi',
              text: 'Đã có lỗi xảy ra vui lòng thử lại',
              confirmButtonText: 'OK'
            });
          }).finally(() => {
            this.loading = false;
          });
        }
      });
    },
    resetData() {
      this.ProductSizeVM = [];

      this.ProductID = 0;
      this.ProductName = null;
      this.Slug = null;
      this.ImageProduct = null;
      this.Price = null;
      this.Quantity = null;
      this.ShortDescription = null;
      this.Description = null;
      this.Price_discount = null;
      this.CategoryID = null;
      this.BrandID = null;
      this.SupplierID = null;
    },
    getDetailsProduct(id) {
      this.loading = true;
      axios.get(`/admin/details-products/${id}`)
          .then(res => {
        this.loading = false;

            this.ProductID = res.data.data[0].product.productID;
            this.ProductName = res.data.data[0].product.productName;
            this.Slug = res.data.data[0].product.slug;
            this.ImageProduct = res.data.data[0].product.imageProduct;
            this.Price = res.data.data[0].product.price;
            this.Price_discount = res.data.data[0].product.price_discount;
            this.ShortDescription = res.data.data[0].product.shortDescription;
            this.CategoryID = res.data.data[0].product.categoryID;
            this.BrandID = res.data.data[0].product.brandID;
            this.SupplierID = res.data.data[0].product.supplierID;
            this.Details = res.data.data[0].product.description;
            res.data.data[0].productSizes.forEach((item) => {
              this.ProductSizeVM.push({
                ProductSizeID: item.productSizeID,
                ProductID: item.productID,
                Size_Id: item.size_Id,
                Quantity_in_stock: item.quantity_in_stock
              });
            });
            console.log(this.ProductSizeVM);

            return Promise.resolve();

          }).catch((error) => {
        console.error(error);
        this.loading = false;

      });
    },
    async addProducts() {
      this.loading = true;

      try {
        if (!this.ProductName || !this.Details || !this.Price || !this.CategoryID || !this.BrandID || !this.SupplierID || !this.Slug) {
          this.loading = false;

          Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Kiểm tra đã nhập các dữ liệu',
            confirmButtonText: 'OK'
          });
          return;

        }
        if (this.ProductSizeVM.length <= 0) {
          this.loading = false;

          Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Chưa thêm size',
            confirmButtonText: 'OK'
          });
          return;
        }
        const formData = new FormData();
        formData.append('ProductID', this.ProductID);
        formData.append('ProductName', this.ProductName);
        formData.append('Description', this.Details);
        formData.append('Price', this.Price);
        formData.append('Slug', this.Slug);
        formData.append('ShortDescription', this.ShortDescription);
        formData.append('Price_discount', this.Price_discount);
        formData.append('SupplierID', this.SupplierID);
        formData.append('BrandID', this.BrandID);
        formData.append('CategoryID', this.CategoryID);
        formData.append('SupplierID', this.SupplierID);
        formData.append('PathProducts', this.$refs.image2.files[0]);
        this.ProductSizeVM.forEach((item, index) => {
          formData.append(`ProductSizeVM[${index}].Size_Id`, item.Size_Id);
          formData.append(`ProductSizeVM[${index}].Quantity_in_stock`, item.Quantity_in_stock);
        });
        let totalQuantity = this.ProductSizeVM.reduce((sum, item) => sum + item.Quantity_in_stock, 0);
        formData.append('Quantity', totalQuantity);


        await axios.post('/admin/add-products', formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }).then((response) => {
          if (response.data.code == 200) {
            this.loading = false;

            Swal.fire({
              icon: 'success',
              title: 'Thành công',
              text: 'Đã lưu thành công',
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.reload();

              }
            });
          } else {
            this.loading = false;

            Swal.fire({
              icon: 'error',
              title: 'Lỗi',
              text: `${response.data.message}`,
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.isConfirmed) {
                return;
              }
            });
          }
        });
      } catch (error) {
        this.loading = false;

        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Đã có lỗi xảy ra server',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            return;
          }
        });
      }
    },
    async editProducts() {
      this.loading = true;

      if (!this.ProductName || !this.Details || !this.Price || !this.CategoryID || !this.BrandID || !this.SupplierID || !this.Slug) {
        this.loading = false;

        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Kiểm tra đã nhập các dữ liệu',
          confirmButtonText: 'OK'
        });
        return;

      }
      if (this.ProductSizeVM.length <= 0) {
        this.loading = false;

        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Chưa thêm size',
          confirmButtonText: 'OK'
        });
        return;
      }
      try {
        const formData = new FormData();
        formData.append('ProductID', this.ProductID);
        formData.append('ProductName', this.ProductName);
        formData.append('Description', this.Details);
        formData.append('Price', this.Price);
        formData.append('Slug', this.Slug);
        formData.append('ShortDescription', this.ShortDescription);
        formData.append('Price_discount', this.Price_discount);
        formData.append('SupplierID', this.SupplierID);
        formData.append('BrandID', this.BrandID);
        formData.append('CategoryID', this.CategoryID);
        formData.append('SupplierID', this.SupplierID);
        formData.append('PathProducts', this.$refs.image2.files[0]);
        this.ProductSizeVM.forEach((item, index) => {
          formData.append(`ProductSizeEditVM[${index}].Size_Id`, item.Size_Id);
          formData.append(`ProductSizeEditVM[${index}].ProductSizeID`, item.ProductSizeID);
          formData.append(`ProductSizeEditVM[${index}].Quantity_in_stock`, item.Quantity_in_stock);
        });
        let totalQuantity = this.ProductSizeVM.reduce((sum, item) => sum + item.Quantity_in_stock, 0);
        formData.append('Quantity', totalQuantity);
        if (this.$refs.image2.files[0] != null) {

          formData.append('PathProducts', this.$refs.image2.files[0]);
        }

        await axios.post(`/admin/products/update`, formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }).then((response) => {
          if (response.data.code == 200) {
            this.loading = false;

            Swal.fire({
              icon: 'success',
              title: 'Thành công',
              text: 'Đã lưu thành công',
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.reload();

              }
            });
          } else {
            this.loading = false;

            Swal.fire({
              icon: 'error',
              title: 'Lỗi',
              text: `${response.data.message}`,
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.isConfirmed) {
                return;
              }
            });
          }
        });
      } catch (error) {
        this.loading = false;

        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Đã có lỗi xảy ra',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      }
    },


  },

}
</script>
<style scoped>
.pagination .page-item .page-link {
  width: 100px;
}

.pagination a {
  display: flex !important;
}
</style>