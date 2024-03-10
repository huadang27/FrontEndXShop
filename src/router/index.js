import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ShopView from "../views/ShopView.vue";
import CartView from "../views/CartView.vue";
import CheckoutView from "../views/CheckoutView.vue";
import ProductDetailsView from "../views/ProductDetailsView.vue";
import LoginView from "../views/LoginView.vue";
import SignupView from "../views/SignupView.vue";
import ForgotPasswordView from "../views/ForgotPasswordView.vue";
import admin from "./admin.js";
import Error from "../views/Error.vue";
import UserLayout from "../layouts/UserLayout.vue";
import AdminLayout from "../layouts/AdminLayout.vue";
import AdminHome from "../pages/admin/index.vue";
import AdminProduct from "../pages/admin/product.vue";
import AdminCategory from "../pages/admin/category.vue";
import AdminBrand from "../pages/admin/Brand.vue";
import AdminSupplier from "../pages/admin/Supplier.vue";
import AdminSizes from "../pages/admin/Sizes.vue";
import AdminPromotions from "../pages/admin/Promotions.vue";
import AdminBillInfo from "../pages/admin/billInfo.vue";
import UserControl from "../pages/admin/UserControl.vue";
import AdminLogin from "../pages/admin/AdminLogin.vue";
import AboutUs from "../views/AboutUs.vue";
import ContactUs from "../views/ContactUs.vue";
import CreadOrder from '../pages/admin/CreadOrder.vue'
import axios from '@/axios';
import VueCookies from "vue-cookies";

const routers = [...admin];

const accessToken = VueCookies.get("accessToken");

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: UserLayout,
      children: [
        {
          path: "",
          name: "home",
          component: HomeView,

          beforeEnter: (to, from, next) => {
            if (accessToken !== null) {
              next();
            } else {
              next({ name: "Login" });
            }
          },
        },
        {
          path: "shop",
          name: "shop",
          component: ShopView,
          beforeEnter: (to, from, next) => {
            if (accessToken !== null) {
              next();
            } else {
              next({ name: "Login" });
            }
          },
        },
        {
          path: "error",
          name: "error",
          component: Error,
        },
        {
          path: "Login",
          name: "Login",
          component: LoginView,
          beforeEnter: (to, from, next) => {
            const isLoggedIn = localStorage.getItem("isLoggedIn");
            if (isLoggedIn !== null) {
              next("/");
            } else {
              next();
            }
          },
        },
        {
          path: "checkout",
          name: "checkout",
          component: CheckoutView,
          beforeEnter: (to, from, next) => {
            if (accessToken !== null) {
              next();
            } else {
              next({ name: "Login" });
            }
          },
        },
        {
          path: "product-details/:id",
          name: "ProductDetailsView",
          component: ProductDetailsView,
          beforeEnter: (to, from, next) => {
            if (accessToken !== null) {
              next();
            } else {
              next({ name: "Login" });
            }
          },
        },
        {
          path: "CartView",
          name: "CartView",
          component: CartView,
          beforeEnter: (to, from, next) => {
            if (accessToken !== null) {
              next();
            } else {
              next({ name: "Login" });
            }
          },
          props: true,
        },
        {
          path: "Signup",
          name: "Signup",
          component: SignupView,
        },
        {
          path: "ForgotPassword",
          name: "ForgotPassword",
          component: ForgotPasswordView,
          beforeEnter: (to, from, next) => {
            if (accessToken !== null) {
              next();
            } else {
              next({ name: "Login" });
            }
          },
        },
        {
          path: "AboutUs",
          name: "AboutUs",
          component: AboutUs,
          beforeEnter: (to, from, next) => {
            if (accessToken !== null) {
              next();
            } else {
              next({ name: "Login" });
            }
          },
        },
        {
          path: "ContactUs",
          name: "ContactUs",
          component: ContactUs,
          beforeEnter: (to, from, next) => {
            if (accessToken !== null) {
              next();
            } else {
              next({ name: "Login" });
            }
          },
        },
      ],
    },
    {
      path: "/admin",
      beforeEnter: (to, from, next) => {
        const userRoleId = localStorage.getItem("RoleName");
        if (userRoleId !== null && userRoleId !== undefined) {
          if (userRoleId === "Admin" || userRoleId === "Sale") {
            next();
          } else {
            next("/error");
          }
        } else {
          next("/login");
        }
      },
      component: AdminLayout,
      children: [
        {
          path: "",
          name: "homeAdmin",
          component: AdminHome,
        },
        {
          path: "product",
          component: AdminProduct,
        },
        {
          path: "category",
          component: AdminCategory,
        },
        {
          path: "supplier",
          component: AdminSupplier,
        },
        {
          path: "sizes",
          component: AdminSizes,
        },
        {
          path: "brand",
          component: AdminBrand,
        },
        {
          path: "bill-info",
          component: AdminBillInfo,
        },
        {
          path: "UserControl",
          name: "UserControl",
          component: UserControl,
        },
        {
          path: "promotions",
          component: AdminPromotions,
        },
        {
          path: 'tao-don-hang',
          name:'CreadOrder',
          component: CreadOrder,

        },
      ],
    },
    {
      path: "/AdminLogin",
      name: "AdminLogin",
      component: AdminLogin,
    },

    // Other routes...
  ].concat(routers),
});

export default router;
