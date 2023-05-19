import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import fire from '../../config/fire-config';
import { v4 as uuidv4 } from 'uuid';
import ICONS from '../icon/IconPaths';
import Icon from '../icon/Icon';
import BasicInformation from './BasicInformation';
import About from './About';
import Experience from './Experience';
import EditExperience from './EditExperience';
import AddExperience from './AddExperience';
import Education from './Education';
import EditEducation from './EditEducation';
import AddEducation from './AddEducation';
import EditVolunteering from './EditVolunteering';
import Volunteering from './Volunteering';
import AddVolunteering from './AddVolunteering';
import Links from './Links';
import AddLink from './AddLink';
import EditLink from './EditLink';
import styles from './EditProfile.module.scss'
import Projects from './Projects';
import AddProject from './AddProject';
import EditProject from './EditProject';
import SideProjects from './SideProjects';
import EditSideProject from './EditSideProject';
import AddSideProject from './AddSideProject';
import AddPost from './AddPost';
import EditPost from './EditPost';
import Posts from './Posts';
import Products from './Products';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct';
import AddService from './AddService';
import Services from './Services';
import EditService from './EditService';
import Featured from './Featured';
import EditFeature from './EditFeature';
import AddFeature from './AddFeature';
import Testimonials from './Testimonials';
import AddTestimonial from './AddTestimonial';
import EditTestimonial from './EditTestimonial';

