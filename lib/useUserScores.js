
import { getToken } from './userAuth'
import { useState, useEffect } from 'react'

export const USER_SCORES_URL = `${process.env.NEXT_PUBLIC_API_URL}/user_scores`

export default function useUserScores(UserId) {

  const [ scores, setScores ] = useState([ ])
  const [ error, setMessage ] = useState('')

  // Set the scores array of a user. If something goes wrong, the "error" state
  // is set.
  useEffect(() => {
    if (!UserId) {
      return
    }

    // Request the scores of a specific user.
    const fetchData = async () => {
      let response = await fetch(USER_SCORES_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: UserId,
        }),
      })
      response = await response.json()
      if (response.errors) {
        setMessage(response.errors)
      } else {
        setScores(response.scores)
        setMessage(undefined)
      }
    }

    // Effect Logic
    fetchData().catch(e => alert(e))
  }, [ UserId ])

  return {
    scores,
    error,
  }
}
