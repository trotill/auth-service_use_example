import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { showError } from 'src/utils/error'
import { axiosInstance } from 'src/api/api'

export function useExample () {
  const incDecValue = ref(0)
  const randomColor = ref('#000000')
  const $q = useQuasar()

  function incrementReq () {
    return axiosInstance.post('/api/increment')
  }

  async function decrementReq () {
    try {
      await axiosInstance.post('/api/decrement')
    } catch (e) {
      showError($q, e)
    }
  }

  async function getValue () {
    const result = await axiosInstance.get('/api/result')
    incDecValue.value = result.data
  }

  async function getRandomColor () {
    const result = await axiosInstance.get('/api/randomColor')
    randomColor.value = result.data
  }

  return {
    incrementReq,
    decrementReq,
    incDecValue,
    getValue,
    getRandomColor,
    randomColor
  }
}
