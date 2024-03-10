<template>
  <div class="container-fluid ">
    <h1>Quản lý User</h1>
    <button data-toggle="modal" data-target="#AddUser" @click="reData"
            class="btn btn-success p-1 rounded mr-3 mb-1 float-left"><i
        class="fa-solid fa-square-plus"></i>
      Thêm user
    </button>
    <table class="table-bordered table" id="dataUserTable">
      <thead>
      <tr>
        <th>#</th>
        <th>avatar</th>
        <th class="text-nowrap">Tên tài khoản</th>
        <th class="text-nowrap">Tên người dùng</th>
        <th class="text-nowrap">Chức năng</th>
        <th class="text-nowrap">Số điện thoại</th>
        <th class="text-nowrap">Email</th>
        <th></th>

      </tr>
      </thead>
      <tbody>
      <tr v-for="(user,index) in dataUser" :key="index">
        <td>{{ index }}</td>
        <td><img :src="user.avatartPath" style="width: 100px; height: auto"/></td>
        <td>{{ user.userName }}</td>
        <td>{{ user.fullName }}</td>
        <td>{{ user.getRole }}</td>
        <td>{{ user.phoneNumber }}</td>
        <td>{{ user.email }}</td>
        <td style="width: 16em">
          <button class="btn btn-primary p-1 rounded mr-1" data-toggle="modal" data-target="#AddUser"
                  @click="getIdUser(user)">
            <i class="fa-solid fa-pen-to-square"></i>
            Sửa
          </button>

          <button class="btn btn-warning p-1 rounded mr-1" @click="UpdatePassWord(user)">
            <i class="fa-solid fa-key"></i>
          </button>

          <button class="btn btn-danger p-1 rounded ml-1" v-on:click="deleteUser(user.id)">
            <i class="fa-regular fa-trash-can"></i>
            Xóa
          </button>
        </td>

      </tr>
      </tbody>
    </table>
    <!--    add edit người dùng -->
    <div class="modal fade" id="AddUser" tabindex="-1" role="dialog" aria-labelledby="AddUserLabel"
         aria-hidden="true">
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="AddUserLabel">
              {{ type === "" ? 'Thêm người dùng' : "Cập nhật thông tin" }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-12 col-md-6 col-sm-6 col-lg-6">
                <div class="form-group mb-3">
                  <label for="userName">Tên tài khoản</label>
                  <input type="text" v-model="userName" class="form-control" required>
                  <span v-if="usernameError !== ''" class="alert alert-danger">{{ usernameError }}</span>

                </div>
                <div class="form-group mb-3">
                  <label for="password">Mật khẩu</label>
                  <input type="password" v-model="password" class="form-control" required>
                  <span v-if="passwordError !== ''" class="alert alert-danger">{{ passwordError }}</span>

                </div>
                <div class="form-group mb-3">
                  <label for="fullName">Tên người dùng</label>
                  <input type="text" v-model="fullName" class="form-control" required>
                </div>
                <div class="form-group mb-3">
                  <label for="avatar">Avartar</label>
                  <input type="file" accept="image/*" @change="handleFileUpload" class="form-control">
                </div>
              </div>
              <div class="col-12 col-md-6 col-sm-6 col-lg-6">

                <div class="form-group mb-3">
                  <label for="PhoneNumber">Số điện thoại</label>
                  <input type="text" v-model="PhoneNumber" class="form-control" required>
                  <span v-if="isInvalidInput" class="alert-danger alert">Vui lòng chỉ nhập số</span>
                </div>
                <div class="form-group mb-3">
                  <label for="Address">Địa chỉ</label>
                  <input type="text" v-model="Address" class="form-control" required>
                </div>
                <div class="form-group mb-3">
                  <label for="Email">Email</label>
                  <input type="text" v-model="Email" class="form-control" required>
                </div>
                <div class="form-group mb-3">
                  <label for="Email">Role</label>
                  <select type="text" v-model="role" class="form-control">
                    <option value="Member">Member</option>
                    <option value="Sale">Sale</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" :disabled="isDisabled" v-on:click="addUser">Lưu</button>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div class="modal fade" id="DetailsUser" tabindex="-1" role="dialog" aria-labelledby="DetailsUserLabel"
         aria-hidden="true">
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="DetailsUserLabel">Chi tiết người dùng</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true" @click="reData">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-12 col-md-6 col-sm-6 col-lg-6">
                <div class="form-group mb-3">
                  <input type="hidden" v-model="idUser"/>
                  <label for="userName">Tên tài khoản</label>
                  <input type="text" v-model="userName" class="form-control" readonly>
                  <span v-if="usernameError !== ''" class="alert alert-danger">{{ usernameError }}</span>

                </div>
                <div class="form-group mb-3">
                  <label for="password">Mật khẩu</label>
                  <input type="password" v-model="password" class="form-control" readonly>
                  <span v-if="passwordError !== ''" class="alert alert-danger">{{ passwordError }}</span>

                </div>
                <div class="form-group mb-3">
                  <label for="fullName">Tên người dùng</label>
                  <input type="text" v-model="fullName" class="form-control" readonly>
                </div>
              </div>
              <div class="col-12 col-md-6 col-sm-6 col-lg-6">

                <div class="form-group mb-3">
                  <label for="PhoneNumber">Số điện thoại</label>
                  <input type="text" v-model="PhoneNumber" class="form-control" readonly>
                </div>
                <div class="form-group mb-3">
                  <label for="Address">Địa chỉ</label>
                  <input type="text" v-model="Address" class="form-control" readonly>
                </div>
                <div class="form-group mb-3">
                  <label for="Email">Email</label>
                  <input type="email" v-model="Email" class="form-control" readonly>
                </div>
              </div>

            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="reData" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import Swal from "sweetalert2";
import axios from '@/axios.js';

export default {
  name: "UserControl",
  data() {
    return {
      dataUser: "",
      idUser: '',
      userName: '',
      password: '',
      fullName: '',
      PhoneNumber: '',
      Address: '',
      Email: '',
      role: "Member",
      submitted: false,
      isInvalidInput: false,
      type: "",
      avatarFile: null
    }
  },

  mounted() {
    axios.get('admin/get-user',)
        .then((response) => {
          this.dataUser = response.data.data;
          return Promise.resolve();
        })
        .then(() => {
          $("#dataUserTable").DataTable({
            ...this.$globalConfig.createDataTableConfig(),

            'columnDefs': [{
              'targets': [-1],
              'orderable': false,
            }],
            searching: true,
            preDrawCallback: function(settings) {
              $('.dataTables_filter input').val('');
            },
            iDisplayLength: 10,
            "ordering": false,
            lengthChange: false,
            aaSorting: [[0, "asc"]],
            aLengthMenu: [
              [5, 10, 25, 50, 100, -1],

              ["5 dòng", "10 dòng", "25 dòng", "50 dòng", "100 dòng", "Tất cả"],
            ],
          })
        });


  },
  computed: {
    isInvalidInput() {
      return isNaN(this.PhoneNumber);
    },
    usernameError() {
      if (!this.userName) {
        return '';
      }
      if (/\s/.test(this.userName)) {
        return 'Không được nhập khoảng trắng';
      }
      if (this.userName.length < 1 || this.userName.length > 30) {
        return 'Username phải có từ 1 đến 30 ký tự';
      }
      if (this.userName.includes('=')) {
        return 'Username không được chứa ký tự "="';
      }
      return '';
    },
    passwordError() {
      if (!this.password) {
        return '';
      }
      if (/\s/.test(this.password)) {
        return 'Không được nhập khoảng trắng';
      }
      if (this.password.length < 1 || this.password.length > 30) {
        return 'Password phải có từ 1 đến 30 ký tự';
      }
      if (this.password.includes('=')) {
        return 'Password không được chứa ký tự "="';
      }
      return '';
    },
    isDisabled() {
      return (
          this.isInvalidInput ||
          this.usernameError !== '' ||
          this.passwordError !== ''
      );
    },
  },
  methods: {
    reData() {
      this.idUser = "";
      this.userName = "";
      this.fullName = "";
      this.PhoneNumber = "";
      this.Address = "";
      this.Email = "";
      this.type = ""
    },
    getIdUser(user) {
      this.idUser = user.id;
      this.userName = user.userName;
      this.fullName = user.fullName;
      this.PhoneNumber = user.phoneNumber;
      this.Address = user.address;
      this.Email = user.email;
      this.type = "Cập nhật"
    },
    deleteUser(id) {
      Swal.fire({
        title: 'Bạn có chắc chắn?',
        text: "User này sẽ bị xóa!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Đồng ý!'
      }).then((result) => {
        if (result.isConfirmed) {
          axios
              .delete(`/admin/userDeleteId?id=${id}`)
              .then((response) => {
                console.log(response.data);
                Swal.fire(
                    'Đã xóa!',
                    'User đã xóa',
                    'success'
                );
                window.location.reload();

              })
              .catch((error) => {
                console.error(error);
                Swal.fire(
                    'Lỗi',
                    'Lỗi xóa',
                    'error'
                );
              });
        }
      });
    },
    addUser() {

      if (this.idUser == "") {
        axios.post(
            '/admin/create-acount',
            {
              UserName: this.userName,
              PasswordUser: this.password,
              FullName: this.fullName,
              Email: this.Email,
              PhoneNumber: this.PhoneNumber,
              Address: this.Address,
              roleName: this.role,
              PasswordHash: this.password,
              PrPathUser: this.avatarFile
            },
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
        ).then((response) => {
          Swal.fire({
            icon: 'success',
            title: 'Thành công',
            text: 'Đã lưu thành công',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          }).catch(er => {
            Swal.fire({
              icon: 'error',
              title: 'Lỗi',
              text: 'Đã có lỗi xảy ra server',
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.reload();
              }
            });
          });
        })
      } else {
        axios.post(
            '/admin/edit-user',
            {
              AvatarFile: this.avatarFile,
              UserName: this.userName,
              PasswordUser: this.password,
              FullName: this.fullName,
              Email: this.Email,
              PhoneNumber: this.PhoneNumber,
              Address: this.Address,
              IsActive: true,
              roleName: this.role
            },
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
        ).then((response) => {
          Swal.fire({
            icon: 'success',
            title: 'Thành công',
            text: 'Đã lưu thành công',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          }).catch(er => {
            Swal.fire({
              icon: 'error',
              title: 'Lỗi',
              text: 'Đã có lỗi xảy ra server',
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.reload();
              }
            });
          });
        })
      }
    },
    handleFileUpload(event) {
      let file = event.target.files[0];
      // Gán giá trị của tệp tin vào biến avatarFile
      this.avatarFile = file;
    },
    UpdatePassWord(user) {
      console.log(user.id)
      let pass = prompt("Nhập mật khẩu mới:")
      if (pass === null || pass === "" || pass === undefined) {
        return;
      }

      axios.post("admin/change-password/new-pass", {
            email: user.email,
            newPass: pass
          },
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          }).then(res => {
        if (res.data.code === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Thành công',
            text: 'Đã cập nhật thành công',
            confirmButtonText: 'OK'
          })
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Thất bại',
            text:res.data.message,
            confirmButtonText: 'OK'
          })
        }

      }).catch(err => {
        Swal.fire({
          icon: 'error',
          title: 'Thất bại',
          confirmButtonText: 'OK'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
