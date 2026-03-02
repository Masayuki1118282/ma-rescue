export async function submitToGAS(
  data: Record<string, string>,
  type: 'seller' | 'buyer'
): Promise<boolean> {
  const endpoint =
    type === 'seller'
      ? process.env.NEXT_PUBLIC_GAS_SELLER_URL
      : process.env.NEXT_PUBLIC_GAS_BUYER_URL

  if (!endpoint) {
    console.warn('GAS endpoint not configured. Set NEXT_PUBLIC_GAS_SELLER_URL / NEXT_PUBLIC_GAS_BUYER_URL.')
    return true
  }

  try {
    // no-cors モードでは Content-Type を text/plain にする必要がある。
    // GAS 側が appendRow でキーを明示指定するため、
    // フォーム種別に関わらず data をそのまま送信する。
    await fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        type,
        ...data,
      }),
    })
    return true
  } catch (error) {
    console.error('GAS submission error:', error)
    return false
  }
}
