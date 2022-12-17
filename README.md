# backend

## 협업을 시작하기 앞서 필독!!!
## 우리의 백엔드 레포지토리를 본인의 컴퓨터로 clone해 주세요.
### 깃에서 레포지토리를 본인의 컴퓨터로 clone 후 설정하셔야 하는 것
1. "npm i" 명령어를 터미널에 입력하여 설정한 모듈 파일을 모두 설치합니다.
    -> 위의 명령어 한방이면, package.json에 나열되어 있는 모든 모듈을 자동으로 깔아줍니다.
2. 만약 VS Code에 "Prettier - Code formatter" extension이 없다면?? 
    -> VS Code 좌측 메뉴바에서 네모네모네모를 클릭합니다 -> prettier를 검색하고, 가장 위에 뜨는 익스텐션 옵션을 설치합니다. -> 프로젝트 폴더로 돌아와서 js 파일을 생성하고, 아무거나 막 치면 자동으로 코드 포맷을 맞춰줍니다!!! (상세한 포맷 설정은 프로젝트폴더 루트폴더에 위치한 .prettierrc.js 파일을 참고하세요~~)
### 모듈과 prettier 설치가 끝났다면, DB 설정하기
1. 프로젝트 루트 폴더(package.json 폴더가 있는 곳)에 ".env" 파일 생성 후, 아래 내용 복붙하시고, 각자 rds 정보 입력하셔서 저장해주세요.
<PORT=3000
MYSQL_USERNAME=
MYSQL_PASSWORD=
MYSQL_DATABASE=
MYSQL_DATABASE_TEST=
MYSQL_HOST=
TOKEN_SECRETE_KEY=hanghae99_token_secrete
CRYPTO_SECRETE_KEY=hanghae99_crypto_secrete>

2. "env" 파일을 저장하셨다면, "npm run db:create" 명령어를 터미널에 입력해 db를 생성합니다.
3. 이후, "npm run db:migrate" 명령어를 터미널에 입력해 db를 migration 시켜줍니다. 끝!
4. 이제, 재밌게 개발하시면 됩니다~~

### app.js를 실행하는 방법
- 터미널에 "npm run dev" 명령어를 치시면, nodemon을 사용해 서버를 열어줍니다. 이후, 명령어를 다시 입력하실 필요 없이, 파일을 수정하고 저장하면 자동 재실행 됩니다!
