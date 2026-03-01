export async function submitToGAS(
  data: Record<string, string>,
  type: 'seller' | 'buyer'
): Promise<boolean> {
  const endpoint =
    type === 'seller'
      ? process.env.NEXT_PUBLIC_GAS_SELLER_URL
      : process.env.NEXT_PUBLIC_GAS_BUYER_URL

  if (!endpoint) {
    console.warn('GAS endpoint not configured')
    return true // 開発環境では成功扱い
  }

  try {
    await fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
        type,
      }),
    })
    return true
  } catch (error) {
    console.error('GAS submission error:', error)
    return false
  }
}
