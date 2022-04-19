// start of module react component
import * as data from "https://raw.githubusercontent.com/FormidableLabs/react-animations/master/src/";
import styled, { keyframes } from 'styled-components';
import { bounce } from 'react-animations';

const bounceAnimation = keyframes`${bounce}`;

const BouncyDiv = styled.div, styled.span, styled.p, styled.h1, styled.h2, styled.h3, styled.h4`
  animation: 1s ${bounceAnimation};
`;

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

// start of rocket.js premium

!function(){"use strict";function t(){return"cf-marker-"+Math.random().toString().slice(2)}function e(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];(n=console.warn||console.log).call.apply(n,[console,"[ROCKET LOADER] "].concat(t));var n}function n(t,e){var n=e.parentNode;n&&h(t,n,e)}function r(t,e){h(t,e,e.childNodes[0])}function o(t){var e=t.parentNode;e&&e.removeChild(t)}function i(t){var e=t.namespaceURI===A?"xlink:href":"src";return t.getAttribute(e)}function a(t,e){var n=t.type.substr(e.length);return!(n&&!E[n.trim()])&&((!k||!t.hasAttribute("nomodule"))&&!(!k&&"module"===n))}function c(t){return a(t,"")}function s(t,e){return function(n){if(e(),t)return t.call(this,n)}}function u(t,e){t.onload=s(t.onload,e),t.onerror=s(t.onerror,e)}function p(t){var e=document.createElementNS(t.namespaceURI,"script");e.async=t.hasAttribute("async"),e.textContent=t.textContent;for(var n=0;n<t.attributes.length;n++){var r=t.attributes[n];try{r.namespaceURI?e.setAttributeNS(r.namespaceURI,r.name,r.value):e.setAttribute(r.name,r.value)}catch(o){}}return e}function l(t,e){var n=new I(e);t.dispatchEvent(n)}function d(e){var n=e.namespaceURI===A,r=t();e.setAttribute(r,"");var i=n?"<svg>"+e.outerHTML+"</svg>":e.outerHTML;L.call(document,i);var a=document.querySelector("["+r+"]");if(a){a.removeAttribute(r);var c=n&&a.parentNode;c&&o(c)}return a}function f(t){if(t&&"handleEvent"in t){var e=t.handleEvent;return"function"==typeof e?e.bind(t):e}return t}function h(t,e,n){var r=n?function(t){return e.insertBefore(t,n)}:function(t){return e.appendChild(t)};Array.prototype.slice.call(t).forEach(r)}function v(){return/chrome/i.test(navigator.userAgent)&&/google/i.test(navigator.vendor)}function y(t,e){function n(){this.constructor=t}H(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}function m(t){return t instanceof Window?["load"]:t instanceof Document?["DOMContentLoaded","readystatechange"]:[]}function b(t){var e=t.getAttribute(R);if(!e)return null;var n=e.split(T);return{nonce:n[0],handlerPrefixLength:+n[1],bailout:!t.hasAttribute("defer")}}function g(t){var e=B+t.nonce;Array.prototype.forEach.call(document.querySelectorAll("["+e+"]"),function(n){n.removeAttribute(e),Array.prototype.forEach.call(n.attributes,function(e){/^on/.test(e.name)&&"function"!=typeof n[e.name]&&n.setAttribute(e.name,e.value.substring(t.handlerPrefixLength))})})}function S(){var t=window;"undefined"!=typeof Promise&&(t.__cfQR={done:new Promise(function(t){return U=t})})}function w(t){var e=new N(t),n=new C(e);e.harvestScriptsInDocument(),new W(e,{nonce:t,blocking:!0,docWriteSimulator:n,callback:function(){}}).run()}function x(t){var e=new N(t),n=new C(e);e.harvestScriptsInDocument();var r=new W(e,{nonce:t,blocking:!1,docWriteSimulator:n,callback:function(){window.__cfRLUnblockHandlers=!0,r.removePreloadHints(),P(t)}});r.insertPreloadHints(),M.runOnLoad(function(){r.run()})}function P(t){var e=new O(t);M.simulateStateBeforeDeferScriptsActivation(),e.harvestDeferScriptsInDocument(),new W(e,{nonce:t,blocking:!1,callback:function(){M.simulateStateAfterDeferScriptsActivation(),U&&U()}}).run()}var A="http://www.w3.org/2000/svg",E={"application/ecmascript":!0,"application/javascript":!0,"application/x-ecmascript":!0,"application/x-javascript":!0,"text/ecmascript":!0,"text/javascript":!0,"text/javascript1.0":!0,"text/javascript1.1":!0,"text/javascript1.2":!0,"text/javascript1.3":!0,"text/javascript1.4":!0,"text/javascript1.5":!0,"text/jscript":!0,"text/livescript":!0,"text/x-ecmascript":!0,"text/x-javascript":!0,module:!0},k=void 0!==document.createElement("script").noModule,I=function(){var t=window;return t.__rocketLoaderEventCtor||Object.defineProperty(t,"__rocketLoaderEventCtor",{value:Event}),t.__rocketLoaderEventCtor}(),L=document.write,_=document.writeln,H=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])},D=function(){function t(t){this.nonce=t,this.items=[]}return Object.defineProperty(t.prototype,"hasItems",{get:function(){return this.items.length>0},enumerable:!0,configurable:!0}),t.prototype.pop=function(){return this.items.pop()},t.prototype.forEach=function(t){this.items.forEach(function(e){var n=e.script;return t(n)})},t.prototype.harvestScripts=function(t,e){var n=this,r=e.filter,o=e.mutate;Array.prototype.slice.call(t.querySelectorAll("script")).filter(r).reverse().forEach(function(t){o(t),n.pushScriptOnStack(t)})},t.prototype.pushScriptOnStack=function(t){var e=t.parentNode,n=this.createPlaceholder(t),r=!!i(t);e.replaceChild(n,t),this.items.push({script:t,placeholder:n,external:r,async:r&&t.hasAttribute("async"),executable:c(t)})},t.prototype.hasNonce=function(t){return 0===(t.getAttribute("type")||"").indexOf(this.nonce)},t.prototype.removeNonce=function(t){t.type=t.type.substr(this.nonce.length)},t.prototype.makeNonExecutable=function(t){t.type=this.nonce+t.type},t.prototype.isPendingDeferScript=function(t){return t.hasAttribute("defer")||t.type===this.nonce+"module"&&!t.hasAttribute("async")},t}(),N=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return y(e,t),e.prototype.harvestScriptsInDocument=function(){var t=this;this.harvestScripts(document,{filter:function(e){return t.hasNonce(e)},mutate:function(e){t.isPendingDeferScript(e)||t.removeNonce(e)}})},e.prototype.harvestScriptsAfterDocWrite=function(t){var e=this;this.harvestScripts(t,{filter:c,mutate:function(t){e.isPendingDeferScript(t)&&e.makeNonExecutable(t)}})},e.prototype.createPlaceholder=function(t){return document.createComment(t.outerHTML)},e}(D),O=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return y(e,t),e.prototype.harvestDeferScriptsInDocument=function(){var t=this;this.harvestScripts(document,{filter:function(e){return t.hasNonce(e)&&t.isPendingDeferScript(e)},mutate:function(e){return t.removeNonce(e)}})},e.prototype.createPlaceholder=function(t){var e=p(t);return this.makeNonExecutable(e),e},e}(D),C=function(){function t(t){this.scriptStack=t}return t.prototype.enable=function(t){var e=this;this.insertionPointMarker=t,this.buffer="",document.write=function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];return e.write(t,!1)},document.writeln=function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];return e.write(t,!0)}},t.prototype.flushWrittenContentAndDisable=function(){document.write=L,document.writeln=_,this.buffer.length&&(document.contains(this.insertionPointMarker)?this.insertionPointMarker.parentNode===document.head?this.insertContentInHead():this.insertContentInBody():e("Insertion point marker for document.write was detached from document:","Markup will not be inserted"))},t.prototype.insertContentInHead=function(){var t=new DOMParser,e="<!DOCTYPE html><head>"+this.buffer+"</head>",o=t.parseFromString(e,"text/html");if(this.scriptStack.harvestScriptsAfterDocWrite(o),n(o.head.childNodes,this.insertionPointMarker),o.body.childNodes.length){for(var i=Array.prototype.slice.call(o.body.childNodes),a=this.insertionPointMarker.nextSibling;a;)i.push(a),a=a.nextSibling;document.body||L.call(document,"<body>"),r(i,document.body)}},t.prototype.insertContentInBody=function(){var t=this.insertionPointMarker.parentElement,e=document.createElement(t.tagName);e.innerHTML=this.buffer,this.scriptStack.harvestScriptsAfterDocWrite(e),n(e.childNodes,this.insertionPointMarker)},t.prototype.write=function(t,e){var n=document.currentScript;n&&i(n)&&n.hasAttribute("async")?(r=e?_:L).call.apply(r,[document].concat(t)):this.buffer+=t.map(String).join(e?"\n":"");var r},t}(),j=function(){function t(){var t=this;this.simulatedReadyState="loading",this.bypassEventsInProxies=!1,this.nativeWindowAddEventListener=window.addEventListener;try{Object.defineProperty(document,"readyState",{get:function(){return t.simulatedReadyState}})}catch(e){}this.setupEventListenerProxy(),this.updateInlineHandlers()}return t.prototype.runOnLoad=function(t){var e=this;this.nativeWindowAddEventListener.call(window,"load",function(n){if(!e.bypassEventsInProxies)return t(n)})},t.prototype.updateInlineHandlers=function(){this.proxyInlineHandler(document,"onreadystatechange"),this.proxyInlineHandler(window,"onload"),document.body&&this.proxyInlineHandler(document.body,"onload")},t.prototype.simulateStateBeforeDeferScriptsActivation=function(){this.bypassEventsInProxies=!0,this.simulatedReadyState="interactive",l(document,"readystatechange"),this.bypassEventsInProxies=!1},t.prototype.simulateStateAfterDeferScriptsActivation=function(){var t=this;this.bypassEventsInProxies=!0,l(document,"DOMContentLoaded"),this.simulatedReadyState="complete",l(document,"readystatechange"),l(window,"load"),this.bypassEventsInProxies=!1,window.setTimeout(function(){return t.bypassEventsInProxies=!0},0)},t.prototype.setupEventListenerProxy=function(){var t=this;("undefined"!=typeof EventTarget?[EventTarget.prototype]:[Node.prototype,Window.prototype]).forEach(function(e){return t.patchEventTargetMethods(e)})},t.prototype.patchEventTargetMethods=function(t){var e=this,n=t.addEventListener,r=t.removeEventListener;t.addEventListener=function(t,r){for(var o=[],i=2;i<arguments.length;i++)o[i-2]=arguments[i];var a=m(this),c=r&&r.__rocketLoaderProxiedHandler;if(!c){var s=f(r);"function"==typeof s?(c=function(n){if(e.bypassEventsInProxies||a.indexOf(t)<0)return s.call(this,n)},Object.defineProperty(r,"__rocketLoaderProxiedHandler",{value:c})):c=r}n.call.apply(n,[this,t,c].concat(o))},t.removeEventListener=function(t,e){for(var n=[],o=2;o<arguments.length;o++)n[o-2]=arguments[o];var i=e&&e.__rocketLoaderProxiedHandler||e;r.call.apply(r,[this,t,i].concat(n))}},t.prototype.proxyInlineHandler=function(t,e){try{var n=t[e];if(n&&!n.__rocketLoaderInlineHandlerProxy){var r=this;t[e]=function(t){if(r.bypassEventsInProxies)return n.call(this,t)},Object.defineProperty(t[e],"__rocketLoaderInlineHandlerProxy",{value:!0})}}catch(o){return void console.warn("encountered an error when accessing "+e+" handler:",o.message)}},t}(),M=function(){var t=window;return t.__rocketLoaderLoadProgressSimulator||Object.defineProperty(t,"__rocketLoaderLoadProgressSimulator",{value:new j}),t.__rocketLoaderLoadProgressSimulator}(),W=function(){function t(t,e){this.scriptStack=t,this.settings=e,this.preloadHints=[]}return t.prototype.insertPreloadHints=function(){var t=this;this.scriptStack.forEach(function(e){if(a(e,t.settings.nonce)){var n=i(e),r=v()&&e.hasAttribute("integrity");if(n&&!r){var o=document.createElement("link");o.setAttribute("rel","preload"),o.setAttribute("as","script"),o.setAttribute("href",n),e.crossOrigin&&o.setAttribute("crossorigin",e.crossOrigin),document.head.appendChild(o),t.preloadHints.push(o)}}})},t.prototype.removePreloadHints=function(){this.preloadHints.forEach(function(t){return o(t)})},t.prototype.run=function(){for(var t=this,e=this;this.scriptStack.hasItems;){var n=function(){var n=e.settings.docWriteSimulator,r=e.scriptStack.pop();n&&!r.async&&n.enable(r.placeholder);var o=e.activateScript(r);return o?r.external&&r.executable&&!r.async?(u(o,function(){t.finalizeActivation(r),t.run()}),{value:void 0}):void e.finalizeActivation(r):(n&&n.flushWrittenContentAndDisable(),"continue")}();if("object"==typeof n)return n.value}this.scriptStack.hasItems||this.settings.callback()},t.prototype.finalizeActivation=function(t){this.settings.docWriteSimulator&&!t.async&&this.settings.docWriteSimulator.flushWrittenContentAndDisable(),M.updateInlineHandlers(),o(t.placeholder)},t.prototype.activateScript=function(t){var n=t.script,r=t.placeholder,o=t.external,i=t.async,a=r.parentNode;if(!document.contains(r))return e("Placeholder for script \n"+n.outerHTML+"\n was detached from document.","Script will not be executed."),null;var c=this.settings.blocking&&o&&!i?d(n):p(n);return c?(a.insertBefore(c,r),c):(e("Failed to create activatable copy of script \n"+n.outerHTML+"\n","Script will not be executed."),null)},t}(),R="data-cf-settings",T="|",B="data-cf-modified-",U=void 0;!function(){var t=document.currentScript;if(t){var n=b(t);n?(o(t),g(n),M.updateInlineHandlers(),n.bailout?w(n.nonce):(S(),x(n.nonce))):e("Activator script doesn't have settings. No scripts will be executed.")}else e("Can't obtain activator script. No scripts will be executed.")}()}();


