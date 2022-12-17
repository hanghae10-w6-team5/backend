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
`PORT=3000
MYSQL_USERNAME=
MYSQL_PASSWORD=
MYSQL_DATABASE=
MYSQL_DATABASE_TEST=
MYSQL_HOST=
TOKEN_SECRETE_KEY=hanghae99_token_secrete
CRYPTO_SECRETE_KEY=hanghae99_crypto_secrete`

2. "env" 파일을 저장하셨다면, "npm run db:create" 명령어를 터미널에 입력해 db를 생성합니다.
3. 이후, "npm run db:migrate" 명령어를 터미널에 입력해 db를 migration 시켜줍니다. 끝!
4. 이제, 재밌게 개발하시면 됩니다~~

### app.js를 실행하는 방법
- 터미널에 "npm run dev" 명령어를 치시면, nodemon을 사용해 서버를 열어줍니다. 이후, 명령어를 다시 입력하실 필요 없이, 파일을 수정하고 저장하면 자동 재실행 됩니다!

### ErrorHandler에 대하여
우리 프로젝트에서는 어디에서 에러가 발생하던지 상관 없이, 에러를 app.js에서 처리하도록 설계하였습니다.
아래의 예제 코드를 보면서 이해해보시면 좋을 것 같습니다.

1. users.controller.createUser 메서드에서 에러 발생 상황
`createUser = async (req, res, next) => {
    try {
        const { nickname, password, confirm } = req.body;

        if (!nickname || !password || !confirm) {
            throw new InvalidParamsError();
        }

        await this.usersService.createUser(nickname, password, confirm);
        res.status(201).json({ message: '회원 가입에 성공하였습니다.' });
    } catch (err) {
        next(err); 
        // 라우터에서 next(err)를 호출하면, app이 죽지 않고, 다음 미들웨어로 err 객체를 내보냅니다. 이것을 controller -> router -> index.router -> app 의 경로로 넘겨서 결국 app.js 파일의 "app.use(errorHandler)"에서 받아 res 처리를 하게 됩니다.
    }
};`

2. 위의 예제에서, req.body 검사를 통과해 users.service.createUser 메서드를 정상 호출했지만, users.service.createUser 메서드에서 에러가 발생한 상황
`createUser = async (nickname, password, confirm) => {
        ...

        const isExistUser = await this.findUser(nickname);

        if (isExistUser) {
            throw new ValidationError('중복된 닉네임입니다.', 412);
        }         
        ...

        return user;
    };`

   - 위의 controller 코드 예시에서는 try...catch 문을 통해 에러를 핸들링하고 있는데, 여기는 없죠?
   - 이유는 바로 아래의 순서로 app이 실행되기 때문입니다.
   - app -> index.router -> users.router -> users.controller -> users.service: 에러 발생 -> users.controller -> users.router -> index.router -> app
   - 처음 앱에서 호출한 api를 받아 경로에 맞는 라우터를 호출하고, 각 라우터는 다시 controller -> service -> repository의 순으로 객체를 생성해 메서드를 호출합니다. 입력받은 데이터에 문제가 없다면, repository.createUser 메서드의 결과 값(db 처리 결과)을 받아 자신을 호출한 service -> controller 객체에 전달합니다.
   - 하지만, 위의 예시에서는 service 객체의 메서드를 실행하는 와중에 에러가 발생했으므로, repository의 메서드는 호출되지 않았습니다. 
   - 최종적으로, service에서 발생시킨 에러 객체(throw new ValidationError)를 controller에 결과 값으로 전달하고, controller에서는 catch문 안에서 에러를 처리합니다(next(err) 호출) 
   - 만약, api 요청 처리에 성공하는 경우, controller 객체에서 클라에 필요한 정보를 전달하기 위해 express.Router의 res 메서드를 호출하여 바로 request-response cycle (하나의 요청에는 하나의 응담)을 종료하는데, 
   - 어디선가 에러가 발생한 경우, catch문 안에서 err는 바로 response 메서드로 송출되는 것이 아닌 발생한 err 객체를 다음 미들웨어에 전달해 호출하도록 되어 있습니다. 모든 controller 레벨의 메서드 안에는 try...catch문으로 에러를 처리하도록 되어 있고, 모든 catch문 안에서는 next(err)를 호출합니다.
   - 결론적으로 이 에러 객체는 처음 에러가 발생한 지점부터 남아있는 모든 미들웨어를 거쳐 app으로 돌아가게 됩니다.

