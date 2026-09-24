/** Kembalikan seluruh data ke seed awal (fitur demo). */
export default defineEventHandler(async () => {
  await resetDb()
  return { success: true }
})
