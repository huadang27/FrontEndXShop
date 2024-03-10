<template>
  <div className="login-container">
    <div class="account section">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-6">
            <div class="login-form border p-5">
              <div class="text-center heading">
                <h2 class="mb-2">Login</h2>
                <p class="lead">
                  Không có tài khoản?
                  <router-link :to="{ name: 'Signup' }">
                   Tạo ngay

                  </router-link>
                </p>
              </div>
              <div v-if="mess != null" class="mb-4 text-center">
                <span  class="alert alert-danger">{{mess}}</span>

              </div>
              <form @submit.prevent="login">

                <div class="form-group mb-4">
                  <label for="#">Nhập tài khoản</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Nhập tài khoản"
                  v-model="userName" required/>
                </div>
                <span v-if="passwordError" class="alert alert-danger">{{ usernameError }}</span>

                <div class="form-group">
                  <label for="#">Nhập mật khẩu</label>
                  <a
                    class="float-right"
                    href=""
                    >Quên mật khẩu?</a
                  >
                  <input
                    type="password"
                    class="form-control"
                    placeholder="Nhập mật khẩu"
                    v-model="password" required/>
                </div>
                <span v-if="passwordError" class="alert alert-danger">{{ passwordError }}</span>

                <button
                  class="btn btn-main mt-3 btn-block"
                  type="submit"
                  >Đăng nhập</button
                >
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from '@/axios.js';
import VueCookies from 'vue-cookies';

export default {
  data(){
    return{
      userName: null,
      password: null,
      check: false,
      RememberMe: true,
      mess: null
    }
  },
  computed: {

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
    }
  },
  methods: {
    login() {
      const formData = new FormData();
      formData.append('UserName', this.userName);
      formData.append('Password', this.password);
      formData.append('RememberMe', this.RememberMe);
      axios.post('/login', formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((response) => {
          if (response.data.code == 200) {
            VueCookies.set('accessToken', response.data.token);
            localStorage.setItem('RoleName', response.data.roleName);
            this.$router.push({ name: 'home' }).then(() => {
              window.location.reload();

            });

          }else{
            this.mess = response.data.message;

          }

        })
        .catch((error) => {
          console.log(error);

        });
    }
  }
}
</script>

