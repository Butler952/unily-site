const developmentNames = [ 
  "uTSBH5rqr8Ez8gPyHfFn",
  "IwxR0fg01nFNSltvGBaI",
  "lFi359MM2506qlY4jjdY",
  "R8varCWorvuYwLPpl0tG",
  "ovwoZMCIk7DPdAjNECjt"
]

const malePreviewIds = process.env.NODE_ENV == "development" ? developmentNames : null;
export default malePreviewIds;
