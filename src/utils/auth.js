import Cookies from 'js-cookie'

const TokenKey = 'stucompla_jwt'
const AvatarKey = 'stucompla_avatar'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}

export function getAvatar () {
  return Cookies.get(AvatarKey)
}

export function setAvatar (avatar) {
  return Cookies.set(AvatarKey, avatar)
}

export function removeAvatar () {
  return Cookies.remove(AvatarKey)
}