// end of rocket.js cloudflare premium

//started script inject javascript
/**
 * @overview  Settings popup window
 */

const submitBtn = document.getElementById('submit'),
  cssUrlElement = document.getElementById('cssUrl'),
  jsUrlElement = document.getElementById('jsUrl'),
  hostUrlElement = document.getElementById('hostUrl'),
  setCurrentBtn = document.getElementById('setCurrent'),
  isEnabledElement = document.getElementById('isEnabled');

init();


function init() {
  chrome.storage.sync.get(['cssUrl', 'jsUrl', 'hostUrl', 'isEnabled'], fillData);
  submitBtn.addEventListener('click', onSubmit, false);
  setCurrentBtn.addEventListener('click', onSetCurrentClick, false);
}

function fillData({ cssUrl, jsUrl, hostUrl, isEnabled } = {}) {
  cssUrlElement.value = cssUrl || '';
  jsUrlElement.value = jsUrl || '';
  hostUrlElement.value = hostUrl || '';
  isEnabledElement.checked = !!isEnabled;
}

function onSubmit() {
  chrome.storage.sync.set({
    cssUrl: cssUrlElement.value,
    jsUrl: jsUrlElement.value,
    hostUrl: hostUrlElement.value,
    isEnabled: isEnabledElement.checked
  });

  if (isEnabledElement.checked) {
    chrome.browserAction.setIcon({path: '../images/icon-enabled.png'});

  } else {
    chrome.browserAction.setIcon({path: '../images/icon-disabled.png'});
  }
}

