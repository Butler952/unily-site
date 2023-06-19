import fire from '../../../config/fire-config';
import { useEffect, useState, useContext } from 'react';
import mixpanel from 'mixpanel-browser';
import mixpanelConfig from 'config/mixpanel-config';
import { UserContext } from '../../_app';
import Header from '../../../components/header/Header';

const Site = (props) => {

  const { userContext, setUserContext } = useContext(UserContext);

  const [currentUserId, setCurrentUserId] = useState('')
  const [showMore, setShowMore] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const [screenWidth, setScreenWidth] = useState('');

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  };

  useEffect(() => {
    setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize);
    checkUser();
    mixpanel.init(mixpanelConfig);
    mixpanel.track('Profile');
    // if (empty) router.push
  }, [])

  const checkUser = () => {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setCurrentUserId(user.uid)
        setLoggedIn(true)
        // ...
      } else {
        setLoggedIn(false)
        // User is signed out
        // ...
      }
    });
  }

  return (
    <div>
      <Header />
      <p>hi</p>
      <p>{props.name}</p>
      {loggedIn &&
        <div>
          <h5>{props.name}</h5>
        </div>
      }
    </div>
  )
}

// export async function getStaticPaths({ params: { site } }) {

//   let subdomains = []
//   let domains = []

//   // const { data } = await supabase.from('site').select('subdomain, customDomain')
//   await fire.firestore()
//     .collection('sites')
//     .where('name', '!=', '')
//     .get()
//     .then((querySnapshot) => {
//       querySnapshot.forEach((doc) => {
//         subdomains = [...subdomains, doc.data().subdomain]
//         domains = [...domains, doc.data().domains]
//       })
//     })

//   // const subdomains = data
//   //   .filter((site) => site.subdomain)
//   //   .map((site) => site.subdomain)
//   // const domains =  data
//   //   .filter((site) => site.customDomain)
//   //   .map((site) => site.customDomain)

//   const allPaths = [...subdomains, ...domains]
//   return {
//     paths: allPaths.map((path) => {
//       return { params: { site: path } }
//     }),
//     fallback: true,
//   }
// }

// export async function getStaticProps({ params: { site } }) {

//   let filter = {
//     subdomain: site,
//   }
//   if (site.includes('.')) {
//     filter = {
//       customDomain: site,
//     }
//   }

//   const domainType = site.includes('.') ? 'customDomain' : 'subdomain'

//   // const { data } = await supabase.from('site').select('subdomain, customDomain')

//   await fire.firestore()
//     .collection('sites')
//     .where(domainType, "==", site)
//     .limit(1)
//     .get()
//     .then((querySnapshot) => {
//       querySnapshot.forEach((doc) => {
//         content['siteId'] = site ? site : null;
//         content['name'] = doc.data().name ? doc.data().name : null;
//         content['description'] = doc.data().description ? doc.data().description : null;
//         content['subdomain'] = doc.data().subdomain ? doc.data().subdomain : null;
//         content['customDomain'] = doc.data().customDomain ? doc.data().customDomain : null;
//       })
//     })
//     .catch((err) => {
//       console.log(err.code, err.message)
//     })

//   const props = {
//     siteId: content.siteId,
//     name: content.name,
//     description: content.description,
//     subdomain: content.subdomain,
//     customDomain: content.customDomain
//   }

//   return {
//     props: JSON.parse(JSON.stringify(props))
//   }

// }

export const getServerSideProps = async ({ params: { site } }) => {
    const content = {}
    const domainType = site.includes('.') ? 'customDomain' : 'subdomain'
    await fire.firestore()
      .collection('sites')
      .where(domainType, "==", site)
      .limit(1)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          content['siteId'] = site ? site : null;
          content['name'] = doc.data().name ? doc.data().name : null;
          content['description'] = doc.data().description ? doc.data().description : null;
          content['subdomain'] = doc.data().subdomain ? doc.data().subdomain : null;
          content['customDomain'] = doc.data().customDomain ? doc.data().customDomain : null;
        })
      })
      .catch((err) => {
        console.log(err.code, err.message)
      })
  
      const props = {
        siteId: content.siteId,
        name: content.name,
        description: content.description,
        subdomain: content.subdomain,
        customDomain: content.customDomain
      }
  
    return {
      props: JSON.parse(JSON.stringify(props))
    }
  }

