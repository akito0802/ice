# 冷蔵庫ストック（超ミニ）

**ファイル3つだけ**でGitHub Pagesに置ける、ビルド不要の超軽量版。  
- `index.html` … UIとロジック全部入り（CDNのFirebase SDKを使用）
- `config.js` … Firebaseの設定を書く
- `README.md` … これ

## 使い方
1. Firebaseコンソールでプロジェクト作成 → Authenticationで「Google」を有効化 → Firestoreを有効化。
2. FirebaseでWebアプリを追加して出てくる設定値を `config.js` にコピペ。
3. この3ファイルをGitHub Pagesの公開リポに置いて終了。

## Firestore ルール（推奨）
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/items/{itemId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
