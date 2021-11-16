import { useRouter } from 'next/router'
import useUserScores from '../../lib/useUserScores'
import Layout from '../../components/Layout'
import ScoreCard from '../../components/ScoreCard'
import useName from '../../lib/useName'


function Profile () {
  const router = useRouter()
  const { id } = router.query

  const { scores, error } = useUserScores(id)

  const name = useName(id, scores)

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
