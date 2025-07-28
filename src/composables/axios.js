import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://urbanistit.com', // or use proxy if in dev
  headers: {
    "Content-Type": "application/json",
  },
})

// 🔐 Add a request interceptor to attach the token
instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('jwt') // or wherever you store it
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
)

export default instance