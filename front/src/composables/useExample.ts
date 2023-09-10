import axios from 'axios'
import { ref } from 'vue'
import { useQuasar } from 'quasar'

export function useExample () {
  const incDecValue = ref(0)
  const $q = useQuasar()

  function incrementReq () {
    return axios.post('/api/increment')
  }

  async function decrementReq () {
    try {
      await axios.post('/api/decrement')
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (('message' in e) && ('code' in e)) {
        $q.notify({ message: `${e.message}, code: ${e.code}`, type: 'negative' })
      }
    }
  }

  async function getValue () {
    const result = await axios.get('/api/result')
    incDecValue.value = result.data
  }

  return {
    incrementReq,
    decrementReq,
    incDecValue,
    getValue
  }
}
