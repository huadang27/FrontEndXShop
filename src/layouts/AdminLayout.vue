<template>
  <div class="wrapper">
    <NavBar/>
    <AdminSideBar/>
    <div class="content-wrapper">

      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import AdminSideBar from '@/components/AdminSideBar.vue';
import NavBar from "@/components/NavBar.vue";
import { useRoute } from 'vue-router';
import axios from "@/axios";
import Swal from "sweetalert2";
import VueCookies from "vue-cookies";

export default {
  components: {
    AdminSideBar,
    NavBar
  },

  data(){
    return {
      currentRoute: {
        title: 'Trang chủ',
      },
    }
  },
  created() {
    this.loadRole();
  },
  methods: {
    loadRole(){
      axios
          .get('/refresh-role')
          .then((response) => {
            if(response.data.code == 200){
              if(response.data.getRole != "Admin" && response.data.getRole != "Sale"){
                localStorage.setItem('RoleName', response.data.getRole);

                this.$router.push({name: 'home'}).then(() => {
                  window.location.reload();
                });
              }else{
                localStorage.setItem('RoleName', response.data.getRole);

              }
              // Handle the response if needed

            }else{
              this.$router.push({name: 'home'}).then(() => {
                window.location.reload();
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
    }
  },
};
</script>

<style scoped>
.min-height-250.bg-primary.position-absolute.w-100 {
  min-height: 100px !important;
}
</style>
