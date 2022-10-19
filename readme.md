![github-repo-card-2skydev-blog](https://user-images.githubusercontent.com/43225384/192663396-f3d95224-a9c7-4f8b-81ba-e541b78000b7.png)

# Notion + Next.js blog starter kit

This repository is a startup kit that allows you to create a blog using `notion` and `next.js`.<br/>
Please understand that the code and explanation are mainly written in Korean. 🥲

<br />

## 🔗 미리보기 및 링크

아래 사진들은 운영중인 제 블로그에서 가져온 리소스입니다. [2skydev blog](https://blog.2skydev.com)

<img width="1792" alt="image" src="https://user-images.githubusercontent.com/43225384/191196610-2e1164e4-4db9-4f7b-a2c7-401828370e5e.png">

<br />

## 🤔 Next.js + Notion 어떻게 만들었을까요?

노션에서 글을 작성하면 next.js의 ISR 방식으로 정적 페이지가 자동으로 생성됩니다.

### 사용한 오픈소스

`transitive-bullshit/nextjs-notion-starter-kit`를 기반으로 커스텀해서 원하는데로 꾸미고 추가했습니다.<br/>
기본적으로 지원하는 기능이 많았지만 아쉬운 부분이 많아 직접 커스텀을 진행했습니다.

[GitHub - transitive-bullshit/nextjs-notion-starter-kit](https://github.com/transitive-bullshit/nextjs-notion-starter-kit)

### 전지적 노션 시점

노션의 내용을 기반으로 블로그가 생성되는 방식이니 실제로는 노션이 어떻게 구성되어있는지 궁금하신가요?<br/>
아래 링크를 통해 이 블로그의 노션 구성을 확인하실 수 있습니다!

[2skydev의 노션 링크](https://www.notion.so/2skydev-blog-d1e89e9e42eb4ebf9486ae0374039efc)

<br/>

## 🔎 자세한 동작 방식을 알고 싶어요

기본적인 동작은 next.js의 `ISR` 방식으로 페이지가 생성됩니다.

배포(빌드)후에도 노션에서 페이지를 생성 또는 수정해도 자동으로 반영됩니다.

### Notion API?

노션의 정보를 가져오는 API는 공식 API가 아닌 실제 노션 페이지에서 요청하는 API를 가져와서 사용했습니다.

아 물론 댓글 기능은 Notion 공식 API를 사용한게 맞습니다 :)

### 배포(빌드) 후 노션에서 새로 페이지를 만들면 어떻게 되나요?

1. 새로 만든 페이지 접속시 정적 페이지가 생성된 것이 없으므로 `router.isFallback`이 활성화 되며 로딩 효과가 표시
2. `getStaticProps` 함수에서 노션 루트 페이지 id를 기준으로 모든 페이지를 가져옴
3. 2번 작동으로 노션 사이트맵 객채가 생성되고 접속한 주소가 사이트맵에 있는지 확인 (없으면 404 처리)
4. 사이트맵에 있다면 해당 주소와 일치하는 노션 페이지 id를 기준으로 페이지 정보를 불러옴
5. 페이지 정보가 불러와졌다면 `router.isFallback` 이 false가 되며 로딩 효과 사라짐 및 새로운 정적 페이지 표시

### 배포(빌드) 후 노션에서 페이지를 수정하면 어떻게 되나요?

1. 수정된 페이지 접속시 `getStaticProps` 함수 반환값인 `revalidate: 10` 에 의해 마지막으로 접속한 유저 기준으로 10초가 지났다면 `getStaticProps` 함수 백그라운드로 실행 (접속한 유저는 이전 버전의 페이지를 보게됨)
2. `getStaticProps` 함수에서 노션 루트 페이지 id를 기준으로 모든 페이지를 가져옴
3. 2번 작동으로 노션 사이트맵 객채가 생성되고 접속한 주소가 사이트맵에 있는지 확인 (없으면 404 처리)
4. 사이트맵에 있다면 해당 주소와 일치하는 노션 페이지 id를 기준으로 페이지 정보를 불러옴 (최신 버전 정보)
5. 페이지 정보가 불러와졌다면 정적 페이지가 생성되며 이미 접속한 유저는 이전 버전의 페이지가 보여지지만 이후 접속한 유저(이미 접속한 유저의 새로고침 액션도 포함)는 생성된 최신 버전의 정적 페이지가 표시됨

<br/>

## 🚀 저도 이 구성을 사용할래요

레포 클론 후 `site.config.ts` 만 수정하시면 바로 이용하실 수 있습니다.<br/>
아래 단계들을 따라와주세요 :)

### 1. 커스텀한 소스 클론하기

커스텀된 소스는 아래 링크를 확인해주세요.<br/>
클론 받으신 후 설정파일을 수정하면 바로 이용하실 수 있습니다.

[GitHub - 2skydev/blog](https://github.com/2skydev/blog)

### 2. 사용방법

커스텀한 블로그 템플릿은 아래의 오픈소스 기반이므로 해당 깃허브 README.md에서 기본적인 사용방법을 확인해주세요.

[GitHub - transitive-bullshit/nextjs-notion-starter-kit - setup](https://github.com/transitive-bullshit/nextjs-notion-starter-kit#setup)

더 자세한 문서는 아래 링크를 확인해주세요.

[Github Wiki - 2skydev/blog](https://github.com/2skydev/blog/wiki)

<br/>

## 🚧 추가 커스텀이 필요해요

`yarn workspace` 기능을 사용해서 세세한 부분까지 모듈 커스텀이 가능하도록 구성했습니다.

### 오픈소스 기준 이미 커스텀한 항목들

- 모듈 수정을 위해 `yarn workspace` 구성
- 날짜 포맷
- 데이터베이스 속성 (스타일, 작동 안하는 속성 등)
- 데이터베이스 필터가 적용이 안되는 부분 수정
- 우측에 표시되는 목차 스타일
- 기기의 다크모드 변경시 자동 반영 (버그가 있어서 직접 구성했습니다)
- 주소에 한국어가 들어가지 않는 부분 수정 (Slug라고 하죠)
- 다크모드 부분적으로 스타일 오류가 있는 부분 수정
- 노션의 블럭들 스타일 수정
- 콜아웃 특정 아이콘일때 배경 색상 변경 처리 (⚠️, 🚧, 🔴, 🛑, 💡)
- 댓글 기능 추가
- GA 구성 추가
- 반응형 처리가 미흡한 부분 수정
- a 링크 방식 -> Next.js Link 컴포넌트 사용
- 로딩 효과 추가
- 페이지 이동간 애니메이션
- 초안 기능추가 (draft, published)
- 여러 오류들 수정 (새로 생성된 페이지 404, 서버와 클라이언트의 timezone 차이로 hydration 에러, 등등)

### 스타일 커스텀

아래 항목 말고도 추가로 커스텀이 필요하다면 원하시는 파일을 수정하거나 추가해서 진행하시면 됩니다.

- 페이지 크기 및 색상 변수들: `styles/custom/vars.scss`
- 노션 기본 블럭들: `styles/custom/notion-blocks.scss`

### 설정 커스텀

`site.config.ts` 파일에 추가 설정이 가능하도록 구성해 두었습니다.<br/>
추가 구성 정보는 아래 테이블을 확인해주세요.

| 키                   | 기본값     | 설명                                                                                                                                                                                       |
| -------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| dateformat           | yyyy.MM.dd | 날짜 포맷을 설정합니다. 유효한 값은 date-fns 포맷 문자열입니다.                                                                                                                            |
| defaultTheme         | system     | 기본 테마를 설정합니다. 유효한 값은 `light`, `dark`, `system` 입니다                                                                                                                       |
| hiddenPostProperties | []         | 글 상세 페이지에서 숨김 처리할 속성 이름들입니다.                                                                                                                                          |
| enableComment        | false      | 글 상세 페이지에서 댓글 기능을 활성화 여부입니다. 노션 댓글 기능을 사용하며 해당 기능을 사용 시 `NOTION_API_KEY` 환경 변수 설정이 필수 입니다. 자세한 내용은 `댓글 기능`쪽을 확인해주세요. |
| contentPositionTextAlign        | left      | 글 상세 페이지에서 우측에 표시되는 목차의 글자 정렬을 설정합니다. 유효한 값은 `left`, `right` 입니다 |

<br />

## 💬 댓글 기능

설정 구성을 통해 댓글 기능을 활성화 시킬 수 있습니다.

댓글은 노션의 댓글 기능을 사용하며 노션 API를 생성해야 사용이 가능합니다.

### 1. API 생성하기

[Notion Developers](https://www.notion.so/my-integrations)이 페이지에서 새로운 API 통합을 눌러서 기능 권한 목록중 댓글 기능만 모두 활성화 후 생성합니다.

### 2. API 토큰 환경 변수 설정하기

생성되면 `프라이빗 API 통합 토큰`을 복사하신 후 `.env` 파일을 만들어 `NOTION_API_KEY` 환경 변수로 설정해주세요.

### 3. site.config.ts 파일 수정

`enableComment`의 값을 `true`로 설정해주세요.

### 4. 블로그 노션 페이지에서 API 연결 추가하기

노션에서 사용하고 있는 블로그 페이지로 이동 후 우측 상단의 ···을 누른 후 하단의 연결 추가에서 생성한 API를 눌러서 연결해주세요.

해당 단계까지 따라왔다면 지금 바로 댓글 기능을 사용하실 수 있습니다 :)
