export function deleteItem(key) {
  localStorage.removeItem(key);
}

export function getItem(key, defaultValue) {
  if (key in localStorage) {
    const json = localStorage.getItem(key);
    return JSON.parse(json);
  } else {
    return defaultValue;
  }
}

export function setItem(key, value) {
  const json = JSON.stringify(value);
  localStorage.setItem(key, json);
}
