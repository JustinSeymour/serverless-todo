export function constructError(code, msg) {
   return {
      statusCode: code,
      body : JSON.stringify({
        error: msg
      })
    };
};