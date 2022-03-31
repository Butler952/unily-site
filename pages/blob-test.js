import { useEffect, useState } from 'react';
import Header from '../components/header/Header';
import { Container } from 'react-bootstrap';
import { saveAs } from 'file-saver';

const BlobTest = () => {
  
  const [loggedIn, setLoggedIn] = useState(false);
  const [screenWidth, setScreenWidth] = useState('');

  useEffect(() => {
    var FileSaver = require('file-saver');
    FileSaver.saveAs("https://httpbin.org/image", "image.jpg");
  }, []);


  // useEffect(() => {
  //     getProfileList()
  //   //.then(console.log(idList))
  // }, []);

  // var FileSaver = require('file-saver');
  // var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
  // FileSaver.saveAs(blob, "hello world.txt");

  // FileSaver saveAs(Blob/File/Url, optional DOMString filename, optional Object { autoBom })


  return (
    <div className="overflow-hidden" style={{ background: 'white' }}>
      <Header hideShadow />
      <Container>
        <p>Hey</p>
      </Container>
    </div>
  )
}

export default BlobTest;