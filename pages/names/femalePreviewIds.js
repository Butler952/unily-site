const developmentNames = [ 
  "KNrorP9EdMwElHHUeLIy",
  "oW2TTw3YDl9rvwGdCItG",
  "khQyJPr20AhIfjnWSCBS",
  "LvxKFQzZ4w2gUzi6oaaV",
  "X6WpTdBWA7QzVhhHJgWA"
]

const femalePreviewIds = process.env.NODE_ENV == "development" ? developmentNames : null;
export default femalePreviewIds;
