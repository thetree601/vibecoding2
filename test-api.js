// API 테스트 스크립트
const testLogin = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation LoginUser($email: String!, $password: String!) {
            loginUser(email: $email, password: $password) {
              accessToken
            }
          }
        `,
        variables: {
          email: "749884738@dldl.com",
          password: "asdf12345"
        }
      })
    });

    const result = await response.json();
    console.log('API 응답:', result);
    
    if (result.errors) {
      console.error('API 에러:', result.errors);
    } else {
      console.log('로그인 성공:', result.data);
    }
  } catch (error) {
    console.error('네트워크 에러:', error);
  }
};

testLogin();
