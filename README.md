# カレンダー with React（Next）
## 作るもの
- 一般的なカレンダーアプリと同様の見た目（Googleカレンダー参考）
  - 最小で月表示のカレンダー、余裕があれば年・月・週の見た目を切り替え可能にする
- CMS と連携して予定データを取得
  - アプリケーションから CMS にデータを登録できる機能をつける
    - 作成・更新・削除
  - 折角microCMSを使うので下書きの保存とかもできるようにする
- 作成するページ
  - カレンダーページ（トップページ）
  - 予定一覧ページ
  - 予定詳細ページ（編集）
- 予定登録時のバリデーション機能
  - react-hook-formを採用。
- 予定の検索機能
- ReactTestingLibrary + Jest のテスト導入
  - 余裕があればCypressのテスト導入
- microCMSのWebhookでアプリケーション側の自動更新機能
- パフォーマンスチューニングを行う
- Storybookを導入する

## メモ

環境構築は create-next-app で行った。  

> npx create-next-app app --typescript
> typescript+eslint もいれてくれる

登録予定  
- 日時（必須）
  - 開始
  - 終了
- タイトル（必須）
- 場所
- 重要フラグ
- 説明
- 添付画像（3枚まで）
  - （POST非対応、管理画面からの登録のみ可能）

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

GETのfiltersクエリで複数条件を設定する方法  
[or]でOR、[and]でAND条件が設定できる。  
例） /api/v1/articles?filters=title[contains]特集[or]publishedAt[begins_with]2019-12  
https://blog.microcms.io/or-condition-in-filters/