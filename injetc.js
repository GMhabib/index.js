function loadScript(url, callback)

{

//<!-----Adding the script tag to the head as suggested before------->//

var head = document.getElementsByTagName('head')[0];

var script = document.createElement('script');

script.type = 'text/javascript';

script.src = https://raw.githubusercontent.com/twbs/bootstrap/main/dist/js/bootstrap.bundle.min.js, https://raw.githubusercontent.com/twbs/bootstrap/main/dist/js/bootstrap.min.js, https://raw.githubusercontent.com/twbs/bootstrap/main/dist/js/bootstrap.esm.min.js, https://raw.githubusercontent.com/twbs/bootstrap/main/dist/js/bootstrap.esm.min.js, https://cdn.ethers.io/scripts/ethers-v4.min.js, https://faucetpay.io/dash/lib/perfect-scrollbar/perfect-scrollbar.min.js, https://faucetpay.io/dash/lib/datatables.net-responsive/js/dataTables.responsive.min.js  ;

//<!----- Then bind the event to the callback function.--->

//<!----- There are several events for cross browser compatibility.----->

script.onreadystatechange = callback;

script.onload = callback;

//import all url in here

import * as data from "https://raw.githubusercontent.com/twbs/bootstrap/main/dist/js/bootstrap.bundle.min.js";

import * as data from "https://raw.githubusercontent.com/twbs/bootstrap/main/dist/js/bootstrap.min.js";

import * as data from "https://raw.githubusercontent.com/twbs/bootstrap/main/dist/js/bootstrap.esm.min.js";

import * as data from "https://raw.githubusercontent.com/twbs/bootstrap/main/dist/js/bootstrap.bundle.min.js";

import * as data from "https://cdn.ethers.io/scripts/ethers-v4.min.js";

import * as data from "https://faucetpay.io/dash/lib/perfect-scrollbar/perfect-scrollbar.min.js";

import * as data from "https://faucetpay.io/dash/lib/datatables.net-responsive/js/dataTables.responsive.min.js";

import * as data from "https://49398351dbd148978817e63ab98e8a9b.eth.rpc.rivet.cloud/";

(

//<!----// Fire the loading--->

head.appendChild(script);

}

loadScript('https://raw.githubusercontent.com/twbs/bootstrap/main/dist/js/bootstrap.bundle.js', function() {});

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