3. app에 도착한 에러객체의 행방은???
`...
app.use('/api', routes);
app.use(errorLogger); // Error Logger -> 에러 로그를 찍고 next(err)로 다음 미들웨어인 errorHandler를 호출합니다.
app.use(errorHandler); // Error Handler
app.listen(PORT, () => {
    console.log(PORT, '서버를 실행 중 입니다.');
});
...`
   - 위의 service layer 예제에서 발생한 에러는 드이어! app에 도착했습니다.
   - service에서 던진 에러는 app.use('/api', routes)를 호출했을 때, 발생했습니다.
   - 이제 next(err)는 다음 라우터인 app.use(errorLogger)로 전달됩니다. 

4. error-handler.middleware.js
`const errorLogger = (error, request, response, next) => {
    // 에러 로깅 코드 구현 
    next(error);
};

const errorHandler = (error, req, res, next) => {
    if (error.name.includes('Sequelize')) {
        res.status(500).json({ errorMessage: 'Internal Server Error' });
    }
    res.status(error.status || 400).json({ errorMessage: error.message });
};

module.exports = { errorLogger, errorHandler };
`
   - 위의 코드는 에러 핸들러 미들웨어를 정의한 error-handler.middleware.js 파일의 모든 내용입니다.
   - 여기서 클래스로 정의한 로거와 핸들러는 app.js에서 불러와 사용하고 있습니다.
   - 보시면, errorLogger 미들웨어에서 에러 로그를 찍도록 처리하고, 마지막에 next(error)를 호출해 다음 미들웨어로 에러 객체를 전달합니다.
   - 3번 app.js 코드를 다시 보시면, app.use(errorLogger); 줄 다음에 app.use(errorHandler);를 선언하고 있습니다.
   - 즉, error logging을 수행하고, 에러 객체를 핸들러 미들웨어로 보낸다는 의미입니다.
   - 이제, 다시 에러 핸들러 코드로 돌아와서 보시면, 드디어, express.Router의 res 메서드를 호출해 클라이언트 요청(req)에 대한 결과 값을 반환해 주고 있습니다.
   - 즉, 우리가 service 레벨에서 던진 `ValidationError('중복된 닉네임입니다.', 412)`는 여기에 와서야 `res.status(412).json({errorMessage: '중복된 닉네임입니다.'})`의 형태로 클라이언트에게 전달됩니다.
   - 이상으로, 처음 클라에서 POST "/api/users/signup" api를 호출(req)한 것에 대한 요청(res)을 보내기 위한 서버의 여정이었습니다...

### 우리가 사용할 에러 객체
우리가 사용할 에러 객체는 src\exception\index.exception.js 파일에 정의되어 있습니다.
현재는 총 3가지 에러로 분류하였습니다.
- InvalidParamsError : 전달되어야 하는 값이 없을 때 사용
- ValidationError : 전달 받은 값에 오류가 있을 때 사용
- AuthenticationError : 사용자 인증과 관련된 오류에 사용
- ! 알 수 없는 오류입니다의 경우, 에러 객체를 생성할때, 인자 값을 주지 않으면 자동으로 400번과 "알 수 없는 오류입니다." 메세지로 나갑니다.
  
### 에러 모듈 사용 방법
{ InvalidParamsError, ValidationError, AuthenticationError } = require('index.exception.js의 상대 경로')

필요한 에러 클래스를 사용할 문서의 상단에서 불러 오신 후 
`throw new 에러종류(송출 메세지, status번호)`로 사용하시면 됩니다.

개발을 하시면서 필요하다고 느끼시는 에러 객체가 있으면 추가해주시고 팀원들에게 공유해주세요!