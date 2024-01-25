import Link from 'next/link';
import styles from '../../pages/blog/blog.module.scss'

const PostCard = (props) => {

  return (
    <>
      <Link href={props.postUrl} style={{ textDecoration: 'none' }}>
        <div className={`d-flex flex-column flex-lg-row ${props.image ? 'align-items-center' : 'align-items-start'} bg-light-900 radius-4 border-1 border-solid border-dark-300 p-4 p-sm-5 ${styles.postCard}`}>
          { props.image ? (
            <div className={`${styles.featureCard} order-1 order-lg-2 w-100`} style={{height: 'fitContent'}}>
              <img alt={props.title} src={props.image}></img>
            </div>
          ) : null }
          <div className="order-2 order-lg-1 w-100">
            <p className="font-weight-medium text-dark-low">{props.duration} min read</p>
            {props.screenWidth > 767 ?
              <h3>{props.title}</h3>
              :
              <h3>{props.title}</h3>
            }
            <p className="text-dark-med mb-0">{props.bodyPreview} <u className="text-dark-low" style={{cursor: 'pointer'}}>Continue reading</u></p>
          </div>
        </div>
      </Link>
    </>
  )
}

export default PostCard;