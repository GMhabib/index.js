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



