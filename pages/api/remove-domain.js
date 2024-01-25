import Cors from 'cors'
import fetch from "node-fetch"
import initMiddleware from '../../lib/init-middleware'
import fire from '../../config/fire-config';

// Initialize the cors middleware
const cors = initMiddleware(
  Cors({
    methods: ['DELETE'],
  })
)

export default async function checkDomain(req, res) {
  // Run cors
  await cors(req, res)

  const domain = req.query.domain
  const userId = req.query.userId
  // const { domain } = req.query

  var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${process.env.NEXT_PUBLIC_AUTH_BEARER_TOKEN}`);
    myHeaders.append("Access-Control-Allow-Origin", "https://www.vitaely.me, https://vitaely.vercel.app, http://localhost:3000/, https://localhost:3000/, https://api.vercel.com/, https://firebasestorage.googleapis.com");
    myHeaders.append('Access-Control-Allow-Credentials', 'true');
    myHeaders.append("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    myHeaders.append("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

    var requestOptions = {
      mode: 'cors',
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow'
    };

  const response = await fetch(`https://api.vercel.com/v10/domains/${domain}?teamId=${process.env.NEXT_PUBLIC_TEAM_ID_VERCEL}`, requestOptions)

  const data = await response.json()

  await fire.firestore().collection('users').doc(userId).update({
    domain: fire.firestore.FieldValue.delete(),
    domainConfig: fire.firestore.FieldValue.delete(),
    lastUpdated: fire.firestore.FieldValue.serverTimestamp()
  })

  res.send(data)
  res.status(200).end()
}
