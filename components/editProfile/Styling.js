import { useState, useContext } from 'react';
import fire from '../../config/fire-config';
import { UserContext } from '../../pages/_app';
import pageStyles from '../../pages/setup/styling.module.scss'
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Styling = ({
  user,
  handleEditProfileChangeView,
  stylingTheme,
  setStylingTheme,
  stylingThemeChanged,
  setStylingThemeChanged
}) => {

  const { userContext, setUserContext } = useContext(UserContext);
  const [submitting, setSubmitting] = useState(false);

  let themes = [
    {
      'id': 0,
      'label': 'Light mode',
      'string': 'light',
      'img': '/images/profile-preview.png',
      'active': !stylingThemeChanged ? userContext?.theme?.mode == 'light' : stylingTheme == 'light',
    },
    {
      'id': 1,
      'label': 'Dark mode',
      'string': 'dark',
      'img': '/images/bento-template.jpg',
      'active': !stylingThemeChanged ? userContext?.theme?.mode == 'dark' : stylingTheme == 'dark',
    },
  ]

  // const themeChange = (value) => {
  //   setStylingTheme(value),
  //   setStylingThemeChanged(true)
  // }

  // value={aboutChanged ? about : (userContext.profile.summary !== undefined ? userContext.profile.summary : '')}


  const changeTemplate = (template) => {
    if (template.premium) {
      if (product == process.env.NEXT_PUBLIC_STRIPE_PRODUCT_PREMIUM && status === 'active') {
        setStylingThemeChanged(true)
        setStylingTheme(template.string)
      } else {
        setShowUpsellModal(true)
      }
    } else {
      setStylingThemeChanged(true)
      setStylingTheme(template.string)
    }
  }

  const handleSave = (e) => {
    e.preventDefault();

    setSubmitting(true)

    fire.firestore().collection('users').doc(user).update({
      'theme.mode': !stylingThemeChanged ? userContext?.theme?.mode : stylingTheme,
      lastUpdated: fire.firestore.FieldValue.serverTimestamp()
    })
      .then(() => {
        handleEditProfileChangeView('default')
        setSubmitting(false)
        toast("Styling updated")
      })
      .catch((error) => {
        setSubmitting(false)
        toast("Unable to update styling")
        //console.error("Error adding document: ", error);
      });
  }

  return (
    <>
      <div className="p-4">
        <div className="d-flex flex-column w-100 mb-3 gap-3">
          {themes.map((theme, index) => 
            <div key={index} role="button" onClick={() => changeTemplate(theme)} className={`d-flex flex-column radius-3 p-3 w-100 ${pageStyles.planCard} ${theme.active && pageStyles.active}`} style={{gap: '16px'}}>
              <label className="checkbox-container mb-4">
                <input type="checkbox" checked={theme.active} />
                <span className="checkmark"></span>
              </label>
              <div className={`${theme.string !== 'dark' ? 'bg-light-900' : 'bg-dark-900' } radius-2 border-1 border-solid border-dark-300`} style={{position: 'relative', paddingTop: '56.25%'}}>
                <div style={{position: 'absolute', top: 0, left: 0, width: '100%', padding: '8%'}}>
                  <div className={`radius-5 ${theme.string !== 'dark' ? 'bg-dark-400' : 'bg-light-500' }`} style={{width: '12%', paddingTop: '12%'}}></div>
                  <div className="d-flex flex-column align-items-start" style={{marginTop: '4%'}}>
                    <div className="radius-4 bg-primary-900" style={{width: '40%', paddingTop: '4%', marginTop: '2%'}}></div>
                    <div className={`radius-4 ${theme.string !== 'dark' ? 'bg-dark-400' : 'bg-light-500' }`} style={{width: '50%', paddingTop: '4%', marginTop: '2%'}}></div>
                    <div className={`radius-4 ${theme.string !== 'dark' ? 'bg-dark-400' : 'bg-light-500' }`} style={{width: '30%', paddingTop: '4%', marginTop: '2%'}}></div>
                  </div>
                  <div className="d-flex flex-row align-items-start" style={{marginTop: '8%'}}>
                    <div className="radius-4 bg-primary-900" style={{width: '16%', paddingTop: '4%', marginRight: '2%'}}></div>
                    <div className={`radius-4 ${theme.string !== 'dark' ? 'bg-dark-400' : 'bg-light-500' }`} style={{width: '16%', paddingTop: '4%'}}></div>
                  </div>
                </div>
              </div>
              {/* <div className={styles.imageWrapper}>
                <Image
                  src={theme.img}
                  layout='fill'
                  objectFit='cover'
                />
              </div> */}
              <div className="d-flex flex-row justify-content-between align-items-center">
                <h6 className="mb-0">{theme.label}</h6>
              </div>
            </div>
          )}
        </div>
        <div className="d-flex flex-row justify-content-end">
          <button type="button" onClick={handleSave} className="btn primary high w-100 w-sm-auto" disabled={submitting}>{!submitting ? 'Save' : 'Saving...'}</button>
        </div>
      </div>
    </>
  )
}

export default Styling;