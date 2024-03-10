<template>
  <div class="container-fluid">
        <h2>Quản lý nhà cung cấp</h2>
        <button data-toggle="modal" data-target="#AddCate" class="btn btn-success p-1 rounded mr-3 mb-1 float-left"><i
                class="fa-solid fa-square-plus"></i>
            Thêm mới
        </button>
        <table class="table table-bordered" id="getListItemsBrand">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Tên nhà cung cấp</th>
                    <th scope="col">Trạng thái</th>
                    <td scope="col">Hành động</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(supplier, index) in suppliers" :key="index">
                    <td>{{ index + 1 }}</td>

                    <td>{{ supplier.supplierName }}</td>
                    <td>
                        <div style="cursor: pointer;" @click="changeDefault(supplier.supplierID)"
                            :class="{ 'text-primary': !supplier.is_Default, 'text-success': supplier.is_Default }">
                            <span>
                                {{ supplier.is_Default ? 'Mặc định' : 'Không mặc định' }}
                            </span>

                        </div>
                    </td>
                    <td>
                        <button v-on:click="editBySupplier(supplier.supplierID)" class="btn btn-primary p-1 rounded mr-1"
                            data-toggle="modal" data-target="#EditCate">
                            <i class="fa-solid fa-pen-to-square"></i>
                            Edit
                        </button>
                        |
                        <button class="btn btn-danger p-1 rounded ml-1" @click="deleteSupplier(supplier.supplierID)">
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
                    <h5 class="modal-title" id="EditCateLabel">Sửa nhà cung cấp</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-12 ">
                            <input type="hidden" v-model="SupplierID">
                            <div class="form-group mb-3">
                                <label for="NameProducts">Tên nhà cung cấp</label>
                                <input type="text" v-model="SupplierName" class="form-control" id="NameProducts"
                                    required>
                            </div>
                          <div class="form-check">
                            <input class="form-check-input" v-model="IsDefault" type="checkbox" value=""
                                   id="flexCheckDefault">
                            <label class="form-check-label" for="flexCheckDefault">
                              Nhà cung cấp mặc định
                            </label>
                          </div>
                        </div>


                    </div>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" @click="editSupplier">Lưu </button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="AddCate" tabindex="-1" role="dialog" aria-labelledby="AddCateLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="AddCateLabel">Thêm nhà cung cấp</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-12 ">
                            <div class="form-group mb-3">
                                <label for="NameProducts">Tên nhà cung cấp</label>
                                <input type="text" v-model="SupplierName" class="form-control" id="NameProducts" required>
                            </div>
                          <div class="form-check">
                            <input class="form-check-input" v-model="IsDefault" type="checkbox" value=""
                                   id="flexCheckDefault">
                            <label class="form-check-label" for="flexCheckDefault">
                              Nhà cung cấp mặc định
                            </label>
                          </div>
                        </div>


                    </div>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Đóng</button>
                    <button type="button" class="btn btn-primary" @click="addSupplier">Lưu </button>
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
            suppliers: [],

            SupplierID: 0,
            SupplierName: null,
            IsDefault: false,

        };
    },
    created() {
        this.loadDataSupplier();
    },
    mounted() {


    },
    methods: {
        loadDataSupplier() {
            axios.get('/admin/get-all-supplier').then((response) => {
                this.suppliers = response.data.data;
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
                });
        },

        deleteSupplier(supplierID) {
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
                    formData.append('SupplierID', supplierID);
                    axios.post('/admin/supplier/delete', formData, {
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
        editBySupplier(id) {
            axios.get(`/admin/details-supplier/${id}`)
                .then(res => {
                    this.SupplierID = res.data.data.supplierID;
                    this.SupplierName = res.data.data.supplierName;
                    this.IsDefault = res.data.data.is_Default;
                }).catch((error) => {
                    console.error(error);

                });
        },
        async editSupplier() {
            if (!this.SupplierName ) {
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
                formData.append('SupplierID', this.SupplierID);
                formData.append('SupplierName', this.SupplierName);
                formData.append('Is_Default', this.IsDefault);
                
                await axios.post("/admin/supplier/update", formData,
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

        async addSupplier() {
            if (!this.SupplierName) {
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
                formData.append('SupplierID', this.SupplierID);
                formData.append('SupplierName', this.SupplierName);
                formData.append('Is_Default', this.IsDefault);

                await axios.post(`/admin/add-supplier`, formData,
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
        async changeDefault(supplierID) {
            try {
                const formData = new FormData();
                formData.append('SupplierID', supplierID);

                await axios.post("/admin/supplier/change-default", formData,
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