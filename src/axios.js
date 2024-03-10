import axios from 'axios';
import VueCookies from 'vue-cookies';

const accessToken = VueCookies.get('accessToken');

let config = {};
if (accessToken !== null) {
  config = {
    headers: { Authorization: `Bearer ${accessToken}` }
  };
}
// baseURL: "https://xshop.devtest.ink/api/v1/Items/",

const instance = axios.create({
  baseURL: "https://localhost:44389/api/v1/Items",
  withCredentials: true,
  ...config 
});

export default instance;