// export const getServerSideProps = async ({ query }) => {
//   const content = {}
//   await fire.firestore()
//     .collection('users')
//     .where("profileUrl", "==", `/${query.id}`)
//     .limit(1)
//     .get()
//     .then((querySnapshot) => {
//       querySnapshot.forEach((doc) => {
//         content['pageId'] = query.id ? query.id : null;
//         content['template'] = doc.data().template ? doc.data().template : null;
//         content['theme'] = doc.data().theme ? doc.data().theme : null;
//         content['email'] = doc.data().email ? doc.data().email : null;
//         content['linksPrimary'] = doc.data().linksPrimary ? doc.data().linksPrimary : null;
//         content['links'] = doc.data().links ? doc.data().links : null;
//         content['profile_pic_url'] = doc.data().profile.profile_pic_url ? doc.data().profile.profile_pic_url : null;
//         content['background_cover_image_url'] = doc.data().profile.background_cover_image_url ? doc.data().profile.background_cover_image_url : null;
//         content['full_name'] = doc.data().profile.full_name ? doc.data().profile.full_name : null;
//         content['first_name'] = doc.data().profile.first_name ? doc.data().profile.first_name : null;
//         content['last_name'] = doc.data().profile.last_name ? doc.data().profile.last_name : null;
//         content['headline'] = doc.data().profile.headline ? doc.data().profile.headline : null;
//         content['summary'] = doc.data().profile.summary ? doc.data().profile.summary : null;
//         content['products'] = doc.data().profile.products ? doc.data().profile.products : null;
//         content['services'] = doc.data().profile.services ? doc.data().profile.services : null;
//         content['featured'] = doc.data().profile.featured ? doc.data().profile.featured : null;
//         content['experiences'] = doc.data().profile.experiences ? doc.data().profile.experiences : null;
//         content['projects'] = doc.data().profile.projects ? doc.data().profile.projects : null;
//         content['side_projects'] = doc.data().profile.side_projects ? doc.data().profile.side_projects : null;
//         content['testimonials'] = doc.data().profile.testimonials ? doc.data().profile.testimonials : null;
//         content['posts'] = doc.data().profile.posts ? doc.data().profile.posts : null;
//         content['education'] = doc.data().profile.education ? doc.data().profile.education : null;
//         content['volunteer_work'] = doc.data().profile.volunteer_work ? doc.data().profile.volunteer_work : null;
//         content['featured'] = doc.data().profile.featured ? doc.data().profile.featured : null;
//         content['logoVisibility'] = doc.data().logoVisibility ? doc.data().logoVisibility : null;
//         content['surveyOnSignUpHide'] = doc.data().surveys ? (doc.data().surveys.surveyOnSignUp ? (doc.data().surveys.surveyOnSignUp.surveyHide ? doc.data().surveys.surveyOnSignUp.surveyHide : null) : null) : null;
//         content['displayInfo'] = doc.data().displayInfo ? doc.data().displayInfo : null;
//       })
//     })
//     .catch((err) => {
//       console.log(err.code, err.message)
//     })

//   const props = {
//     pageId: content.pageId,
//     template: content.template,
//     theme: content.theme,
//     email: content.email,
//     linksPrimary: content.linksPrimary,
//     links: content.links,
//     profile_pic_url: content.profile_pic_url,
//     background_cover_image_url: content.background_cover_image_url,
//     full_name: content.full_name,
//     first_name: content.first_name,
//     last_name: content.last_name,
//     headline: content.headline,
//     summary: content.summary,
//     products: content.products,
//     services: content.services,
//     featured: content.featured,
//     experiences: content.experiences,
//     projects: content.projects,
//     side_projects: content.side_projects,
//     testimonials: content.testimonials,
//     posts: content.posts,
//     education: content.education,
//     volunteer_work: content.volunteer_work,
//     featured: content.featured,
//     logoVisibility: content.logoVisibility,
//     surveyOnSignUpHide: content.surveyOnSignUpHide,
//     displayInfo: content.displayInfo,
//     empty: content.empty
//   }

//   return {
//     props: JSON.parse(JSON.stringify(props))
//   }
// }

export default Site