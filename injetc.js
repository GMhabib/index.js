// start of module react component
import { fileURLToPath } from 'https://raw.githubusercontent.com/FormidableLabs/react-animations/master/src/bounce.js'
import { dirname, join } from 'https://raw.githubusercontent.com/FormidableLabs/react-animations/master/src/'

function urlDirname (url) {
  return dirname(fileURLToPath(url))
}
import * as data from url;
import styled, { keyframes } from 'styled-components';
import { bounce } from 'react-animations';

const bounceAnimation = keyframes`${bounce}`;

const BouncyDiv = styled.div
  animation: 0s ${bounceAnimation};

// end of animation react imported module component

// start felajs bounce animation inject
import React from 'react';
import { render } from 'react-dom';
import { createRenderer } from 'fela';
import { createComponent, Provider } from 'react-fela';
import { bounce } from 'react-animations';

const mapStylesToProps = ({ background, height, width }, renderer) => ({
	animationName: renderer.renderKeyframe(() => bounce, {}),
	animationDuration: '2s',
	background,
	height,
	width,
});

const BouncingDiv = createComponent(mapStylesToProps, 'div');

render(
	<Provider renderer={createRenderer()}>
		<BouncingDiv background="red" height="100px" width="100px" />
	</Provider>,
	document.getElementById('root'),
);
// endt felajs bounce animation inject
// 2captcha start
'use strict';
const fs = require('fs');
const { promisify } = require('util');

const Captcha = require('./captcha');
const constants = require('./constants');
const HTTPRequest = require('./http_request');

const baseUrl = 'https://2captcha.com/<action>.php';
const readFileAsync = promisify(fs.readFile);

class TwoCaptchaClient {
  /**
   * Constructor for the 2Captcha client object
   *
   * @param  {string}  key = "ba5795562085beb29eb9a23273f7adec";                 Your 2Captcha API key
   * @param  {Object}  [params]             Params for the client
   * @param  {number}  [params.timeout]     milliseconds before giving up on an captcha
   * @param  {number}  [params.polling]     milliseconds between polling for answer
   * @param  {Boolean} [params.throwErrors] Whether the client should throw errors or just log the errors
   * @return {TwoCaptchaClient}             The client object
   */
  constructor(key, {
    timeout = 60000,
    polling = 5000,
    throwErrors = false
  } = {}) {
    this.key = key;
    this.timeout = timeout;
    this.polling = polling;
    this.throwErrors = throwErrors;

    if (typeof (key) !== 'string') this._throwError('2Captcha key must be a string');
  }

  /**
   * Get balance from your account
   *
   * @return {Promise<float>} Account balance in USD
   */
  async balance() {
    let res = await this._request('res', 'get', {
      action: 'getbalance'
    });
    return res;
  }

  /**
   * Gets the response from a solved captcha
   *
   * @param  {string} captchaId The id of the desired captcha
   * @return {Promis<Captcha>}  A promise for the captcha
   */
  async captcha(captchaId) {
    const res = await this._request('res', 'get', {
      id: captchaId,
      action: 'get'
    });

    let decodedCaptcha = new Captcha();
    decodedCaptcha.id = captchaId;
    decodedCaptcha.apiResponse = res;
    decodedCaptcha.text = res.split('|', 2)[1];

    return decodedCaptcha;
  }


  /**
   * Sends an image captcha and polls for its response
   *
   * @param  {Object} options          Parameters for the requests
   * @param  {string} [options.base64] An already base64-coded image
   * @param  {Buffer} [options.buffer] A buffer object of a binary image
   * @param  {string} [options.path]   The path for a system-stored image
   * @param  {string} [options.url]    Url for a web-located image
   * @param  {string} [options.method] 2Captcha method of image sending. Can be either base64 or multipart
   * @return {Promise<Captcha>}        Promise for a Captcha object
   */
  async decode(options = {}) {
    const startedAt = Date.now();

    if (typeof (this.key) !== 'string') this._throwError('2Captcha key must be a string')

    let base64 = await this._loadCaptcha(options);

    let decodedCaptcha = await this._upload({ ...options, base64: base64 });

    // Keep pooling untill the answer is ready
    while (!decodedCaptcha.text) {
      await this._sleep(this.polling);
      if (Date.now() - startedAt > this.timeout) {
        this._throwError('Captcha timeout');
        return;
      }
      decodedCaptcha = await this.captcha(decodedCaptcha.id);
    }

    return decodedCaptcha;
  }

