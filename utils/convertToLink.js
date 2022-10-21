const convertToLink = (link) => {
  if (link) {
    if (link.includes('https://') || link.includes('http://')) {
      return link
    } else { 
      return `https://${link}`
    }
  } else {
    return null
  }
}

export default convertToLink