import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { HOME_BUCKETS } from '../../lib/buckets'
import { Container } from 'react-bootstrap'

export default function Home() {
  const router = useRouter()
  const setBucket = (bucket) => () => {
    Cookies.set('bucket-home', bucket)
    router.reload()
  }
  const removeBucket = () => {
    Cookies.remove('bucket-home')
    router.reload()
  }
  const bucket = router.query.bucket

  return (
    <div>
      <Container>
        <div>
          <h2>Home page variant</h2>
          <p>You&apos;re currently on <b>bucket {bucket.toUpperCase()}</b></p>
          <p>
            You can use the buttons below to change your assigned bucket and refresh
            the page:
          </p>
          {HOME_BUCKETS.map((bucket) => (
            <button
              key={bucket}
              onClick={setBucket(bucket)}
              style={{ marginRight: '0.625rem' }}
            >
              Bucket {bucket.toUpperCase()}
            </button>
          ))}
           <button onClick={removeBucket}>Remove bucket</button>
        </div>
      </Container>
    </div>
  )
}

export async function getStaticPaths() {
  return {
    paths: HOME_BUCKETS.map((bucket) => ({ params: { bucket } })),
    fallback: false,
  }
}

export async function getStaticProps() {
  // Here you would return data about the bucket
  return { props: {} }
}