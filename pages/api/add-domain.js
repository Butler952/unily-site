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

export default async function addDomain(req, res) {
  // Run cors
  await cors(req, res)

  // const query = req.query
  // const { domain, userId } = query

  const domain = req.query.domain
  const userId = req.query.userId

  // const { domain, siteId } = req.query
  // var domain = 'www.example.com'
  // var userId = '8JTBYqYQ34Rgr3USMptqX9yTS1Z2'

  // Rest of the API logic
 var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${process.env.NEXT_PUBLIC_AUTH_BEARER_TOKEN}`);
  myHeaders.append("Access-Control-Allow-Origin", "https://www.vitaely.me, https://expertpage.vercel.app, http://localhost:3000/, https://localhost:3000/, https://api.vercel.com/, https://firebasestorage.googleapis.com");
  myHeaders.append('Access-Control-Allow-Credentials', 'true');
  myHeaders.append("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  myHeaders.append("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

  var requestOptions = {
    mode: 'cors',
    body: `{\n  "name": "${domain}"\n}`,
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow'
  };

  const response = await fetch(`https://api.vercel.com/v10/projects/${process.env.NEXT_PUBLIC_PROJECT_ID_VERCEL}/domains?teamId=${process.env.NEXT_PUBLIC_TEAM_ID_VERCEL}`, requestOptions)
  
  const data = await response.json()

  if (data.error?.code == 'forbidden') {
    res.status(403).end() // domain is already owned by another team but you can request delegation to access it
  } else if (data.error?.code == 'domain_taken') {
    res.send(data)
    res.status(409).end() // domain is already being used by a different project
  } else if (data.error?.code == 'domain_already_in_use') {
    res.send(data)
    res.status(409).end() // domain is already being used by this project
  } else {
    await fire.firestore().collection('users').doc(userId).update({
      domain: data,
      lastUpdated: fire.firestore.FieldValue.serverTimestamp(),
    })
    res.send(data)
    res.status(200).end()
  }
}