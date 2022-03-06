# カレンダー with React（Next）

- 一般的なカレンダーアプリと同様の見た目
- CMS と連携してスケジュールデータを取得
- データは基本的に CMS で作成する想定なので管理画面等は作成しない

## メモ

環境構築は create-next-app で行った。  

> npx create-next-app app --typescript
> typescript+eslint もいれてくれる

登録スケジュール  
- 日時（必須）
- タイトル（必須）
- 場所
- 重要フラグ
- 説明

microCMSのAPI通信公式モジュール  
microcms-js-sdk  
TypeScriptの型  
- MicroCMSListResponse<T>: APIからの返却データ
- MicroCMSListContent: microCMSに登録されているデータ