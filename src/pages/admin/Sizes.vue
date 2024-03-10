<template>
  <div class="container-fluid">
      <h2>Quản lý sizes</h2>
      <button data-toggle="modal" data-target="#AddCate" class="btn btn-success p-1 rounded mr-3 mb-1 float-left"><i
          class="fa-solid fa-square-plus"></i>
        Thêm mới
      </button>
      <table class="table table-bordered" id="getListItemsSizes">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Loại size</th>
            <td scope="col">Hành động</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(size, index) in sizes" :key="index">
            <td>{{ index + 1 }}</td>
            
            <td>{{ size.sizeName }}</td>
           
            <td>
              <button v-on:click="editBySize(size.sizesID)" class="btn btn-primary p-1 rounded mr-1"
                data-toggle="modal" data-target="#EditCate">
                <i class="fa-solid fa-pen-to-square"></i>
                Edit
              </button>
              |
              <button class="btn btn-danger p-1 rounded ml-1" @click="deleteSize(size.sizesID)">
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
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="EditCateLabel">Sửa size</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-12 ">
                <input type="hidden" v-model="SizesID">
                <div class="form-group mb-3">
                  <label for="NameProducts">Loại size</label>
                  <input type="text" v-model="SizeName" class="form-control" id="NameProducts" >
                </div>
                
              </div>
              
            </div>
  
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="editSize">Lưu </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="AddCate" tabindex="-1" role="dialog" aria-labelledby="AddCateLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="AddCateLabel">Thêm size</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-12 ">
                <div class="form-group mb-3">
                    <label for="NameProducts">Loại size</label>
                    <input type="text" v-model="SizeName" class="form-control" id="NameProducts" >
                </div>
              
              </div>
              
              
            </div>
  
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" @click="addSize">Lưu </button>
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
  
  export default {
    data() {
      return {
        sizes: [],

        SizesID: 0,
        SizeName: null,
      
      
      };
    },
    created() {
      this.loadDataSizes();
    },
    mounted() {
  
  
    },
    methods: {
        loadDataSizes() {
        axios.get('/admin/get-all-size').then((response) => {
          this.sizes = response.data.data;
        })
          .then(() => {
            $("#getListItemsSizes").DataTable({
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
          });
      },
      
     
      deleteSize(sizeID) {
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
            const formData = new FormData();
            formData.append('SizesID', sizeID);
            axios.post('/admin/sizes/delete', formData, {
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
            });
          }
        });
  
      },
      editBySize(id) {
        axios.get(`/admin/details-size/${id}`)
          .then(res => {
            this.SizesID = res.data.data.sizesID;
            this.SizeName = res.data.data.sizeName;
          }).catch((error) => {
            console.error(error);
  
          });
      },
      async editSize() {
        if (!this.SizeName) {
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
          formData.append('SizesID', this.SizesID);
          formData.append('SizeName', this.SizeName);
          
  
          await axios.post("/admin/sizes/update", formData,
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
            });
        } catch (error) {
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
  
      async addSize() {
        if (!this.SizeName) {
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
          formData.append('SizesID', this.SizesID);
          formData.append('SizeName', this.SizeName);
  
          await axios.post(`/admin/add-size`, formData,
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
            });
  
        } catch (error) {
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
      
  
    }
  }
  </script>
  