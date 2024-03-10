<template>
  <LoadingOverlay v-if="loading" />

  <div class="container-fluid pt-3">
    <div class="row mb-4 align-items-center">
      <div class="col-xl-4 col-sm-6 mb-xl-0 mb-4">
        <div class="card">
          <div class="card-body p-3">
            <div class="row align-items-center">
              <div class="col-9">
                <div class="numbers">
                  <p class="text-sm mb-0 text-uppercase font-weight-bold">Tổng tất cả sản phẩm</p>
                  <h5 class="font-weight-bolder">
                    {{ totalProducts }}
                  </h5>

                </div>
              </div>
              <div class="col-2 text-end">
                <div class="icon icon-shape bg-gradient-primary shadow-primary text-center rounded-circle">
                  <i class="fa-solid fa-list-ol iconList"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-4 col-sm-6 mb-xl-0 mb-4">
        <div class="card">
          <div class="card-body p-3">
            <div class="row align-items-center">
              <div class="col-9">
                <div class="numbers">
                  <p class="text-sm mb-0 text-uppercase font-weight-bold">Khách hàng đã đăng ký</p>
                  <h5 class="font-weight-bolder">
                    {{ getUserAllAuth }}
                  </h5>

                </div>
              </div>
              <div class="col-2 text-end">
                <div class="icon icon-shape bg-gradient-danger shadow-danger text-center rounded-circle">
                  <i class="fa-solid fa-users text-lg opacity-10"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-4 col-sm-6 mb-xl-0 mb-4">
        <div class="card">
          <div class="card-body p-3">
            <div class="row">
              <div class="col-9">
                <div class="numbers">
                  <p class="text-sm mb-0 text-uppercase font-weight-bold">Đơn hàng</p>
                  <h5 class="font-weight-bolder">
                    {{ countGetOrders }}
                  </h5>

                </div>
              </div>
              <div class="col-2 text-end">
                <div class="icon icon-shape bg-gradient-success shadow-success text-center rounded-circle">
                  <i class="fa-solid fa-cart-arrow-down text-lg opacity-10"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row ">

      <div class="col-xl-4 col-sm-6">
        <div class="card">
          <div class="card-body p-3">
            <div class="row align-items-center">
              <div class="col-9">
                <div class="numbers">
                  <p class="text-sm mb-0 text-uppercase font-weight-bold">Doanh thu hôm nay</p>
                  <h5 class="font-weight-bolder">
                    {{formatCurrency(calculateTotal)}}
                  </h5>


                </div>
              </div>
              <div class="col-2 text-end">
                <div class="icon icon-shape bg-gradient-warning shadow-warning text-center rounded-circle">

                  <i class="fa-solid fa-coins text-lg opacity-10"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-4 col-sm-6">
        <div class="card">
          <div class="card-body p-3">
            <div class="row align-items-center">
              <div class="col-9">
                <div class="numbers">
                  <p class="text-sm mb-0 text-uppercase font-weight-bold">Doanh thu tuần này</p>
                  <h5 class="font-weight-bolder">
                    {{formatCurrency(calculateTotalPayThisWeek)}}
                  </h5>

                </div>
              </div>
              <div class="col-2 text-end">
                <div class="icon icon-shape bg-gradient-warning shadow-warning text-center rounded-circle">
                  <i class="fa-solid fa-money-check-dollar text-lg opacity-10"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-4 col-sm-6">
        <div class="card">
          <div class="card-body p-3">
            <div class="row align-items-center">
              <div class="col-9">
                <div class="numbers">
                  <p class="text-sm mb-0 text-uppercase font-weight-bold">Doanh thu tháng này</p>
                  <h5 class="font-weight-bolder">
                    {{formatCurrency(calculateTotalPayThisMonth)}}
                  </h5>


                </div>
              </div>
              <div class="col-2 text-end">
                <div class="icon icon-shape bg-gradient-warning shadow-warning text-center rounded-circle">
                  <i class="fa-solid fa-sack-dollar text-lg opacity-10"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <Bar v-if="load"
           id="my-chart-id"
           :options="chartOptions"
           :data="chartData" ref="bar"
      />
    </div>
  </div>



</template>

<script>
import axios from "@/axios";
import { Bar } from 'vue-chartjs'

import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
import ChartDataLabels from 'chartjs-plugin-datalabels';
import LoadingOverlay from "@/components/Loading.vue";
export default {
  name: "index",
  components: {
    LoadingOverlay,
    Bar
  },
  data() {
    return {
      loading: false,
      totalProducts: null,
      categoryCounts: null,
      getUserAllAuth: null,
      countGetOrders: null,
      calculateTotal: null,
      calculateTotalPayThisWeek: null,
      percentageChangeWeek: null,
      percentageChangeToday: null,
      percentageChangeMonth: null,
      percentageChangeCart: null,
      percentageChangeUser: null,
      calculateTotalPayThisMonth: null,
      load: false,
      chartData: {
        labels: ['tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6', 'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'],
        datasets: [{
          data: [],
          label: 'Doanh thu theo tháng',
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
          ],
        }]
      },
      chartOptions: {
        responsive: true,
        plugins: {
          datalabels: {
            anchor: 'end',
            align: 'end',
            color: '#000',
            formatter: function (value) {
              return value.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'});
            },
          },
        },
      },
      dataChart:"",
      value1:'',
      value2:'',
      value3:''
    }
  },
  created() {
    this.loadDataReport();
  },
  mounted() {
    this.fetchData();
  },
  methods:{
    loadDataReport(){
      this.loading = false;
      axios.get("/admin/report")
          .then(res => {
            if(res.data.code == 200){
              this.totalProducts = res.data.productCount;
              this.getUserAllAuth = res.data.userCount;
              this.countGetOrders = res.data.orderCount;
              this.calculateTotal = res.data.totalRevenue;
              this.calculateTotalPayThisWeek = res.data.totalRevenueInWeek;
              this.calculateTotalPayThisMonth = res.data.totalRevenueInMonth;
              console.log(res.data);
            }else{
              console.log("Không có quyền hạn")
            }
          }).finally(() => {
        this.loading = false;
      });
    },
    formatCurrency(value) {
      const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      });
      return formatter.format(value);
    },
    fetchData() {
      axios.get("report/get-all-order")
          .then(res => {
            this.TotalOrder = res.data.data.totalOrder
            this.ToTalRevenue = res.data.data.toTalRevenue
          })
      let date = new Date()
      axios.get(`report/get-order-per-month?year=${date.getFullYear()}`)
          .then(res => {
            this.load = true;
            console.log(res.data.data)
            this.chartData.datasets[0].data = res.data.data.map(item => item.totalRevenue);

          })
    },

    drawChart() {
      // const ctx = this.$refs.bar.getContext('2d');
      // new Chart(ctx, {
      //   type: 'bar',
      //   data: this.chartData,
      //   options: this.chartOptions,
      //   plugins: [ChartDataLabels],
      // });
    },

  }
}
</script>

<style scoped>
i{
  font-size: 3em;
  opacity: 0.5;
}
.iconList{
  font-size: 1em;

}
</style>