<template>
  <div class="container-fluid">
        <h2>Quản lý khuyến mãi</h2>
        <button data-toggle="modal" data-target="#AddCate" class="btn btn-success p-1 rounded mr-3 mb-1 float-left"><i
                class="fa-solid fa-square-plus"></i>
            Thêm mới
        </button>
        <table class="table table-bordered" id="getListItemsPromotions">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Code khuyến mãi</th>
                    <th scope="col">Loại khuyến mãi</th>
                    <th scope="col">Phần trăm giảm</th>
                    <th scope="col">Điều kiện khuyến mãi</th>
                    <th scope="col">Trạng thái</th>
                    <td scope="col">Hành động</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(promotion, index) in Promotions" :key="index">
                    <td>{{ index + 1 }}</td>
                   
                    <td>{{ promotion.codePromotions }}</td>
                    <td>{{ promotion.promotionsName }}</td>
                    <td>{{ promotion.discount_Percentage }}%</td>
                    <td>Đơn hàng lớn hơn {{ formatCurrency(promotion.conditionsValue) }}</td>
                    <td>
                        <div style="cursor: pointer;" @click="changeDefault(promotion.promotionsID)"
                            :class="{ 'text-primary': !promotion.is_Active, 'text-success': promotion.is_Active }">
                            <span>
                                {{ promotion.is_Active ? 'Hoạt động' : 'Không hoạt động' }}
                            </span>

                        </div>
                    </td>
                    <td>
                        <button v-on:click="editByPromotions(promotion.promotionsID)" class="btn btn-primary p-1 rounded mr-1"
                            data-toggle="modal" data-target="#EditCate">
                            <i class="fa-solid fa-pen-to-square"></i>
                            Edit
                        </button>
                        |
                        <button class="btn btn-danger p-1 rounded ml-1" @click="deletePromotions(promotion.promotionsID)">
                            <i class="fa-regular fa-trash-can"></i>
                            Delete
                        </button>
                    </td>
                </tr>

            </tbody>
        </table>
    </div>
    <!--   add product-->
    <div class="modal fade" id="EditCate" tabindex="-1" role="dialog" aria-labelledby="EditCateLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="EditCateLabel">Sửa mã khuyến mãi</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-12">
                            <input type="hidden" v-model="PromotionsID">
                            <div class="form-group mb-3">
                                <label for="NameProducts">Code khuyến mãi</label>
                                <input type="text" v-model="CodePromotions" class="form-control" id="NameProducts"
                                    required>
                            </div>
                            <div class="form-group mb-3">
                                <label for="Details">Loại code</label>
                                <input type="text" v-model="PromotionsName" class="form-control" id="Details" required>
                            </div>
                            <div class="form-group mb-3">
                                <label for="Details">Phần trăm giảm</label>
                                <input type="number" v-model="Discount_Percentage" class="form-control" id="Details"
                                    required>
                            </div>
                            <div class="form-group mb-3">
                                <label for="Details">Điều kiện(có thể để trống)</label>
                                <input type="number" v-model="ConditionsValue" class="form-control" id="Details"
                                    required>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" v-model="IsActive" type="checkbox" value=""
                                    id="flexCheckDefault">
                                <label class="form-check-label" for="flexCheckDefault">
                                    Tình trạng khuyến mãi
                                </label>
                            </div>
                        </div>


                    </div>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" @click="editPromotions">Lưu </button>
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
                        <div class="col-12">
                            <div class="form-group mb-3">
                                <label for="NameProducts">Code khuyến mãi</label>
                                <input type="text" v-model="CodePromotions" class="form-control" id="NameProducts"
                                    required>
                            </div>
                            <div class="form-group mb-3">
                                <label for="Details">Loại code</label>
                                <input type="text" v-model="PromotionsName" class="form-control" id="Details" required>
                            </div>
                            <div class="form-group mb-3">
                                <label for="Details">Phần trăm giảm</label>
                                <input type="number" v-model="Discount_Percentage" class="form-control" id="Details"
                                    required>
                            </div>
                            <div class="form-group mb-3">
                                <label for="Details">Điều kiện(có thể để trống)</label>
                                <input type="number" v-model="ConditionsValue" class="form-control" id="Details"
                                    required>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" v-model="IsActive" type="checkbox" value=""
                                    id="flexCheckDefault">
                                <label class="form-check-label" for="flexCheckDefault">
                                    Tình trạng khuyến mãi
                                </label>
                            </div>
                        </div>


                    </div>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Đóng</button>
                    <button type="button" class="btn btn-primary" @click="addPromotions">Lưu </button>
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
            Promotions: [],
            PromotionsID: 0,
            CodePromotions: null,
            PromotionsName: null,
            Discount_Percentage: 0,
            ConditionsValue: 0,
            IsActive: false,

        };
    },
    created() {
        this.loadDataPromotions();
    },
    mounted() {


    },
    methods: {
        formatCurrency(value) {
      const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      });
      return formatter.format(value);
    },
        loadDataPromotions() {
            axios.get('/admin/get-all-promotions')
                .then((response) => {
                    this.Promotions = response.data.data;
                })
                .then(() => {
                    $("#getListItemsPromotions").DataTable({
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


        deletePromotions(PromotionsID) {
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
                    formData.append('PromotionsID', PromotionsID);
                    axios.post('/admin/promotions/delete', formData, {
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
        editByPromotions(id) {
            axios.get(`/admin/details-promotions/${id}`)
                .then(res => {
                    this.PromotionsID = res.data.data.promotionsID;
                    this.CodePromotions = res.data.data.codePromotions;
                    this.PromotionsName = res.data.data.promotionsName;
                    this.Discount_Percentage = res.data.data.discount_Percentage;
                    this.IsActive = res.data.data.is_Active;
                    this.ConditionsValue = res.data.data.conditionsValue;
                }).catch((error) => {
                    console.error(error);

                });
        },
        async editPromotions() {
            if (!this.CodePromotions || !this.PromotionsName) {
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
                formData.append('PromotionsID', this.PromotionsID);
                formData.append('CodePromotions', this.CodePromotions);
                formData.append('PromotionsName', this.PromotionsName);
                formData.append('ConditionsValue', this.ConditionsValue);
                formData.append('Discount_Percentage', this.Discount_Percentage);
                formData.append('Is_Active', this.IsActive);


                await axios.post("/admin/promotions/update", formData,
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

        async addPromotions() {
            if (!this.CodePromotions || !this.PromotionsName) {
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
                formData.append('PromotionsID', this.PromotionsID);
                formData.append('CodePromotions', this.CodePromotions);
                formData.append('PromotionsName', this.PromotionsName);
                formData.append('ConditionsValue', this.ConditionsValue);
                formData.append('Discount_Percentage', this.Discount_Percentage);
                formData.append('Is_Active', this.IsActive);
                await axios.post(`/admin/add-promotions`, formData,
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
        async changeDefault(PromotionsID) {
            try {
                const formData = new FormData();
                formData.append('PromotionsID', PromotionsID);

                await axios.post("/admin/promotions/change-active", formData,
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
        }

    }
}
</script>