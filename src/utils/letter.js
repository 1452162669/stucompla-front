import Cookies from 'js-cookie'

const Key = 'unReadTotal'

export function getUnReadTotal () {
  return Cookies.get(Key)
}

export function setUnReadTotal (total) {
  return Cookies.set(Key, total)
}

export function removeUnReadTotal () {
  return Cookies.remove(Key)
}