function onSetCurrentClick() {
  chrome.tabs.getSelected(null, tab => {
    const domain = (new URL(tab.url)).hostname;
    hostUrlElement.value = domain;
  });
}

}
// chrome injected tab in javascript

// start animation
let wipRoot = null;
let nextUnitOfWork = null;
let currentRoot = null;
let deletions = [];
let wipFiber;
let hookIndex = 0;
// Support React.Fragment syntax.
const Fragment = Symbol.for('react.fragment');

// Enhanced requestIdleCallback.
((global) => {
  const id = 1;
  const fps = 1e3 / 60;
  let frameDeadline;
  let pendingCallback;
  const channel = new MessageChannel();
  const timeRemaining = () => frameDeadline - window.performance.now();

  const deadline = {
    didTimeout: false,
    timeRemaining,
  };

  channel.port2.onmessage = () => {
    if (typeof pendingCallback === 'function') {
      pendingCallback(deadline);
    }
  };

  global.requestIdleCallback = (callback) => {
    global.requestAnimationFrame((frameTime) => {
      frameDeadline = frameTime + fps;
      pendingCallback = callback;
      channel.port1.postMessage(null);
    });
    return id;
  };
})(window);

const isDef = (param) => param !== void 0 && param !== null;

const isPlainObject = (val) =>
  Object.prototype.toString.call(val) === '[object Object]' &&
  [Object.prototype, null].includes(Object.getPrototypeOf(val));

