# Notion + Next.js blog starter kit
This repository is a startup kit that allows you to create a blog using `notion` and `next.js`.

Please understand that the code was written mainly in Korean. 🥲

<br />

# 🚧🚧🚧 잠깐!!!
아직은 수정중이에요 :(<br/>
디자인 및 기능 수정이 완료가 된다면 해당 내용을 지우고 릴리즈를 할 예정입니다!

## 🤔 어떤걸로 만들었을까요?
몇몇 분들은 눈치 채셨겠지만 노션을 활용해서 만들어진 블로그입니다.<br/>
노션에서 글을 작성하면 next.js의 `ISR` 방식으로 정적 페이지가 생성됩니다.

### 사용한 오픈소스
`transitive-bullshit`분이 작성하신 `nextjs-notion-starter-kit`를 기반으로 커스텀해서 원하는데로 꾸미고 추가했습니다.<br/>
기본적으로 지원하는 기능이 많았지만 아쉬운 부분이 많아 직접 커스텀을 진행했습니다.

[GitHub - transitive-bullshit/nextjs-notion-starter-kit](https://github.com/transitive-bullshit/nextjs-notion-starter-kit)

### 전지적 노션 시점
노션의 내용을 기반으로 블로그가 생성되는 방식이니 실제로는 노션이 어떻게 구성되어있는지도 궁금하시죠?<br/>
아래 링크를 통해 이 블로그의 노션 구성을 확인하실 수 있습니다!

[2skydev의 노션 링크](https://www.notion.so/2skydev-blog-d1e89e9e42eb4ebf9486ae0374039efc)

<br/>

## 🚀 저도 이 구성을 사용할래요
레포 클론 후 `site.config.ts` 만 수정하시면 바로 이용하실 수 있습니다.<br/>
아래 단계들을 따라와주세요 :)

### 1. 커스텀한 소스 클론하기
커스텀된 소스는 아래 링크를 확인해주세요.<br/>
클론 받으신 후 설정파일을 수정하면 바로 이용하실 수 있습니다.

[GitHub - 2skydev/blog](https://github.com/2skydev/blog)

### 2. 사용방법
커스텀한 블로그 템플릿도 아래의 오픈소스 기반이므로 해당 깃허브 README.md에서 사용방법을 확인해주세요.

[GitHub - transitive-bullshit/nextjs-notion-starter-kit - setup](https://github.com/transitive-bullshit/nextjs-notion-starter-kit#setup)

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

### 스타일 커스텀
아래 항목 말고도 추가로 커스텀이 필요하다면 원하시는 파일을 수정하거나 추가해서 진행하시면 됩니다.

- 페이지 크기 및 색상 변수들: `styles/custom/vars.scss`
- 노션 기본 블럭들: `styles/custom/notion-blocks.scss`

### 설정 커스텀
`site.config.ts` 파일에 추가 설정이 가능하도록 구성해 두었습니다.<br/>
추가 구성 정보는 아래 테이블을 확인해주세요.

| 키 | 기본값 | 설명 |
| --- | --- | --- |
| dateformat | yyyy.MM.dd | 날짜 포맷을 설정합니다. 유효한 값은 date-fns 포맷 문자열입니다. |
