import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { MARKETING_BUCKETS } from '../../lib/buckets'

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
  const bucket = router.query.bucket;

  return (
    <div>
        <Container>
            <h2>
            Marketing page variant
            </h2>
            <p>
            You&apos;re currently on <b>bucket {bucket.toUpperCase()}</b>
            </p>
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
            <button variant="black" onClick={removeBucket}>
            Remove bucket
            </button>
        </Container>
    </div>
  )
}

export async function getStaticPaths() {
  /**
   * For the marketing page, the `original` bucket (handled by `./original.tsx`)
   * represents the current marketing page without any changes, this is
   * useful if the variations are very different and you don't to merge
   * them on the same page.
   */
  const buckets = MARKETING_BUCKETS.filter((bucket) => bucket !== 'original')

  return {
    paths: buckets.map((bucket) => ({ params: { bucket } })),
    fallback: false,
  }
}

export async function getStaticProps() {
  // Here you would return data about the bucket
  return { props: {} }
}