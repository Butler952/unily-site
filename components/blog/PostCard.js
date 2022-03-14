import Link from 'next/link';
import styles from '../../pages/blog/blog.module.scss'

const PostCard = (props) => {

  return (
    <>
      <Link href={props.postUrl}>
        <div className={`d-flex flex-column flex-lg-row align-items-center bg-light-900 border-1 border-solid radius-3 p-5 ${styles.postCard}`} style={{gap: '24px'}}>
          { props.image ? (
            <div className={`${styles.featureCard} order-1 order-lg-2 w-100`} style={{height: 'fitContent'}}>
              <img alt={props.title} src={props.image}></img>
            </div>
          ) : null }
          <div className="order-2 order-lg-1 w-100">
            {props.screenWidth > 767 ?
              <h2>{props.title}</h2>
              :
              <h3>{props.title}</h3>
            }
            <p className="font-weight-medium text-dark-high">{props.duration} min read</p>
            <p className="mb-0">{props.bodyPreview} <Link href={props.postUrl} className="text-dark-low"><u style={{cursor: 'pointer'}}>Continue reading</u></Link></p>
          </div>
        </div>
      </Link>
    </>
  )
}

export default PostCard;