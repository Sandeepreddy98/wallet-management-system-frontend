import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL

export const createWallet = (name, balance) =>{
  return   axios.post(`${API_URL}/wallet/setup`, { name, balance });
}

export const getWallet = (walletId) => {return axios.get(`${API_URL}/wallet/${walletId}`);}

export const transact = (walletId, amount, type) => {
  return   axios.post(`${API_URL}/transact/${walletId}`, { amount});
}

export const getTransactions = (walletId, page = 1, limit = 10) =>{
  const skip = (page - 1) * limit; // Calculate skip value
  return   axios.get(`${API_URL}/transact?walletId=${walletId}&skip=${skip}&limit=${limit}`);
}