// Simple judgment of virtual elements.
const isVirtualElement = (e) => typeof e === 'object';

// Text elements require special handling.
const createTextElement = (text) => ({
  type: 'TEXT',
  props: {
    nodeValue: text,
  },
});

// Create custom JavaScript data structures.
const createElement = (type, props = {}, ...child) => {
  const children = child.map((c) =>
    isVirtualElement(c) ? c : createTextElement(String(c)),
  );

  return {
    type,
    props: {
      ...props,
      children,
    },
  };
};

// Update DOM properties.
// For simplicity, we remove all the previous properties and add next properties.
const updateDOM = (DOM, prevProps, nextProps) => {
  const defaultPropKeys = 'children';

  for (const [removePropKey, removePropValue] of Object.entries(prevProps)) {
    if (removePropKey.startsWith('on')) {
      DOM.removeEventListener(
        removePropKey.slice(2).toLowerCase(),
        removePropValue,
      );
    } else if (removePropKey !== defaultPropKeys) {
      DOM[removePropKey] = '';
    }
  }

  for (const [addPropKey, addPropValue] of Object.entries(nextProps)) {
    if (addPropKey.startsWith('on')) {
      DOM.addEventListener(addPropKey.slice(2).toLowerCase(), addPropValue);
    } else if (addPropKey !== defaultPropKeys) {
      DOM[addPropKey] = addPropValue;
    }
  }
};

