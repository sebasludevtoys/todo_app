export async function create (method:'POST' | 'GET' | 'DELETE', url:string,body: {}) {
  try {
    
    const exercise = await fetch(
      `http://localhost:3000/api/${url}/${
        method === "POST" ? "create" : "delete"
      }`,
      {
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
        method: method,
      })
      return exercise
  } catch (error) {
   throw new Error('somthing went worng')
  }
};
