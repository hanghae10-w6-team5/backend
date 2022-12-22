# 탈덕마켓
정리하고 싶은 탈덕 아이템을 거래하는 전문 게리판 사이트입니다.

### 웹사이트
https://63a439d111e256656d561b76--dapper-bombolone-cb620b.netlify.app/

### 데모 영상


### 소개
- 로그인 회원만 장터에 글을 올릴 수 있습니다.
- 글에 댓글을 달아 물건 거래를 진행해 보세요.
- 마이페이지에서 자신이 찜한 물건과 자신이 올린 판매글만 모아서 보세요.
- 메인 페이지는 최신 업데이트 된 글을 기준으로 정렬됩니다.

### 기술 스택
`frontend`
- javascript
- react
- axios

`backend`
- node
- express
- mysql

`deploy`
- AWS EC2 (ubuntu)
- AWS S3

`etc Tools`
- github 
  - PR 요청을 통한 코드 리뷰 
  - front-back 통합 Project work-flow board 사용 (레포지토리별 issue 연동)
- notion
  - S.A.
  - 와이어프레임, ERD, API 명세서 관리

### 핵심 기능
##### 게시판 CRUD
- 로그인한 회원만 게시글 및 댓글 생성/조회/삭제 가능
  
##### 좋아요 👍 기능
- 로그인한 회원만 게시글 좋아요 등록/삭제 가능
  
##### front-back HTTPS 통신
- backend 서버에서 nginx 및 reverse proxy 설정을 통해 HTTPS로 요청을 보내는 front req에 대응

##### 유저 마이페이지
- 로그인한 회원의 작성 및 좋아요 게시글 목록 조회