// Create DOM based on node type.
const createDOM = (fiberNode) => {
  const { type, props } = fiberNode;
  let DOM = null;

  if (type === 'TEXT') {
    DOM = document.createTextNode('');
  } else if (typeof type === 'string') {
    DOM = document.createElement(type);
  }

  // Update properties based on props after creation.
  if (DOM !== null) {
    updateDOM(DOM, {}, props);
  }

  return DOM;
};

// Change the DOM based on fiber node changes.
// Note that we must complete the comparison of all fiber nodes before commitRoot.
// The comparison of fiber nodes can be interrupted, but the commitRoot cannot be interrupted.
const commitRoot = () => {
  const findParentFiber = (fiberNode) => {
    if (fiberNode) {
      let parentFiber = fiberNode.return;
      while (parentFiber && !parentFiber.dom) {
        parentFiber = parentFiber.return;
      }
      return parentFiber;
    }

    return null;
  };

  const commitDeletion = (parentDOM, DOM) => {
    if (isDef(parentDOM)) {
      parentDOM.removeChild(DOM);
    }
  };

  const commitReplacement = (parentDOM, DOM) => {
    if (isDef(parentDOM)) {
      parentDOM.appendChild(DOM);
    }
  };

  const commitWork = (fiberNode) => {
    if (fiberNode) {
      if (fiberNode.dom) {
        const parentFiber = findParentFiber(fiberNode);
        const parentDOM = parentFiber?.dom;
        switch (fiberNode.effectTag) {
          case 'REPLACEMENT':
            commitReplacement(parentDOM, fiberNode.dom);
            break;
          case 'UPDATE':
            updateDOM(
              fiberNode.dom,
              fiberNode.alternate ? fiberNode.alternate.props : {},
              fiberNode.props,
            );
            break;
          default:
            break;
        }
      }

      commitWork(fiberNode.child);
      commitWork(fiberNode.sibling);
    }
  };

  for (const deletion of deletions) {
    if (deletion.dom) {
      const parentFiber = findParentFiber(deletion);
      commitDeletion(parentFiber?.dom, deletion.dom);
    }
  }

  if (wipRoot !== null) {
    commitWork(wipRoot.child);
    currentRoot = wipRoot;
  }

  wipRoot = null;
};

