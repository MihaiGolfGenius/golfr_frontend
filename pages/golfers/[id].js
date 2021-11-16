import { useRouter } from 'next/router'
import { USER_SCORES_URL } from '../../lib/useUserScores'
import { useUserScores } from '../../lib/useUserScores'
import Layout from '../../components/Layout'
import ScoreCard from '../../components/ScoreCard'
import { useEffect, useState } from 'react'
import { getToken } from '../../lib/userAuth'


function Profile () {
  const router = useRouter()
  const { id } = router.query

  const [ scores, setScores ] = useState([ ])
  const [ error, setMessage ] = useState('')
  const [ name, setName ] = useState('')

  // Set the user name on screen.
  useEffect(() => {

    // Request the user name if the user has no scores.
    const fetchName = async () => {
      const USER_NAME_URL = `${process.env.NEXT_PUBLIC_API_URL}/user`
      let response = await fetch(USER_NAME_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
        }),
      })
      response = await response.json()
      if (response.errors) {
        setName('Unknown User Id, something went wrong.')
      } else {
        setName(response.user_name)
      }
    }

    // Effect logic, execute only if scores array changes.
    if (scores.length > 0) {
      setName(scores[0].user_name)
    } else if (!!id) {
      // This branch has not been tested yet.
      fetchName().catch(e => alert(e))
    }
  }, [ scores, id ])


  // Set the scores array of a user. If something goes wrong, the "error" state
  // is set.
  useEffect(() => {
    if (id === null || id === undefined) {
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
          user_id: id,
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
  }, [ id ])

  return (
    <Layout>
      <>
        {
          error ?
            error
            :
            <>
              <h1> Here are your scores, {name}: </h1>
              {
                scores && scores.map(score => (
                  <ScoreCard
                    key={score.id}
                    id={score.id}
                    totalScore={score.total_score}
                    playedAt={score.played_at}
                    userId={score.user_id}
                    userName={score.user_name}
                  />
                ))
              }
            </>
        }
      </>
    </Layout>
  )
}

export default Profile