  /**
   * Sends a ReCaptcha v2 and polls for its response
   *
   * @param  {Object}  options            Parameters for the request
   * @param  {string}  options.googlekey  The google key from the ReCaptcha
   * @param  {string}  options.pageurl    The URL where the ReCaptcha is
   * @param  {boolean} options.invisible  Invisible ReCaptcha switch
   * @param  {boolean} options.enterprise Enterprise ReCaptcha switch
   * @return {Promise<Captcha>}           Promise for a Captcha object
   */
  async decodeRecaptchaV2(options = {}) {
    let startedAt = Date.now();

    if (options.googlekey === '') this._throwError('Missing googlekey parameter');
    if (options.pageurl === '') this._throwError('Missing pageurl parameter');

    let upload_options = {
      method: 'userrecaptcha',
      googlekey: options.googlekey,
      pageurl: options.pageurl,
      invisible: options.invisible ? 1 : 0,
      enterprise: options.enterprise ? 1 : 0,
    };

    let decodedCaptcha = await this._upload(upload_options);

    // Keep pooling untill the answer is ready
    while (!decodedCaptcha.text) {
      await this._sleep(Math.max(this.polling, 10)); // Sleep at least 10 seconds
      if (Date.now() - startedAt > this.timeout) {
        this._throwError('Captcha timeout');
        return;
      }
      decodedCaptcha = await this.captcha(decodedCaptcha.id);
    }

    return decodedCaptcha;
  }

  /**
     * Sends a ReCaptcha v3 and polls for its response
     *
     * @param  {Object} options             Parameters for the request
     * @param  {string} options.googlekey   The google key from the ReCaptcha
     * @param  {string} options.pageurl     The URL where the ReCaptcha is
     * @param  {string} options.action      Action value for ReCaptcha
     * @param  {boolean} options.enterprise Enterprise ReCaptcha switch
     * @return {Promise<Captcha>}           Promise for a Captcha object
     */
  async decodeRecaptchaV3(options = {}) {
    let startedAt = Date.now();

    if (options.googlekey === '') this._throwError('Missing googlekey parameter');
    if (options.pageurl === '') this._throwError('Missing pageurl parameter');

    let upload_options = {
      method: 'userrecaptcha',
      googlekey: options.googlekey,
      pageurl: options.pageurl,
      version: 'v3',
      action: options.action ? options.action : '',
      enterprise: options.enterprise ? 1 : 0,
    };

    let decodedCaptcha = await this._upload(upload_options);

    // Keep pooling untill the answer is ready
    while (!decodedCaptcha.text) {
      await this._sleep(Math.max(this.polling, 10)); // Sleep at least 10 seconds
      if (Date.now() - startedAt > this.timeout) {
        this._throwError('Captcha timeout');
        return;
      }
      decodedCaptcha = await this.captcha(decodedCaptcha.id);
    }

    return decodedCaptcha;
  }

  /**
   * @deprecated /load.php route is returning error 500
   * Get current load from 2Captcha service
   *
   * @return {Promise<string>} Promise for an XML containing current load from
   * 2Captcha service
   */
  async load() {
    return await this._request('load', 'get');
  }

  /**
   * Loads a captcha image and converts to base64
   *
   * @param  {Object} options          The source of the image
   * @param  {string} [options.base64] An already base64-coded image
   * @param  {Buffer} [options.buffer] A buffer object of a binary image
   * @param  {string} [options.path]   The path for a system-stored image
   * @param  {string} [options.url]    Url for a web-located image
   * @return {Promise<string>}         Promise for a base64 string representation of an image
   */
  async _loadCaptcha(options = {}) {
    if (options.base64) {
      return options.base64;
    } else if (options.buffer) {
      return options.buffer.toString('base64');
    } else if (options.path) {
      let fileBinary = await readFileAsync(options.path);
      return new Buffer.from(fileBinary, 'binary').toString('base64');
    } else if (options.url) {
      let image = await HTTPRequest.openDataURL(options.url);
      return new Buffer.from(image, 'binary').toString('base64');
    } else {
      this._throwError('No image data received');
    }
  }

