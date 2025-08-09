# 冷蔵庫ストック管理（シンプル版 / Firestoreのみ）

## できること
- Googleログイン
- アイテムの追加・編集・削除（カテゴリ、数量、単位、期限、メモ）
- カテゴリごとに一覧表示、検索、数量の＋/−
- 個人ごとの Firestore コレクションに保存
- 上に一気に戻るボタン

## セットアップ手順
1. 依存関係をインストール：
   ```bash
   npm install
   ```
2. Firebase で Web アプリを作成し、`.env` を作る：
   ```env
   VITE_FIREBASE_API_KEY=xxxxx
   VITE_FIREBASE_AUTH_DOMAIN=xxxxx.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=xxxxx
   VITE_FIREBASE_APP_ID=1:xxxxx:web:xxxxx
   ```
3. 開発起動：
   ```bash
   npm run dev
   ```
4. Firestoreルール反映（任意／CLI必要）
   ```bash
   firebase deploy --only firestore:rules
   ```

## データ構造
`users/{uid}/items/{itemId}`
```json
{
  "name": "卵",
  "category": "乳製品",
  "quantity": 10,
  "unit": "個",
  "expiry": "2025-08-31",
  "notes": "上段(右)",
  "createdAt": "...",
  "updatedAt": "..."
}
```

## メモ
- Storage を使わないため、セットアップは Firestore のみで完結します。
