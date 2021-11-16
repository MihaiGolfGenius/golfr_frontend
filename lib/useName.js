import React, { useState, useEffect } from 'react'
import { getToken } from './userAuth'
export const USER_NAME_URL = `${process.env.NEXT_PUBLIC_API_URL}/user`

export default function useName(userId, scores) {

  const [ myName, setMyName ] = useState('')

  // Gets the userName either from a loaded score
  // Or if no score is available, create a custom request.
  useEffect(() => {

    if (!userId) {
      return
    }
    // Request the user name if the user has no scores.
    const fetchName = async () => {

      let response = await fetch(USER_NAME_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId,
        }),
      })
      response = await response.json()
      if (response.errors) {
        setMyName('')
      } else {
        setMyName(response.user_name)
      }
    }

    // Maybe we can get the name from a score.
    if (scores.length > 0) {
      setMyName(scores[0].user_name)
    } else if (!!userId) {
      fetchName().catch(e => alert(e))
    }
  }, [ scores, userId ])

  return myName
}
