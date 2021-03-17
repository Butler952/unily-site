import fire from '../../config/fire-config';
import Link from 'next/link'

const Blog = (props) => {

  return (
    <div>
      <h2>{props.title}</h2>
      <p>
        {props.id}
      </p>
      <Link href="/">
        <a>Back</a>
      </Link>
    </div>
  )
}

export const getServerSideProps = async ({ query }) => {
  const content = {}
  await fire.firestore()
    .collection('users')
    .doc(query.id)
    .get()
    .then(result => {
      content['title'] = result.data().profile.title;
      content['id'] = result.data().profile.id;
    });

  return {
    props: {
      title: content.title,
      id: content.id,
    }
  }
}

export default Blog