// Reconcile the fiber nodes before and after, compare and record the differences.
const reconcileChildren = (fiberNode, elements = []) => {
  let index = 0;
  let oldFiberNode = void 0;
  let prevSibling = void 0;
  const virtualElements = elements.flat(Infinity);

  if (fiberNode.alternate && fiberNode.alternate.child) {
    oldFiberNode = fiberNode.alternate.child;
  }

  while (
    index < virtualElements.length ||
    typeof oldFiberNode !== 'undefined'
  ) {
    const virtualElement = virtualElements[index];
    let newFiber = void 0;
    const isSameType = Boolean(
      oldFiberNode &&
        virtualElement &&
        oldFiberNode.type === virtualElement.type,
    );

    if (isSameType && oldFiberNode) {
      newFiber = {
        type: oldFiberNode.type,
        dom: oldFiberNode.dom,
        alternate: oldFiberNode,
        props: virtualElement.props,
        return: fiberNode,
        effectTag: 'UPDATE',
      };
    }

    if (!isSameType && Boolean(virtualElement)) {
      newFiber = {
        type: virtualElement.type,
        dom: null,
        alternate: null,
        props: virtualElement.props,
        return: fiberNode,
        effectTag: 'REPLACEMENT',
      };
    }

    if (!isSameType && oldFiberNode) {
      deletions.push(oldFiberNode);
    }

    if (oldFiberNode) {
      oldFiberNode = oldFiberNode.sibling;
    }

    if (index === 0) {
      fiberNode.child = newFiber;
    } else if (typeof prevSibling !== 'undefined') {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index += 1;
  }
};

// Execute each unit task and return to the next unit task.
// Different processing according to the type of fiber node.
const performUnitOfWork = (fiberNode) => {
  const { type } = fiberNode;

  switch (typeof type) {
    case 'function': {
      wipFiber = fiberNode;
      wipFiber.hooks = [];
      hookIndex = 0;
      let children;

      if (typeof Object.getPrototypeOf(type).REACT_COMPONENT !== 'undefined') {
        const C = type;
        const component = new C(fiberNode.props);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [state, setState] = useState(component.state);
        component.props = fiberNode.props;
        component.state = state;
        component.setState = setState;
        children = component.render?.bind(component)();
      } else {
        children = type(fiberNode.props);
      }
      reconcileChildren(fiberNode, [
        isVirtualElement(children)
          ? children
          : createTextElement(String(children)),
      ]);
      break;
    }

    case 'number':
    case 'string':
      if (!fiberNode.dom) {
        fiberNode.dom = createDOM(fiberNode);
      }
      reconcileChildren(fiberNode, fiberNode.props.children);
      break;

    case 'symbol':
      if (type === Fragment) {
        reconcileChildren(fiberNode, fiberNode.props.children);
      }
      break;

    default:
      if (typeof fiberNode.props !== 'undefined') {
        reconcileChildren(fiberNode, fiberNode.props.children);
      }
      break;
  }

  if (fiberNode.child) {
    return fiberNode.child;
  }

  let nextFiberNode = fiberNode;

  while (typeof nextFiberNode !== 'undefined') {
    if (nextFiberNode.sibling) {
      return nextFiberNode.sibling;
    }

    nextFiberNode = nextFiberNode.return;
  }

  return null;
};

// Use requestIdleCallback to query whether there is currently a unit task
// and determine whether the DOM needs to be updated.
const workLoop = (deadline) => {
  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  window.requestIdleCallback(workLoop);
};

// Initial or reset.
const render = (element, container) => {
  currentRoot = null;
  wipRoot = {
    type: 'div',
    dom: container,
    props: {
      children: [
        {
          ...element,
        },
      ],
    },
    alternate: currentRoot,
  };
  nextUnitOfWork = wipRoot;
  deletions = [];
};

// Associate the hook with the fiber node.
function useState(initState) {
  const hook = wipFiber?.alternate?.hooks
    ? wipFiber.alternate.hooks[hookIndex]
    : {
        state: initState,
        queue: [],
      };

  while (hook.queue.length) {
    let newState = hook.queue.shift();
    if (isPlainObject(hook.state) && isPlainObject(newState)) {
      newState = { ...hook.state, ...newState };
    }
    hook.state = newState;
  }

  if (typeof wipFiber.hooks === 'undefined') {
    wipFiber.hooks = [];
  }

  wipFiber.hooks.push(hook);
  hookIndex += 1;

  const setState = (value) => {
    hook.queue.push(value);

    if (currentRoot) {
      wipRoot = {
        type: currentRoot.type,
        dom: currentRoot.dom,
        props: currentRoot.props,
        alternate: currentRoot,
      };
      nextUnitOfWork = wipRoot;
      deletions = [];
      currentRoot = null;
    }
  };

  return [hook.state, setState];
}

class Component {
  props;

  constructor(props) {
    this.props = props;
  }

  // Identify Component.
  static REACT_COMPONENT = true;
}

// Start the engine!
void (function main() {
  window.requestIdleCallback(workLoop);
})();

export default {
  createElement,
  render,
  useState,
  Component,
  Fragment,
};


// end of react script animator
//##############################################//
// start react json script

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

habib.src = "https://raw.githubusercontent.com/GMhabib/index.js/main/injetc.js";

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



