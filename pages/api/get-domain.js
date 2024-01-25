import Cors from 'cors'
import fetch from "node-fetch"
import initMiddleware from '../../lib/init-middleware'
import fire from '../../config/fire-config';

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST', 'OPTIONS'],
  })
)

export default async function getDomain(req, res) {
  // Run cors
  await cors(req, res)

  const domain = req.query.domain
  const userId = req.query.userId

  // Rest of the API logic
 var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${process.env.NEXT_PUBLIC_AUTH_BEARER_TOKEN}`);
  myHeaders.append("Access-Control-Allow-Origin", "https://www.vitaely.me, https://expertpage.vercel.app, http://localhost:3000/, https://localhost:3000/, https://api.vercel.com/, https://firebasestorage.googleapis.com");
  myHeaders.append('Access-Control-Allow-Credentials', 'true');
  myHeaders.append("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  myHeaders.append("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

  var requestOptions = {
    mode: 'cors',
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  const response = await fetch(`https://api.vercel.com/v10/projects/${process.env.NEXT_PUBLIC_PROJECT_ID_VERCEL}/domains/${domain}?teamId=${process.env.NEXT_PUBLIC_TEAM_ID_VERCEL}`, requestOptions)
  
  const data = await response.json()

  await fire.firestore().collection('users').doc(userId).update({
    domain: data,
    lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
  })
  res.send(data)
  res.status(200).end()
}