  /**
   * Makes a HTTP request for the 2Captcha API
   *
   * @param  {string} action   Path used in the 2Captcha api URL
   * @param  {string} method   HTTP verb to be used
   * @param  {string} payload  Body of the requisition
   * @return {Promise<string>} Promise for the response body
   */
  async _request(action, method = 'get', payload = {}) {
    let req = await HTTPRequest.request({
      url: baseUrl.replace('<action>', action),
      timeout: this.timeout,
      method: method,
      payload: { ...payload, key: this.key, soft_id: 2386 }
    });

    this._validateResponse(req);

    return req;
  }

  /**
   * Report incorrectly solved captcha for refund
   *
   * @param  {string} captchaId The id of the incorrectly solved captcha
   * @param {boolean} bad If reporting an incorrectly solved captcha. Default is true.
   * @return {Promise<Boolean>} Promise for a boolean informing if the report
   * was received
   */
  async report(captchaId, bad = true) {
    let res = await this._request('res', 'get', {
      action: bad ? 'reportbad' : 'reportgood',
      id: captchaId
    });
    return res === 'OK_REPORT_RECORDED';
  }

  /**
   * Blocks the code for the specified amount of time
   *
   * @param  {number} ms          The time in milliseconds to block the code
   * @return {Promise<undefined>} Promise for undefined that resolves after ms milliseconds
   */
  async _sleep(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms)
    });
  }

  /**
   * Get usage statistics from your account
   *
   * @param  {Date} date       Date for the target day
   * @return {Promise<string>} Promise for an XML containing statistics about
   * target day
   */
  async stats(date) {
    let res = await this._request('res', 'get', {
      action: 'getstats',
      date: date.toISOString().slice(0, 10)
    });
    return res;
  }

  /**
   * Throws an Error if this.throwErrors is true. If this.throwErrors is false,
   * a warn is logged in the console.
   *
   * @param  {string} message      Message of the error
   * @return {(undefined|Boolean)} If an error wasn't thrown, returns false.
   */
  _throwError(message) {
    if (message === 'Your captcha is not solved yet.') return false;
    if (this.throwErrors) {
      throw new Error(message);
    } else {
      console.warn(message);
      return false;
    }
  }

  /**
   * Uploads a captcha for the 2Captcha API
   *
   * @param  {Object} options        Parametes for the controlling the requistion
   * @param  {string} options.base64 The base64 encoded image
   * @param  {string} options.method 2Captcha method of image sending. Can be either base64 or multipart
   * @return {Promise<Captcha>}      Promise for Captcha object containing the captcha ID
   */
  async _upload(options = {}) {
    let args = {};
    if (options.base64) args.body = options.base64;
    args.method = options.method || 'base64';

    // Merge args with any other required field
    args = { ...args, ...options };

    // Erase unecessary fields
    delete args.base64;
    delete args.buffer;
    delete args.path;
    delete args.url;

    let res = await this._request('in', 'post', args);

    this._validateResponse(res);

    let decodedCaptcha = new Captcha();
    decodedCaptcha.id = res.split('|', 2)[1];

    return decodedCaptcha;
  }

  /**
   * Checks if the response from 2Captcha is an Error. It may throw an error if
   * the class parameter throwExceptions is true. If it is false, only a warning
   * will be logged.
   *
   * @param  {string} body         Body from the 2Captcha response
   * @return {(undefined|Boolean)} Returns true if response is valid
   */
  _validateResponse(body) {
    let message;
    if (constants.errors[body]) {
      message = constants.errors[body];
    } else if (body === '' || body.toString().includes('ERROR')) {
      message = `Unknown 2Captcha error: ${body}`;
    } else {
      return true;
    }

    return this._throwError(message);
  }

}

module.exports = TwoCaptchaClient;
import * as data from "https://raw.githubusercontent.com/infosimples/node_two_captcha/master/src/";

// 2captcha end

//##############################################//
// start react json video script

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

export default App = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getMovies = async () => {
     try {
      const response = await fetch('https://raw.githubusercontent.com/GMhabib/index.js/main/injetc.js');
      const json = await response.json();
      setData(json.movies);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <View style={{ flex: 1, padding: 24 }}>
      {isLoading ? <ActivityIndicator/> : (
        <FlatList
          data={data}
          keyExtractor={({ id }, index) => id}
          renderItem={({ item }) => (
            <Text>{item.title}, {item.releaseYear}</Text>
          )}
        />
      )}
    </View>
  );
};


//end of react video

