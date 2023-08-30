import axios from 'axios'
import { DefaultApi as AuthApi } from 'src/api/auth'

export const axiosLoginInstance = axios.create()

export const authApi = new AuthApi(undefined, '', axiosLoginInstance)
