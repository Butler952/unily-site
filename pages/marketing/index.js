import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { MARKETING_BUCKETS } from '../../lib/buckets'
import { Container } from 'react-bootstrap'

export default function Marketing() {
  const router = useRouter()
  const setBucket = (bucket) => () => {
    Cookies.set('bucket-marketing', bucket)
    router.reload()
  }
  const removeBucket = () => {
    Cookies.remove('bucket-marketing')
    router.reload()
  }

  return (
    <div>
        <Container>
            <h2>
            Marketing page
            </h2>
            <p>
            You&apos;re currently on <b>/marketing/original</b>
            </p>
            <p>This is the original marketing page</p>
            <p>
            You can use the buttons below to change your assigned bucket and refresh
            the page:
            </p>
            {MARKETING_BUCKETS.map((bucket) => (
            <button
                key={bucket}
                onClick={setBucket(bucket)}
                style={{ marginRight: '0.625rem' }}
            >
                Bucket {bucket.toUpperCase()}
            </button>
            ))}
            <button onClick={removeBucket}>
            Remove bucket
            </button>
        </Container>
    </div>
  )
}