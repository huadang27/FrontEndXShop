<template>
  <LoadingOverlay v-if="loading" />

  <div class="container-fluid">
      <h2>Quản lý thương hiệu</h2>
      <button data-toggle="modal" data-target="#AddCate" class="btn btn-success p-1 rounded mr-3 mb-1 float-left"><i
          class="fa-solid fa-square-plus"></i>
        Thêm mới
      </button>
      <table class="table table-bordered" id="getListItemsBrand">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col" class="w-25">Ảnh</th>
            <th scope="col">Tên thương hiệu</th>
            <th scope="col">Trạng thái</th>
            <td scope="col">Hành động</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(brand, index) in brands" :key="index">
            <td>{{ index + 1 }}</td>
            <td>
              <img :src="brand.imageBrand" alt="Category Image" style="width: 60px;" />
            </td>
            <td>{{ brand.brandName }}</td>
            <td>
              <div style="cursor: pointer;" @click="changeDefault(brand.brandID)" :class="{ 'text-primary': !brand.is_Default, 'text-success': brand.is_Default }">
                <span>
                  {{ brand.is_Default ? 'Mặc định' : 'Không mặc định' }}
                </span>
  
              </div>
            </td>
            <td>
              <button v-on:click="editByBrand(brand.brandID)" class="btn btn-primary p-1 rounded mr-1"
                data-toggle="modal" data-target="#EditCate">
                <i class="fa-solid fa-pen-to-square"></i>
                Edit
              </button>
              |
              <button class="btn btn-danger p-1 rounded ml-1" @click="deleteBrand(brand.brandID)">
                <i class="fa-regular fa-trash-can"></i>
                Delete
              </button>
            </td>
          </tr>
  
        </tbody>
      </table>
    </div>
    <!--   add product-->
    <div class="modal fade" id="EditCate" tabindex="-1" role="dialog" aria-labelledby="EditCateLabel" aria-hidden="true">
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="EditCateLabel">Sửa thương hiệu</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-12 col-md-6 col-sm-6 col-lg-6">
                <input type="hidden" v-model="BrandID">
                <div class="form-group mb-3">
                  <label for="NameProducts">Tên thương hiệu</label>
                  <input type="text" v-model="BrandName" class="form-control" id="NameProducts" required>
                </div>
                <div class="form-group mb-3">
                  <label for="Details">Slug</label>
                  <input type="text" v-model="Slug" class="form-control" id="Details" required>
                </div>
              </div>
              <div class="col-12 col-md-6 col-sm-6 col-lg-6">
                <div class="row">
                  <div class="col-md-12 d-flex flex-column align-items-center" v-if="ImageBrand">
                    <img :src="ImageBrand" style="width: 50%" />
                    <p class="text-center">Ảnh đang có</p>
                  </div>
                  <div class="col-md-12 d-flex flex-column align-items-center">
                    <label>
                      Chọn ảnh
                    </label>
                    <input type="file" ref="image3" v-on:change="onFileChange" accept="image/*" required>
                    <img :src="previewImage" alt="" style="width:50%" />
                    <p class="text-center">Ảnh mới</p>
                  </div>
                </div>
              </div>
              <div class="form-check">
                <input class="form-check-input" v-model="IsDefault" type="checkbox" value="" id="flexCheckDefault">
                <label class="form-check-label" for="flexCheckDefault">
                  Thương hiệu mặc định
                </label>
              </div>
            </div>
  
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="editBrand">Lưu </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="AddCate" tabindex="-1" role="dialog" aria-labelledby="AddCateLabel" aria-hidden="true">
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="AddCateLabel">Thêm thương hiệu</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-12 col-md-6 col-sm-6 col-lg-6">
                <div class="form-group mb-3">
                  <label for="NameProducts">Tên thương hiệu</label>
                  <input type="text" v-model="BrandName" class="form-control" id="NameProducts" required @blur="generateSlug">
                </div>
                <div class="form-group mb-3">
                  <label for="Details">Slug thương hiệu</label>
                  <input type="text" v-model="Slug" class="form-control" id="Details" required>
                </div>
              </div>
              <div class="col-12 col-md-6 col-sm-6 col-lg-6">
                <div class="row">
                  <div class="col-md-12 d-flex flex-column align-items-center" v-if="ImageBrand">
                    <img :src="ImageBrand" style="width: 50%" />
                    <p class="text-center">Ảnh đang có</p>
                  </div>
                  <div class="col-md-12 d-flex flex-column align-items-center">
                    <label>
                      Chọn ảnh
                    </label>
                    <input type="file" ref="image4" v-on:change="onFileChange" accept="image/*" required>
                    <img :src="previewImage" alt="" style="width:50%" />
                    <p class="text-center">Ảnh mới</p>
                  </div>
                </div>
              </div>
              <div class="form-check">
                <input class="form-check-input" v-model="IsDefault" type="checkbox" value="" id="flexCheckDefault">
                <label class="form-check-label" for="flexCheckDefault">
                  Thương hiệu mặc định
                </label>
              </div>
            </div>
  
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" @click="addBrand">Lưu </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  .btn {
    font-size: 16px;
  }
  
  .pagination a {
    display: flex !important;
  }
  </style>
  
  <script>
  import axios from "@/axios";
  import Swal from "sweetalert2";
  import LoadingOverlay from "@/components/Loading.vue";

  export default {
    components: {
      LoadingOverlay
    },
    data() {
      return {
        loading: false,
        brands: [],

        BrandID: 0,
        BrandName: null,
        Slug: null,
        ImageBrand: null,

        imageFile: null,
        previewImage: null,
        uploadedImage: null,
      
        IsDefault: false,
      
      };
    },
    created() {
      this.loadDataBrand();
    },
    mounted() {
  
  
    },
    methods: {
      loadDataBrand() {
        this.loading = true;
        axios.get('/admin/get-all-brand').then((response) => {
          this.brands = response.data.data;
        })
          .then(() => {
            $("#getListItemsBrand").DataTable({
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
      generateSlug() {
        let str = this.BrandName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
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
      deleteBrand(brandID) {
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
            formData.append('BrandID', brandID);
            axios.post('/admin/brand/delete', formData, {
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
      editByBrand(id) {
        this.loading = true;

        axios.get(`/admin/details-brand/${id}`)
          .then(res => {
            this.BrandID = res.data.data.brandID;
            this.BrandName = res.data.data.brandName;
            this.ImageBrand = res.data.data.imageBrand;
            this.Slug = res.data.data.slug;
            this.IsDefault = res.data.data.is_Default;
            this.loading = false;

          }).catch((error) => {
            this.loading = false;

            console.error(error);
  
          });
      },
      async editBrand() {
        this.loading = true;

        if (!this.BrandName || !this.Slug) {
          this.loading = false;

          Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Kiểm tra đã nhập các dữ liệu',
            confirmButtonText: 'OK'
          });
          return;
  
        }
        try {
          const formData = new FormData();
          formData.append('BrandID', this.BrandID);
          formData.append('BrandName', this.BrandName);
          formData.append('Slug', this.Slug);
          formData.append('Is_Default', this.IsDefault);
          if (this.$refs.image3.files[0] != null) {
            formData.append('PathBrand', this.$refs.image3.files[0]);
  
          }
  
          await axios.post("/admin/brand/update", formData,
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
            text: 'Đã có lỗi xảy ra',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
        }
      },
  
      async addBrand() {
        this.loading = true;
        if (!this.$refs.image4.files[0] || !this.BrandName) {
          this.loading = false;

          Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Kiểm tra đã nhập các dữ liệu',
            confirmButtonText: 'OK'
          });
          return;
  
        }
        try {
          const formData = new FormData();
          formData.append('BrandID', this.BrandID);
          formData.append('BrandName', this.BrandName);
          formData.append('Slug', this.Slug);
          formData.append('Is_Default', this.IsDefault);
          formData.append('PathBrand', this.$refs.image4.files[0]);
  
          await axios.post(`/admin/add-brand`, formData,
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
            text: 'Đã có lỗi xảy ra',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              return;
  
            }
          });
        }
      },
      async changeDefault(brandID) {
        try {
          this.loading = true;

          const formData = new FormData();
          formData.append('BrandID', brandID);
  
          await axios.post("/admin/brand/change-default", formData,
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
            text: 'Đã có lỗi xảy ra',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
        }
      }
  
    }
  }
  </script>
  