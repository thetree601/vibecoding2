// fetchUserLoggedIn API 테스트 스크립트
const testFetchUser = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGY3MDE0OGU0M2FhZjAwMjkxNTQ0YmQiLCJwZXJtaXNzaW9uIjowLCJpYXQiOjE3NjEwMzc0MzksImV4cCI6MTc2MTA0MTAzOSwic3ViIjoiYWNjZXNzVG9rZW4ifQ.k8zNi02eumtEN4IkVUyZvGiEMlfuZ-EXK6LMetNDO5a1Q6Ae5bTGcv_y7CzDf1hP0kFIsWaHqRRjXclaNcz0Tg'
      },
      body: JSON.stringify({
        query: `
          query FetchUserLoggedIn {
            fetchUserLoggedIn {
              _id
              name
            }
          }
        `
      })
    });

    const result = await response.json();
    console.log('사용자 정보 API 응답:', result);
    
    if (result.errors) {
      console.error('API 에러:', result.errors);
    } else {
      console.log('사용자 정보 조회 성공:', result.data);
    }
  } catch (error) {
    console.error('네트워크 에러:', error);
  }
};

testFetchUser();
