import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Col, Container, ProgressBar, Row } from 'react-bootstrap';
import Icon from '../components/icon/Icon';
import ICONS from '../components/icon/IconPaths';

const Components = () => {
  const [notification, setNotification] = useState('');

  return (
    <div>
      <Head>
        <title>Components</title>
      </Head>
      <Container className="mt-5">
        <Row>
          <Col>
            <h1>Components</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <br />
            <hr />
            <br />
          </Col>
        </Row>
        <Row>
          <Col>
            <h2 id="colours" className="text-dark-dis">Colours</h2>
          </Col>
        </Row>
        <br />
        <div>
          <Row>
            <Col>
              <h3>Primary</h3>
            </Col>
          </Row>
          <div className="d-flex flex-md-row flex-column">
            <Col className="bg-primary-900 p-3 font-weight-bold text-light-high" style={{ height: '160px' }}><p>900</p></Col>
            <Col className="bg-primary-800 p-3 font-weight-bold text-light-high" style={{ height: '160px' }}><p>800</p></Col>
            <Col className="bg-primary-700 p-3 font-weight-bold text-light-high" style={{ height: '160px' }}><p>700</p></Col>
            <Col className="bg-primary-600 p-3 font-weight-bold text-dark-high" style={{ height: '160px' }}><p>600</p></Col>
            <Col className="bg-primary-500 p-3 font-weight-bold text-dark-high" style={{ height: '160px' }}><p>500</p></Col>
            <Col className="bg-primary-400 p-3 font-weight-bold text-dark-high" style={{ height: '160px' }}><p>400</p></Col>
            <Col className="bg-primary-300 p-3 font-weight-bold text-dark-high" style={{ height: '160px' }}><p>300</p></Col>
            <Col className="bg-primary-200 p-3 font-weight-bold text-dark-high" style={{ height: '160px' }}><p>200</p></Col>
            <Col className="bg-primary-100 p-3 font-weight-bold text-dark-high" style={{ height: '160px' }}><p>100</p></Col>
          </div>
        </div>
        <br /><br />
        <div>
          <Row>
            <Col>
              <h3>Dark</h3>
            </Col>
          </Row>
          <div className="d-flex flex-md-row flex-column">
            <Col className="bg-dark-900 p-3 font-weight-bold text-light-high" style={{ height: '160px' }}><p>900</p></Col>
            <Col className="bg-dark-800 p-3 font-weight-bold text-light-high" style={{ height: '160px' }}><p>800</p></Col>
            <Col className="bg-dark-700 p-3 font-weight-bold text-light-high" style={{ height: '160px' }}><p>700</p></Col>
            <Col className="bg-dark-600 p-3 font-weight-bold text-dark-high" style={{ height: '160px' }}><p>600</p></Col>
            <Col className="bg-dark-500 p-3 font-weight-bold text-dark-high" style={{ height: '160px' }}><p>500</p></Col>
            <Col className="bg-dark-400 p-3 font-weight-bold text-dark-high" style={{ height: '160px' }}><p>400</p></Col>
            <Col className="bg-dark-300 p-3 font-weight-bold text-dark-high" style={{ height: '160px' }}><p>300</p></Col>
            <Col className="bg-dark-200 p-3 font-weight-bold text-dark-high" style={{ height: '160px' }}><p>200</p></Col>
            <Col className="bg-dark-100 p-3 font-weight-bold text-dark-high" style={{ height: '160px' }}><p>100</p></Col>
          </div>
        </div>
        <br /><br />
        <div>
          <Row>
            <Col>
              <h3>Error</h3>
            </Col>
          </Row>
          <div className="d-flex flex-md-row flex-column">
            <Col className="bg-error-900 p-3 font-weight-bold text-light-high" style={{ height: '160px' }}><p>900</p></Col>
            <Col className="bg-error-800 p-3 font-weight-bold text-light-high" style={{ height: '160px' }}><p>800</p></Col>
            <Col className="bg-error-700 p-3 font-weight-bold text-light-high" style={{ height: '160px' }}><p>700</p></Col>
            <Col className="bg-error-600 p-3 font-weight-bold text-dark-high" style={{ height: '160px' }}><p>600</p></Col>
            <Col className="bg-error-500 p-3 font-weight-bold text-dark-high" style={{ height: '160px' }}><p>500</p></Col>
            <Col className="bg-error-400 p-3 font-weight-bold text-dark-high" style={{ height: '160px' }}><p>400</p></Col>
            <Col className="bg-error-300 p-3 font-weight-bold text-dark-high" style={{ height: '160px' }}><p>300</p></Col>
            <Col className="bg-error-200 p-3 font-weight-bold text-dark-high" style={{ height: '160px' }}><p>200</p></Col>
            <Col className="bg-error-100 p-3 font-weight-bold text-dark-high" style={{ height: '160px' }}><p>100</p></Col>
          </div>
        </div>
        <br /><br />
        <div>
          <Row>
            <Col>
              <h3>Warning</h3>
            </Col>
          </Row>
          <div className="d-flex flex-md-row flex-column">
            <Col className="bg-warning-900 p-3 font-weight-bold text-light-high" style={{ height: '160px' }}><p>900</p></Col>
            <Col className="bg-warning-800 p-3 font-weight-bold text-light-high" style={{ height: '160px' }}><p>800</p></Col>
            <Col className="bg-warning-700 p-3 font-weight-bold text-dark-high" style={{ height: '160px' }}><p>700</p></Col>
            <Col className="bg-warning-600 p-3 font-weight-bold text-dark-high" style={{ height: '160px' }}><p>600</p></Col>
            <Col className="bg-warning-500 p-3 font-weight-bold text-dark-high" style={{ height: '160px' }}><p>500</p></Col>
            <Col className="bg-warning-400 p-3 font-weight-bold text-dark-high" style={{ height: '160px' }}><p>400</p></Col>
            <Col className="bg-warning-300 p-3 font-weight-bold text-dark-high" style={{ height: '160px' }}><p>300</p></Col>
            <Col className="bg-warning-200 p-3 font-weight-bold text-dark-high" style={{ height: '160px' }}><p>200</p></Col>
            <Col className="bg-warning-100 p-3 font-weight-bold text-dark-high" style={{ height: '160px' }}><p>100</p></Col>
          </div>
        </div>
        <br /><br />
        <div>
          <Row>
            <Col>
              <h3>Success</h3>
            </Col>
          </Row>
          <div className="d-flex flex-md-row flex-column">
            <Col className="bg-success-900 p-3 font-weight-bold text-light-high" style={{ height: '160px' }}><p>900</p></Col>
            <Col className="bg-success-800 p-3 font-weight-bold text-light-high" style={{ height: '160px' }}><p>800</p></Col>
            <Col className="bg-success-700 p-3 font-weight-bold text-light-high" style={{ height: '160px' }}><p>700</p></Col>
            <Col className="bg-success-600 p-3 font-weight-bold text-dark-high" style={{ height: '160px' }}><p>600</p></Col>
            <Col className="bg-success-500 p-3 font-weight-bold text-dark-high" style={{ height: '160px' }}><p>500</p></Col>
            <Col className="bg-success-400 p-3 font-weight-bold text-dark-high" style={{ height: '160px' }}><p>400</p></Col>
            <Col className="bg-success-300 p-3 font-weight-bold text-dark-high" style={{ height: '160px' }}><p>300</p></Col>
            <Col className="bg-success-200 p-3 font-weight-bold text-dark-high" style={{ height: '160px' }}><p>200</p></Col>
            <Col className="bg-success-100 p-3 font-weight-bold text-dark-high" style={{ height: '160px' }}><p>100</p></Col>
          </div>
        </div>
        <br /><br />
        <Row>
          <Col>
            <br />
            <hr />
            <br />
          </Col>
        </Row>
        <Row>
          <Col>
            <h2 id="typography" className="text-dark-dis">Typography</h2>
            <br />
            <h1>Heading 1</h1>
            <h2>Heading 2</h2>
            <h3>Heading 3</h3>
            <h4>Heading 4</h4>
            <h5>Heading 5</h5>
            <br />
            <p className="large">Large</p>
            <p>Regular</p>
            <p className="small">Small</p>
            <p className="caption">Caption</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <br />
            <hr />
            <br />
          </Col>
        </Row>
        <Row>
          <Col>
            <h2 id="buttons" className="text-dark-dis">Buttons</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <h3>Primary</h3>
            <div className="d-flex flex-wrap">
              <a className="btn primary high small mr-3">Label</a>
              <a className="btn primary high small icon-left mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn primary high small icon-right mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn primary high small icon-only mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
              </a>
              <a className="btn primary medium small mr-3">Label</a>
              <a className="btn primary low small mr-3">Label</a>
            </div>
            <br />
            <div className="d-flex flex-wrap">
              <a className="btn primary high mr-3">Label</a>
              <a className="btn primary high icon-left mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn primary high icon-right mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn primary high icon-only mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
              </a>
              <a className="btn primary medium mr-3">Label</a>
              <a className="btn primary low mr-3">Label</a>
            </div>
            <br />
            <div className="d-flex flex-wrap">
              <a className="btn primary high large mr-3">Label</a>
              <a className="btn primary high large icon-left mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn primary high large icon-right mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn primary high large icon-only mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
              </a>
              <a className="btn primary medium large mr-3">Label</a>
              <a className="btn primary low large mr-3">Label</a>
            </div>
            <br />
          </Col>
        </Row>
        <br /><br />
        <Row>
          <Col>
            <h3>Dark</h3>
            <div className="d-flex flex-wrap">
              <a className="btn dark high small mr-3">Label</a>
              <a className="btn dark high small icon-left mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn dark high small icon-right mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn dark high small icon-only mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
              </a>
              <a className="btn dark medium small mr-3">Label</a>
              <a className="btn dark low small mr-3">Label</a>
            </div>
            <br />
            <div className="d-flex flex-wrap">
              <a className="btn dark high mr-3">Label</a>
              <a className="btn dark high icon-left mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn dark high icon-right mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn dark high icon-only mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
              </a>
              <a className="btn dark medium mr-3">Label</a>
              <a className="btn dark low mr-3">Label</a>
            </div>
            <br />
            <div className="d-flex flex-wrap">
              <a className="btn dark high large mr-3">Label</a>
              <a className="btn dark high large icon-left mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn dark high large icon-right mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn dark high large icon-only mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
              </a>
              <a className="btn dark medium large mr-3">Label</a>
              <a className="btn dark low large mr-3">Label</a>
            </div>
            <br />
          </Col>
        </Row>
        <br /><br />
        <Row>
          <Col>
            <h3>Light</h3>
            <div className="d-flex flex-wrap">
              <a className="btn light high small mr-3">Label</a>
              <a className="btn light high small icon-left mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn light high small icon-right mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn light high small icon-only mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
              </a>
              <a className="btn light medium small mr-3">Label</a>
              <a className="btn light low small mr-3">Label</a>
            </div>
            <br />
            <div className="d-flex flex-wrap">
              <a className="btn light high mr-3">Label</a>
              <a className="btn light high icon-left mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn light high icon-right mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn light high icon-only mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
              </a>
              <a className="btn light medium mr-3">Label</a>
              <a className="btn light low mr-3">Label</a>
            </div>
            <br />
            <div className="d-flex flex-wrap">
              <a className="btn light high large mr-3">Label</a>
              <a className="btn light high large icon-left mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn light high large icon-right mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn light high large icon-only mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
              </a>
              <a className="btn light medium large mr-3">Label</a>
              <a className="btn light low large mr-3">Label</a>
            </div>
            <br />
          </Col>
        </Row>
        <br /><br />
        <Row>
          <Col>
            <h3>Error</h3>
            <div className="d-flex flex-wrap">
              <a className="btn error high small mr-3">Label</a>
              <a className="btn error high small icon-left mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn error high small icon-right mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn error high small icon-only mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
              </a>
              <a className="btn error medium small mr-3">Label</a>
              <a className="btn error low small mr-3">Label</a>
            </div>
            <br />
            <div className="d-flex flex-wrap">
              <a className="btn error high mr-3">Label</a>
              <a className="btn error high icon-left mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn error high icon-right mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn error high icon-only mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
              </a>
              <a className="btn error medium mr-3">Label</a>
              <a className="btn error low mr-3">Label</a>
            </div>
            <br />
            <div className="d-flex flex-wrap">
              <a className="btn error high large mr-3">Label</a>
              <a className="btn error high large icon-left mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn error high large icon-right mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn error high large icon-only mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
              </a>
              <a className="btn error medium large mr-3">Label</a>
              <a className="btn error low large mr-3">Label</a>
            </div>
            <br />
          </Col>
        </Row>
        <br /><br />
        <Row>
          <Col>
            <h3>Warning</h3>
            <div className="d-flex flex-wrap">
              <a className="btn warning high small mr-3">Label</a>
              <a className="btn warning high small icon-left mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn warning high small icon-right mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn warning high small icon-only mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
              </a>
              <a className="btn warning medium small mr-3">Label</a>
              <a className="btn warning low small mr-3">Label</a>
            </div>
            <br />
            <div className="d-flex flex-wrap">
              <a className="btn warning high mr-3">Label</a>
              <a className="btn warning high icon-left mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn warning high icon-right mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn warning high icon-only mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
              </a>
              <a className="btn warning medium mr-3">Label</a>
              <a className="btn warning low mr-3">Label</a>
            </div>
            <br />
            <div className="d-flex flex-wrap">
              <a className="btn warning high large mr-3">Label</a>
              <a className="btn warning high large icon-left mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn warning high large icon-right mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn warning high large icon-only mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
              </a>
              <a className="btn warning medium large mr-3">Label</a>
              <a className="btn warning low large mr-3">Label</a>
            </div>
            <br />
          </Col>
        </Row>
        <br /><br />
        <Row>
          <Col>
            <h3>Success</h3>
            <div className="d-flex flex-wrap">
              <a className="btn success high small mr-3">Label</a>
              <a className="btn success high small icon-left mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn success high small icon-right mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn success high small icon-only mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
              </a>
              <a className="btn success medium small mr-3">Label</a>
              <a className="btn success low small mr-3">Label</a>
            </div>
            <br />
            <div className="d-flex flex-wrap">
              <a className="btn success high mr-3">Label</a>
              <a className="btn success high icon-left mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn success high icon-right mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn success high icon-only mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
              </a>
              <a className="btn success medium mr-3">Label</a>
              <a className="btn success low mr-3">Label</a>
            </div>
            <br />
            <div className="d-flex flex-wrap">
              <a className="btn success high large mr-3">Label</a>
              <a className="btn success high large icon-left mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn success high large icon-right mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn success high large icon-only mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
              </a>
              <a className="btn success medium large mr-3">Label</a>
              <a className="btn success low large mr-3">Label</a>
            </div>
            <br />
          </Col>
        </Row>
        <br /><br />
        <Row>
          <Col>
            <h3>Disabled</h3>
            <div className="d-flex flex-wrap">
              <a className="btn high small mr-3 disabled">Label</a>
              <a className="btn high small icon-left mr-3 disabled">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn high small icon-right mr-3 disabled">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn high small icon-only mr-3 disabled">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
              </a>
              <a className="btn medium small mr-3 disabled">Label</a>
              <a className="btn low small mr-3 disabled">Label</a>
            </div>
            <br />
            <div className="d-flex flex-wrap">
              <a className="btn high mr-3 disabled">Label</a>
              <a className="btn high icon-left mr-3 disabled">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn high icon-right mr-3 disabled">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn high icon-only mr-3 disabled">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
              </a>
              <a className="btn medium mr-3 disabled">Label</a>
              <a className="btn low mr-3 disabled">Label</a>
            </div>
            <br />
            <div className="d-flex flex-wrap">
              <a className="btn high large mr-3 disabled">Label</a>
              <a className="btn high large icon-left mr-3 disabled">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn high large icon-right mr-3 disabled">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </a>
              <a className="btn high large icon-only mr-3 disabled">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
              </a>
              <a className="btn medium large mr-3 disabled">Label</a>
              <a className="btn low large mr-3 disabled">Label</a>
            </div>
            <br />
          </Col>
        </Row>
        <Row>
          <Col>
            <br />
            <hr />
            <br />
          </Col>
        </Row>
        <Row>
          <Col>
            <h2 id="form-fields" className="text-dark-dis">Form fields</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <h3>Basic</h3>
            <div className="d-flex flex-wrap">
              <input type="text" placeholder="Placeholder" className="small" />
            </div>
            <br />
            <div className="d-flex flex-wrap">
              <input type="text" placeholder="Placeholder" />
            </div>
            <br />
            <div className="d-flex flex-wrap">
              <input type="text" placeholder="Placeholder" className="error" />
            </div>
            <br />
            <div className="d-flex flex-wrap">
              <input type="text" placeholder="Placeholder" className="large" />
            </div>
            <br />
          </Col>
        </Row>
        <br /><br />
        <Row>
          <Col>
            <h3>Text area</h3>
            <div className="d-flex flex-wrap">
              <textarea type="text" placeholder="Placeholder" className="small" />
            </div>
            <br />
            <div className="d-flex flex-wrap">
              <textarea type="text" placeholder="Placeholder" />
            </div>
            <br />
            <div className="d-flex flex-wrap">
              <textarea type="text" placeholder="Placeholder" className="error" />
            </div>
            <br />
            <div className="d-flex flex-wrap">
              <textarea type="text" placeholder="Placeholder" className="large" />
            </div>
            <br />
          </Col>
        </Row>
        <br /><br />
        <Row>
          <Col>
            <h3>With Icons</h3>
            <div className="d-flex flex-wrap">
              <div className="input-with-icon icon-left small mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                <input type="text" placeholder="Placeholder" className="icon-left small" />
              </div>
              <div className="input-with-icon icon-right small mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                <input type="text" placeholder="Placeholder" className="icon-right small" />
              </div>
            </div>
            <br />
            <div className="d-flex flex-wrap">
              <div className="input-with-icon icon-left  mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                <input type="text" placeholder="Placeholder" className="icon-left" />
              </div>
              <div className="input-with-icon icon-right  mr-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                <input type="text" placeholder="Placeholder" className="icon-right" />
              </div>
            </div>
            <br />
            <div className="d-flex flex-wrap">
              <div className="input-with-icon icon-left large mr-3 mb-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                <input type="text" placeholder="Placeholder" className="icon-left large" />
              </div>
              <div className="input-with-icon icon-right large mr-3 mb-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                <input type="text" placeholder="Placeholder" className="icon-right large" />
              </div>
            </div>
            <br />
          </Col>
        </Row>
        <br /><br />
        <Row>
          <Col>
            <h3>With Prefix/Suffix</h3>
            <div className="d-flex flex-wrap">
              <div className="input-group prefix small mr-3 mb-3">
                <span className="input-group-addon">Prefix</span>
                <input type="text" placeholder="Placeholder" name="input" className="small" />
              </div>
              <div className="input-group suffix small mr-3 mb-3">
                <input type="text" placeholder="Placeholder" name="input" className="small" />
                <span className="input-group-addon ">Suffix</span>
              </div>
              <div className="input-group small presuffix align-items-start">
                <span className="input-group-addon prefix">Prefix</span>
                <input type="text" placeholder="Placeholder" name="input" className="small" />
                <span className="input-group-addon suffix">Suffix</span>
              </div>
            </div>
            <br />
            <div className="d-flex flex-wrap">
              <div className="input-group prefix mr-3 mb-3">
                <span className="input-group-addon">Prefix</span>
                <input type="text" placeholder="Placeholder" name="input" />
              </div>
              <div className="input-group suffix mr-3 mb-3">
                <input type="text" placeholder="Placeholder" name="input" />
                <span className="input-group-addon ">Suffix</span>
              </div>
              <div className="input-group presuffix align-items-start">
                <span className="input-group-addon prefix">Prefix</span>
                <input type="text" placeholder="Placeholder" name="input" />
                <span className="input-group-addon suffix">Suffix</span>
              </div>
            </div>
            <br />
            <div className="d-flex flex-wrap">
              <div className="input-group prefix large mr-3 mb-3">
                <span className="input-group-addon">Prefix</span>
                <input type="text" placeholder="Placeholder" name="input" className="large" />
              </div>
              <div className="input-group suffix large mr-3 mb-3">
                <input type="text" placeholder="Placeholder" name="input" className="large" />
                <span className="input-group-addon ">Suffix</span>
              </div>
              <div className="input-group presuffix large align-items-start">
                <span className="input-group-addon prefix">Prefix</span>
                <input type="text" placeholder="Placeholder" name="input" className="large" />
                <span className="input-group-addon suffix">Suffix</span>
              </div>
            </div>
            <br />
          </Col>
        </Row>
        <br /> <br />
        <Row>
          <Col>
            <h3>Hybrid</h3>
            <div className="d-flex flex-wrap">
              <div className="input-with-icon icon-right small mr-3 mb-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                <div className="input-group small prefix">
                  <span className="input-group-addon">Prefix</span>
                  <input type="text" placeholder="Placeholder" name="input" className="small icon-right" />
                </div>
              </div>
              <div className="input-with-icon icon-left small mr-3 mb-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                <div className="input-group small suffix">
                  <input type="text" placeholder="Placeholder" name="input" className="small icon-left" />
                  <span className="input-group-addon">Suffix</span>
                </div>
              </div>
            </div>
            <br />
            <div className="d-flex flex-wrap">
              <div className="input-with-icon icon-right mr-3 mb-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                <div className="input-group prefix">
                  <span className="input-group-addon">Prefix</span>
                  <input type="text" placeholder="Placeholder" name="input" className="icon-right" />
                </div>
              </div>
              <div className="input-with-icon icon-left mr-3 mb-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                <div className="input-group suffix">
                  <input type="text" placeholder="Placeholder" name="input" className="icon-left" />
                  <span className="input-group-addon">Suffix</span>
                </div>
              </div>
            </div>
            <br />
            <div className="d-flex flex-wrap">
              <div className="input-with-icon icon-right large mr-3 mb-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                <div className="input-group large prefix">
                  <span className="input-group-addon">Prefix</span>
                  <input type="text" placeholder="Placeholder" name="input" className="large icon-right" />
                </div>
              </div>
              <div className="input-with-icon icon-left large mr-3 mb-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                <div className="input-group large suffix">
                  <input type="text" placeholder="Placeholder" name="input" className="large icon-left" />
                  <span className="input-group-addon">Suffix</span>
                </div>
              </div>
            </div>
            <br />
          </Col>
        </Row>
        <Row>
          <Col>
            <br />
            <hr />
            <br />
          </Col>
        </Row>
        <Row>
          <Col>
            <h2 id="Checkbox" className="text-dark-dis">Checkbox</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <h3>Small</h3>
            <label className="checkbox-container small">One
              <input type="checkbox" checked="checked"/>
              <span className="checkmark"></span>
            </label>
            <br />
            <label className="checkbox-container small">Two
              <input type="checkbox" />
              <span className="checkmark"></span>
            </label>
            <br />
          </Col>
        </Row>
        <br /><br />
        <Row>
          <Col>
            <h3>Standard</h3>
            <label className="checkbox-container">One
              <input type="checkbox" checked="checked" />
              <span className="checkmark"></span>
            </label>
            <br />
            <label className="checkbox-container">Two
              <input type="checkbox" />
              <span className="checkmark"></span>
            </label>
            <br />
          </Col>
        </Row>
        <br /><br />
        <Row>
          <Col>
            <h3>Large</h3>
            <label className="checkbox-container large">
              One
              <input type="checkbox" checked="checked" />
              <span className="checkmark"></span>
            </label>
            <br />
            <label className="checkbox-container large">Two
              <input type="checkbox" />
              <span className="checkmark"></span>
            </label>
            <br />
          </Col>
        </Row>
        <br /><br />
        <Row>
          <Col>
            <br />
            <hr />
            <br />
          </Col>
        </Row>
        <Row>
          <Col>
            <h2 id="tags" className="text-dark-dis">Tags</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="d-flex flex-wrap">
              <div className="tag primary high mr-3 mb-3">Label</div>
              <div className="tag primary high icon-left mr-3 mb-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </div>
              <div className="tag primary high icon-right mr-3 mb-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </div>
              <div className="tag primary medium mr-3 mb-3">Label</div>
              <div className="tag primary medium icon-left mr-3 mb-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </div>
              <div className="tag primary medium icon-right mr-3 mb-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </div>
            </div>

            <div className="d-flex flex-wrap">
              <div className="tag dark high mr-3 mb-3">Label</div>
              <div className="tag dark high icon-left mr-3 mb-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </div>
              <div className="tag dark high icon-right mr-3 mb-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </div>
              <div className="tag dark medium mr-3 mb-3">Label</div>
              <div className="tag dark medium icon-left mr-3 mb-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </div>
              <div className="tag dark medium icon-right mr-3 mb-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </div>
            </div>
 
            <div className="d-flex flex-wrap">
              <div className="tag error high mr-3 mb-3">Label</div>
              <div className="tag error high icon-left mr-3 mb-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </div>
              <div className="tag error high icon-right mr-3 mb-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </div>
              <div className="tag error medium mr-3 mb-3">Label</div>
              <div className="tag error medium icon-left mr-3 mb-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </div>
              <div className="tag error medium icon-right mr-3 mb-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </div>
            </div>

            <div className="d-flex flex-wrap">
              <div className="tag warning high mr-3 mb-3">Label</div>
              <div className="tag warning high icon-left mr-3 mb-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </div>
              <div className="tag warning high icon-right mr-3 mb-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </div>
              <div className="tag warning medium mr-3 mb-3">Label</div>
              <div className="tag warning medium icon-left mr-3 mb-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </div>
              <div className="tag warning medium icon-right mr-3 mb-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </div>
            </div>
        
            <div className="d-flex flex-wrap">
              <div className="tag success high mr-3 mb-3">Label</div>
              <div className="tag success high icon-left mr-3 mb-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </div>
              <div className="tag success high icon-right mr-3 mb-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </div>
              <div className="tag success medium mr-3 mb-3">Label</div>
              <div className="tag success medium icon-left mr-3 mb-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </div>
              <div className="tag success medium icon-right mr-3 mb-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </div>
            </div>

            <div className="d-flex flex-wrap">
              <div className="tag disabled high mr-3 mb-3">Label</div>
              <div className="tag disabled high icon-left mr-3 mb-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </div>
              <div className="tag disabled high icon-right mr-3 mb-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </div>
              <div className="tag disabled medium mr-3 mb-3">Label</div>
              <div className="tag disabled medium icon-left mr-3 mb-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </div>
              <div className="tag disabled medium icon-right mr-3 mb-3">
                <svg viewBox="0 0 24 24">
                  <path d={ICONS.PLUS}></path>
                </svg>
                Label
              </div>
            </div>
          </Col>
        </Row>
        <br /><br />
        <Row>
          <Col>
            <br />
            <hr />
            <br />
          </Col>
        </Row>
        <Row>
          <Col>
            <h2 id="progress" className="text-dark-dis">Progress bar</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <h3>Standard</h3>
              <ProgressBar now={60} />
          </Col>
        </Row>
        <br /><br />
      </Container>
    </div>
  )
}

export default Components;