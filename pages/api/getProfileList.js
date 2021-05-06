import fire from '../../config/fire-config';

export default async (req, res) => {
  fire.collection('users').get()
  .then((doc) => {
    console.log(doc.id)
  })
  .then((res) => {
    res.status(200).json(doc)
  })
  .catch((e) => {
    res.status(400).end();
  })
}

/*
.then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    tempIdList.push(doc.id);
  })
})*/