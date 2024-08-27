import { reactive } from 'vue';

export const authState = reactive({
  loggedIn: localStorage.getItem('token') !== null
});

export function login() {
  authState.loggedIn = true;
}

export function logout() {
  authState.loggedIn = false;
}