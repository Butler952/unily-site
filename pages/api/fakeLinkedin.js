import Cors from 'cors'
import fetch from "node-fetch"
import initMiddleware from '../../lib/init-middleware'

// Initialize the cors middleware
const cors = initMiddleware(
    // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
    Cors({
        // Only allow requests with GET, POST and OPTIONS
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)

export default async function handler(req, res) {
    // Run cors
    await cors(req, res)

    //return console.log(req.query)

    // Rest of the API logic
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer 535f6290-580a-42db-b7cb-93677b8c82e6");
    myHeaders.append("Access-Control-Allow-Origin", "https://www.expertpage.io, https://expertpage.vercel.app, http://localhost:3000/, https://localhost:3000/, https://nubela.co/proxycurl/api/v2/");
    myHeaders.append('Access-Control-Allow-Credentials', 'true');
    myHeaders.append("Access-Control-Allow-Methods", "GET, OPTIONS");
    myHeaders.append("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

    var requestOptions = {
        mode: 'cors',
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    res.send({
        "experiences": [
            {
                "employment_type": null,
                "company": "Activate",
                "ends_at": null,
                "company_linkedin_profile_url": "https://uk.linkedin.com/company/activate-london",
                "company_urn": null,
                "starts_at": {
                    "day": 1,
                    "year": 2019,
                    "month": 10
                },
                "location": "London, United Kingdom",
                "title": "Product Designer",
                "media": [],
                "logo_url": "https://media-exp3.licdn.com/dms/image/C4D0BAQHXy8wQzcA-xQ/company-logo_100_100/0/1623769010635?e=1631750400&v=beta&t=U5KdRfI1mhyFA7I-Sh2NQm8-GTywVQuQYHJ_ytwdZiQ",
                "description": null
            },
            {
                "company_linkedin_profile_url": "https://uk.linkedin.com/company/activate-london",
                "employment_type": null,
                "media": [],
                "title": "Product Manager",
                "description": null,
                "starts_at": {
                    "year": 2020,
                    "day": 1,
                    "month": 3
                },
                "location": "London, United Kingdom",
                "company": "Activate",
                "logo_url": "https://media-exp3.licdn.com/dms/image/C4D0BAQHXy8wQzcA-xQ/company-logo_100_100/0/1623769010635?e=1631750400&v=beta&t=U5KdRfI1mhyFA7I-Sh2NQm8-GTywVQuQYHJ_ytwdZiQ",
                "company_urn": null,
                "ends_at": {
                    "year": 2021,
                    "month": 4,
                    "day": 1
                }
            },
            {
                "title": "Junior Product Designer",
                "company_urn": null,
                "media": [],
                "location": "London, United Kingdom",
                "description": null,
                "ends_at": {
                    "month": 10,
                    "day": 1,
                    "year": 2019
                },
                "logo_url": "https://media-exp3.licdn.com/dms/image/C4D0BAQHXy8wQzcA-xQ/company-logo_100_100/0/1623769010635?e=1631750400&v=beta&t=U5KdRfI1mhyFA7I-Sh2NQm8-GTywVQuQYHJ_ytwdZiQ",
                "company": "Activate",
                "starts_at": {
                    "day": 1,
                    "year": 2018,
                    "month": 4
                },
                "employment_type": null,
                "company_linkedin_profile_url": "https://uk.linkedin.com/company/activate-london"
            },
            {
                "title": "UX Design Intern",
                "logo_url": "https://media-exp3.licdn.com/dms/image/C4D0BAQES5l8k3ruIDg/company-logo_100_100/0/1597224257179?e=1631750400&v=beta&t=mrRo0itH0Kgoa3Z_jWprso_AkrB2AgNHfMIVfFO0afw",
                "employment_type": null,
                "starts_at": {
                    "month": 6,
                    "year": 2016,
                    "day": 1
                },
                "location": "London, United Kingdom",
                "company_linkedin_profile_url": "https://uk.linkedin.com/company/market-gravity",
                "company": "Market Gravity",
                "ends_at": {
                    "year": 2016,
                    "month": 9,
                    "day": 1
                },
                "media": [],
                "company_urn": null,
                "description": null
            },
            {
                "company_urn": null,
                "logo_url": "https://media-exp3.licdn.com/dms/image/C4E0BAQF7Bk1h9-cUuw/company-logo_100_100/0/1548868826450?e=1631750400&v=beta&t=iDebzQich7pvUztsE6ohJDkutCewU-3OQ9n2RCZkIcA",
                "starts_at": {
                    "year": 2015,
                    "month": 8,
                    "day": 1
                },
                "company_linkedin_profile_url": "https://uk.linkedin.com/company/dci-artform",
                "ends_at": {
                    "year": 2016,
                    "day": 1,
                    "month": 3
                },
                "title": "Student Design Engineer",
                "company": "DCI-Artform",
                "employment_type": null,
                "description": null,
                "location": "Loughborough, United Kingdom",
                "media": []
            },
            {
                "ends_at": {
                    "day": 1,
                    "year": 2015,
                    "month": 8
                },
                "description": null,
                "media": [],
                "employment_type": null,
                "company_linkedin_profile_url": "https://uk.linkedin.com/company/createanet",
                "title": "UX/UI Summer Intern",
                "company": "Createanet",
                "location": "Torquay, United Kingdom",
                "logo_url": "https://media-exp3.licdn.com/dms/image/C510BAQEYXfl8FYlCpA/company-logo_100_100/0/1519896736129?e=1631750400&v=beta&t=YTrA6A__WhjpY4wDBqV3YjnVmXO3w5JUD7TAx79BZR8",
                "company_urn": null,
                "starts_at": {
                    "year": 2015,
                    "month": 7,
                    "day": 1
                }
            },
            {
                "company": "Pro Direct Sport",
                "company_linkedin_profile_url": "https://uk.linkedin.com/company/pro-direct-sport",
                "title": "Sales Assistant (Weekends & Summer)",
                "company_urn": null,
                "starts_at": {
                    "year": 2012,
                    "day": 1,
                    "month": 5
                },
                "ends_at": {
                    "year": 2015,
                    "month": 7,
                    "day": 1
                },
                "media": [],
                "logo_url": "https://media-exp1.licdn.com/dms/image/C4E0BAQGd4ppwjE3Qzg/company-logo_100_100/0/1519864941410?e=1631750400&v=beta&t=phqJmxrIqtsZ1u9nPsblRCD_lqq5g9bVzl4HyC1rBes",
                "description": null,
                "location": "Torquay, United Kingdom",
                "employment_type": null
            }
        ],
        "country": "UK",
        "articles": [],
        "accomplishment_courses": [],
        "accomplishment_test_scores": [],
        "country_full_name": "United Kingdom",
        "background_cover_image_url": "https://media-exp1.licdn.com/dms/image/C5616AQEEDqAtXNfg9w/profile-displaybackgroundimage-shrink_350_1400/0/1579640632734?e=1658361600&v=beta&t=BBC7S6psQGKESAHxP7CkXLNnz9zdLRqFDZV3eD3642U",
        "education": [
            {
                "starts_at": {
                    "month": 1,
                    "day": 1,
                    "year": 2013
                },
                "field_of_study": "Industrial Design and Technology",
                "degree_name": "Bachelor of Arts (BA)",
                "ends_at": {
                    "day": 1,
                    "month": 1,
                    "year": 2017
                },
                "school": "Loughborough University",
                "logo_url": null,
                "description": null
            },
            {
                "field_of_study": null,
                "logo_url": null,
                "degree_name": "A-Level's & GCSE's",
                "description": null,
                "starts_at": {
                    "year": 2006,
                    "day": 1,
                    "month": 1
                },
                "ends_at": {
                    "month": 1,
                    "day": 1,
                    "year": 2013
                },
                "school": "Churston Ferrers Grammar School"
            }
        ],
        "people_also_viewed": [],
        "similarly_named_profiles": [],
        "profile_pic_url": "https://media-exp1.licdn.com/dms/image/C5603AQHU-NUoZs5ViA/profile-displayphoto-shrink_400_400/0/1549034067332?e=1658361600&v=beta&t=LoohaFrvPz8mu0Oe6ZHMlxBL5exRLaN_AHWiuBdSM08",
        "first_name": "Aaron",
        "recommendations": [],
        "city": "London",
        "state": "England",
        "accomplishment_projects": [],
        "languages": [
            "English"
        ],
        "certifications": [],
        "connections": 313,
        "accomplishment_publications": [],
        "full_name": "Aaron Butler",
        "accomplishment_patents": [],
        "activities": [],
        "occupation": "Product Designer at Activate",
        "accomplishment_organisations": [],
        "headline": "Product Designer at Activate",
        "public_identifier": "butler952",
        "accomplishment_honors_awards": [],
        "last_name": "Butler",
        "volunteer_work": [
            {
                "company": "Loughborough Students American Football Club",
                "description": null,
                "company_linkedin_profile_url": null,
                "ends_at": {
                    "day": 1,
                    "year": 2016,
                    "month": 6
                },
                "cause": null,
                "starts_at": {
                    "day": 1,
                    "year": 2015,
                    "month": 9
                },
                "title": "Media Rep",
                "company_urn": null,
                "logo_url": null
            }
        ],
        "summary": "Product & Venture designer."
    });
}