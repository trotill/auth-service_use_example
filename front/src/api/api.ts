import axios from 'axios'
import { AuthorizationApi, UserManagementApi } from 'src/api/auth'

export const axiosInstance = axios.create()

export const authApi = new AuthorizationApi(undefined, '', axiosInstance)
export const userApi = new UserManagementApi(undefined, '', axiosInstance)
