const fetcher = (input: RequestInfo, init?: RequestInit | undefined) =>
  fetch(input, init).then(async (res) => {
    var json = await res.json();
    return json;
  });
export default fetcher;
