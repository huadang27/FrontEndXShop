<template>
  <aside class="main-sidebar sidebar-dark-primary elevation-4">
    <!-- Brand Logo -->
    <a href="/" class="brand-link">
      <img src="../assets/images/logo_admin.png" class="brand-image " />
     
    </a>

    <!-- Sidebar -->
    <div class="sidebar">

      <!-- Sidebar Menu -->
      <nav class="mt-2">
        <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">

          <li class="nav-item">
            <RouterLink to="/admin" class="nav-link cursor-pointer" :class="{ 'active': currentRoute === '/admin' }">

              <i class="fa-solid fa-house-user"></i>
              <p>
                Trang chủ
              </p>

            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/admin/product" class="nav-link cursor-pointer"
                        :class="{ 'active': currentRoute === '/admin/product' }">

              <i class="fa-brands fa-product-hunt"></i>
              <p>
                Sản phẩm
              </p>

            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/admin/sizes" class="nav-link cursor-pointer"
                        :class="{ 'active': currentRoute === '/admin/sizes' }">

              <i class="fa-solid fa-dumpster-fire"></i>
              <p>
                Loại sizes
              </p>

            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/admin/category" class="nav-link cursor-pointer"
                        :class="{ 'active': currentRoute === '/admin/category' }">

              <i class="fa-solid fa-dumpster-fire"></i>
              <p>
                Loại sản phẩm
              </p>

            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/admin/brand" class="nav-link cursor-pointer"
                        :class="{ 'active': currentRoute === '/admin/brand' }">

                        <i class="fa-solid fa-earth-americas"></i>
              <p>
                Thương hiệu sản phẩm
              </p>

            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/admin/supplier" class="nav-link cursor-pointer"
                        :class="{ 'active': currentRoute === '/admin/supplier' }">

                        <i class="fa-solid fa-truck-field-un"></i>
              <p>
                Nhà cung cấp
              </p>

            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/admin/promotions" class="nav-link cursor-pointer"
                        :class="{ 'active': currentRoute === '/admin/promotions' }">

                        <i class="fa-brands fa-adversal"></i>
              <p>
                Khuyến mãi
              </p>

            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/admin/tao-don-hang" class="nav-link cursor-pointer"
                        :class="{ 'active': currentRoute === '/admin/tao-don-hang' }">

              <i class="fa-solid fa-cart-shopping"></i>
              <p>
                Quản lý đơn hàng
              </p>

            </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink to="/admin/UserControl" class="nav-link cursor-pointer"
                        :class="{ 'active': currentRoute === '/admin/UserControl' }">
              <i class="fa-solid fa-users"></i>
              <p>
                Quản lý User
              </p>
            </RouterLink>


          </li>
          <li class="nav-item">
            <RouterLink to="#" class="nav-link cursor-pointer" v-on:click="logout()"
                        :class="{ 'active': currentRoute === '#' }">

              <i class="fa-solid fa-arrow-right-from-bracket"></i>
              <p>
                Đăng xuất
              </p>

            </RouterLink>
          </li>

        </ul>
      </nav>
      <!-- /.sidebar-menu -->
    </div>
    <!-- /.sidebar -->
  </aside>
</template>

<script>
import {RouterLink} from 'vue-router';
import axios from "@/axios";
import Product from "@/pages/admin/product.vue";
import Swal from "sweetalert2";

export default {
  name: "AdminSideBar",
  components: {Product, RouterLink},
  data() {
    return {
      currentRoute: null,

    };
  },
  created() {
    this.currentRoute = this.$route.path;
  },
  watch: {
    '$route'(to, from) {
      this.currentRoute = to.path;
    },

  },

  methods: {

    logout() {
      axios
          .post('/logout')
          .then((response) => {
            if(response.data.code == 200){
              // Handle the response if needed
              localStorage.clear();
              this.$router.push({name: 'home'}).then(() => {
                window.location.reload();
              });
            }else{
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

          })
          .catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Lỗi',
              text: `${error}`,
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.isConfirmed) {
                return;
              }
            });
          });
    },
    checkApi(){
     const admin = localStorage.getItem('RoleId');
      axios.post('/getUserAdmin', { admin: admin })
          .then(response => {
            this.$router.push({name: 'UserControl'}).then(() => {
              window.location.reload();
            });
          })
          .catch(error => {
            console.log(error)
          });
    }
  }

}
</script>

<style scoped>
.text-span {
  font-size: 16px !important;
}
</style>