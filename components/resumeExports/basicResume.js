import { useEffect } from 'react';
import { Page, Text, View, Image, Document, Font, StyleSheet } from '@react-pdf/renderer';


// Create Document Component
const BasicResume = ({ allUserData }) => {

  useEffect(() => {
  }, [])

  const convertMonth = (mon) => {
    return [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][mon];
  }

  // Create styles
  const styles = StyleSheet.create({
    page: {
      fontFamily: 'InterRegular',
      backgroundColor: '#f8f7f8',
      paddingTop: 35,
      paddingBottom: 65,
      paddingHorizontal: 35,
      fontSize: 16,
      textAlign: 'left',
      lineHeight: '1.5',
      // color: '#231F20', High
      color: '#605d5d',
    },
    h1: {
      fontFamily: 'InterBold',
      fontSize: 64,
    },
    h2: {
      fontFamily: 'InterBold',
      fontSize: 48,
    },
    h3: {
      fontFamily: 'InterBold',
      fontSize: 34,
    },
    h4: {
      fontFamily: 'InterBold',
      fontSize: 28,
    },
    h5: {
      fontFamily: 'InterBold',
      fontSize: 24,
    },
    pExtraLargeRegular: {
      fontFamily: 'InterRegular',
      fontSize: 24,
    },
    pLargeRegular: {
      fontFamily: 'InterRegular',
      fontSize: 20,
    },
    pLargeBold: {
      fontFamily: 'InterBold',
      fontSize: 20,
    },
    pRegular: {
      fontFamily: 'InterRegular',
      fontSize: 16,
    },
    pBold: {
      fontFamily: 'InterBold',
      fontSize: 16,
    },
    pSmallRegular: {
      fontFamily: 'InterRegular',
      fontSize: 14,
    },
    pSmallBold: {
      fontFamily: 'InterBold',
      fontSize: 14,
    },
    pExtraSmallRegular: {
      fontFamily: 'InterRegular',
      fontSize: 12,
    },
    pExtraSmallBold: {
      fontFamily: 'InterBold',
      fontSize: 12,
    },
    highEmphasis: {
      color: '#231F20'
    },
    mediumEmphasis: {
      color: '#605d5d'
    },
    lowEmphasis: {
      color: '#969494'
    },
    mb1: {
      padding: 2
    },
    mb2: {
      padding: 4
    },
    mb3: {
      padding: 8
    },
    mb4: {
      padding: 12
    },
    mb5: {
      padding: 16
    },
    keyInfoSection: {
      display: 'flex',
      alignItems: 'center'
    },
    userImageSection: {
      display: 'flex',
      flexDirection: 'row'
    },
    userImageWrapper: {
      borderTopLeftRadius: 100,
      borderTopRightRadius: 100,
      borderBottomRightRadius: 100,
      borderBottomLeftRadius: 100,
      background: '#ffffff',
      border: '2px solid #ffffff',
    },
    userImage: {
      width: 120,
      height: 120,
      borderTopLeftRadius: 100,
      borderTopRightRadius: 100,
      borderBottomRightRadius: 100,
      borderBottomLeftRadius: 100,
    },
    orgImage: {
      width: 48,
      height: 48,
      marginRight: 24,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      borderBottomRightRadius: 12,
      borderBottomLeftRadius: 12
    },
    card: {
      backgroundColor: '#FFFFFF',
      // border: '1px solid #eeedee',
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16,
      borderBottomLeftRadius: 16
    },
    section: {
      margin: 0,
      padding: 24,
    },
    sectionRow: {
      display: 'flex',
      flexDirection: 'row',
    },
    sectionFillRow: {
      flex: 1
    },
    horizontalBorder: {
      height: 1,
      backgroundColor: '#eeedee'
    }
  });

  Font.register({
    family: 'InterRegular',
    src: 'https://www.vitaely.me/fonts/plusJakartaSans/desktop/PlusJakartaSans-Medium.ttf'
    // src: 'https://www.vitaely.me/fonts/inter/desktop/Inter-Regular.otf'
  });

  Font.register({
    family: 'InterBold',
    src: 'https://www.vitaely.me/fonts/plusJakartaSans/desktop/PlusJakartaSans-Bold.ttf'
    // src: 'https://www.vitaely.me/fonts/inter/desktop/Inter-Bold.otf'
  });

  /* Start prevent hyphenation */

  Font.registerHyphenationCallback(word => (
    [word]
  ));

  /* End prevent hyphenation */

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.keyInfoSection}>
          {allUserData.profile.profile_pic_url && (
            <View style={styles.userImageSection}>
              <View style={styles.userImageWrapper}>
                <Image
                  style={styles.userImage}
                  src={allUserData.profile.profile_pic_url}
                />
              </View>
            </View>
          )}
          <View style={styles.mb3}></View>
          {allUserData.profile.full_name && (
            <View style={styles.highEmphasis}>
              <Text style={styles.h5}>{allUserData.profile.full_name}</Text>
            </View>
          )}
          {allUserData.profile.headline && (
            <Text style={styles.title}>{allUserData.profile.headline}</Text>
          )}
        </View>
        <View style={styles.mb5}></View>
        {allUserData.profile.summary && (
          <>
            <View style={styles.highEmphasis}>
              <Text style={styles.pLargeBold}>Summary</Text>
            </View>
            <View style={styles.mb3}></View>
            <View style={styles.card}>
              <View style={styles.section}>
                <Text style={styles.pExtraSmallRegular}>{allUserData.profile.summary}</Text>
              </View>
            </View>
            <View style={styles.mb5}></View>
          </>
        )}
        <View style={styles.highEmphasis}>
          <Text style={styles.pLargeBold}>Experience</Text>
        </View>
        <View style={styles.mb3}></View>
        <View style={styles.card}>
          { allUserData &&
            allUserData.profile &&
            allUserData.profile.experiences &&
            allUserData.profile.experiences.map((job, index) =>
            <div key={index}>
            <View style={styles.section}>
              <View style={styles.sectionRow}>
                { allUserData.logoVisibility && allUserData.logoVisibility.experience && job.logo_url &&
                // { job.logo_url &&
                  <Image
                    style={styles.orgImage}
                    src={job.logo_url}
                  />
                }
                <View style={styles.sectionFillRow}>
                  <View style={styles.highEmphasis}>
                    <Text style={styles.pBold}>{job.title}</Text>
                  </View>
                  <Text style={styles.pRegular}>{job.company}</Text>
                  <View style={styles.lowEmphasis}>
                    <Text style={styles.pExtraSmallRegular}>{job.location}</Text>
                    <Text style={styles.pExtraSmallRegular}>
                      {job.starts_at ? (job.starts_at.month ? convertMonth(job.starts_at.month) + " " : '') : null}
                      {job.starts_at ? (job.starts_at.year ? job.starts_at.year + " " : null) : null}
                      {job.starts_at && job.ends_at == null ? ' – Present' : null}
                      {job.starts_at && job.ends_at ? " – " + (job.ends_at.month ? convertMonth(job.ends_at.month) : '') : null}
                      {job.starts_at && job.ends_at ? (job.ends_at.year ? " " + job.ends_at.year : null) : null}
                    </Text>
                  </View>
                  { job.description && (
                    <>
                      <View style={styles.mb3}></View>
                      <Text style={styles.pExtraSmallRegular}>{job.description}</Text>
                    </>
                  )}
                </View>
              </View>
            </View>
            <View style={styles.horizontalBorder}></View>
            </div>
          )}
            {/* <div key={index} className="d-flex flex-column flex-lg-row align-items-start">
              {(props.logoVisibility ? props.logoVisibility.experience : null) && job.logo_url ?
                <div className="mb-3 mb-lg-0 mr-0 mr-lg-4">
                  <a target="_blank" href={job.company_linkedin_profile_url}>
                    <img className={styles.experienceImage} src={job.logo_url ? job.logo_url : null} />
                  </a>
                </div>
                : null}
              <div className="w-100">
                <p className="large text-dark-high font-weight-semibold mb-0">{job.title}</p>
                <p className="large text-dark-med mb-0">{job.company}</p>
                <p className="text-dark-low mb-0">{job.location}</p>
                <p className="text-dark-low mb-0">
                  {job.starts_at ? (job.starts_at.month ? convertMonth(job.starts_at.month) + " " : '') : null}
                  {job.starts_at ? (job.starts_at.year ? job.starts_at.year + " " : null) : null}
                  {job.starts_at && job.ends_at == null ? ' – Present' : null}
                  {job.starts_at && job.ends_at ? " – " + (job.ends_at.month ? convertMonth(job.ends_at.month) : '') : null}
                  {job.starts_at && job.ends_at ? (job.ends_at.year ? " " + job.ends_at.year : null) : null}
                </p>
                {job.description ? <p className="text-dark-med mb-0 mt-3">{job.description}</p> : null}

              </div>
          )} */}
          {/* <View style={styles.section}>
            <View style={styles.sectionRow}>
              <Image
                style={styles.orgImage}
                src="https://media-exp2.licdn.com/dms/image/C4E0BAQHcJ9uGR09y_A/company-logo_400_400/0/1640605556084?e=1666224000&v=beta&t=VvBC9_xjm7-qvV3RsLafOj3Pa4iaOmtMhv6EYPPfwCY"
              />
              <View style={styles.sectionFillRow}>
                <View style={styles.highEmphasis}>
                  <Text style={styles.pBold}>Product Designer</Text>
                </View>
                <Text style={styles.pRegular}>Cuvva</Text>
                <View style={styles.lowEmphasis}>
                  <Text style={styles.pExtraSmallRegular}>London, United Kingdom</Text>
                  <Text style={styles.pExtraSmallRegular}>July 2021 — Present</Text>
                </View>
                <View style={styles.mb3}></View>
                <Text style={styles.pExtraSmallRegular}>Activate is a digital startup studio. We use our strategy, design and technology expertise to support entrepreneurs who understand the challenges that matter to our world and want to create a positive impact at scale.</Text>
              </View>
            </View>
          </View> */}
          {/* <View style={styles.horizontalBorder}></View>
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <Image
                style={styles.orgImage}
                src="https://media-exp2.licdn.com/dms/image/C4E0BAQHcJ9uGR09y_A/company-logo_400_400/0/1640605556084?e=1666224000&v=beta&t=VvBC9_xjm7-qvV3RsLafOj3Pa4iaOmtMhv6EYPPfwCY"
              />
              <View style={styles.sectionFillRow}>
                <View style={styles.highEmphasis}>
                  <Text style={styles.pBold}>Product Designer</Text>
                </View>
                <Text style={styles.pRegular}>Cuvva</Text>
                <View style={styles.lowEmphasis}>
                  <Text style={styles.pExtraSmallRegular}>London, United Kingdom</Text>
                  <Text style={styles.pExtraSmallRegular}>July 2021 — Present</Text>
                </View>
                <View style={styles.mb3}></View>
                <Text style={styles.pExtraSmallRegular}>Activate is a digital startup studio. We use our strategy, design and technology expertise to support entrepreneurs who understand the challenges that matter to our world and want to create a positive impact at scale.</Text>
              </View>
            </View>
          </View> */}
          {/* <View style={styles.section}>
          <View style={styles.highEmphasis}>
            <Text style={styles.pBold}>Product Designer</Text>
          </View>
          <Text style={styles.pRegular}>Cuvva</Text>
          <View style={styles.lowEmphasis}>
            <Text style={styles.pExtraSmallRegular}>London, United Kingdom</Text>
            <Text style={styles.pExtraSmallRegular}>July 2021 — Present</Text>
          </View>
          <View style={styles.mb3}></View>
          <Text style={styles.pExtraSmallRegular}>Activate is a digital startup studio. We use our strategy, design and technology expertise to support entrepreneurs who understand the challenges that matter to our world and want to create a positive impact at scale.

We deliver hands-on acceleration programmes to help founders go from idea to an investor-ready business and assist startups in building and launching their product to market.</Text>
        </View> */}
        </View>
        <View style={styles.mb5}></View>
        <View style={styles.highEmphasis}>
          <Text style={styles.pLargeBold}>Education</Text>
        </View>
        <View style={styles.mb3}></View>
        <View style={styles.card}>
          { allUserData &&
            allUserData.profile &&
            allUserData.profile.education &&
            allUserData.profile.education.map((school, index) => 
            <div key={index}>
            <View style={styles.section}>
              <View style={styles.sectionRow}>
                { allUserData.logoVisibility && allUserData.logoVisibility.education && school.logo_url &&
                // { job.logo_url &&
                  <Image
                    style={styles.orgImage}
                    src={school.logo_url}
                  />
                }
                <View style={styles.sectionFillRow}>
                  <View style={styles.highEmphasis}>
                    <Text style={styles.pBold}>
                      {`${school.field_of_study ? school.field_of_study : ''} ${school.field_of_study ? `(${school.degree_name})` : (school.degree_name ? school.degree_name : '')}`}
                    </Text>
                  </View>
                  <Text style={styles.pRegular}>{school.school}</Text>
                  <View style={styles.lowEmphasis}>
                    <Text style={styles.pExtraSmallRegular}>{school.location}</Text>
                    <Text style={styles.pExtraSmallRegular}>
                      {school.starts_at ? (school.starts_at.month ? convertMonth(school.starts_at.month) + " " : '') : null}
                      {school.starts_at ? (school.starts_at.year ? school.starts_at.year + " " : null) : null}
                      {school.starts_at && school.ends_at == null ? ' – Present' : null}
                      {school.starts_at && school.ends_at ? " – " + (school.ends_at.month ? convertMonth(school.ends_at.month) : '') : null}
                      {school.starts_at && school.ends_at ? (school.ends_at.year ? " " + school.ends_at.year : null) : null}
                    </Text>
                  </View>
                  { school.description && (
                    <>
                      <View style={styles.mb3}></View>
                      <Text style={styles.pExtraSmallRegular}>{school.description}</Text>
                    </>
                  )}
                </View>
              </View>
            </View>
            <View style={styles.horizontalBorder}></View>
            </div>
          )}
        </View>
        <View style={styles.mb5}></View>
        <View style={styles.highEmphasis}>
          <Text style={styles.pLargeBold}>Volunteering</Text>
        </View>
        <View style={styles.mb3}></View>
        <View style={styles.card}>
          { allUserData &&
            allUserData.profile &&
            allUserData.profile.volunteer_work &&
            allUserData.profile.volunteer_work.map((volunteer, index) => 
            <div key={index}>
            <View style={styles.section}>
              <View style={styles.sectionRow}>
                { allUserData.logoVisibility && allUserData.logoVisibility.education && volunteer.logo_url &&
                // { job.logo_url &&
                  <Image
                    style={styles.orgImage}
                    src={volunteer.logo_url}
                  />
                }
                <View style={styles.sectionFillRow}>
                  <View style={styles.highEmphasis}>
                    <Text style={styles.pBold}>{volunteer.title}</Text>
                  </View>
                  <Text style={styles.pRegular}>{volunteer.company}</Text>
                  <View style={styles.lowEmphasis}>
                    <Text style={styles.pExtraSmallRegular}>
                      {volunteer.starts_at ? (volunteer.starts_at.month ? convertMonth(volunteer.starts_at.month) + " " : '') : null} 
                      {volunteer.starts_at ? (volunteer.starts_at.year ? volunteer.starts_at.year + " " : null) : null}
                      {volunteer.starts_at && volunteer.ends_at == null ? ' – Present' : null}
                      {volunteer.starts_at && volunteer.ends_at ? " – " + (volunteer.ends_at.month ? convertMonth(volunteer.ends_at.month) : '') : null}
                      {volunteer.starts_at && volunteer.ends_at ? (volunteer.ends_at.year ? " " + volunteer.ends_at.year : null) : null}
                    </Text>
                  </View>
                  { volunteer.description && (
                    <>
                      <View style={styles.mb3}></View>
                      <Text style={styles.pExtraSmallRegular}>{volunteer.description}</Text>
                    </>
                  )}
                </View>
              </View>
            </View>
            <View style={styles.horizontalBorder}></View>
            </div>
          )}
        </View>
        {/* <View style={styles.card}>
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <Image
                style={styles.orgImage}
                src="https://media-exp2.licdn.com/dms/image/C510BAQHEvRVx_GsmBQ/company-logo_400_400/0/1519856822387?e=1666224000&v=beta&t=9FvJZoxWwXuWz3LTkRXxG29pEMLd5z0k0v841saEI5k"
              />
              <View style={styles.sectionFillRow}>
                <View style={styles.highEmphasis}>
                  <Text style={styles.pBold}>BA Industrial Design and Technology</Text>
                </View>
                <Text style={styles.pRegular}>Loughborough University</Text>
                <View style={styles.lowEmphasis}>
                  <Text style={styles.pExtraSmallRegular}>Loughborough, United Kingdom</Text>
                  <Text style={styles.pExtraSmallRegular}>2013 — 2017</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.horizontalBorder}></View>
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <Image
                style={styles.orgImage}
                src="https://pbs.twimg.com/profile_images/1172433166331564032/zel5JyVF_400x400.png"
              />
              <View style={styles.sectionFillRow}>
                <View style={styles.highEmphasis}>
                  <Text style={styles.pBold}>GCSEs and A-Levels</Text>
                </View>
                <Text style={styles.pRegular}>Chustons Ferrers Grammar School</Text>
                <View style={styles.lowEmphasis}>
                  <Text style={styles.pExtraSmallRegular}>Brixham, United Kingdom</Text>
                  <Text style={styles.pExtraSmallRegular}>2006 — 2013</Text>
                </View>
              </View>
            </View>
          </View>
        </View> */}
      </Page>
    </Document>
  )
};

export default BasicResume;