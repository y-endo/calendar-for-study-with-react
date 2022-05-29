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
「microcms-js-sdk」  
TypeScriptの型  
- MicroCMSListResponse<T>: APIからの返却データ
- MicroCMSListContent: microCMSに登録されているデータ

クライアントサイドでenv参照  
https://nextjs.org/docs/api-reference/next.config.js/environment-variables  

useRouterはuseEffectの中で使う。  
TypeScriptで特定のプロパティを削除した型を作る。  
```
type T1 = {
    hoge: string
    foo: number
    bar: boolean
}
type T2 = Omit<T1, 'foo'>
```

SWRのuseSWRはデフォルトで自動再検証がONになっている。  
https://swr.vercel.app/ja/docs/revalidation  
useSWRImmutableを使うか、useSWRのオプションで再検証を無効にできる。  

SWRのミューテーション(mutate)を使えば、リクエストを再実行できる。  
https://swr.vercel.app/ja/docs/mutation  

CSSの選択肢の1つとして、「Zero-runtime（ゼロランタイム）」を覚えてもいいかも。  

microCMSの通信パターン  
- GET: endpointまでで全取得
- GET: endpoint/content_idで該当データ取得
- POST: 投稿（IDは自動生成）
- PUT: endpoint/content_idで指定したIDのデータを作成（POSTとの違いはIDの指定）
- PATCH: 更新
- DELETE: 削除