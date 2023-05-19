import { useState, useContext } from 'react';
import { UserContext } from '../../pages/_app';
import 'react-toastify/dist/ReactToastify.css';
import styles from './EditProfile.module.scss'
import ICONS from '../icon/IconPaths';
import Icon from '../icon/Icon';

const Products = ({
  user,
  handleEditProfileChangeView
}) => {

  const { userContext, setUserContext } = useContext(UserContext);
  const [submitting, setSubmitting] = useState(false);

  const handleSelect = (index) => {
    handleEditProfileChangeView('Edit product', "What you're selling", index)
  }

  const handleAdd = () => {
    handleEditProfileChangeView('Add product', "What you're selling")
  }

  return (
    <div className="d-flex flex-column p-3">
    {/* <p>{
      userContext &&
      userContext.profile &&
      userContext.profile.experiences &&
      userContext.profile.experiences.sort(sortProducts).map((job, index) => 
        <div key={index}>
          <p>{job.title}</p>
        </div>
      )
    }</p> */}
      <div>
        { userContext &&
          userContext.profile &&
          userContext.profile.products &&
          // userContext.profile.products.sort(sortProducts).map((product, index) => 
          userContext.profile.products.map((product, index) => {

          return (
          <div onClick={() => handleSelect(index)} role="button" key={index} className={`${styles.menuOption} d-flex flex-column align-items-center`} style={{gap:'16px'}}>
            <div className="d-flex flex-row justify-content-between align-items-center w-100" style={{gap:'24px'}}>
              <div className="d-flex flex-column w-100 gap-1">
                <h6 className="mb-0">{product.name}</h6>
                {product.url && <p className="mb-0 text-dark-low">{ product.url}</p>}
                {/* <a target="_blank" href={product.company_linkedin_profile_url} className="text-decoration-none"> */}
                {/* <p className="large text-dark-med mb-0">{product.company}</p> */}
                {/* </a> */}
                {/* {product.description ? <p className="text-dark-med mb-0 mt-3">{product.description}</p> : null} */}
              </div>
              <div className=""><Icon icon={ICONS.ARROW_RIGHT} size='24' className="fill-dark-900" /></div>
              {/* <div className="d-none d-lg-block"><Icon icon={ICONS.EDIT} size='24' className="fill-dark-900" /></div> */}
            </div>
          </div>
          )}
        )}
      </div>
      <div className="d-flex flex-row p-3">
        <button type="button" onClick={handleAdd} className="btn primary medium icon-left w-100 w-sm-auto">
          <svg viewBox="0 0 24 24">
            <path d={ICONS.PLUS}></path>
          </svg>
          Add product
        </button>
      </div>
    </div>
  )
}

export default Products;