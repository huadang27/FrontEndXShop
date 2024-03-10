<template>
  <LoadingOverlay v-if="loading" />

  <div class="container-fluid">
    <h2>Quản lý danh mục</h2>
    <button data-toggle="modal" data-target="#AddCate" class="btn btn-success p-1 rounded mr-3 mb-1 float-left"><i
        class="fa-solid fa-square-plus"></i>
      Thêm mới
    </button>
    <table class="table table-bordered" id="getListItemsCate">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col" class="w-25">Ảnh</th>
          <th scope="col">Tên danh mục</th>
          <th scope="col">Trạng thái</th>
          <td scope="col">Hành động</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(category, index) in categories" :key="index">
          <td>{{ index + 1 }}</td>
          <td>
            <img :src="category.imageCategory" alt="Category Image" style="width: 60px;" />
          </td>
          <td>{{ category.categoryName }}</td>
          <td>
            <div style="cursor: pointer;" @click="changeDefault(category.categoryID)" :class="{ 'text-primary': !category.is_Default, 'text-success': category.is_Default }">
              <span>
                {{ category.is_Default ? 'Mặc định' : 'Không mặc định' }}
              </span>

            </div>
          </td>
          <td>
            <button v-on:click="editByCate(category.categoryID)" class="btn btn-primary p-1 rounded mr-1"
              data-toggle="modal" data-target="#EditCate">
              <i class="fa-solid fa-pen-to-square"></i>
              Edit
            </button>
            |
            <button class="btn btn-danger p-1 rounded ml-1" @click="deleteCategory(category.categoryID)">
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
          <h5 class="modal-title" id="EditCateLabel">Sửa danh mục</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-12 col-md-6 col-sm-6 col-lg-6">
              <input type="hidden" v-model="cateID">
              <div class="form-group mb-3">
                <label for="NameProducts">Tên danh mục</label>
                <input type="text" v-model="Name" class="form-control" id="NameProducts" required>
              </div>
              <div class="form-group mb-3">
                <label for="Details">Slug</label>
                <input type="text" v-model="Slug" class="form-control" id="Details" required>
              </div>
            </div>
            <div class="col-12 col-md-6 col-sm-6 col-lg-6">
              <div class="row">
                <div class="col-md-12 d-flex flex-column align-items-center" v-if="Image">
                  <img :src="Image" style="width: 50%" />
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
                Danh mục mặc định
              </label>
            </div>
          </div>

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" @click="editCate">Lưu </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="AddCate" tabindex="-1" role="dialog" aria-labelledby="AddCateLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="AddCateLabel">Thêm danh mục</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-12 col-md-6 col-sm-6 col-lg-6">
              <div class="form-group mb-3">
                <label for="NameProducts">Tên danh mục</label>
                <input type="text" v-model="Name" class="form-control" id="NameProducts" required @blur="generateSlug">
              </div>
              <div class="form-group mb-3">
                <label for="Details">Slug danh mục</label>
                <input type="text" v-model="Slug" class="form-control" id="Details" required>
              </div>
            </div>
            <div class="col-12 col-md-6 col-sm-6 col-lg-6">
              <div class="row">
                <div class="col-md-12 d-flex flex-column align-items-center" v-if="Image">
                  <img :src="Image" style="width: 50%" />
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
                Danh mục mặc định
              </label>
            </div>
          </div>

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Đóng</button>
          <button type="button" class="btn btn-primary" @click="addCategory">Lưu </button>
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
  components: {LoadingOverlay},
  data() {
    return {
      loading: false,

      categories: [],
      cateID: null,
      Image: null,
      Name: null,
      Details: null,
      imageFile: null,
      previewImage: null,
      uploadedImage: null,
      Slug: "",
      IsDefault: false,
      CategoryID: 0
    };
  },
  created() {
    this.loadDataCategory();
  },
  mounted() {



  },
  methods: {
    loadDataCategory() {
      this.loading = true;
      axios.get('/admin/get-all-category').then((response) => {
        this.categories = response.data.data;
      })
        .then(() => {
          $("#getListItemsCate").DataTable({
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
      let str = this.Name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
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
    deleteCategory(categoryId) {
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
          formData.append('CategoryID', categoryId);
          axios.post('/admin/category/delete', formData, {
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
    editByCate(id) {
      this.loading = true;

      axios.get(`/admin/details-category/${id}`)
        .then(res => {
          this.CategoryID = res.data.data.categoryID;
          this.Image = res.data.data.imageCategory;
          this.Name = res.data.data.categoryName;
          this.Slug = res.data.data.slug;
          this.IsDefault = res.data.data.is_Default;
          this.loading = false;

        }).catch((error) => {
        this.loading = false;

          console.error(error);

        });
    },
    async editCate() {
      this.loading = true;

      if (!this.Name || !this.Slug) {
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
        formData.append('CategoryID', this.CategoryID);
        formData.append('CategoryName', this.Name);
        formData.append('Slug', this.Slug);
        formData.append('Is_Default', this.IsDefault);
        if (this.$refs.image3.files[0] != null) {
          formData.append('PathCategory', this.$refs.image3.files[0]);

        }

        await axios.post("/admin/category/update", formData,
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

    async addCategory() {
      this.loading = true;

      if (!this.$refs.image4.files[0] || !this.Name) {
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
        formData.append('CategoryID', this.CategoryID);
        formData.append('CategoryName', this.Name);
        formData.append('Slug', this.Slug);
        formData.append('Is_Default', this.IsDefault);
        formData.append('PathCategory', this.$refs.image4.files[0]);

        await axios.post(`/admin/add-category`, formData,
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
    async changeDefault(categoryID) {
      try {
        this.loading = true;

        const formData = new FormData();
        formData.append('CategoryID', categoryID);

        await axios.post("/admin/category/change-default", formData,
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
    }

  }
}
</script>
