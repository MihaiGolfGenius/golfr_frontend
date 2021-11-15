//
//  WARNING: THIS FILE SHOULD BE TESTED.
//
import useSWR from 'swr'
import { getToken } from './userAuth'

export const USER_SCORES_URL = `${process.env.NEXT_PUBLIC_API_URL}/user_scores`

const useUserScores = (user_id) => {

  const fetcher = async url => {
    console.log("Executing fetcher, my id: ", user_id)
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id
      })
    })

    if (!res.ok) {
      const error = new Error('An error occured while fetching the data.')
      // Attach extra info to the error object.
      error.info = await res.json()
      error.status = res.status
      throw error
    }

    return res.json().then(data => data.scores)
  }


    const {data, error} = useSWR(USER_SCORES_URL, fetcher)
    return {
      scores: data,
      error: error && error.message,
    }
  }


export default useUserScores