// ============================================================
// M&Aレスキュー — Google Apps Script
// このファイルの内容をそのままGASエディタに貼り付けてください。
//
// スプレッドシートのシート構成（自動作成されます）:
//   「sellers」シート : 売り手フォーム + AIチャット
//   「buyers」シート  : 買い手フォーム
// ============================================================

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const ss   = SpreadsheetApp.getActiveSpreadsheet()

    if (data.type === 'seller') {
      writeSeller(ss, data)
    } else if (data.type === 'buyer') {
      writeBuyer(ss, data)
    }

    return ContentService.createTextOutput('ok')
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err.message)
  }
}

// ──────────────────────────────────────────────
// 売り手データ書き込み
// 列順: 登録日時, 会社名, 代表者氏名, 生年月日, 会社住所,
//       電話番号, メールアドレス, HP, 業種, 年商, 営業利益,
//       従業員数, 創業年度, 取引金融機関, 固定資産額, 負債総額
// ──────────────────────────────────────────────
function writeSeller(ss, data) {
  const sheet = getOrCreateSheet(ss, 'sellers')

  // ヘッダーが未設定なら1行目に書き込む
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      '登録日時', '会社名', '代表者氏名', '生年月日', '会社住所',
      '電話番号', 'メールアドレス', 'HP', '業種', '年商', '営業利益',
      '従業員数', '創業年度', '取引金融機関', '固定資産額', '負債総額',
    ])
  }

  sheet.appendRow([
    new Date(),
    data.companyName        || '',
    data.representativeName || '',
    data.birthDate          || '',
    data.address            || '',
    data.phone              || '',
    data.email              || '',
    data.website            || '',
    data.industry           || '',
    data.revenue            || '',
    data.profit             || '',
    data.employees          || '',
    data.foundedYear        || '',
    data.bank               || '',
    data.fixedAssets        || '',
    data.totalDebt          || '',
  ])
}

// ──────────────────────────────────────────────
// 買い手データ書き込み
// 列順: 登録日時, 会社名, 法人番号, 代表者氏名, 会社住所,
//       電話番号, メールアドレス, HP, 業種, 年商,
//       買収希望業種, 買収希望規模
// ──────────────────────────────────────────────
function writeBuyer(ss, data) {
  const sheet = getOrCreateSheet(ss, 'buyers')

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      '登録日時', '会社名', '法人番号', '代表者氏名', '会社住所',
      '電話番号', 'メールアドレス', 'HP', '業種', '年商',
      '買収希望業種', '買収希望規模',
    ])
  }

  sheet.appendRow([
    new Date(),
    data.companyName           || '',
    data.corporateNumber       || '',
    data.representativeName    || '',
    data.address               || '',
    data.phone                 || '',
    data.email                 || '',
    data.website               || '',
    data.industry              || '',
    data.revenue               || '',
    data.acquisitionIndustries || '',
    data.acquisitionScale      || '',
  ])
}

// ──────────────────────────────────────────────
// シート取得 or 新規作成
// ──────────────────────────────────────────────
function getOrCreateSheet(ss, name) {
  return ss.getSheetByName(name) || ss.insertSheet(name)
}
