import Cors from 'cors'
import fetch from "node-fetch"
import initMiddleware from '../../lib/init-middleware'

// Initialize the cors middleware
const cors = initMiddleware(
  Cors({
    methods: ['GET'],
  })
)

export default async function checkDomain(req, res) {
  // Run cors
  await cors(req, res)

  var domain = 'example.com'
  // const { domain } = req.query

  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${process.env.AUTH_BEARER_TOKEN}`);
  myHeaders.append("Access-Control-Allow-Origin", "https://www.expertpage.io, https://expertpage.vercel.app, http://localhost:3000/, https://localhost:3000/, https://api.vercel.com/, https://firebasestorage.googleapis.com");
  myHeaders.append('Access-Control-Allow-Credentials', 'true');
  myHeaders.append("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  myHeaders.append("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

  const response = await fetch(`https://api.vercel.com/v6/domains/${domain}/config?teamId=${process.env.TEAM_ID_VERCEL}`, {
    "mode": 'cors',  
    "headers": myHeaders,
    "method": "GET"
    })

  const data = await response.json()

  const valid = data?.configuredBy ? true : false

  res.status(200).json(valid)
}
