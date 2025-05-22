import { reactive } from 'vue';

export const auth = reactive({
  user: null,
  token: null,
  roles: [],
  isLoggedIn: false,
});
