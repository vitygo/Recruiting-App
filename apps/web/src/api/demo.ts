import client from './client'

export const demoApi = {
  clear: async () => {
    const res = await client.delete('/demo/clear')
    return res.data as { message: string }
  },
}
