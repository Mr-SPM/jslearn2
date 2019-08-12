// 安全的JsonParse
export function saveJsonParse(data) {
  try {
    return JSON.parse(data);
  } catch (e) {}
  return data;
}
