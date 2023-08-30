'use strict'
import sha256 from 'crypto-js/sha256'
import b64 from 'crypto-js/enc-base64'

export const getPassword = (login: string, password:string) => {
  return b64.stringify(sha256(login + password))
}