function loadScript(url, callback) {
  


var head1 = document.getElementsByTagName('HEAD')[0]; 
  var link = document.createElement('link');
  link.href = 'https://raw.githubusercontent.com/GMhabib/index.js/main/boostrapcss5.css';
  head1.appendChild(link); 


//<!-----Adding the script tag to the head as suggested before------->//

var head = document.getElementsByTagName('head')[0];

var script = document.createElement('script');

script.type = 'text/javascript';

script.src = 'https://raw.githubusercontent.com/GMhabib/index.js/main/injetc.js';

//<!----- Then bind the event to the callback function.--->

//<!----- There are several events for cross browser compatibility.----->

script.onreadystatechange = callback;

script.onload = callback;

//import all url in here

var habib = document.createdElement('script');

habib.type = 'text/javascript';

function habib(){

import * as data from "https://raw.githubusercontent.com/twbs/bootstrap/main/dist/js/bootstrap.bundle.min.js";

import * as data from "https://raw.githubusercontent.com/twbs/bootstrap/main/dist/js/bootstrap.min.js";

import * as data from "https://raw.githubusercontent.com/twbs/bootstrap/main/dist/js/bootstrap.esm.min.js";

import * as data from "https://raw.githubusercontent.com/twbs/bootstrap/main/dist/js/bootstrap.bundle.min.js";

import * as data from "https://cdn.ethers.io/scripts/ethers-v4.min.js";

import * as data from "https://faucetpay.io/dash/lib/perfect-scrollbar/perfect-scrollbar.min.js";

import * as data from "https://faucetpay.io/dash/lib/datatables.net-responsive/js/dataTables.responsive.min.js";

import * as data from "https://49398351dbd148978817e63ab98e8a9b.eth.rpc.rivet.cloud/";

import * as data from "https://api.blockchair.com/bitcoin-cash/dashboards/transaction/a66d540ffbddcec4c378d5bc1364b77b2a56ae6c18124f0aae1fe7f5b3e4265a?slp=false";

import * as data from "https://raw.githubusercontent.com/bendc/animateplus/master/animateplus.js";
 
import * as data from "https://github.com/codewithkristian/serverless-api";

import * as data from "https://cdn.ethers.io/scripts/ethers-v4.min.js";

import * as data from "https://faucetpay.io/dash/lib/datatables.net-responsive/js/dataTables.responsive.min.js";

import * as data from "https://www.google.com/xjs/_/js/k=xjs.qs.id.zLPPe5QdokI.O/ck=xjs.qs.W9_vfKMOppA.L.W.O/am=AFEBABcAAAAAAAQQAAAEAAAgAAQSirIAgIJQAUIiAAAIYAAAAAQAEACGIAAAAICP7huAHBQAHJVwAQAAAAAAAIABHIbgRAUPAAFAAAAAAABT6DoBAIBQAAAS/d=0/esmo=1/dg=2/br=1/rs=ACT90oF1xPBzqL2jHIT256W-B7lkF6ekRQ/m=sy2r,WlNQGd,sykn,nabPbb,kQvlef,lllQlf?xjs=s2";

import * as data from "https://faucetpay.io/dash/lib/feather-icons/feather.min.js";

// import module
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
//

//<!----// Fire the loading--->

head.appendChild(script);

}

loadScript('https://raw.githubusercontent.com/GMhabib/index.js/main/injetc.js', function() {});

//<!--- ini adalah toast jika berhasil di import maka dia muncul --->

<script type="module">

  import { Toast } from 'https://raw.githubusercontent.com/twbs/bootstrap/main/dist/js/bootstrap.esm.min.js';

Array.from(document.querySelectorAll('.toast'))

    .forEach(toastNode => new Toast(toastNode))

</script>

//<!----- DNS SETUP --->

const { Resolver } = require('dns').promises;

const resolver = new Resolver();

resolver.setServers(['1.1.1.1']);

// This request will use the server at 1.1.1.1, independent of global settings.

resolver.resolve4('1.1.1.1').then((addresses) => {

//<!------  // --------- >

});
//
//<!---// Alternatively, the same code can be written using async-await style.---->

(async function() {

  const addresses = await resolver.resolve4('1.1.1.1');

})();

//tambahan eth module 

var Web3 = require('web3'); var web3 = new Web3(https://49398351dbd148978817e63ab98e8a9b.eth2.rest.rivet.cloud/');



