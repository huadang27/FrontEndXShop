<template>
  <LoadingOverlay v-if="loading"/>

  <div class="w-100 my-3">
    <button type="button" class="btn btn-success float-left" data-toggle="modal" data-target="#AddOrder"
            @click="resetData"><i
        class="fa-solid fa-square-plus"></i>
      Thêm mới
    </button>
  </div>

  <div class="table-responsive">
    <table class="table table-bordered" id="orderTable">
      <thead>
      <tr>
        <th>#</th>
        <th scope="col">Mã đơn hàng</th>
        <th scope="col">Loại đơn</th>
        <th scope="col">Họ tên</th>
        <th scope="col">Số điện thoại</th>
        <th scope="col">Địa chỉ</th>
        <th scope="col">Tổng giá trị đơn hàng</th>
        <th scope="col">Ngày tạo đơn</th>
        <th scope="col">Người tạo</th>
        <th scope="col">Trạng thái</th>
        <th scope="col">Hành động</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(items,index) in listOrder" :key="index">
        <td>{{ index + 1 }}</td>
        <td>{{ items.orderCode }}</td>
        <td>{{ items.type }}</td>
        <td>{{ items.customer_Name }}</td>
        <td>{{ items.phone_Number }}</td>
        <td>{{ items.address }}</td>
        <td>{{ formatCurrency(items.total_Price) }}</td>
        <td>{{ formatDate(new Date(items.createDate)) }}</td>

        <td>{{ items.applicationUser.fullName }}</td>
        <td>
          <div style="cursor: pointer;" @click="UpdateOrder(items.orderCode)"
               :class="{ 'text-warning': !items.order_Status, 'text-success': items.order_Status }">
              <span>
                {{ items.order_Status ? 'Đã thanh toán' : 'Đang chờ thanh toán' }}
              </span>

          </div>
        </td>
        <td>
          <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#detailsOrder"
                  @click="getDetailsOrder(items.orderID)">Chi tiết
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>

  <div class="modal" tabindex="-1" id="AddOrder" role="dialog" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Tạo mới đơn hàng</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="resetData">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="row mb-3">
            <div class="col-12 col-md-6">
              <div class="form-group mb-3">
                <label for="Customer_Name">Tên người mua hàng</label>
                <input type="text" v-model="Customer_Name" class="form-control" id="Customer_Name" required>
              </div>
              <div class="form-group mb-3">
                <label for="Phone_Number">SĐT người mua hàng</label>
                <input type="number" v-model="Phone_Number" class="form-control" id="Phone_Number" required>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="form-group mb-3">
                <label for="Total_Price">Trạng thái thanh toán</label>
                <select class="form-control" v-model="Order_Status">
                  <option value="true">Đã thanh toán</option>
                  <option value="false">Chờ thanh toán</option>
                </select>
              </div>
              <div class="form-group mb-3">
                <div class="basket-module">
                  <label for="promo-code">Nhập mã giảm giá (nếu có)</label> <br>
                  <input id="promo-code" type="text" name="promo-code" v-model="PromotionsCode" maxlength="50"
                         class="promo-code-field">
                  <button class="promo-code-cta" @click="CheckPromotions">Xác nhận</button>
                </div>
                <p class="text-center mt-2 text-success" v-if="checkCode">Thành công</p>
                <p class="text-center mt-2 text-danger" v-if="messageCode != null">{{messageCode}}</p>
              </div>

            </div>
            <div class="col-12">
              <div class="form-group mb-3">
                <label for="Address">Đia chỉ người mua hàng</label>
                <textarea class="form-control" rows="5" cols="50" v-model="Address"></textarea>
              </div>
            </div>
          </div>
          <h5 class="text-center">Thông tin đơn hàng</h5>
          <div class="basket-labels">
            <ul>
              <li class="item item-heading">Sản phẩm</li>
              <li class="price">Giá</li>
              <li class="quantity">Số lượng</li>
              <li class="subtotal">Tổng tiền</li>
            </ul>
          </div>
          <div class="basket-product" v-for="(product,index) in OrderDetailList" :key="index">
            <div class="row w-100" v-if="!product.selected">
              <div class="col-12 col-md-6">
                <div class="mb-3">
                  <label>Chọn sản phẩm</label>
                  <select class="form-control" v-model="OrderDetailList[index].selectedProduct">
                    <option v-for="(itemProduct, item) in listProduct" :key="item" :value="itemProduct">
                      {{ itemProduct.product.productName }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <label>Chọn size</label>
                <select class="form-control" v-model="product.ProductsSizeID">
                  <option v-for="(itemSize, itemIndex) in OrderDetailList[index].selectedProduct.productSizes"
                          :key="itemIndex" :value="itemSize.productSizeID">{{ itemSize.sizes.sizeName }}
                  </option>
                </select>
                <button @click="checkSelect(index)">Xác nhận</button>
              </div>
            </div>
            <div class="item-product" v-if="product.selected">
              <div class="product-image">
                <img :src="product.selectedProduct.product.imageProduct"
                     :alt="product.selectedProduct.product.productName" class="product-frame"/>
              </div>
              <div class="product-details">
                <h1><strong><span class="item-quantity">{{ product.selectedProduct.product.productName }}</span>
                </strong></h1>
                <p><strong>
                  Size:{{ getSizeName(index, product.ProductsSizeID, product.selectedProduct.productSizes) }}
                </strong></p>
                <p>Danh mục:{{ product.selectedProduct.product.categoryProducts.categoryName }}</p>
              </div>
            </div>
            <div class="price" v-if="product.selected">
              {{ formatCurrency(product.Price_Details) }}
            </div>
            <div class="quantity" v-if="product.selected">
              <input type="number" v-model="product.Product_Quantity" min="1" class="quantity-field">
            </div>
            <div class="subtotal" v-if="product.selected">
              {{ formatCurrency(product.Product_Quantity * product.Price_Details) }}
            </div>
            <div class="remove" v-if="product.selected">
              <button @click="deleteOrderList(index)">Xóa</button>
            </div>
          </div>
          <div class="text-right">Thành tiền: {{ formatCurrency(total) }}</div>
          <div class="text-right text-success" v-if="checkCode">Đã áp dụng mã khuyến mãi</div>
          <div class="row" @click="addProductOrder">
            <button class="btn btn-success d-flex">+</button>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="resetData">Đóng</button>
          <button type="button" class="btn btn-primary" @click="addOrder">Xác nhận</button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal" tabindex="-1" id="detailsOrder" role="dialog" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Chi tiết đơn hàng</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="resetData">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body" ref="screenshotContent">
          <div class="row mb-3">
            <div class="col-12 col-md-6">
              <div class="form-group mb-3">
                <label for="promo-code">Mã order</label> <br>
                <p>{{ OrderDetailMain.orderCode }}</p>
              </div>
              <div class="form-group mb-3">
                <label for="Customer_Name">Tên người mua hàng</label>
                <p>{{ OrderDetailMain.customer_Name }}</p>
              </div>
              <div class="form-group mb-3">
                <label for="Phone_Number">SĐT người mua hàng</label>
                <p>{{ OrderDetailMain.phone_Number }}</p>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="form-group mb-3">
                <label for="Total_Price">Trạng thái thanh toán</label>
                <div style="cursor: pointer;"
                     :class="{ 'text-warning': !OrderDetailMain.order_Status, 'text-success': OrderDetailMain.order_Status }">
              <span>
                {{ OrderDetailMain.order_Status ? 'Đã thanh toán' : 'Đang chờ thanh toán' }}
              </span>

                </div>

              </div>
              <div class="form-group mb-3">
                <div class="basket-module">
                  <label for="promo-code">Mã giảm giá (nếu có)</label> <br>
                  <p>{{ OrderDetailMain.promotionCode }}</p>
                </div>
              </div>
              <div class="form-group mb-3">
                <label for="Address">Đia chỉ người mua hàng</label>
                <p>{{ OrderDetailMain.address }}</p>
              </div>

            </div>

          </div>
          <h5 class="text-center">Thông tin đơn hàng</h5>
          <div class="basket-labels">
            <ul>
              <li class="item item-heading">Sản phẩm</li>
              <li class="price">Giá</li>
              <li class="quantity">Số lượng</li>
              <li class="subtotal">Tổng tiền</li>
            </ul>
          </div>
          <div class="basket-product" v-for="(prt,index) in OrderDetailMain.orderDetails" :key="index">

            <div class="item-product">
              <div class="product-image">
                <img :src="prt.productSize.products.imageProduct"
                     :alt="prt.productSize.products.productName" class="product-frame"/>
              </div>
              <div class="product-details">
                <h1><strong><span class="item-quantity">{{ prt.productSize.products.productName }}</span>
                </strong></h1>
                <p><strong>
                  Size:{{ prt.productSize.sizes.sizeName }}
                </strong></p>
                <p>Danh mục:{{ prt.productSize.products.categoryProducts.categoryName }}</p>
              </div>
            </div>
            <div class="price">
              {{ formatCurrency(prt.price_Details) }}
            </div>
            <div class="quantity">
              <input type="number" v-model="prt.product_Quantity" min="1" class="quantity-field" readonly>
            </div>
            <div class="subtotal">
              {{ formatCurrency(prt.product_Quantity * prt.price_Details) }}
            </div>

          </div>
          <div class="text-right">Thành tiền: {{ formatCurrency(OrderDetailMain.total_Price) }}</div>
          <div class="text-right text-success"
               v-if="OrderDetailMain.promotionCode != '' || OrderDetailMain.promotionCode != null">Đã áp dụng mã
            khuyến mãi
          </div>

        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="resetData">Đóng</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "@/axios";
import Swal from "sweetalert2";
import LoadingOverlay from "@/components/Loading.vue";

export default {
  name: "CreadOrder",
  components: {LoadingOverlay},
  data() {
    return {
      listProduct: [],
      listSize: [],
      listOrder: [],
      OrderDetailMain: {},

      OrderDetailList: [],
      Customer_Name: null,
      Phone_Number: null,
      Address: null,
      PromotionsCode: null,
      Total_Price: 0,
      checkCode: false,
      dataPromotions: null,
      promotionsCodeDiscount: 0,
      Order_Status: false,
      loading: false,
      messageCode: null,

    }
  },
  created() {
    this.loadItemOrder();
  },
  mounted() {
    axios.get("/admin/get-all-products")
        .then(res => {
          this.listProduct = res.data.data;
        })
  },
  computed: {
    total() {
      const discountPercentage = this.checkCode ? (this.dataPromotions.discount_Percentage / 100) : 0;
      return this.OrderDetailList.reduce((acc, product) => {
        if (product.selected) {
          const discountedPrice = product.Price_Details * (1 - discountPercentage);
          acc += discountedPrice * product.Product_Quantity;
        }
        return acc;
      }, 0);
    },
  },
  methods: {
    resetData() {
      this.messageCode = null;
      this.checkCode = false;
      this.OrderDetailMain = {};
      this.OrderDetailList = [];
      this.Customer_Name = null;
      this.Phone_Number = null;
      this.Address = null;
      this.PromotionsCode = null;
      this.Total_Price = 0;
      this.checkCode = false;
      this.dataPromotions = null;
      this.promotionsCodeDiscount = 0;
      this.Order_Status = false;
    },
    UpdateOrder(OrderCode) {
      this.loading = true;

      const formData = new FormData();
      formData.append('OrderCode', OrderCode);
      axios.post('/admin/update-order-active', formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then((response) => {
        if(response.data.code == 200) {
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
      }).finally(() => {
        this.loading = false;
      });
    },
    formatDate(date) {
      const options = {year: 'numeric', month: '2-digit', day: '2-digit'};
      return date.toLocaleDateString('vi-VN', options);
    },
    getSizeName(index, productSizeID, productSizes) {
      console.log(productSizes);
      console.log(productSizeID);

      const selectedSize = productSizes.find(size => size.productSizeID === productSizeID);
      return selectedSize ? `${selectedSize.sizes.sizeName}` : '';
    },
    formatCurrency(value) {
      const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      });
      return formatter.format(value);
    },
    checkSelect(index) {
      const selectedProduct = this.OrderDetailList[index].selectedProduct;
      const selectedProductSizeId = this.OrderDetailList[index].ProductsSizeID;
      console.log(selectedProduct)
      if (selectedProduct) {
        const isDuplicate = this.OrderDetailList.some((item, i) => i !== index && item.ProductsSizeID === selectedProductSizeId);

        if (isDuplicate) {
          alert('Sản phẩm và size đã tồn tại rồi');
          return;
        }
        if (selectedProduct.product.price_discount != 0) {


          this.OrderDetailList[index] = {
            ...this.OrderDetailList[index],
            ProductID: selectedProduct.product.productID,
            Product_Quantity: 1,
            Price_Details: selectedProduct.product.price_discount,
            selected: true
          };


        } else {
          this.OrderDetailList[index] = {
            ...this.OrderDetailList[index],
            ProductID: selectedProduct.product.productID,
            Product_Quantity: 1,
            Price_Details: selectedProduct.product.price,
            selected: true
          };


        }

      }

    },
    deleteOrderList(index) {
      this.OrderDetailList.splice(index, 1);
    },
    getDetailsOrder(id) {
      const order = this.listOrder.find(order => order.orderID === id);
      if (order) {
        this.OrderDetailMain = order;
        console.log(this.OrderDetailMain)
      } else {
        console.log("Order not found with OrderId:", id);
      }
    },
    loadItemOrder() {
      this.loading = true;

      axios.get('/admin/get-order').then((response) => {
        this.listOrder = response.data.data;
      })
          .then(() => {
            $("#orderTable").DataTable({
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
    addProductOrder() {
      this.OrderDetailList.push({
        ProductID: 0,
        ProductsSizeID: 0,
        Product_Quantity: 0,
        Price_Details: 0,
        selected: false,
        selectedProduct: {}
      });
    },
    CheckPromotions() {
      if (this.PromotionsCode != null) {
        this.loading = true;

        const formData = new FormData();
        formData.append('PromotionsCode', this.PromotionsCode);
        axios.post(`/admin/order/check-promotions`, formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }).then((response) => {
          if (response.data.code == 200) {
            this.checkCode = true;
            this.dataPromotions = response.data.data;
            this.messageCode = null;
          } else {
            this.messageCode = response.data.message;
            this.checkCode = false;
            this.dataPromotions = null

          }
        }).finally(() => {
          this.loading = false;
        });
      } else {
        this.checkCode = false;
      }

    },
    async addOrder() {
      this.loading = true;

      if (!this.Customer_Name || !this.Phone_Number || !this.Address || this.OrderDetailList.length <= 0) {
        this.loading = false;

        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: `Kiểm tra lại các trường`,
          confirmButtonText: 'OK'
        });
        return;

      }
      try {
        const formData = new FormData();
        formData.append('Customer_Name', this.Customer_Name);
        formData.append('OrderId', 0);
        formData.append('Phone_Number', this.Phone_Number);
        formData.append('Address', this.Address);
        formData.append('Total_Price', this.total);
        formData.append('Order_Status', this.Order_Status);
        if (this.dataPromotions != null && this.dataPromotions != "") {
          formData.append('PromotionCode', this.dataPromotions.codePromotions);

        }
        this.OrderDetailList.forEach((item, index) => {
          formData.append(`OrderDetailList[${index}].ProductID`, item.ProductID);
          formData.append(`OrderDetailList[${index}].ProductsSizeID`, item.ProductsSizeID);
          formData.append(`OrderDetailList[${index}].Product_Quantity`, item.Product_Quantity);
          formData.append(`OrderDetailList[${index}].Price_Details`, item.Price_Details);
        });
        await axios.post('/admin/add-order', formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }).then((response) => {
          if (response.data.code == 200) {
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
        }).finally(() => {
          this.loading = false;
        });
      } catch (error) {
        this.loading = false;

        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Đã có lỗi xảy ra server',
          confirmButtonText: 'OK'
        });
        return;
      }
    }
  }
}
</script>
<style scoped>
.promo-code-field {
  border: 1px solid #ccc;
  padding: 0.5rem;
  text-transform: uppercase;
  transition: all 0.2s linear;
  width: 48%;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  -moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  -o-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
}

.promo-code-field:hover,
.promo-code-field:focus {
  border: 1px solid #999;
}

.promo-code-cta {
  border-radius: 4px;
  font-size: 0.625rem;
  margin-left: 0.625rem;
  padding: 0.6875rem 1.25rem 0.625rem;
}

.basket-labels {
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  margin-top: 1.625rem;
}

.basket-labels ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.basket-labels li {
  color: #111;
  display: inline-block;
  padding: 0.625rem 0;
}

.basket-labels li.price:before,
.basket-labels li.subtotal:before {
  content: "";
}

.item {
  width: 55%;
}

.price,
.quantity,
.subtotal {
  width: 15%;
}

.subtotal {
  text-align: right;
}

.remove {
  bottom: 1.125rem;
  float: right;
  position: absolute;
  right: 0;
  text-align: right;
  width: 45%;
}

.remove button {
  background-color: transparent;
  color: #777;
  float: none;
  text-decoration: underline;
  text-transform: uppercase;
}

.item-heading {
  padding-left: 4.375rem;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

.basket-product {
  border-bottom: 1px solid #ccc;
  padding: 1rem 0;
  position: relative;
}

.product-image {
  width: 20%;
}

.product-details {
  width: 65%;
}

.item-product {
  display: flex;
  width: 55%;
}

.product-frame {
  border: 1px solid #aaa;
  max-width: 100%;
}

.basket-product {
  border-bottom: 1px solid #ccc;
  padding: 1rem 0;
  position: relative;
}

.basket-product:last-child {
  border-bottom: unset;
}

.product-details {
  padding: 0 1.5rem;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

.product-details h1 {
  font-size: 20px;
}

.basket-product {
  display: flex;
}

.quantity-field {
  background-color: #ccc;
  border: 1px solid #aaa;
  border-radius: 4px;
  font-size: 0.625rem;
  padding: 2px;
  width: 3.75rem;
}
</style>