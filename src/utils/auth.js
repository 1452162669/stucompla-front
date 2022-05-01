import Cookies from 'js-cookie'

const TokenKey = 'stucompla_jwt'
const AvatarKey = 'stucompla_avatar'
const UserIdKey = 'stucomple_userId'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}

export function getUserId () {
  return Cookies.get(UserIdKey)
}

export function setUserId (userId) {
  return Cookies.set(UserIdKey, userId)
}

export function removeUserId () {
  return Cookies.remove(UserIdKey)
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
