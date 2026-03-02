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

  // キーを明示的に指定して列順を固定する。
  // GAS 側は以下の順番で appendRow する：
  // 登録日時, 会社名, 代表者氏名, 生年月日, 会社住所,
  // 電話番号, メールアドレス, HP, 業種, 年商, 営業利益,
  // 従業員数, 創業年度, 取引金融機関, 固定資産額, 負債総額
  const ordered = {
    companyName:        data.companyName        ?? '',
    representativeName: data.representativeName ?? '',
    birthDate:          data.birthDate          ?? '',
    address:            data.address            ?? '',
    phone:              data.phone              ?? '',
    email:              data.email              ?? '',
    website:            data.website            ?? '',
    industry:           data.industry           ?? '',
    revenue:            data.revenue            ?? '',
    profit:             data.profit             ?? '',
    employees:          data.employees          ?? '',
    foundedYear:        data.foundedYear        ?? '',
    bank:               data.bank               ?? '',
    fixedAssets:        data.fixedAssets        ?? '',
    totalDebt:          data.totalDebt          ?? '',
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
        type,
        ...ordered,
      }),
    })
    return true
  } catch (error) {
    console.error('GAS submission error:', error)
    return false
  }
}
