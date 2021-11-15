import { useRouter } from 'next/router'
import { USER_SCORES_URL } from '../../lib/useUserScores'
import { useUserScores } from '../../lib/useUserScores'
import Layout from '../../components/Layout'
import ScoreCard from '../../components/ScoreCard'
import { useEffect, useState } from 'react'
import { getToken } from '../../lib/userAuth'

// Problema 1: nu gaseste setMessage / setScores
// Problema 2: tot trimite payload id: null 

const Profile = () => {
  const router = useRouter()
  const {id} = router.query

  const [scores, setScores] = useState([])
  const [error, setMessage] = useState('')
  const [name, setName] = useState('')

  useEffect(() => {
    // You also have to treat the case when user has no scores.
    if (scores.length > 0) {
      setName(scores[0].user_name)
    }
  }, [scores])

  useEffect(() => {
    if (id === null || id === undefined) {
      return;
    }
  
    const fetchData = async () => {
      let response = await fetch(USER_SCORES_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: id
        })
      })
      response = await response.json()
      if (response.errors) {
        setMessage(response.errors)
      } else {
        setScores(response.scores)
        setMessage(undefined)
      }
    }

    fetchData().catch(e => alert(e))
  }, [id])

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