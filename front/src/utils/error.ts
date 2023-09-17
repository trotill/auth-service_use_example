import { QVueGlobals } from 'quasar/dist/types/globals'
import axios from 'axios'

export function showError ($q: QVueGlobals, e: unknown) {
  if (axios.isAxiosError(e)) {
    $q.notify({ message: `${e?.response?.data.message}, code: ${e?.response?.data.statusCode}`, type: 'negative' })
  }
}
