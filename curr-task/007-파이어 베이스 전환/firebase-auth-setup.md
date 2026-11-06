# Firebase 로그인 및 관리자 초기 설정

## 1. Firebase Authentication 활성화

1. Firebase Console에서 **Authentication > Sign-in method**로 이동합니다.
2. **이메일/비밀번호** 로그인을 활성화합니다.
3. **Authentication > Settings > Authorized domains**에 `localhost`와 실제 배포 도메인을 추가합니다.

## 2. Firestore 규칙 게시

저장소 루트의 `firestore.rules` 내용을 Firebase Console의 **Firestore Database > Rules**에 게시합니다.

- 공지사항은 누구나 읽을 수 있습니다.
- 공지 생성·수정·삭제는 `users/{uid}` 프로필의 `role`이 `admin`인 로그인 사용자만 할 수 있습니다.
- 조회수는 글을 열 때 1씩 증가하도록 비관리자 업데이트를 제한적으로 허용합니다.
- 회원가입 프로필은 본인 UID에만 생성할 수 있고, 클라이언트는 관리자 문서를 만들거나 수정할 수 없습니다.

## 3. 관리자 계정 수동 등록

1. **Authentication > Users > Add user**에서 관리자 이메일로 계정을 만듭니다.
2. Firebase가 요구하는 6자 이상의 비밀번호를 직접 지정합니다. 요청에 적힌 4자리 비밀번호는 Firebase Authentication의 최소 길이보다 짧아 사용할 수 없습니다.
3. 생성된 계정의 UID를 복사합니다.
4. **Firestore Database > Data**에서 아래 두 문서를 수동으로 만듭니다. `{uid}`는 3단계에서 복사한 값으로 바꿉니다.

`users/{uid}`

```json
{
  "name": "관리자",
  "username": "admin",
  "email": "admin.com@company.co.kr",
  "createdAt": "2026-11-06T00:00:00.000Z",
  "role": "admin"
}
```

`usernames/admin`

```json
{
  "uid": "{uid}"
}
```

관리자는 이메일과 비밀번호로 로그인합니다. `admin` 아이디는 가입 폼에서 예약되어 일반 사용자가 만들 수 없습니다.

## 4. 첨부파일 저장

공지 첨부파일과 본문 이미지는 요청대로 기존 LocalStorage 방식을 유지합니다. Firebase Storage에 업로드되지 않으며 같은 브라우저 저장소를 쓰는 환경에서만 사용할 수 있습니다.