const EditProfile = ({
    showEditProfileModal, 
    editProfileModalState,
    editProfileModalSubtitle,
    setEditProfileModalIndex,
    editProfileModalIndex,
    handleEditProfileChangeView,
    handleEditProfileClose
  }) => {

  const [user, setUser] = useState('')

  const [basicInfoFirstName, setBasicInfoFirstName] = useState('');
  const [basicInfoFirstNameChanged, setBasicInfoFirstNameChanged] = useState(false);
  const [basicInfoFirstNameError, setBasicInfoFirstNameError] = useState('');
  const [basicInfoLastName, setBasicInfoLastName] = useState('');
  const [basicInfoLastNameChanged, setBasicInfoLastNameChanged] = useState(false);
  const [basicInfoLastNameError, setBasicInfoLastNameError] = useState('');
  const [basicInfoHeadline, setBasicInfoHeadline] = useState('');
  const [basicInfoHeadlineChanged, setBasicInfoHeadlineChanged] = useState(false);
  const [basicInfoHeadlineError, setBasicInfoHeadlineError] = useState('');

  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [profilePictureUrlChanged, setProfilePictureUrlChanged] = useState(false);

  const [linksContact, setLinksContact] = useState('');
  const [linksContactChanged, setLinksContactChanged] = useState(false);
  const [linksContactError, setLinksContactError] = useState('');
  const [linksContactShow, setLinksContactShow] = useState(false);
  const [linksContactShowChanged, setLinksContactShowChanged] = useState(false);
  const [linksLabel, setLinksLabel] = useState('');
  const [linksLabelChanged, setLinksLabelChanged] = useState(false);
  const [linksLabelError, setLinksLabelError] = useState('');
  const [linksUrl, setLinksUrl] = useState('');
  const [linksUrlChanged, setLinksUrlChanged] = useState(false);
  const [linksUrlError, setLinksUrlError] = useState('');
  const [linksShowDeleteLinkModal, setLinksShowDeleteLinkModal] = useState(false);

  const [about, setAbout] = useState('');
  const [aboutChanged, setAboutChanged] = useState(false);
  const [aboutError, setAboutError] = useState('');

  const [productsImage, setProductsImage] = useState('');
  const [productsImageChanged, setProductsImageChanged] = useState(false);
  const [productsName, setProductsName] = useState('');
  const [productsNameChanged, setProductsNameChanged] = useState(false);
  const [productsNameError, setProductsNameError] = useState('');
  const [productsUrl, setProductsUrl] = useState('');
  const [productsUrlChanged, setProductsUrlChanged] = useState(false);
  const [productsUrlError, setProductsUrlError] = useState('');
  const [productsDescription, setProductsDescription] = useState('');
  const [productsDescriptionChanged, setProductsDescriptionChanged] = useState(false);
  const [productsDescriptionError, setProductsDescriptionError] = useState('');
  const [productsShowDeleteProductModal, setProductsShowDeleteProductModal] = useState(false);

  const [servicesImage, setServicesImage] = useState('');
  const [servicesImageChanged, setServicesImageChanged] = useState(false);
  const [servicesName, setServicesName] = useState('');
  const [servicesNameChanged, setServicesNameChanged] = useState(false);
  const [servicesNameError, setServicesNameError] = useState('');
  const [servicesUrl, setServicesUrl] = useState('');
  const [servicesUrlChanged, setServicesUrlChanged] = useState(false);
  const [servicesUrlError, setServicesUrlError] = useState('');
  const [servicesDescription, setServicesDescription] = useState('');
  const [servicesDescriptionChanged, setServicesDescriptionChanged] = useState(false);
  const [servicesDescriptionError, setServicesDescriptionError] = useState('');
  const [servicesShowDeleteServiceModal, setServicesShowDeleteServiceModal] = useState(false);

  const [featuredImage, setFeaturedImage] = useState('');
  const [featuredImageChanged, setFeaturedImageChanged] = useState(false);
  const [featuredName, setFeaturedName] = useState('');
  const [featuredNameChanged, setFeaturedNameChanged] = useState(false);
  const [featuredNameError, setFeaturedNameError] = useState('');
  const [featuredUrl, setFeaturedUrl] = useState('');
  const [featuredUrlChanged, setFeaturedUrlChanged] = useState(false);
  const [featuredUrlError, setFeaturedUrlError] = useState('');
  const [featuredShowDeleteFeatureModal, setFeaturedShowDeleteFeatureModal] = useState(false);

  const [experiencesLogo, setExperiencesLogo] = useState('');
  const [experiencesLogoChanged, setExperiencesLogoChanged] = useState(false);
  const [experiencesCompany, setExperiencesCompany] = useState('');
  const [experiencesCompanyChanged, setExperiencesCompanyChanged] = useState(false);
  const [experiencesCompanyError, setExperiencesCompanyError] = useState('');
  const [experiencesTitle, setExperiencesTitle] = useState('');
  const [experiencesTitleChanged, setExperiencesTitleChanged] = useState(false);
  const [experiencesTitleError, setExperiencesTitleError] = useState('');
  const [experiencesLocation, setExperiencesLocation] = useState('');
  const [experiencesLocationChanged, setExperiencesLocationChanged] = useState(false);
  const [experiencesLocationError, setExperiencesLocationError] = useState('');
  const [experiencesStartDate, setExperiencesStartDate] = useState('');
  const [experiencesStartDateInputType, setExperiencesStartDateInputType] = useState('text');
  const [experiencesStartDateChanged, setExperiencesStartDateChanged] = useState(false);
  const [experiencesStartDateError, setExperiencesStartDateError] = useState('');
  const [experiencesEndDate, setExperiencesEndDate] = useState('');
  const [experiencesEndDateInputType, setExperiencesEndDateInputType] = useState('text');
  const [experiencesEndDateChanged, setExperiencesEndDateChanged] = useState(false);
  const [experiencesEndDateError, setExperiencesEndDateError] = useState('');
  const [experiencesEndDatePresent, setExperiencesEndDatePresent] = useState(false);
  const [experiencesEndDatePresentChanged, setExperiencesEndDatePresentChanged] = useState(false);
  const [experiencesUrl, setExperiencesUrl] = useState('');
  const [experiencesUrlChanged, setExperiencesUrlChanged] = useState(false);
  const [experiencesUrlError, setExperiencesUrlError] = useState('');
  const [experiencesDescription, setExperiencesDescription] = useState('');
  const [experiencesDescriptionChanged, setExperiencesDescriptionChanged] = useState(false);
  const [experiencesDescriptionError, setExperiencesDescriptionError] = useState('');
  const [experiencesShowDeleteExperienceModal, setExperiencesShowDeleteExperienceModal] = useState(false);

  const [educationLogo, setEducationLogo] = useState('');
  const [educationLogoChanged, setEducationLogoChanged] = useState(false);
  const [educationSchool, setEducationSchool] = useState('');
  const [educationSchoolChanged, setEducationSchoolChanged] = useState(false);
  const [educationSchoolError, setEducationSchoolError] = useState('');
  const [educationFieldOfStudy, setEducationFieldOfStudy] = useState('');
  const [educationFieldOfStudyChanged, setEducationFieldOfStudyChanged] = useState(false);
  const [educationFieldOfStudyError, setEducationFieldOfStudyError] = useState('');
  const [educationDegreeName, setEducationDegreeName] = useState('');
  const [educationDegreeNameChanged, setEducationDegreeNameChanged] = useState(false);
  const [educationDegreeNameError, setEducationDegreeNameError] = useState('');
  const [educationLocation, setEducationLocation] = useState('');
  const [educationLocationChanged, setEducationLocationChanged] = useState(false);
  const [educationLocationError, setEducationLocationError] = useState('');
  const [educationStartDate, setEducationStartDate] = useState('');
  const [educationStartDateInputType, setEducationStartDateInputType] = useState('text');
  const [educationStartDateChanged, setEducationStartDateChanged] = useState(false);
  const [educationStartDateError, setEducationStartDateError] = useState('');
  const [educationEndDate, setEducationEndDate] = useState('');
  const [educationEndDateInputType, setEducationEndDateInputType] = useState('text');
  const [educationEndDateChanged, setEducationEndDateChanged] = useState(false);
  const [educationEndDateError, setEducationEndDateError] = useState('');
  const [educationEndDatePresent, setEducationEndDatePresent] = useState(false);
  const [educationEndDatePresentChanged, setEducationEndDatePresentChanged] = useState(false);
  const [educationUrl, setEducationUrl] = useState('');
  const [educationUrlChanged, setEducationUrlChanged] = useState(false);
  const [educationUrlError, setEducationUrlError] = useState('');
  const [educationDescription, setEducationDescription] = useState('');
  const [educationDescriptionChanged, setEducationDescriptionChanged] = useState(false);
  const [educationDescriptionError, setEducationDescriptionError] = useState('');
  const [educationShowDeleteEducationModal, setEducationShowDeleteEducationModal] = useState(false);

  const [volunteeringLogo, setVolunteeringLogo] = useState('');
  const [volunteeringLogoChanged, setVolunteeringLogoChanged] = useState(false);
  const [volunteeringCompany, setVolunteeringCompany] = useState('');
  const [volunteeringCompanyChanged, setVolunteeringCompanyChanged] = useState(false);
  const [volunteeringCompanyError, setVolunteeringCompanyError] = useState('');
  const [volunteeringTitle, setVolunteeringTitle] = useState('');
  const [volunteeringTitleChanged, setVolunteeringTitleChanged] = useState(false);
  const [volunteeringTitleError, setVolunteeringTitleError] = useState('');
  const [volunteeringLocation, setVolunteeringLocation] = useState('');
  const [volunteeringLocationChanged, setVolunteeringLocationChanged] = useState(false);
  const [volunteeringLocationError, setVolunteeringLocationError] = useState('');
  const [volunteeringStartDate, setVolunteeringStartDate] = useState('');
  const [volunteeringStartDateInputType, setVolunteeringStartDateInputType] = useState('text');
  const [volunteeringStartDateChanged, setVolunteeringStartDateChanged] = useState(false);
  const [volunteeringStartDateError, setVolunteeringStartDateError] = useState('');
  const [volunteeringEndDate, setVolunteeringEndDate] = useState('');
  const [volunteeringEndDateInputType, setVolunteeringEndDateInputType] = useState('text');
  const [volunteeringEndDateChanged, setVolunteeringEndDateChanged] = useState(false);
  const [volunteeringEndDateError, setVolunteeringEndDateError] = useState('');
  const [volunteeringEndDatePresent, setVolunteeringEndDatePresent] = useState(false);
  const [volunteeringEndDatePresentChanged, setVolunteeringEndDatePresentChanged] = useState(false);
  const [volunteeringUrl, setVolunteeringUrl] = useState('');
  const [volunteeringUrlChanged, setVolunteeringUrlChanged] = useState(false);
  const [volunteeringUrlError, setVolunteeringUrlError] = useState('');
  const [volunteeringDescription, setVolunteeringDescription] = useState('');
  const [volunteeringDescriptionChanged, setVolunteeringDescriptionChanged] = useState(false);
  const [volunteeringDescriptionError, setVolunteeringDescriptionError] = useState('');
  const [volunteeringShowDeleteVolunteeringModal, setVolunteeringShowDeleteVolunteeringModal] = useState(false);

  const [projectsImage, setProjectsImage] = useState('');
  const [projectsImageChanged, setProjectsImageChanged] = useState(false);
  const [projectsName, setProjectsName] = useState('');
  const [projectsNameChanged, setProjectsNameChanged] = useState(false);
  const [projectsNameError, setProjectsNameError] = useState('');
  const [projectsUrl, setProjectsUrl] = useState('');
  const [projectsUrlChanged, setProjectsUrlChanged] = useState(false);
  const [projectsUrlError, setProjectsUrlError] = useState('');
  const [projectsStartDate, setProjectsStartDate] = useState('');
  const [projectsStartDateInputType, setProjectsStartDateInputType] = useState('text');
  const [projectsStartDateChanged, setProjectsStartDateChanged] = useState(false);
  const [projectsStartDateError, setProjectsStartDateError] = useState('');
  const [projectsEndDate, setProjectsEndDate] = useState('');
  const [projectsEndDateInputType, setProjectsEndDateInputType] = useState('text');
  const [projectsEndDateChanged, setProjectsEndDateChanged] = useState(false);
  const [projectsEndDateError, setProjectsEndDateError] = useState('');
  const [projectsEndDatePresent, setProjectsEndDatePresent] = useState(false);
  const [projectsEndDatePresentChanged, setProjectsEndDatePresentChanged] = useState(false);
  const [projectsDescription, setProjectsDescription] = useState('');
  const [projectsDescriptionChanged, setProjectsDescriptionChanged] = useState(false);
  const [projectsDescriptionError, setProjectsDescriptionError] = useState('');
  const [projectsShowDeleteProjectModal, setProjectsShowDeleteProjectModal] = useState(false);
  
  const [testimonialsAvatar, setTestimonialsAvatar] = useState('');
  const [testimonialsAvatarChanged, setTestimonialsAvatarChanged] = useState(false);
  const [testimonialsName, setTestimonialsName] = useState('');
  const [testimonialsNameChanged, setTestimonialsNameChanged] = useState(false);
  const [testimonialsNameError, setTestimonialsNameError] = useState('');
  const [testimonialsTitle, setTestimonialsTitle] = useState('');
  const [testimonialsTitleChanged, setTestimonialsTitleChanged] = useState(false);
  const [testimonialsTitleError, setTestimonialsTitleError] = useState('');
  const [testimonialsUrl, setTestimonialsUrl] = useState('');
  const [testimonialsUrlChanged, setTestimonialsUrlChanged] = useState(false);
  const [testimonialsUrlError, setTestimonialsUrlError] = useState('');
  const [testimonialsDate, setTestimonialsDate] = useState('');
  const [testimonialsDateChanged, setTestimonialsDateChanged] = useState(false);
  const [testimonialsDateError, setTestimonialsDateError] = useState('');
  const [testimonialsDescription, setTestimonialsDescription] = useState('');
  const [testimonialsDescriptionChanged, setTestimonialsDescriptionChanged] = useState(false);
  const [testimonialsDescriptionError, setTestimonialsDescriptionError] = useState('');
  const [testimonialsShowDeleteTestimonialModal, setTestimonialsShowDeleteTestimonialModal] = useState(false);

  const [postsImage, setPostsImage] = useState('');
  const [postsImageChanged, setPostsImageChanged] = useState(false);
  const [postsName, setPostsName] = useState('');
  const [postsNameChanged, setPostsNameChanged] = useState(false);
  const [postsNameError, setPostsNameError] = useState('');
  const [postsUrl, setPostsUrl] = useState('');
  const [postsUrlChanged, setPostsUrlChanged] = useState(false);
  const [postsUrlError, setPostsUrlError] = useState('');
  const [postsDate, setPostsDate] = useState('');
  const [postsDateChanged, setPostsDateChanged] = useState(false);
  const [postsDateError, setPostsDateError] = useState('');
  const [postsDescription, setPostsDescription] = useState('');
  const [postsDescriptionChanged, setPostsDescriptionChanged] = useState(false);
  const [postsDescriptionError, setPostsDescriptionError] = useState('');
  const [postsShowDeletePostModal, setPostsShowDeletePostModal] = useState(false);
  
  const [sideProjectsLogo, setSideProjectsLogo] = useState('');
  const [sideProjectsLogoChanged, setSideProjectsLogoChanged] = useState(false);
  const [sideProjectsImage, setSideProjectsImage] = useState('');
  const [sideProjectsImageChanged, setSideProjectsImageChanged] = useState(false);
  const [sideProjectsName, setSideProjectsName] = useState('');
  const [sideProjectsNameChanged, setSideProjectsNameChanged] = useState(false);
  const [sideProjectsNameError, setSideProjectsNameError] = useState('');
  const [sideProjectsTagline, setSideProjectsTagline] = useState('');
  const [sideProjectsTaglineChanged, setSideProjectsTaglineChanged] = useState(false);
  const [sideProjectsTaglineError, setSideProjectsTaglineError] = useState('');
  const [sideProjectsUrl, setSideProjectsUrl] = useState('');
  const [sideProjectsUrlChanged, setSideProjectsUrlChanged] = useState(false);
  const [sideProjectsUrlError, setSideProjectsUrlError] = useState('');
  const [sideProjectsStartDate, setSideProjectsStartDate] = useState('');
  const [sideProjectsStartDateInputType, setSideProjectsStartDateInputType] = useState('text');
  const [sideProjectsStartDateChanged, setSideProjectsStartDateChanged] = useState(false);
  const [sideProjectsStartDateError, setSideProjectsStartDateError] = useState('');
  const [sideProjectsEndDate, setSideProjectsEndDate] = useState('');
  const [sideProjectsEndDateInputType, setSideProjectsEndDateInputType] = useState('text');
  const [sideProjectsEndDateChanged, setSideProjectsEndDateChanged] = useState(false);
  const [sideProjectsEndDateError, setSideProjectsEndDateError] = useState('');
  const [sideProjectsEndDatePresent, setSideProjectsEndDatePresent] = useState(false);
  const [sideProjectsEndDatePresentChanged, setSideProjectsEndDatePresentChanged] = useState(false);
  const [sideProjectsDescription, setSideProjectsDescription] = useState('');
  const [sideProjectsDescriptionChanged, setSideProjectsDescriptionChanged] = useState(false);
  const [sideProjectsDescriptionError, setSideProjectsDescriptionError] = useState('');
  const [sideProjectsShowDeleteProjectModal, setSideProjectsShowDeleteProjectModal] = useState(false);

  useEffect(() => {
    const unsubscribe = fire.auth()
      .onAuthStateChanged((user) => {
        if (user) {
          setUser(user.uid)
        } 
      })
    return () => {
      // Unmouting
      unsubscribe();
    };
  }, []);

  const resetFields = () => {

    setEditProfileModalIndex('')

    setBasicInfoFirstName('')
    setBasicInfoFirstNameChanged(false)
    setBasicInfoFirstNameError('')
    setBasicInfoLastName('')
    setBasicInfoLastNameChanged(false)
    setBasicInfoLastNameError('')
    setBasicInfoHeadline('')
    setBasicInfoHeadlineChanged(false)
    setBasicInfoHeadlineError('')
    setProfilePictureUrl('')
    setProfilePictureUrlChanged(false)

    setLinksContact('')
    setLinksContactChanged(false)
    setLinksContactError('')
    setLinksContactShow(false)
    setLinksContactShowChanged(false)
    setLinksLabel('')
    setLinksLabelChanged(false)
    setLinksLabelError('')
    setLinksUrl('')
    setLinksUrlChanged(false)
    setLinksUrlError('')
    setLinksShowDeleteLinkModal(false)

    setAbout('')
    setAboutChanged(false)
    setAboutError('')

    setProductsImage('')
    setProductsImageChanged(false)
    setProductsName('')
    setProductsNameChanged(false)
    setProductsNameError('')
    setProductsUrl('')
    setProductsUrlChanged(false)
    setProductsUrlError('')
    setProductsDescription('')
    setProductsDescriptionChanged(false)
    setProductsDescriptionError('')
    setProductsShowDeleteProductModal(false)

    setServicesImage('')
    setServicesImageChanged(false)
    setServicesName('')
    setServicesNameChanged(false)
    setServicesNameError('')
    setServicesUrl('')
    setServicesUrlChanged(false)
    setServicesUrlError('')
    setServicesDescription('')
    setServicesDescriptionChanged(false)
    setServicesDescriptionError('')
    setServicesShowDeleteServiceModal(false)

    setFeaturedImage('')
    setFeaturedImageChanged(false)
    setFeaturedName('')
    setFeaturedNameChanged(false)
    setFeaturedNameError('')
    setFeaturedUrl('')
    setFeaturedUrlChanged(false)
    setFeaturedUrlError('')
    setFeaturedShowDeleteFeatureModal(false)

    setExperiencesLogo('')
    setExperiencesLogoChanged(false)
    setExperiencesCompany('')
    setExperiencesCompanyChanged(false)
    setExperiencesCompanyError('')
    setExperiencesTitle('')
    setExperiencesTitleChanged(false)
    setExperiencesTitleError('')
    setExperiencesLocation('')
    setExperiencesLocationChanged(false)
    setExperiencesLocationError('')
    setExperiencesStartDate('')
    setExperiencesStartDateInputType('text')
    setExperiencesStartDateChanged(false)
    setExperiencesStartDateError('')
    setExperiencesEndDate('')
    setExperiencesEndDateInputType('text')
    setExperiencesEndDateChanged(false)
    setExperiencesEndDateError('')
    setExperiencesEndDatePresent(false)
    setExperiencesEndDatePresentChanged(false)
    setExperiencesUrl('')
    setExperiencesUrlChanged(false)
    setExperiencesUrlError('')
    setExperiencesDescription('')
    setExperiencesDescriptionChanged(false)
    setExperiencesDescriptionError('')
    setExperiencesShowDeleteExperienceModal(false)

    setEducationLogo(''),
    setEducationLogoChanged(false),
    setEducationSchool('')
    setEducationSchoolChanged(false)
    setEducationSchoolError('')
    setEducationFieldOfStudy('')
    setEducationFieldOfStudyChanged(false)
    setEducationFieldOfStudyError('')
    setEducationDegreeName('')
    setEducationDegreeNameChanged(false)
    setEducationDegreeNameError('')
    setEducationLocation('')
    setEducationLocationChanged(false)
    setEducationLocationError('')
    setEducationStartDate('')
    setEducationStartDateInputType('text')
    setEducationStartDateChanged(false)
    setEducationStartDateError('')
    setEducationEndDate('')
    setEducationEndDateInputType('text')
    setEducationEndDateChanged(false)
    setEducationEndDateError('')
    setEducationEndDatePresent(false)
    setEducationEndDatePresentChanged(false)
    setEducationUrl('')
    setEducationUrlChanged(false)
    setEducationUrlError('')
    setEducationDescription('')
    setEducationDescriptionChanged(false)
    setEducationDescriptionError('')
    setEducationShowDeleteEducationModal(false)

    setVolunteeringLogo('')
    setVolunteeringLogoChanged(false)
    setVolunteeringCompany('')
    setVolunteeringCompanyChanged(false)
    setVolunteeringCompanyError('')
    setVolunteeringTitle('')
    setVolunteeringTitleChanged(false)
    setVolunteeringTitleError('')
    setVolunteeringLocation('')
    setVolunteeringLocationChanged(false)
    setVolunteeringLocationError('')
    setVolunteeringStartDate('')
    setVolunteeringStartDateInputType('text')
    setVolunteeringStartDateChanged(false)
    setVolunteeringStartDateError('')
    setVolunteeringEndDate('')
    setVolunteeringEndDateInputType('text')
    setVolunteeringEndDateChanged(false)
    setVolunteeringEndDateError('')
    setVolunteeringEndDatePresent(false)
    setVolunteeringEndDatePresentChanged(false)
    setVolunteeringUrl('')
    setVolunteeringUrlChanged(false)
    setVolunteeringUrlError('')
    setVolunteeringDescription('')
    setVolunteeringDescriptionChanged(false)
    setVolunteeringDescriptionError('')
    setVolunteeringShowDeleteVolunteeringModal(false)

    setProjectsImage('')
    setProjectsImageChanged(false)
    setProjectsName('')
    setProjectsNameChanged(false)
    setProjectsNameError('')
    setProjectsUrl('')
    setProjectsUrlChanged(false)
    setProjectsUrlError('')
    setProjectsStartDate('')
    setProjectsStartDateInputType('text')
    setProjectsStartDateChanged(false)
    setProjectsStartDateError('')
    setProjectsEndDate('')
    setProjectsEndDateInputType('text')
    setProjectsEndDateChanged(false)
    setProjectsEndDateError('')
    setProjectsEndDatePresent(false)
    setProjectsEndDatePresentChanged(false)
    setProjectsDescription('')
    setProjectsDescriptionChanged(false)
    setProjectsDescriptionError('')
    setProjectsShowDeleteProjectModal(false)

    setTestimonialsAvatar('');
    setTestimonialsAvatarChanged(false);
    setTestimonialsName('');
    setTestimonialsNameChanged(false);
    setTestimonialsNameError('');
    setTestimonialsTitle('');
    setTestimonialsTitleChanged(false);
    setTestimonialsTitleError('');
    setTestimonialsUrl('');
    setTestimonialsUrlChanged(false);
    setTestimonialsUrlError('');
    setTestimonialsDate('');
    setTestimonialsDateChanged(false);
    setTestimonialsDateError('');
    setTestimonialsDescription('');
    setTestimonialsDescriptionChanged(false);
    setTestimonialsDescriptionError('');
    setTestimonialsShowDeleteTestimonialModal(false);

    setPostsImage('')
    setPostsImageChanged(false)
    setPostsName('')
    setPostsNameChanged(false)
    setPostsNameError('')
    setPostsUrl('')
    setPostsUrlChanged(false)
    setPostsUrlError('')
    setPostsDate('')
    setPostsDateChanged(false)
    setPostsDateError('')
    setPostsDescription('')
    setPostsDescriptionChanged(false)
    setPostsDescriptionError('')
    setPostsShowDeletePostModal(false)

    setSideProjectsLogo('')
    setSideProjectsLogoChanged(false)
    setSideProjectsImage('')
    setSideProjectsImageChanged(false)
    setSideProjectsName('')
    setSideProjectsNameChanged(false)
    setSideProjectsNameError('')
    setSideProjectsTagline('')
    setSideProjectsTaglineChanged(false)
    setSideProjectsTaglineError('')
    setSideProjectsUrl('')
    setSideProjectsUrlChanged(false)
    setSideProjectsUrlError('')
    setSideProjectsStartDate('')
    setSideProjectsStartDateInputType('text')
    setSideProjectsStartDateChanged(false)
    setSideProjectsStartDateError('')
    setSideProjectsEndDate('')
    setSideProjectsEndDateInputType('text')
    setSideProjectsEndDateChanged(false)
    setSideProjectsEndDateError('')
    setSideProjectsEndDatePresent(false)
    setSideProjectsEndDatePresentChanged(false)
    setSideProjectsDescription('')
    setSideProjectsDescriptionChanged(false)
    setSideProjectsDescriptionError('')
    setSideProjectsShowDeleteProjectModal(false)
  }

  const handleClick = (title, subtitle) => {
    handleEditProfileChangeView(title, subtitle)
  }

  const handleBack = () => {
    resetFields();
    switch (editProfileModalState) {
      case 'Add product': case 'Edit product':
        handleEditProfileChangeView('Products')
        break;
      case 'Add service': case 'Edit service':
        handleEditProfileChangeView('Services')
        break;
      case 'Add feature': case 'Edit feature':
        handleEditProfileChangeView('Featured')
        break;

      case 'Add link': case 'Edit link':
        handleEditProfileChangeView('Links')
        break;
      case 'Add testimonial': case 'Edit testimonial':
        handleEditProfileChangeView('Testimonials')
        break;
      case 'Add post': case 'Edit post':
        handleEditProfileChangeView('Posts')
        break;
      // case 'Add project' || 'Edit project':
      //   handleEditProfileChangeView('Projects')
      //   break;
      // case 'Add experience' || 'Edit experience':
      //   handleEditProfileChangeView('Experience')
      //   break;
      // case 'Add education' || 'Edit education':
      //   handleEditProfileChangeView('Education')
      //   break;
      // case 'Add volunteering' || 'Edit volunteering':
      //   handleEditProfileChangeView('Volunteering')
      //   break;
      // case 'Add side project' || 'Edit side project':
      //   handleEditProfileChangeView('Side projects')
      //   break;
      default:  
        handleEditProfileChangeView('default')
        break;
    }
    // (editProfileModalState == "Add experience" || editProfileModalState == "Edit experience") ? handleEditProfileChangeView('Experience') : (
    //   (editProfileModalState == "Add education" || editProfileModalState == "Edit education") ? handleEditProfileChangeView('Education') : (
    //     (editProfileModalState == "Add volunteering" || editProfileModalState == "Edit volunteering") ? handleEditProfileChangeView('Volunteering') : (
    //       (editProfileModalState == "Add link" || editProfileModalState == "Edit link") ? handleEditProfileChangeView('Links') : (
    //         (editProfileModalState == "Add project" || editProfileModalState == "Edit project") ? handleEditProfileChangeView('Projects') : (
    //           (editProfileModalState == "Add post" || editProfileModalState == "Edit post") ? handleEditProfileChangeView('Posts') : (
    //             (editProfileModalState == "Add side project" || editProfileModalState == "Edit side project") ? handleEditProfileChangeView('Side projects') : handleEditProfileChangeView('default')
    //           )
    //         )
    //       )
    //     )
    //   )
    // )
  }

  // const getEditProfileModalSubtitle = () => {
  //   switch (editProfileModalState) {
  //     case 'Add product' || 'Edit product' || 'Products':
  //       setEditProfileModalSubtitle("What you're selling")
  //       break;
  //     case 'Add service' || 'Edit service' || 'Services':
  //       setEditProfileModalSubtitle("What you're offering")
  //       break;
  //     case 'Add feature' || 'Edit feature' || 'Featured':
  //       setEditProfileModalSubtitle("Places where you've been featured")
  //       break;
  //     case 'Add link' || 'Edit link' || 'Links':
  //       setEditProfileModalSubtitle("Highlight anything you like")
  //       break;
  //     case 'Add testimonial' || 'Edit testimonial' || 'Testimonials':
  //       setEditProfileModalSubtitle("Highlight quotes from clients")
  //       break;
  //     case 'Add post' || 'Edit post' || 'Posts':
  //       setEditProfileModalSubtitle("Your best written content")  
  //       break;
  //     default:  
  //       setEditProfileModalSubtitle('')
  //       break;
  //   }
  // }

  const handleClose = () => {
    resetFields()
    handleEditProfileClose();
  };

  const editProfileOptions = [
    {
      "id": uuidv4(),
      "title": "Basic information",
      "subtitle": "Avatar, name and headline",
      "icon": ICONS.USER,
    },
    {
      "id": uuidv4(),
      "title": "Links",
      "subtitle": "Highlight anything you like",
      "icon": ICONS.LINK
    },
    {
      "id": uuidv4(),
      "title": "About",
      "subtitle": "Summary of who you are",
      "icon": ICONS.ABOUT,
    },
    {
      "id": uuidv4(),
      "title": "Products",
      "subtitle": "What you're selling",
      "icon": ICONS.PRODUCT
    },
    {
      "id": uuidv4(),
      "title": "Services",
      "subtitle": "What you're offering",
      "icon": ICONS.SERVICE
    },
    {
      "id": uuidv4(),
      "title": "Testimonials",
      "subtitle": "Highlight quotes from clients",
      "icon": ICONS.SERVICE
    },
    {
      "id": uuidv4(),
      "title": "Featured",
      "subtitle": "Places where you've been featured",
      "icon": ICONS.FEATURED
    },
    {
      "id": uuidv4(),
      "title": "Posts",
      "subtitle": "Your best written content",
      "icon": ICONS.MAIL
    },
    // {
    //   "id": uuidv4(),
    //   "title": "Side projects",
    //   "icon": ICONS.SIDE_PROJECTS
    // },
    // {
    //   "id": uuidv4(),
    //   "title": "About",
    //   "icon": ICONS.ABOUT
    // },
    // {
    //   "id": uuidv4(),
    //   "title": "Experience",
    //   "icon": ICONS.WORK
    // },
    // {
    //   "id": uuidv4(),
    //   "title": "Education",
    //   "icon": ICONS.SCHOOL
    // },
    // {
    //   "id": uuidv4(),
    //   "title": "Projects",
    //   "icon": ICONS.PROJECTS
    // },
    // {
    //   "id": uuidv4(),
    //   "title": "Testimonials",
    //   "icon": ICONS.SIDE_PROJECTS
    // },
    // {
    //   "id": uuidv4(),
    //   "title": "Volunteering",
    //   "icon": ICONS.VOLUNTEERING
    // },
    // {
    //   "id": 5,
    //   "title": "Skills",
    // }
  ]

  return (
    <>

      <Modal
        show={showEditProfileModal} 
        onHide={handleEditProfileClose}
        backdrop="static"
        keyboard={false}
        size="md"
      >
        <Modal.Header closeButton>
          <div className="d-flex flex-row align-items-center gap-3">
            {editProfileModalState !== 'default' ?
            <button onClick={handleBack} className="btn dark medium icon-only">
              <svg viewBox="0 0 24 24">
                <path d={ICONS.ARROW_LEFT}></path>
              </svg>
            </button>
            : <div style={{height: '56px', width: '56px'}}></div> 
            }

          </div>
          <div className="d-flex flex-column align-items-center gap-1">
            <h5 className="text-dark-high text-center font-weight-bold mb-0">{editProfileModalState == 'default' ? 'Edit profile' : editProfileModalState}</h5>
            {editProfileModalSubtitle !== '' && <p className="mb-0 text-center text-dark-low">{editProfileModalSubtitle}</p>}
          </div>
          <button onClick={handleClose} className="btn dark medium icon-only">
            <svg viewBox="0 0 24 24">
              <path d={ICONS.CLOSE}></path>
            </svg>
          </button>
        </Modal.Header>
        <>
        { editProfileModalState == 'default' && (
          <div className="d-flex flex-column p-3">
          {editProfileOptions.map((option) =>
            <button key={option.id} onClick={() => handleClick(option.title, option.subtitle)} className={`${styles.menuOption} d-flex flex-row justify-content-between align-items-center`}>
              <div className="d-flex flex-row align-items-center" style={{gap: '16px'}}>
                {/* <Icon icon={option.icon} size='24' className="fill-dark-900" /> */}
                <div className="d-flex flex-column align-items-start w-100 gap-1">
                  <h6 className="mb-0">
                    {option.title}
                  </h6>
                  <p className="mb-0 text-dark-low">{option.subtitle && option.subtitle}</p>
                </div>
              </div>
              <Icon icon={ICONS.ARROW_RIGHT} size='20' className="iconDarkHigh" />
            </button>
          )}
          </div>
        )}
        { editProfileModalState == 'Basic information' && (
          <BasicInformation 
            user={user}
            basicInfoFirstName={basicInfoFirstName}
            basicInfoFirstNameChanged={basicInfoFirstNameChanged}
            basicInfoFirstNameError={basicInfoFirstNameError}
            basicInfoLastName={basicInfoLastName}
            basicInfoLastNameChanged={basicInfoLastNameChanged}
            basicInfoLastNameError={basicInfoLastNameError}
            basicInfoHeadline={basicInfoHeadline}
            basicInfoHeadlineChanged={basicInfoHeadlineChanged}
            basicInfoHeadlineError={basicInfoHeadlineError}
            setBasicInfoFirstName={setBasicInfoFirstName}
            setBasicInfoFirstNameChanged={setBasicInfoFirstNameChanged}
            setBasicInfoFirstNameError={setBasicInfoFirstNameError}
            setBasicInfoLastName={setBasicInfoLastName}
            setBasicInfoLastNameChanged={setBasicInfoLastNameChanged}
            setBasicInfoLastNameError={setBasicInfoLastNameError}
            setBasicInfoHeadline={setBasicInfoHeadline}
            setBasicInfoHeadlineChanged={setBasicInfoHeadlineChanged}
            setBasicInfoHeadlineError={setBasicInfoHeadlineError}
            profilePictureUrl={profilePictureUrl}
            setProfilePictureUrl={setProfilePictureUrl}
            profilePictureUrlChanged={profilePictureUrlChanged}
            setProfilePictureUrlChanged={setProfilePictureUrlChanged}
            handleEditProfileChangeView={handleEditProfileChangeView}
          />
        )}
        { editProfileModalState == 'Links' && (
          <Links
            user={user}
            handleEditProfileChangeView={handleEditProfileChangeView}
          />
        )}
        { editProfileModalState == 'Add link' && (
          <>
          <AddLink
            user={user}
            linksLabel={linksLabel}
            setLinksLabel={setLinksLabel}
            linksLabelChanged={linksLabelChanged}
            setLinksLabelChanged={setLinksLabelChanged}
            linksLabelError={linksLabelError}
            setLinksLabelError={setLinksLabelError}
            linksUrl={linksUrl}
            setLinksUrl={setLinksUrl}
            linksUrlChanged={linksUrlChanged}
            setLinksUrlChanged={setLinksUrlChanged}
            linksUrlError={linksUrlError}
            setLinksUrlError={setLinksUrlError}
            handleBack={handleBack}
          />
          </>
        )}
        { editProfileModalState == 'Edit link' && (
          <EditLink
            user={user}
            editProfileModalIndex={editProfileModalIndex}
            linksLabel={linksLabel}
            setLinksLabel={setLinksLabel}
            linksLabelChanged={linksLabelChanged}
            setLinksLabelChanged={setLinksLabelChanged}
            linksLabelError={linksLabelError}
            setLinksLabelError={setLinksLabelError}
            linksUrl={linksUrl}
            setLinksUrl={setLinksUrl}
            linksUrlChanged={linksUrlChanged}
            setLinksUrlChanged={setLinksUrlChanged}
            linksUrlError={linksUrlError}
            setLinksUrlError={setLinksUrlError}
            linksShowDeleteLinkModal={linksShowDeleteLinkModal}
            setLinksShowDeleteLinkModal={setLinksShowDeleteLinkModal}
            handleBack={handleBack}
          />
        )}
        { editProfileModalState == 'About' && (
          <About 
            user={user}
            about={about}
            aboutChanged={aboutChanged}
            aboutError={aboutError}
            setAbout={setAbout}
            setAboutChanged={setAboutChanged}
            setAboutError={setAboutError}
            handleEditProfileChangeView={handleEditProfileChangeView}
          />
        )}
        { editProfileModalState == 'Products' && (
          <Products
            user={user}
            handleEditProfileChangeView={handleEditProfileChangeView}
          />
        )}
        { editProfileModalState == 'Add product' && (
          <>
          <AddProduct
            user={user}
            editProfileModalIndex={editProfileModalIndex}
            productsImage={productsImage}
            setProductsImage={setProductsImage}
            productsImageChanged={productsImageChanged}
            setProductsImageChanged={setProductsImageChanged}
            productsName={productsName}
            setProductsName={setProductsName}
            productsNameChanged={productsNameChanged}
            setProductsNameChanged={setProductsNameChanged}
            productsNameError={productsNameError}
            setProductsNameError={setProductsNameError}
            productsUrl={productsUrl}
            setProductsUrl={setProductsUrl}
            productsUrlChanged={productsUrlChanged}
            setProductsUrlChanged={setProductsUrlChanged}
            productsUrlError={productsUrlError}
            setProductsUrlError={setProductsUrlError}
            productsDescription={productsDescription}
            setProductsDescription={setProductsDescription}
            productsDescriptionChanged={productsDescriptionChanged}
            setProductsDescriptionChanged={setProductsDescriptionChanged}
            productsDescriptionError={productsDescriptionError}
            setProductsDescriptionError={setProductsDescriptionError}
            handleBack={handleBack}
          />
          </>
        )}
        { editProfileModalState == 'Edit product' && (
          <>
          <EditProduct
            user={user}
            editProfileModalIndex={editProfileModalIndex}
            productsImage={productsImage}
            setProductsImage={setProductsImage}
            productsImageChanged={productsImageChanged}
            setProductsImageChanged={setProductsImageChanged}
            productsName={productsName}
            setProductsName={setProductsName}
            productsNameChanged={productsNameChanged}
            setProductsNameChanged={setProductsNameChanged}
            productsNameError={productsNameError}
            setProductsNameError={setProductsNameError}
            productsUrl={productsUrl}
            setProductsUrl={setProductsUrl}
            productsUrlChanged={productsUrlChanged}
            setProductsUrlChanged={setProductsUrlChanged}
            productsUrlError={productsUrlError}
            setProductsUrlError={setProductsUrlError}
            productsDescription={productsDescription}
            setProductsDescription={setProductsDescription}
            productsDescriptionChanged={productsDescriptionChanged}
            setProductsDescriptionChanged={setProductsDescriptionChanged}
            productsDescriptionError={productsDescriptionError}
            setProductsDescriptionError={setProductsDescriptionError}
            productsShowDeleteProductModal={productsShowDeleteProductModal}
            setProductsShowDeleteProductModal={setProductsShowDeleteProductModal}
            handleBack={handleBack}
          />
          </>
        )}
        { editProfileModalState == 'Services' && (
          <Services
            user={user}
            handleEditProfileChangeView={handleEditProfileChangeView}
          />
        )}
        { editProfileModalState == 'Add service' && (
          <>
          <AddService
            user={user}
            editProfileModalIndex={editProfileModalIndex}
            servicesImage={servicesImage}
            setServicesImage={setServicesImage}
            servicesImageChanged={servicesImageChanged}
            setServicesImageChanged={setServicesImageChanged}
            servicesName={servicesName}
            setServicesName={setServicesName}
            servicesNameChanged={servicesNameChanged}
            setServicesNameChanged={setServicesNameChanged}
            servicesNameError={servicesNameError}
            setServicesNameError={setServicesNameError}
            servicesUrl={servicesUrl}
            setServicesUrl={setServicesUrl}
            servicesUrlChanged={servicesUrlChanged}
            setServicesUrlChanged={setServicesUrlChanged}
            servicesUrlError={servicesUrlError}
            setServicesUrlError={setServicesUrlError}
            servicesDescription={servicesDescription}
            setServicesDescription={setServicesDescription}
            servicesDescriptionChanged={servicesDescriptionChanged}
            setServicesDescriptionChanged={setServicesDescriptionChanged}
            servicesDescriptionError={servicesDescriptionError}
            setServicesDescriptionError={setServicesDescriptionError}
            handleBack={handleBack}
          />
          </>
        )}
        { editProfileModalState == 'Edit service' && (
          <>
          <EditService
            user={user}
            editProfileModalIndex={editProfileModalIndex}
            servicesImage={servicesImage}
            setServicesImage={setServicesImage}
            servicesImageChanged={servicesImageChanged}
            setServicesImageChanged={setServicesImageChanged}
            servicesName={servicesName}
            setServicesName={setServicesName}
            servicesNameChanged={servicesNameChanged}
            setServicesNameChanged={setServicesNameChanged}
            servicesNameError={servicesNameError}
            setServicesNameError={setServicesNameError}
            servicesUrl={servicesUrl}
            setServicesUrl={setServicesUrl}
            servicesUrlChanged={servicesUrlChanged}
            setServicesUrlChanged={setServicesUrlChanged}
            servicesUrlError={servicesUrlError}
            setServicesUrlError={setServicesUrlError}
            servicesDescription={servicesDescription}
            setServicesDescription={setServicesDescription}
            servicesDescriptionChanged={servicesDescriptionChanged}
            setServicesDescriptionChanged={setServicesDescriptionChanged}
            servicesDescriptionError={servicesDescriptionError}
            setServicesDescriptionError={setServicesDescriptionError}
            servicesShowDeleteServiceModal={servicesShowDeleteServiceModal}
            setServicesShowDeleteServiceModal={setServicesShowDeleteServiceModal}
            handleBack={handleBack}
          />
          </>
        )}
        { editProfileModalState == 'Featured' && (
          <Featured
            user={user}
            handleEditProfileChangeView={handleEditProfileChangeView}
          />
        )}
        { editProfileModalState == 'Add feature' && (
          <>
          <AddFeature
            user={user}
            editProfileModalIndex={editProfileModalIndex}
            featuredImage={featuredImage}
            setFeaturedImage={setFeaturedImage}
            featuredImageChanged={featuredImageChanged}
            setFeaturedImageChanged={setFeaturedImageChanged}
            featuredName={featuredName}
            setFeaturedName={setFeaturedName}
            featuredNameChanged={featuredNameChanged}
            setFeaturedNameChanged={setFeaturedNameChanged}
            featuredNameError={featuredNameError}
            setFeaturedNameError={setFeaturedNameError}
            featuredUrl={featuredUrl}
            setFeaturedUrl={setFeaturedUrl}
            featuredUrlChanged={featuredUrlChanged}
            setFeaturedUrlChanged={setFeaturedUrlChanged}
            featuredUrlError={featuredUrlError}
            setFeaturedUrlError={setFeaturedUrlError}
            handleBack={handleBack}
          />
          </>
        )}
        { editProfileModalState == 'Edit feature' && (
          <>
          <EditFeature
            user={user}
            editProfileModalIndex={editProfileModalIndex}
            featuredImage={featuredImage}
            setFeaturedImage={setFeaturedImage}
            featuredImageChanged={featuredImageChanged}
            setFeaturedImageChanged={setFeaturedImageChanged}
            featuredName={featuredName}
            setFeaturedName={setFeaturedName}
            featuredNameChanged={featuredNameChanged}
            setFeaturedNameChanged={setFeaturedNameChanged}
            featuredNameError={featuredNameError}
            setFeaturedNameError={setFeaturedNameError}
            featuredUrl={featuredUrl}
            setFeaturedUrl={setFeaturedUrl}
            featuredUrlChanged={featuredUrlChanged}
            setFeaturedUrlChanged={setFeaturedUrlChanged}
            featuredUrlError={featuredUrlError}
            setFeaturedUrlError={setFeaturedUrlError}
            featuredShowDeleteFeatureModal={featuredShowDeleteFeatureModal}
            setFeaturedShowDeleteFeatureModal={setFeaturedShowDeleteFeatureModal}
            handleBack={handleBack}
          />
          </>
        )}
        { editProfileModalState == 'Side projects' && (
          <SideProjects
            user={user}
            handleEditProfileChangeView={handleEditProfileChangeView}
          />
        )}
        { editProfileModalState == 'Add side project' && (
          <>
          <AddSideProject
            user={user}
            editProfileModalIndex={editProfileModalIndex}
            sideProjectsLogo={sideProjectsLogo}
            setSideProjectsLogo={setSideProjectsLogo}
            sideProjectsLogoChanged={sideProjectsLogoChanged}
            setSideProjectsLogoChanged={setSideProjectsLogoChanged}
            sideProjectsImage={sideProjectsImage}
            setSideProjectsImage={setSideProjectsImage}
            sideProjectsImageChanged={sideProjectsImageChanged}
            setSideProjectsImageChanged={setSideProjectsImageChanged}
            sideProjectsName={sideProjectsName}
            setSideProjectsName={setSideProjectsName}
            sideProjectsNameChanged={sideProjectsNameChanged}
            setSideProjectsNameChanged={setSideProjectsNameChanged}
            sideProjectsNameError={sideProjectsNameError}
            setSideProjectsNameError={setSideProjectsNameError}
            sideProjectsTagline={sideProjectsTagline}
            setSideProjectsTagline={setSideProjectsTagline}
            sideProjectsTaglineChanged={sideProjectsTaglineChanged}
            setSideProjectsTaglineChanged={setSideProjectsTaglineChanged}
            sideProjectsTaglineError={sideProjectsTaglineError}
            setSideProjectsTaglineError={setSideProjectsTaglineError}
            sideProjectsUrl={sideProjectsUrl}
            setSideProjectsUrl={setSideProjectsUrl}
            sideProjectsUrlChanged={sideProjectsUrlChanged}
            setSideProjectsUrlChanged={setSideProjectsUrlChanged}
            sideProjectsUrlError={sideProjectsUrlError}
            setSideProjectsUrlError={setSideProjectsUrlError}
            sideProjectsStartDate={sideProjectsStartDate}
            setSideProjectsStartDate={setSideProjectsStartDate}
            sideProjectsStartDateInputType={sideProjectsStartDateInputType}
            setSideProjectsStartDateInputType={setSideProjectsStartDateInputType}
            sideProjectsStartDateChanged={sideProjectsStartDateChanged}
            setSideProjectsStartDateChanged={setSideProjectsStartDateChanged}
            sideProjectsStartDateError={sideProjectsStartDateError}
            setSideProjectsStartDateError={setSideProjectsStartDateError}
            sideProjectsEndDate={sideProjectsEndDate}
            setSideProjectsEndDate={setSideProjectsEndDate}
            sideProjectsEndDateInputType={sideProjectsEndDateInputType}
            setSideProjectsEndDateInputType={setSideProjectsEndDateInputType}
            sideProjectsEndDateChanged={sideProjectsEndDateChanged}
            setSideProjectsEndDateChanged={setSideProjectsEndDateChanged}
            sideProjectsEndDateError={sideProjectsEndDateError}
            setSideProjectsEndDateError={setSideProjectsEndDateError}
            sideProjectsEndDatePresent={sideProjectsEndDatePresent}
            setSideProjectsEndDatePresent={setSideProjectsEndDatePresent}
            sideProjectsEndDatePresentChanged={sideProjectsEndDatePresentChanged}
            setSideProjectsEndDatePresentChanged={setSideProjectsEndDatePresentChanged}
            sideProjectsDescription={sideProjectsDescription}
            setSideProjectsDescription={setSideProjectsDescription}
            sideProjectsDescriptionChanged={sideProjectsDescriptionChanged}
            setSideProjectsDescriptionChanged={setSideProjectsDescriptionChanged}
            sideProjectsDescriptionError={sideProjectsDescriptionError}
            setSideProjectsDescriptionError={setSideProjectsDescriptionError}
            handleBack={handleBack}
          />
          </>
        )}
        { editProfileModalState == 'Edit side project' && (
          <>
          <EditSideProject
            user={user}
            editProfileModalIndex={editProfileModalIndex}
            sideProjectsLogo={sideProjectsLogo}
            setSideProjectsLogo={setSideProjectsLogo}
            sideProjectsLogoChanged={sideProjectsLogoChanged}
            setSideProjectsLogoChanged={setSideProjectsLogoChanged}
            sideProjectsName={sideProjectsName}
            setSideProjectsName={setSideProjectsName}
            sideProjectsNameChanged={sideProjectsNameChanged}
            setSideProjectsNameChanged={setSideProjectsNameChanged}
            sideProjectsNameError={sideProjectsNameError}
            setSideProjectsNameError={setSideProjectsNameError}
            sideProjectsTagline={sideProjectsTagline}
            setSideProjectsTagline={setSideProjectsTagline}
            sideProjectsTaglineChanged={sideProjectsTaglineChanged}
            setSideProjectsTaglineChanged={setSideProjectsTaglineChanged}
            sideProjectsTaglineError={sideProjectsTaglineError}
            setSideProjectsTaglineError={setSideProjectsTaglineError}
            sideProjectsUrl={sideProjectsUrl}
            setSideProjectsUrl={setSideProjectsUrl}
            sideProjectsUrlChanged={sideProjectsUrlChanged}
            setSideProjectsUrlChanged={setSideProjectsUrlChanged}
            sideProjectsUrlError={sideProjectsUrlError}
            setSideProjectsUrlError={setSideProjectsUrlError}
            sideProjectsStartDate={sideProjectsStartDate}
            setSideProjectsStartDate={setSideProjectsStartDate}
            sideProjectsStartDateInputType={sideProjectsStartDateInputType}
            setSideProjectsStartDateInputType={setSideProjectsStartDateInputType}
            sideProjectsStartDateChanged={sideProjectsStartDateChanged}
            setSideProjectsStartDateChanged={setSideProjectsStartDateChanged}
            sideProjectsStartDateError={sideProjectsStartDateError}
            setSideProjectsStartDateError={setSideProjectsStartDateError}
            sideProjectsEndDate={sideProjectsEndDate}
            setSideProjectsEndDate={setSideProjectsEndDate}
            sideProjectsEndDateInputType={sideProjectsEndDateInputType}
            setSideProjectsEndDateInputType={setSideProjectsEndDateInputType}
            sideProjectsEndDateChanged={sideProjectsEndDateChanged}
            setSideProjectsEndDateChanged={setSideProjectsEndDateChanged}
            sideProjectsEndDateError={sideProjectsEndDateError}
            setSideProjectsEndDateError={setSideProjectsEndDateError}
            sideProjectsEndDatePresent={sideProjectsEndDatePresent}
            setSideProjectsEndDatePresent={setSideProjectsEndDatePresent}
            sideProjectsEndDatePresentChanged={sideProjectsEndDatePresentChanged}
            setSideProjectsEndDatePresentChanged={setSideProjectsEndDatePresentChanged}
            sideProjectsDescription={sideProjectsDescription}
            setSideProjectsDescription={setSideProjectsDescription}
            sideProjectsDescriptionChanged={sideProjectsDescriptionChanged}
            setSideProjectsDescriptionChanged={setSideProjectsDescriptionChanged}
            sideProjectsDescriptionError={sideProjectsDescriptionError}
            setSideProjectsDescriptionError={setSideProjectsDescriptionError}
            sideProjectsShowDeleteProjectModal={sideProjectsShowDeleteProjectModal}
            setSideProjectsShowDeleteProjectModal={setSideProjectsShowDeleteProjectModal}
            handleBack={handleBack}
          />
          </>
        )}
        { editProfileModalState == 'Experience' && (
          <Experience
            user={user}
            handleEditProfileChangeView={handleEditProfileChangeView}
          />
        )}
        { editProfileModalState == 'Edit experience' && (
          <>
          <EditExperience 
            user={user}
            experiencesLogo={experiencesLogo}
            setExperiencesLogo={setExperiencesLogo}
            experiencesLogoChanged={experiencesLogoChanged}
            setExperiencesLogoChanged={setExperiencesLogoChanged}
            editProfileModalIndex={editProfileModalIndex}
            experiencesCompany={experiencesCompany}
            setExperiencesCompany={setExperiencesCompany}
            experiencesCompanyChanged={experiencesCompanyChanged}
            setExperiencesCompanyChanged={setExperiencesCompanyChanged}
            experiencesCompanyError={experiencesCompanyError}
            setExperiencesCompanyError={setExperiencesCompanyError}
            experiencesTitle={experiencesTitle}
            setExperiencesTitle={setExperiencesTitle}
            experiencesTitleChanged={experiencesTitleChanged}
            setExperiencesTitleChanged={setExperiencesTitleChanged}
            experiencesTitleError={experiencesTitleError}
            setExperiencesTitleError={setExperiencesTitleError}
            experiencesLocation={experiencesLocation}
            setExperiencesLocation={setExperiencesLocation}
            experiencesLocationChanged={experiencesLocationChanged}
            setExperiencesLocationChanged={setExperiencesLocationChanged}
            experiencesLocationError={experiencesLocationError}
            setExperiencesLocationError={setExperiencesLocationError}
            experiencesStartDate={experiencesStartDate}
            setExperiencesStartDate={setExperiencesStartDate}
            experiencesStartDateInputType={experiencesStartDateInputType}
            setExperiencesStartDateInputType={setExperiencesStartDateInputType}
            experiencesStartDateChanged={experiencesStartDateChanged}
            setExperiencesStartDateChanged={setExperiencesStartDateChanged}
            experiencesStartDateError={experiencesStartDateError}
            setExperiencesStartDateError={setExperiencesStartDateError}
            experiencesEndDate={experiencesEndDate}
            setExperiencesEndDate={setExperiencesEndDate}
            experiencesEndDateInputType={experiencesEndDateInputType}
            setExperiencesEndDateInputType={setExperiencesEndDateInputType}
            experiencesEndDateChanged={experiencesEndDateChanged}
            setExperiencesEndDateChanged={setExperiencesEndDateChanged}
            experiencesEndDateError={experiencesEndDateError}
            setExperiencesEndDateError={setExperiencesEndDateError}
            experiencesEndDatePresent={experiencesEndDatePresent}
            setExperiencesEndDatePresent={setExperiencesEndDatePresent}
            experiencesEndDatePresentChanged={experiencesEndDatePresentChanged}
            setExperiencesEndDatePresentChanged={setExperiencesEndDatePresentChanged}
            experiencesUrl={experiencesUrl}
            setExperiencesUrl={setExperiencesUrl}
            experiencesUrlChanged={experiencesUrlChanged}
            setExperiencesUrlChanged={setExperiencesUrlChanged}
            experiencesUrlError={experiencesUrlError}
            setExperiencesUrlError={setExperiencesUrlError}
            experiencesDescription={experiencesDescription}
            setExperiencesDescription={setExperiencesDescription}
            experiencesDescriptionChanged={experiencesDescriptionChanged}
            setExperiencesDescriptionChanged={setExperiencesDescriptionChanged}
            experiencesDescriptionError={experiencesDescriptionError}
            setExperiencesDescriptionError={setExperiencesDescriptionError}
            experiencesShowDeleteExperienceModal={experiencesShowDeleteExperienceModal}
            setExperiencesShowDeleteExperienceModal={setExperiencesShowDeleteExperienceModal}
            handleBack={handleBack}
          />
          </>
        )}
        { editProfileModalState == 'Add experience' && (
          <>
          <AddExperience 
            user={user}
            editProfileModalIndex={editProfileModalIndex}
            experiencesLogo={experiencesLogo}
            setExperiencesLogo={setExperiencesLogo}
            experiencesLogoChanged={experiencesLogoChanged}
            setExperiencesLogoChanged={setExperiencesLogoChanged}
            experiencesCompany={experiencesCompany}
            setExperiencesCompany={setExperiencesCompany}
            experiencesCompanyChanged={experiencesCompanyChanged}
            setExperiencesCompanyChanged={setExperiencesCompanyChanged}
            experiencesCompanyError={experiencesCompanyError}
            setExperiencesCompanyError={setExperiencesCompanyError}
            experiencesTitle={experiencesTitle}
            setExperiencesTitle={setExperiencesTitle}
            experiencesTitleChanged={experiencesTitleChanged}
            setExperiencesTitleChanged={setExperiencesTitleChanged}
            experiencesTitleError={experiencesTitleError}
            setExperiencesTitleError={setExperiencesTitleError}
            experiencesLocation={experiencesLocation}
            setExperiencesLocation={setExperiencesLocation}
            experiencesLocationChanged={experiencesLocationChanged}
            setExperiencesLocationChanged={setExperiencesLocationChanged}
            experiencesLocationError={experiencesLocationError}
            setExperiencesLocationError={setExperiencesLocationError}
            experiencesStartDate={experiencesStartDate}
            setExperiencesStartDate={setExperiencesStartDate}
            experiencesStartDateInputType={experiencesStartDateInputType}
            setExperiencesStartDateInputType={setExperiencesStartDateInputType}
            experiencesStartDateChanged={experiencesStartDateChanged}
            setExperiencesStartDateChanged={setExperiencesStartDateChanged}
            experiencesStartDateError={experiencesStartDateError}
            setExperiencesStartDateError={setExperiencesStartDateError}
            experiencesEndDate={experiencesEndDate}
            setExperiencesEndDate={setExperiencesEndDate}
            experiencesEndDateInputType={experiencesEndDateInputType}
            setExperiencesEndDateInputType={setExperiencesEndDateInputType}
            experiencesEndDateChanged={experiencesEndDateChanged}
            setExperiencesEndDateChanged={setExperiencesEndDateChanged}
            experiencesEndDateError={experiencesEndDateError}
            setExperiencesEndDateError={setExperiencesEndDateError}
            experiencesEndDatePresent={experiencesEndDatePresent}
            setExperiencesEndDatePresent={setExperiencesEndDatePresent}
            experiencesEndDatePresentChanged={experiencesEndDatePresentChanged}
            setExperiencesEndDatePresentChanged={setExperiencesEndDatePresentChanged}
            experiencesUrl={experiencesUrl}
            setExperiencesUrl={setExperiencesUrl}
            experiencesUrlChanged={experiencesUrlChanged}
            setExperiencesUrlChanged={setExperiencesUrlChanged}
            experiencesUrlError={experiencesUrlError}
            setExperiencesUrlError={setExperiencesUrlError}
            experiencesDescription={experiencesDescription}
            setExperiencesDescription={setExperiencesDescription}
            experiencesDescriptionChanged={experiencesDescriptionChanged}
            setExperiencesDescriptionChanged={setExperiencesDescriptionChanged}
            experiencesDescriptionError={experiencesDescriptionError}
            setExperiencesDescriptionError={setExperiencesDescriptionError}
            handleBack={handleBack}
          />
          </>
        )}
        { editProfileModalState == 'Projects' && (
          <Projects
            user={user}
            handleEditProfileChangeView={handleEditProfileChangeView}
          />
        )}
        { editProfileModalState == 'Add project' && (
          <>
          <AddProject 
            user={user}
            editProfileModalIndex={editProfileModalIndex}
            projectsImage={projectsImage}
            setProjectsImage={setProjectsImage}
            projectsImageChanged={projectsImageChanged}
            setProjectsImageChanged={setProjectsImageChanged}
            projectsName={projectsName}
            setProjectsName={setProjectsName}
            projectsNameChanged={projectsNameChanged}
            setProjectsNameChanged={setProjectsNameChanged}
            projectsNameError={projectsNameError}
            setProjectsNameError={setProjectsNameError}
            projectsUrl={projectsUrl}
            setProjectsUrl={setProjectsUrl}
            projectsUrlChanged={projectsUrlChanged}
            setProjectsUrlChanged={setProjectsUrlChanged}
            projectsUrlError={projectsUrlError}
            setProjectsUrlError={setProjectsUrlError}
            projectsStartDate={projectsStartDate}
            setProjectsStartDate={setProjectsStartDate}
            projectsStartDateInputType={projectsStartDateInputType}
            setProjectsStartDateInputType={setProjectsStartDateInputType}
            projectsStartDateChanged={projectsStartDateChanged}
            setProjectsStartDateChanged={setProjectsStartDateChanged}
            projectsStartDateError={projectsStartDateError}
            setProjectsStartDateError={setProjectsStartDateError}
            projectsEndDate={projectsEndDate}
            setProjectsEndDate={setProjectsEndDate}
            projectsEndDateInputType={projectsEndDateInputType}
            setProjectsEndDateInputType={setProjectsEndDateInputType}
            projectsEndDateChanged={projectsEndDateChanged}
            setProjectsEndDateChanged={setProjectsEndDateChanged}
            projectsEndDateError={projectsEndDateError}
            setProjectsEndDateError={setProjectsEndDateError}
            projectsEndDatePresent={projectsEndDatePresent}
            setProjectsEndDatePresent={setProjectsEndDatePresent}
            projectsEndDatePresentChanged={projectsEndDatePresentChanged}
            setProjectsEndDatePresentChanged={setProjectsEndDatePresentChanged}
            projectsDescription={projectsDescription}
            setProjectsDescription={setProjectsDescription}
            projectsDescriptionChanged={projectsDescriptionChanged}
            setProjectsDescriptionChanged={setProjectsDescriptionChanged}
            projectsDescriptionError={projectsDescriptionError}
            setProjectsDescriptionError={setProjectsDescriptionError}
            handleBack={handleBack}
          />
          </>
        )}
        { editProfileModalState == 'Edit project' && (
          <>
          <EditProject
            user={user}
            editProfileModalIndex={editProfileModalIndex}
            projectsImage={projectsImage}
            setProjectsImage={setProjectsImage}
            projectsImageChanged={projectsImageChanged}
            setProjectsImageChanged={setProjectsImageChanged}
            projectsName={projectsName}
            setProjectsName={setProjectsName}
            projectsNameChanged={projectsNameChanged}
            setProjectsNameChanged={setProjectsNameChanged}
            projectsNameError={projectsNameError}
            setProjectsNameError={setProjectsNameError}
            projectsUrl={projectsUrl}
            setProjectsUrl={setProjectsUrl}
            projectsUrlChanged={projectsUrlChanged}
            setProjectsUrlChanged={setProjectsUrlChanged}
            projectsUrlError={projectsUrlError}
            setProjectsUrlError={setProjectsUrlError}
            projectsStartDate={projectsStartDate}
            setProjectsStartDate={setProjectsStartDate}
            projectsStartDateInputType={projectsStartDateInputType}
            setProjectsStartDateInputType={setProjectsStartDateInputType}
            projectsStartDateChanged={projectsStartDateChanged}
            setProjectsStartDateChanged={setProjectsStartDateChanged}
            projectsStartDateError={projectsStartDateError}
            setProjectsStartDateError={setProjectsStartDateError}
            projectsEndDate={projectsEndDate}
            setProjectsEndDate={setProjectsEndDate}
            projectsEndDateInputType={projectsEndDateInputType}
            setProjectsEndDateInputType={setProjectsEndDateInputType}
            projectsEndDateChanged={projectsEndDateChanged}
            setProjectsEndDateChanged={setProjectsEndDateChanged}
            projectsEndDateError={projectsEndDateError}
            setProjectsEndDateError={setProjectsEndDateError}
            projectsEndDatePresent={projectsEndDatePresent}
            setProjectsEndDatePresent={setProjectsEndDatePresent}
            projectsEndDatePresentChanged={projectsEndDatePresentChanged}
            setProjectsEndDatePresentChanged={setProjectsEndDatePresentChanged}
            projectsDescription={projectsDescription}
            setProjectsDescription={setProjectsDescription}
            projectsDescriptionChanged={projectsDescriptionChanged}
            setProjectsDescriptionChanged={setProjectsDescriptionChanged}
            projectsDescriptionError={projectsDescriptionError}
            setProjectsDescriptionError={setProjectsDescriptionError}
            projectsShowDeleteProjectModal={projectsShowDeleteProjectModal}
            setProjectsShowDeleteProjectModal={setProjectsShowDeleteProjectModal}
            handleBack={handleBack}
          />
          </>
        )}
        { editProfileModalState == 'Testimonials' && (
          <Testimonials
            user={user}
            handleEditProfileChangeView={handleEditProfileChangeView}
          />
        )}
        { editProfileModalState == 'Add testimonial' && (
          <>
          <AddTestimonial
            user={user}
            editProfileModalIndex={editProfileModalIndex}
            testimonialsAvatar={testimonialsAvatar}
            setTestimonialsAvatar={setTestimonialsAvatar}
            testimonialsAvatarChanged={testimonialsAvatarChanged}
            setTestimonialsAvatarChanged={setTestimonialsAvatarChanged}
            testimonialsName={testimonialsName}
            setTestimonialsName={setTestimonialsName}
            testimonialsNameChanged={testimonialsNameChanged}
            setTestimonialsNameChanged={setTestimonialsNameChanged}
            testimonialsNameError={testimonialsNameError}
            setTestimonialsNameError={setTestimonialsNameError}
            testimonialsTitle={testimonialsTitle}
            setTestimonialsTitle={setTestimonialsTitle}
            testimonialsTitleChanged={testimonialsTitleChanged}
            setTestimonialsTitleChanged={setTestimonialsTitleChanged}
            testimonialsTitleError={testimonialsTitleError}
            setTestimonialsTitleError={setTestimonialsTitleError}
            testimonialsUrl={testimonialsUrl}
            setTestimonialsUrl={setTestimonialsUrl}
            testimonialsUrlChanged={testimonialsUrlChanged}
            setTestimonialsUrlChanged={setTestimonialsUrlChanged}
            testimonialsUrlError={testimonialsUrlError}
            setTestimonialsUrlError={setTestimonialsUrlError}
            testimonialsDate={testimonialsDate}
            setTestimonialsDate={setTestimonialsDate}
            testimonialsDateChanged={testimonialsDateChanged}
            setTestimonialsDateChanged={setTestimonialsDateChanged}
            testimonialsDateError={testimonialsDateError}
            setTestimonialsDateError={setTestimonialsDateError}
            testimonialsDescription={testimonialsDescription}
            setTestimonialsDescription={setTestimonialsDescription}
            testimonialsDescriptionChanged={testimonialsDescriptionChanged}
            setTestimonialsDescriptionChanged={setTestimonialsDescriptionChanged}
            testimonialsDescriptionError={testimonialsDescriptionError}
            setTestimonialsDescriptionError={setTestimonialsDescriptionError}
            handleBack={handleBack}
          />
          </>
        )}
        { editProfileModalState == 'Edit testimonial' && (
          <>
          <EditTestimonial
            user={user}
            editProfileModalIndex={editProfileModalIndex}
            testimonialsAvatar={testimonialsAvatar}
            setTestimonialsAvatar={setTestimonialsAvatar}
            testimonialsAvatarChanged={testimonialsAvatarChanged}
            setTestimonialsAvatarChanged={setTestimonialsAvatarChanged}
            testimonialsName={testimonialsName}
            setTestimonialsName={setTestimonialsName}
            testimonialsNameChanged={testimonialsNameChanged}
            setTestimonialsNameChanged={setTestimonialsNameChanged}
            testimonialsNameError={testimonialsNameError}
            setTestimonialsNameError={setTestimonialsNameError}
            testimonialsTitle={testimonialsTitle}
            setTestimonialsTitle={setTestimonialsTitle}
            testimonialsTitleChanged={testimonialsTitleChanged}
            setTestimonialsTitleChanged={setTestimonialsTitleChanged}
            testimonialsTitleError={testimonialsTitleError}
            setTestimonialsTitleError={setTestimonialsTitleError}
            testimonialsUrl={testimonialsUrl}
            setTestimonialsUrl={setTestimonialsUrl}
            testimonialsUrlChanged={testimonialsUrlChanged}
            setTestimonialsUrlChanged={setTestimonialsUrlChanged}
            testimonialsUrlError={testimonialsUrlError}
            setTestimonialsUrlError={setTestimonialsUrlError}
            testimonialsDate={testimonialsDate}
            setTestimonialsDate={setTestimonialsDate}
            testimonialsDateChanged={testimonialsDateChanged}
            setTestimonialsDateChanged={setTestimonialsDateChanged}
            testimonialsDateError={testimonialsDateError}
            setTestimonialsDateError={setTestimonialsDateError}
            testimonialsDescription={testimonialsDescription}
            setTestimonialsDescription={setTestimonialsDescription}
            testimonialsDescriptionChanged={testimonialsDescriptionChanged}
            setTestimonialsDescriptionChanged={setTestimonialsDescriptionChanged}
            testimonialsDescriptionError={testimonialsDescriptionError}
            setTestimonialsDescriptionError={setTestimonialsDescriptionError}
            testimonialsShowDeleteTestimonialModal={testimonialsShowDeleteTestimonialModal}
            setTestimonialsShowDeleteTestimonialModal={setTestimonialsShowDeleteTestimonialModal}
            handleBack={handleBack}
          />
          </>
        )}
        { editProfileModalState == 'Posts' && (
          <Posts
            user={user}
            handleEditProfileChangeView={handleEditProfileChangeView}
          />
        )}
        { editProfileModalState == 'Add post' && (
          <>
          <AddPost
            user={user}
            editProfileModalIndex={editProfileModalIndex}
            postsImage={postsImage}
            setPostsImage={setPostsImage}
            postsImageChanged={postsImageChanged}
            setPostsImageChanged={setPostsImageChanged}
            postsName={postsName}
            setPostsName={setPostsName}
            postsNameChanged={postsNameChanged}
            setPostsNameChanged={setPostsNameChanged}
            postsNameError={postsNameError}
            setPostsNameError={setPostsNameError}
            postsUrl={postsUrl}
            setPostsUrl={setPostsUrl}
            postsUrlChanged={postsUrlChanged}
            setPostsUrlChanged={setPostsUrlChanged}
            postsUrlError={postsUrlError}
            setPostsUrlError={setPostsUrlError}
            postsDate={postsDate}
            setPostsDate={setPostsDate}
            postsDateChanged={postsDateChanged}
            setPostsDateChanged={setPostsDateChanged}
            postsDateError={postsDateError}
            setPostsDateError={setPostsDateError}
            postsDescription={postsDescription}
            setPostsDescription={setPostsDescription}
            postsDescriptionChanged={postsDescriptionChanged}
            setPostsDescriptionChanged={setPostsDescriptionChanged}
            postsDescriptionError={postsDescriptionError}
            setPostsDescriptionError={setPostsDescriptionError}
            handleBack={handleBack}
          />
          </>
        )}
        { editProfileModalState == 'Edit post' && (
          <>
          <EditPost
            user={user}
            editProfileModalIndex={editProfileModalIndex}
            postsImage={postsImage}
            setPostsImage={setPostsImage}
            postsImageChanged={postsImageChanged}
            setPostsImageChanged={setPostsImageChanged}
            postsName={postsName}
            setPostsName={setPostsName}
            postsNameChanged={postsNameChanged}
            setPostsNameChanged={setPostsNameChanged}
            postsNameError={postsNameError}
            setPostsNameError={setPostsNameError}
            postsUrl={postsUrl}
            setPostsUrl={setPostsUrl}
            postsUrlChanged={postsUrlChanged}
            setPostsUrlChanged={setPostsUrlChanged}
            postsUrlError={postsUrlError}
            setPostsUrlError={setPostsUrlError}
            postsDate={postsDate}
            setPostsDate={setPostsDate}
            postsDateChanged={postsDateChanged}
            setPostsDateChanged={setPostsDateChanged}
            postsDateError={postsDateError}
            setPostsDateError={setPostsDateError}
            postsDescription={postsDescription}
            setPostsDescription={setPostsDescription}
            postsDescriptionChanged={postsDescriptionChanged}
            setPostsDescriptionChanged={setPostsDescriptionChanged}
            postsDescriptionError={postsDescriptionError}
            setPostsDescriptionError={setPostsDescriptionError}
            postsShowDeletePostModal={postsShowDeletePostModal}
            setPostsShowDeletePostModal={setPostsShowDeletePostModal}
            handleBack={handleBack}
          />
          </>
        )}
        { editProfileModalState == 'Education' && (
          <Education
            user={user}
            handleEditProfileChangeView={handleEditProfileChangeView}
          />
        )}
        { editProfileModalState == 'Edit education' && (
          <>
          <EditEducation 
            user={user}
            editProfileModalIndex={editProfileModalIndex}
            educationLogo={educationLogo}
            setEducationLogo={setEducationLogo}
            educationLogoChanged={educationLogoChanged}
            setEducationLogoChanged={setEducationLogoChanged}
            educationSchool={educationSchool}
            setEducationSchool={setEducationSchool}
            educationSchoolChanged={educationSchoolChanged}
            setEducationSchoolChanged={setEducationSchoolChanged}
            educationSchoolError={educationSchoolError}
            setEducationSchoolError={setEducationSchoolError}
            educationFieldOfStudy={educationFieldOfStudy}
            setEducationFieldOfStudy={setEducationFieldOfStudy}
            educationFieldOfStudyChanged={educationFieldOfStudyChanged}
            setEducationFieldOfStudyChanged={setEducationFieldOfStudyChanged}
            educationFieldOfStudyError={educationFieldOfStudyError}
            setEducationFieldOfStudyError={setEducationFieldOfStudyError}
            educationDegreeName={educationDegreeName}
            setEducationDegreeName={setEducationDegreeName}
            educationDegreeNameChanged={educationDegreeNameChanged}
            setEducationDegreeNameChanged={setEducationDegreeNameChanged}
            educationDegreeNameError={educationDegreeNameError}
            setEducationDegreeNameError={setEducationDegreeNameError}
            educationLocation={educationLocation}
            setEducationLocation={setEducationLocation}
            educationLocationChanged={educationLocationChanged}
            setEducationLocationChanged={setEducationLocationChanged}
            educationLocationError={educationLocationError}
            setEducationLocationError={setEducationLocationError}
            educationStartDate={educationStartDate}
            setEducationStartDate={setEducationStartDate}
            educationStartDateInputType={educationStartDateInputType}
            setEducationStartDateInputType={setEducationStartDateInputType}
            educationStartDateChanged={educationStartDateChanged}
            setEducationStartDateChanged={setEducationStartDateChanged}
            educationStartDateError={educationStartDateError}
            setEducationStartDateError={setEducationStartDateError}
            educationEndDate={educationEndDate}
            setEducationEndDate={setEducationEndDate}
            educationEndDateInputType={educationEndDateInputType}
            setEducationEndDateInputType={setEducationEndDateInputType}
            educationEndDateChanged={educationEndDateChanged}
            setEducationEndDateChanged={setEducationEndDateChanged}
            educationEndDateError={educationEndDateError}
            setEducationEndDateError={setEducationEndDateError}
            educationEndDatePresent={educationEndDatePresent}
            setEducationEndDatePresent={setEducationEndDatePresent}
            educationEndDatePresentChanged={educationEndDatePresentChanged}
            setEducationEndDatePresentChanged={setEducationEndDatePresentChanged}
            educationUrl={educationUrl}
            setEducationUrl={setEducationUrl}
            educationUrlChanged={educationUrlChanged}
            setEducationUrlChanged={setEducationUrlChanged}
            educationUrlError={educationUrlError}
            setEducationUrlError={setEducationUrlError}
            educationDescription={educationDescription}
            setEducationDescription={setEducationDescription}
            educationDescriptionChanged={educationDescriptionChanged}
            setEducationDescriptionChanged={setEducationDescriptionChanged}
            educationDescriptionError={educationDescriptionError}
            setEducationDescriptionError={setEducationDescriptionError}
            educationShowDeleteEducationModal={educationShowDeleteEducationModal}
            setEducationShowDeleteEducationModal={setEducationShowDeleteEducationModal}
            handleBack={handleBack}
          />
          </>
        )}
        { editProfileModalState == 'Add education' && (
          <>
          <AddEducation 
            user={user}
            editProfileModalIndex={editProfileModalIndex}
            educationLogo={educationLogo}
            setEducationLogo={setEducationLogo}
            educationLogoChanged={educationLogoChanged}
            setEducationLogoChanged={setEducationLogoChanged}
            educationSchool={educationSchool}
            setEducationSchool={setEducationSchool}
            educationSchoolChanged={educationSchoolChanged}
            setEducationSchoolChanged={setEducationSchoolChanged}
            educationSchoolError={educationSchoolError}
            setEducationSchoolError={setEducationSchoolError}
            educationFieldOfStudy={educationFieldOfStudy}
            setEducationFieldOfStudy={setEducationFieldOfStudy}
            educationFieldOfStudyChanged={educationFieldOfStudyChanged}
            setEducationFieldOfStudyChanged={setEducationFieldOfStudyChanged}
            educationFieldOfStudyError={educationFieldOfStudyError}
            setEducationFieldOfStudyError={setEducationFieldOfStudyError}
            educationDegreeName={educationDegreeName}
            setEducationDegreeName={setEducationDegreeName}
            educationDegreeNameChanged={educationDegreeNameChanged}
            setEducationDegreeNameChanged={setEducationDegreeNameChanged}
            educationDegreeNameError={educationDegreeNameError}
            setEducationDegreeNameError={setEducationDegreeNameError}
            educationLocation={educationLocation}
            setEducationLocation={setEducationLocation}
            educationLocationChanged={educationLocationChanged}
            setEducationLocationChanged={setEducationLocationChanged}
            educationLocationError={educationLocationError}
            setEducationLocationError={setEducationLocationError}
            educationStartDate={educationStartDate}
            setEducationStartDate={setEducationStartDate}
            educationStartDateInputType={educationStartDateInputType}
            setEducationStartDateInputType={setEducationStartDateInputType}
            educationStartDateChanged={educationStartDateChanged}
            setEducationStartDateChanged={setEducationStartDateChanged}
            educationStartDateError={educationStartDateError}
            setEducationStartDateError={setEducationStartDateError}
            educationEndDate={educationEndDate}
            setEducationEndDate={setEducationEndDate}
            educationEndDateInputType={educationEndDateInputType}
            setEducationEndDateInputType={setEducationEndDateInputType}
            educationEndDateChanged={educationEndDateChanged}
            setEducationEndDateChanged={setEducationEndDateChanged}
            educationEndDateError={educationEndDateError}
            setEducationEndDateError={setEducationEndDateError}
            educationEndDatePresent={educationEndDatePresent}
            setEducationEndDatePresent={setEducationEndDatePresent}
            educationEndDatePresentChanged={educationEndDatePresentChanged}
            setEducationEndDatePresentChanged={setEducationEndDatePresentChanged}
            educationUrl={educationUrl}
            setEducationUrl={setEducationUrl}
            educationUrlChanged={educationUrlChanged}
            setEducationUrlChanged={setEducationUrlChanged}
            educationUrlError={educationUrlError}
            setEducationUrlError={setEducationUrlError}
            educationDescription={educationDescription}
            setEducationDescription={setEducationDescription}
            educationDescriptionChanged={educationDescriptionChanged}
            setEducationDescriptionChanged={setEducationDescriptionChanged}
            educationDescriptionError={educationDescriptionError}
            setEducationDescriptionError={setEducationDescriptionError}
            educationShowDeleteEducationModal={educationShowDeleteEducationModal}
            setEducationShowDeleteEducationModal={setEducationShowDeleteEducationModal}
            handleBack={handleBack}
          />
          </>
        )}
        { editProfileModalState == 'Volunteering' && (
          <Volunteering
            user={user}
            handleEditProfileChangeView={handleEditProfileChangeView}
          />
        )}
        { editProfileModalState == 'Edit volunteering' && (
          <>
          <EditVolunteering 
            user={user}
            editProfileModalIndex={editProfileModalIndex}
            volunteeringLogo={volunteeringLogo}
            setVolunteeringLogo={setVolunteeringLogo}
            volunteeringLogoChanged={volunteeringLogoChanged}
            setVolunteeringLogoChanged={setVolunteeringLogoChanged}
            volunteeringCompany={volunteeringCompany}
            setVolunteeringCompany={setVolunteeringCompany}
            volunteeringCompanyChanged={volunteeringCompanyChanged}
            setVolunteeringCompanyChanged={setVolunteeringCompanyChanged}
            volunteeringCompanyError={volunteeringCompanyError}
            setVolunteeringCompanyError={setVolunteeringCompanyError}
            volunteeringTitle={volunteeringTitle}
            setVolunteeringTitle={setVolunteeringTitle}
            volunteeringTitleChanged={volunteeringTitleChanged}
            setVolunteeringTitleChanged={setVolunteeringTitleChanged}
            volunteeringTitleError={volunteeringTitleError}
            setVolunteeringTitleError={setVolunteeringTitleError}
            volunteeringLocation={volunteeringLocation}
            setVolunteeringLocation={setVolunteeringLocation}
            volunteeringLocationChanged={volunteeringLocationChanged}
            setVolunteeringLocationChanged={setVolunteeringLocationChanged}
            volunteeringLocationError={volunteeringLocationError}
            setVolunteeringLocationError={setVolunteeringLocationError}
            volunteeringStartDate={volunteeringStartDate}
            setVolunteeringStartDate={setVolunteeringStartDate}
            volunteeringStartDateInputType={volunteeringStartDateInputType}
            setVolunteeringStartDateInputType={setVolunteeringStartDateInputType}
            volunteeringStartDateChanged={volunteeringStartDateChanged}
            setVolunteeringStartDateChanged={setVolunteeringStartDateChanged}
            volunteeringStartDateError={volunteeringStartDateError}
            setVolunteeringStartDateError={setVolunteeringStartDateError}
            volunteeringEndDate={volunteeringEndDate}
            setVolunteeringEndDate={setVolunteeringEndDate}
            volunteeringEndDateInputType={volunteeringEndDateInputType}
            setVolunteeringEndDateInputType={setVolunteeringEndDateInputType}
            volunteeringEndDateChanged={volunteeringEndDateChanged}
            setVolunteeringEndDateChanged={setVolunteeringEndDateChanged}
            volunteeringEndDateError={volunteeringEndDateError}
            setVolunteeringEndDateError={setVolunteeringEndDateError}
            volunteeringEndDatePresent={volunteeringEndDatePresent}
            setVolunteeringEndDatePresent={setVolunteeringEndDatePresent}
            volunteeringEndDatePresentChanged={volunteeringEndDatePresentChanged}
            setVolunteeringEndDatePresentChanged={setVolunteeringEndDatePresentChanged}
            volunteeringUrl={volunteeringUrl}
            setVolunteeringUrl={setVolunteeringUrl}
            volunteeringUrlChanged={volunteeringUrlChanged}
            setVolunteeringUrlChanged={setVolunteeringUrlChanged}
            volunteeringUrlError={volunteeringUrlError}
            setVolunteeringUrlError={setVolunteeringUrlError}
            volunteeringDescription={volunteeringDescription}
            setVolunteeringDescription={setVolunteeringDescription}
            volunteeringDescriptionChanged={volunteeringDescriptionChanged}
            setVolunteeringDescriptionChanged={setVolunteeringDescriptionChanged}
            volunteeringDescriptionError={volunteeringDescriptionError}
            setVolunteeringDescriptionError={setVolunteeringDescriptionError}
            volunteeringShowDeleteVolunteeringModal={volunteeringShowDeleteVolunteeringModal}
            setVolunteeringShowDeleteVolunteeringModal={setVolunteeringShowDeleteVolunteeringModal}
            handleBack={handleBack}
          />
          </>
        )}
        { editProfileModalState == 'Add volunteering' && (
          <>
          <AddVolunteering
            user={user}
            editProfileModalIndex={editProfileModalIndex}
            volunteeringLogo={volunteeringLogo}
            setVolunteeringLogo={setVolunteeringLogo}
            volunteeringLogoChanged={volunteeringLogoChanged}
            setVolunteeringLogoChanged={setVolunteeringLogoChanged}
            volunteeringCompany={volunteeringCompany}
            setVolunteeringCompany={setVolunteeringCompany}
            volunteeringCompanyChanged={volunteeringCompanyChanged}
            setVolunteeringCompanyChanged={setVolunteeringCompanyChanged}
            volunteeringCompanyError={volunteeringCompanyError}
            setVolunteeringCompanyError={setVolunteeringCompanyError}
            volunteeringTitle={volunteeringTitle}
            setVolunteeringTitle={setVolunteeringTitle}
            volunteeringTitleChanged={volunteeringTitleChanged}
            setVolunteeringTitleChanged={setVolunteeringTitleChanged}
            volunteeringTitleError={volunteeringTitleError}
            setVolunteeringTitleError={setVolunteeringTitleError}
            volunteeringLocation={volunteeringLocation}
            setVolunteeringLocation={setVolunteeringLocation}
            volunteeringLocationChanged={volunteeringLocationChanged}
            setVolunteeringLocationChanged={setVolunteeringLocationChanged}
            volunteeringLocationError={volunteeringLocationError}
            setVolunteeringLocationError={setVolunteeringLocationError}
            volunteeringStartDate={volunteeringStartDate}
            setVolunteeringStartDate={setVolunteeringStartDate}
            volunteeringStartDateInputType={volunteeringStartDateInputType}
            setVolunteeringStartDateInputType={setVolunteeringStartDateInputType}
            volunteeringStartDateChanged={volunteeringStartDateChanged}
            setVolunteeringStartDateChanged={setVolunteeringStartDateChanged}
            volunteeringStartDateError={volunteeringStartDateError}
            setVolunteeringStartDateError={setVolunteeringStartDateError}
            volunteeringEndDate={volunteeringEndDate}
            setVolunteeringEndDate={setVolunteeringEndDate}
            volunteeringEndDateInputType={volunteeringEndDateInputType}
            setVolunteeringEndDateInputType={setVolunteeringEndDateInputType}
            volunteeringEndDateChanged={volunteeringEndDateChanged}
            setVolunteeringEndDateChanged={setVolunteeringEndDateChanged}
            volunteeringEndDateError={volunteeringEndDateError}
            setVolunteeringEndDateError={setVolunteeringEndDateError}
            volunteeringEndDatePresent={volunteeringEndDatePresent}
            setVolunteeringEndDatePresent={setVolunteeringEndDatePresent}
            volunteeringEndDatePresentChanged={volunteeringEndDatePresentChanged}
            setVolunteeringEndDatePresentChanged={setVolunteeringEndDatePresentChanged}
            volunteeringUrl={volunteeringUrl}
            setVolunteeringUrl={setVolunteeringUrl}
            volunteeringUrlChanged={volunteeringUrlChanged}
            setVolunteeringUrlChanged={setVolunteeringUrlChanged}
            volunteeringUrlError={volunteeringUrlError}
            setVolunteeringUrlError={setVolunteeringUrlError}
            volunteeringDescription={volunteeringDescription}
            setVolunteeringDescription={setVolunteeringDescription}
            volunteeringDescriptionChanged={volunteeringDescriptionChanged}
            setVolunteeringDescriptionChanged={setVolunteeringDescriptionChanged}
            volunteeringDescriptionError={volunteeringDescriptionError}
            setVolunteeringDescriptionError={setVolunteeringDescriptionError}
            volunteeringShowDeleteVolunteeringModal={volunteeringShowDeleteVolunteeringModal}
            setVolunteeringShowDeleteVolunteeringModal={setVolunteeringShowDeleteVolunteeringModal}
            handleBack={handleBack}
          />
          </>
        )}
        </>
      </Modal>
    </>
  )
}

export default EditProfile;