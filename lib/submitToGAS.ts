export async function submitToGAS(
  data: Record<string, string>,
  type: 'seller' | 'buyer'
): Promise<boolean> {
  const endpoint =
    type === 'seller'
      ? process.env.NEXT_PUBLIC_GAS_SELLER_URL
      : process.env.NEXT_PUBLIC_GAS_BUYER_URL

  if (!endpoint) {
    // 環境変数未設定（開発環境など）は成功扱いにしてUIを確認できるようにする
    console.warn('GAS endpoint not configured. Set NEXT_PUBLIC_GAS_SELLER_URL / NEXT_PUBLIC_GAS_BUYER_URL.')
    return true
  }

  try {
    // no-cors モードでは Content-Type を text/plain にする必要がある。
    // application/json はプリフライトを要求するため no-cors では無視され
    // GAS がリクエストボディを受け取れない。
    // GAS 側は JSON.parse(e.postData.contents) でそのまま受け取れる。
    await fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
        type,
      }),
    })
    // no-cors では opaque response のためステータスコードは読めない。
    // fetch が例外を投げなければリクエストは送信できたとみなす。
    return true
  } catch (error) {
    console.error('GAS submission error:', error)
    return false
  }
}
